const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
    },
    invoiceNo: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps : true,
  }
);

invoiceSchema.plugin(AutoIncrement, { 
  inc_field: 'invoiceNo', 
  start_seq: 202400 
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
