const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRouter = require("./routes/user.routes");
const refUserRouter = require("./routes/addRefUser.routes");
const recordRouter = require("./routes/record.routes");
const invoiceRouter = require("./routes/invoice.routes");
const productRouter = require("./routes/product.routes");
const paymentRouter = require("./routes/payment.route");
const connectDB = require("./DB/db");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");


dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
connectDB();

app.post('/verify-token', (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).json({ valid: false, message: 'Token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ valid: false, message: 'Token is invalid or expired' });
    }
    res.status(200).json({ valid: true, user });
  });
});

app.use("/api",userRouter);
app.use("/user", refUserRouter);
app.use("/record", recordRouter);
app.use("/invoice", invoiceRouter);
app.use("/product", productRouter);
app.use("/payment", paymentRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
