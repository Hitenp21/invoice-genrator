const mongoose = require("mongoose");
const RefUser = require("./refUser.model");

const invoiceSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    date: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'RefUser' },

    products: [
      {
        name: { type: String, required: true },
        dQty: {
          type: Number,
        },
        qty: {
          type: Number,
        },
        price: {
          type: Number,
        },
        amount: {
          type: Number,
        },
      },
    ],
    gst: {
      type: Number,
    },
    tax: {
      type: Number,
    },

    receivedPayment: {
      type: Number,
    },
    remainingPayment: {
      type: Number,
    },

    subTotal: {
      type: Number,
    },
    total: {
      type: Number,
    },
    paymentStatus :{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps : true,
  }
);



const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
