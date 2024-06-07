const Invoice = require("../models/invoice.model");
const RefUser = require("../models/refUser.model");
const User = require("../models/user.model");

const addInvoice = async (req, res) => {
    try {
      const { date, products } = req.body.invoiceData;
  
      const indianTimeZoneOffset = 330;
  
      // Convert the provided date to a Date object
      // const providedDate = new Date(date);
  
      // // Adjust the date based on the Indian time zone offset
      // const currentDate = new Date(providedDate.getTime() + indianTimeZoneOffset * 60000);
      const currentDate = new Date(date);
  
      const filteredProducts = products.filter((product) => product.qty !== 0);
  
      if (filteredProducts.length === 0) {
        throw new Error("No products with quantity > 0 found");
      }
  
      const newInvoice = new Invoice({
        ...req.body.invoiceData,
        date: currentDate,
        products: filteredProducts,
      });
  
      const savedInvoice = await newInvoice.save();
      res.status(201).json(savedInvoice);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error adding invoice" });
    }
  };

const getInvoices = async (req, res) => {
  try {
    const userId = req.userData.id;
    const { fromDate, toDate, username } = req.query;

    const user = await User.findById(userId).populate("subUser").exec();

    if (!user) {
      throw new Error("User not found");
    }

    const refUserIds = user.subUser.map((subUser) => subUser._id);

    let query = { user: { $in: refUserIds } };

    if (fromDate && toDate) {
      query.date = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    } else if (fromDate) {
      query.date = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.date = { $lte: new Date(toDate) };
    }

    if (username) {
      query.username = username;
    }

    const filteredInvoices = await Invoice.find(query)
      .sort({ date: -1 })
      .exec();
      

    res.status(200).send(filteredInvoices);
  } catch (error) {
    console.log(error);
  }
};

const invoiceCount = async (req, res) => {
  try {
    const userId = req.userData.id;
    const user = await User.findById(userId).populate("subUser").exec();

    if (!user) {
      throw new Error("User not found");
    }

    const refUserIds = user.subUser.map((subUser) => subUser._id);

    const countTotalInvoices = await Invoice.countDocuments({
      user: { $in: refUserIds },
    });

    const indianTimezoneOffset = 5.5; // Indian Standard Time (IST) offset in hours

    const today = new Date();
    const indianTimeZoneDate = new Date(
      today.getTime() + indianTimezoneOffset * 60 * 60 * 1000
    );
    const todayStart = new Date(indianTimeZoneDate);
    todayStart.setHours(0, 0, 0, 0); // Set time to start of today

    const todayEnd = new Date(indianTimeZoneDate);
    todayEnd.setHours(23, 59, 59, 999);

    const totalInvoiceSumToday = await Invoice.aggregate([
      {
        $match: {
          user: { $in: refUserIds },
          date: {
            $gte: todayStart,
            $lte: todayEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$total" },
        },
      },
    ]);

    const totalSum =
      totalInvoiceSumToday.length > 0 ? totalInvoiceSumToday[0].totalSum : 0;

    res.status(200).send({ count: countTotalInvoices, totalSum: totalSum });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const deleteInvoice = async (req, res) => {
    const invoiceId = req.params.id;
  try {
    const deletedInvoice = await Invoice.findById(invoiceId);

    if (!deletedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    await RefUser.updateOne(
      { _id: deleteInvoice.user },
      { $pull: { invoices: deletedInvoice._id } }
    );

    await deletedInvoice.deleteOne();

    res.status(200).send("Invoice deleted");
  } catch (error) {
    console.log(error);
  }
};


const pdfInvoice = async (req, res) => {
  const invoiceId = req.params.id;
  const userId = req.userData.id;
try {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  const supplier = await User.findById(userId).select("address gstNum username");

  let formattedDate = '';
  if (invoice.date) {
    const date = new Date(invoice.date);
    formattedDate = date.toLocaleDateString('en-GB'); 
  }
  
  const refUser = await RefUser.findById(invoice.user).select("gstnum address -_id");
  
  const pdfData = {
    ...invoice.toObject(), 
    date: formattedDate,  
    buyerGstNo: refUser.gstnum,
    buyerAddress: refUser.address,
    supplierName: supplier.username,
    supplierGstNo: supplier.gstNum,
    supplierAddress: supplier.address
  };

  res.status(200).send(pdfData);
} catch (error) {
  console.log(error);
}
};



module.exports = {
  addInvoice,
  getInvoices,
  invoiceCount,
  deleteInvoice,
  pdfInvoice
};
