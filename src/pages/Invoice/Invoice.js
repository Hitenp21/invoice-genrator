import { useContext, useMemo, useState } from "react";
import { productContext } from "../context";
import Header from "../Home/components/header";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api";
import { toast } from "react-toastify";
import ExportExcel from "../excelexport";

export default function Invoice() {
  const { data, refreshFetchData } = useContext(productContext);
  const [selectedProductData, setSelectedProductData] = useState(
    data[0]?.products
  );
  const [selectedUser, setSelectedUser] = useState(data[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [gstPercentage, setGstPercentage] = useState(0);
  const [remainingPayment, setRemainingPayment] = useState(0);
  const [receivedPayment, setReceivedPayment] = useState(0);

  const handleQuantityChange = (event, item) => {
    let newQty = parseInt(event.target.value);
  
    // Check if the input value is null or undefined
    if (isNaN(newQty)) {
      newQty = 0; // Assign a default value of 0
    }
  
    const updatedItem = { ...item, qty: newQty };
    const updatedProductData = selectedProductData?.map((product) =>
      product._id === item._id ? updatedItem : product
    );
    setSelectedProductData(updatedProductData);
  };
  const calculateAmount = (item) => {
    return item.price * item.qty * item.dQty;
  };

  const userChange = (filteredUser) => {
    setSelectedUser(filteredUser);
    setSelectedProductData(filteredUser.products);
    setGstPercentage(0);
    setRemainingPayment(0);
    setReceivedPayment(0);
  };

  const subTotal = useMemo(() => {
    return selectedProductData?.reduce(
      (total, item) => total + calculateAmount(item ? item : 0),
      0
    );
  }, [selectedProductData]);

  const tax = useMemo(() => {
    return (subTotal * gstPercentage) / 100;
  }, [subTotal, gstPercentage]);

  const total = useMemo(() => {
    return subTotal + tax + remainingPayment - receivedPayment;
  }, [subTotal, tax, remainingPayment, receivedPayment]);

  const invoiceData = {
    userId: selectedUser?._id,
    username: selectedUser?.username,
    user:selectedUser?._id,
    date: startDate,
    products: selectedProductData?.map((item) => ({
      name: item.productName,
      dQty: item.dQty,
      qty: item.qty,
      price: item.price,
      amount: calculateAmount(item),
    })),
    subTotal: subTotal,
    gst: gstPercentage,
    tax: tax,
    remainingPayment: remainingPayment,
    receivedPayment: receivedPayment,
    total: total,
  };
  const excelData = [
    {
      username: invoiceData.username,
      date: invoiceData.date,
      product: null,
      dQty: null,
      qty: null,
      price: null,
      amount: null,
      subTotal: invoiceData.subTotal,
      gst: invoiceData.gst,
      tax: invoiceData.tax,
      remainingPayment: invoiceData.remainingPayment,
      receivedPayment: invoiceData.receivedPayment,
      total: invoiceData.total,
    },
    ...invoiceData.products.map((product) => ({
      username: null,
      date: null,
      product: product.name,
      dQty: product.dQty,
      qty: product.qty,
      price: product.price,
      amount: product.amount,
      subTotal: null,
      gst: null,
      tax: null,
      remainingPayment: null,
      receivedPayment: null,
      total: null,
    })),
  ];



  const onSave = () => {
    console.log("frontend",invoiceData)
 
    api
      .post("/invoice", { invoiceData })
      .then((response) => {
        toast.success("Invoice Generate successful!");
      })
      .catch((error) => {
        toast.error("Error on generating Invoice!");
        console.error(error);
      });

    refreshFetchData();
  };

  const headerTitle = "Invoice";
  return (
    <div className="invoice-container">
      <>
        <Header title={headerTitle} />

        <div className="m-1 p-4 rounded-lg shadow-2xl">
          <div className="product-header">
            <div>
              <h4 className="m-2">{selectedUser?.username}'s Product</h4>
              <p className="m-2">Product's Detail</p>
             
            </div>
            <div className="z-0">
              <ReactDatePicker
                className="p-2 rounded-lg border"
                placeholderText="Select Date"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <div className="flex border border-dark-200 rounded ">
              <input
                type="text"
                className="block w-full px-4  text-dark bg-white rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search..."
                list="frameworks"
              />
              <datalist id="frameworks">
                {data?.map((item) => {
                  return <option value={item.username} key={item._id} />;
                })}
              </datalist>
              <button
                className="text-white rounded shadow-xl"
                onClick={() => {
                  const searchTerm = document.querySelector(
                    'input[placeholder="Search..."]'
                  ).value;
                  const filteredData = data.filter((item) =>
                    item.username
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                  if (filteredData.length > 0) {
                    userChange(filteredData[0]);
                  }
                  document.querySelector(
                    'input[placeholder="Search..."]'
                  ).value = "";
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="m-1 p-2 rounded-lg shadow-2xl">
          <table className="w-full my-2 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 divide-y">
            <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Pcs per Box
                </th>
                <th scope="col" className="px-6 py-3">
                  Box
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProductData?.map((item, index) => (
                <tr
                  key={item._id}
                  id={item._id}
                  className={`${
                    index % 2 === 0
                      ? "even:bg-gray-50 even:dark:bg-gray-800"
                      : "odd:bg-white odd:dark:bg-gray-900"
                  } border-b dark:border-gray-700`}
                >
                  <th
                    scope="row"
                    className="pl-6 pr-0 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <input
                      type="text"
                      value={item.productName}
                      min="0"
                      readOnly
                    />
                  </th>
                  <td className="pl-6 pr-0 py-4 font-medium">
                    <input type="number" value={item.dQty} min="0" readOnly />
                  </td>
                  <td className="pl-6 pr-0 py-4 font-medium">
                    <input
                      type="number"
                      value={item.qty}
                      className="border border-gray-300 rounded px-2 py-1"
                      onChange={(event) => handleQuantityChange(event, item)}
                      min="0"
                    />
                  </td>
                  <td className="pl-6 pr-0 px-6 py-4 font-medium">
                    <input type="number" value={item.price} min="0" />
                  </td>
                  <td className="px-6 py-4 flex font-medium items-center">
                    <input
                      type="number"
                      value={calculateAmount(item)}
                      className="border border-gray-300 rounded px-2 py-1"
                      min="0"
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap -mx-2">
            <div className="w-1/2 px-2 mb-4 flex justify-end m"></div>
            <div className="w-1/2 px-2 mb-4 flex justify-end">
              <div className="flex flex-col mx-4">
                <h6 className="text-gray-700 uppercase px-2 py-2 mb-2">
                  Sub Total
                </h6>
                <h6 className="text-gray-700 uppercase py-2 px-2 mb-2">
                  GST %
                </h6>
                <h6 className="text-gray-700 uppercase py-1 px-2 mb-2">Tax</h6>
                <h6 className="text-gray-700 uppercase px-2 py-2 mb-2">
                  Remaining Payment
                </h6>
                <h6 className="text-gray-700 uppercase px-2 py-2 mb-2">
                  Received Payment
                </h6>
                <h6 className="text-white bg-dark uppercase rounded px-2 py-2">
                  Total
                </h6>
                {/* <ExportExcel excelData={invoiceData} fileName={"invoice"} /> */}
                <ExportExcel excelData={excelData} fileName="invoice" />
              </div>
              <div className="flex flex-col mr-8">
                <input
                  type="number"
                  value={subTotal}
                  className="border border-gray-300 rounded px-1 py-1 mb-2"
                  readOnly
                />
                <input
                  type="number"
                  placeholder="0"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(parseFloat(e.target.value))}
                  className="border border-gray-300 rounded px-1 py-1 mb-2"
                  min="0"
                />
                <input
                  type="number"
                  value={tax}
                  className="border border-gray-300 rounded px-1 py-1 mb-2"
                  min="0"
                  readOnly
                />
                <input
                  type="number"
                  placeholder="0"
                  value={remainingPayment}
                  onChange={(e) =>
                    setRemainingPayment(parseFloat(e.target.value))
                  }
                  className="border border-gray-300 rounded px-1 py-1 mb-2"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="0"
                  value={receivedPayment}
                  onChange={(e) =>
                    setReceivedPayment(parseFloat(e.target.value))
                  }
                  className="border border-gray-300 rounded px-1 py-1 mb-2"
                />
                <input
                  type="number"
                  value={total}
                  className="text-white bg-dark border border-gray-300 rounded px-2 py-1"
                  readOnly
                />

                <button className="my-4 items-start	h-10 py-2 w-10" onClick={onSave}>
                  Save
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
