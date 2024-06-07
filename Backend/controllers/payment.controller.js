const { default: mongoose } = require("mongoose");
const Invoice = require("../models/invoice.model");
const RefUser = require("../models/refUser.model");
const User = require("../models/user.model");

const getPayment = async (req, res) => {
  try {
    const userId = req.userData.id;
    const user = await User.findById(userId).populate('subUser').exec();

    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    const refUserIds = user.subUser?.map(subUser => subUser._id);
    let payments = [];

    if (user.subUser.length > 0) {
      let refUsers = await RefUser.aggregate([
        {
          $match: { _id: { $in: refUserIds } }
        },
        {
          $lookup: {
            from: "invoices",
            localField: "_id",
            foreignField: "user",
            as: "invoices",
          },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            invoices: 1,
          },
        },
      ]);

      // Sort and map the invoices in the application code
      payments = refUsers.map(refUser => {
        refUser.invoices = refUser.invoices.sort((a, b) => new Date(b.date) - new Date(a.date)).map(invoice => ({
          _id: invoice._id,
          username: invoice.username,
          date: invoice.date,
          total: invoice.total,
          paymentStatus: invoice.paymentStatus,
        }));
        return refUser;
      });
    }

    res.status(200).json(payments);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error!");
  }
};


const updatePaymentStatus = async (req, res) => {
  const invoiceId = req.params.id;
  const paymentStatus = req.body.paymentStatus;
  try {
    const status = await Invoice.findByIdAndUpdate(
      invoiceId,
      { $set: { paymentStatus: paymentStatus } },
      { new: true }
    );

    res.status(200).json(status);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};

const chartData = async (req, res) => {
  try {

    let { startDate } = req.query;

    if (!startDate) {
      startDate = new Date();
    } else {
      startDate = new Date(startDate);
    }

    const startOfWeek  = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); 

    const weeklyInvoices = await Invoice.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$total" },
        },
      },
    ]);

    let dailyTotals = {};
    const currentDate = new Date(startOfWeek);

    while (currentDate <= endOfWeek) {
      const formattedDate = currentDate.toISOString().split("T")[0];
      dailyTotals[formattedDate] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    weeklyInvoices.forEach((invoice) => {
      const { _id, total } = invoice;
      dailyTotals[_id] = total;
    });

    dailyTotals = Object.values(dailyTotals)

    const today = new Date(startDate);
    const currentYear = today.getFullYear();

    const monthlyDateRanges = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);
      monthlyDateRanges.push({ startDate, endDate });
    }

    const monthlyInvoices = await Promise.all(
      monthlyDateRanges.map(async ({ startDate, endDate }) => {
        return await Invoice.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ]);
      })
    );
    const monthlyTotals = monthlyInvoices.map((invoices, index) => ({
      month: index + 1, 
      total: invoices.length ? invoices[0].total : 0,
    }));

    const yearlyDateRanges = [];

    for (let year = 2022; year <= 2030; year++) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      yearlyDateRanges.push({ startDate, endDate });
    }

    const yearlyTotals = await Promise.all(
      yearlyDateRanges.map(async ({ startDate, endDate }) => {
        const yearlyInvoices = await Invoice.aggregate([
          {
            $match: {
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" },
            },
          },
        ]);

        return {
          year: startDate.getFullYear(),
          total: yearlyInvoices.length ? yearlyInvoices[0].total : 0,
        };
      })
    );

    res.status(200).json({ dailyTotals, monthlyTotals, yearlyTotals });
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
};


const allUserPayment = async (req,res)=>{
  try {

    const userId = req.userData.id;

    const allPaymentDetail = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "refusers",
          localField: "subUser",
          foreignField: "_id",
          as: "refUsers"
        }
      },
      { $unwind: "$refUsers" },
      {
        $lookup: {
          from: "invoices",
          localField: "refUsers._id",
          foreignField: "user",
          as: "refUsers.invoices"
        }
      },
      {
        $unwind: "$refUsers.invoices"
      },
      {
        $group: {
          _id: {
            userId: "$refUsers._id",
            paymentStatus: "$refUsers.invoices.paymentStatus"
          },
          total: { $sum: "$refUsers.invoices.total" }
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          paidTotal: {
            $sum: {
              $cond: [
                { $eq: ["$_id.paymentStatus", true] },
                "$total",
                0
              ]
            }
          },
          unpaidTotal: {
            $sum: {
              $cond: [
                { $eq: ["$_id.paymentStatus", false] },
                "$total",
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "refusers",
          localField: "_id",
          foreignField: "_id",
          as: "refUser"
        }
      },
      {
        $unwind: "$refUser"
      },
      {
        $project: {
          _id: "$refUser._id",
          username: "$refUser.username",
          paidTotal: 1,
          unpaidTotal: 1
        }
      }
    ])
   
    res.status(200).json(allPaymentDetail);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error!");
  }
}


module.exports = {
  getPayment,
  updatePaymentStatus,
  chartData,
  allUserPayment
};
