import { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../Products/product.css";
import "./records.css";
import "../../index.css";
import ReactDatePicker from "react-datepicker";
import { productContext } from "../context";
import Header from "./../Home/components/header";
import api from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Records() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [username, setUserName] = useState();
  const [toDate, setToDate] = useState();
  const [recordsData, setRecordsData] = useState();
  const { data } = useContext(productContext);

  const [activeRecordId, setActiveRecordId] = useState(null);

  const [isDelete, setIsDelete] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const openDeletePopup = (record) => {
    setRecordToDelete(record);
    setIsDelete(true);
  };

  const closePopup = () => {
    setIsDelete(false);
    setRecordToDelete(null);
    setIsOpen(false);
  };

  const handleConfirmDelete = () => {
    api.delete(`/invoice/delete/${recordToDelete._id}`)
    .then((res)=>{
      toast.success("Invoice delete successful!");
      fetchData();
    }).catch((err)=>{
      toast.error("Error ! Invoice not delete.");

      console.log(err)
    })
    closePopup();
  };

  const toggleDetails = (id) => {
    setActiveRecordId((prevId) => (prevId === id ? null : id));
  };
  const openPopup = () => {
    setIsOpen(true);
  };

  const fetchData = async () => {
    try {
      const response = await api.post("/invoice/all");
      setRecordsData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    
    fetchData();
  }, [data]);

  const applyFilter = async () => {
    let baseURL = "/invoice/all";
    let queryParams = [];

    if (username) {
      queryParams.push(`username=${encodeURIComponent(username)}`);
    }
    if (startDate) {
      queryParams.push(`fromDate=${encodeURIComponent(startDate)}`);
    }
    if (toDate) {
      queryParams.push(`toDate=${encodeURIComponent(toDate)}`);
    }

    if (queryParams.length > 0) {
      baseURL += "?" + queryParams.join("&");
    }

    await api
      .post(baseURL)
      .then((response) => {
        console.log(response.data);

        setRecordsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setUserName();
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format to 'YYYY-MM-DD'
  };

  const headerTitle = "Records";
  return (
    <div className="product-container">
      <>
        <Header title={headerTitle} />
      </>
      <div className="m-1 p-4 rounded-lg shadow-2xl">
        <div className="product-header">
          <div>
            <h4 className="m-2">All Records</h4>
            <p className="m-2">Invoice's Detail</p>
          </div>
          <div className="btn-container">
            <button className="product-btn shadow-xl" onClick={openPopup}>
              Apply Filters
            </button>
          </div>
          {isOpen && (
            <Popup
              open={isOpen}
              closeOnDocumentClick
              onClose={closePopup}
              className="custom-popup"
            >
              <div className="">
                <h2 className="text-xl text-gray-500 px-2 ">Filter By Date</h2>
                <p className="px-2  text-bold">Date</p>
                <div className="date-picker-container px-1">
                  <ReactDatePicker
                    className="p-2 rounded-lg border-2"
                    placeholderText="Select start date"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                  <p className="to text-lg">to</p>
                  <ReactDatePicker
                    className="p-2 rounded-lg border-2"
                    placeholderText="Select end date"
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                  />
                </div>
                <h2 className="text-xl pt-4 text-gray-500 px-2 ">
                  Filter By User
                </h2>
                <div className="flex border border-dark-200 rounded ">
                  <input
                    type="text"
                    className="block w-full px-3 py-2  text-dark bg-white rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Filter by user"
                    list="frameworks"
                    onChange={() => {
                      const searchTerm = document.querySelector(
                        'input[placeholder="Filter by user"]'
                      ).value;
                      const filteredData = data.filter((item) =>
                        item.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      );
                      if (filteredData.length > 0) {
                        // userChange(filteredData[0]);
                        setUserName(filteredData[0].username);
                      }
                    }}
                  />
                  <datalist id="frameworks">
                    {data.map((item) => {
                      return <option value={item.username} key={item.id} />;
                    })}
                  </datalist>
                </div>

                <button
                  onClick={applyFilter}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Apply
                </button>
              </div>
            </Popup>
          )}
        </div>
        <div>
          {recordsData?.map((record) => (
            <div key={record._id} className="m-1 mt-4 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between ">
                <button
                  className="bg-white w-full flex items-center justify-between p-2"
                  onClick={() => toggleDetails(record._id)}
                >
                  <div className="flex items-center ">
                    <img
                      className="h-5 w-5 mr-4"
                      src={
                        activeRecordId === record._id
                          ? "/images/dropup.png"
                          : "/images/dropdown.png"
                      }
                      alt={
                        activeRecordId === record._id
                          ? "dropup icon"
                          : "dropdown icon"
                      }
                    />
                    <h3 className="text-dark mt-1">
                      {record.username}'s Invoices
                    </h3>
                  </div>
                </button>
                <h5 className="text-dark pt-3 flex-end">
                  Date : {formatDate(record.date)}
                </h5>
                <Link
                  className="rounded-full font-medium p-3 text-red-500 hover:underline underline-offset-2"
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => openDeletePopup(record)}
                >
                  Delete
                </Link>
              </div>

              {activeRecordId === record._id && (
                <>
                  <div className="w-full my-2">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 divide-y">
                      <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-1 py-3">
                            Product name
                          </th>
                          <th scope="col" className="px-1 py-3">
                            pcs per box
                          </th>
                          <th scope="col" className="px-1 py-3">
                            box
                          </th>
                          <th scope="col" className="px-1 py-3">
                            Price
                          </th>
                          <th scope="col" className="px-1 py-3">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {record.products.map((item, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0
                                ? "even:bg-gray-50 even:dark:bg-gray-800"
                                : "odd:bg-white odd:dark:bg-gray-900"
                            } border-b dark:border-gray-700`}
                          >
                            <th
                              scope="row"
                              className="py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              <input type="text" value={item.name} readOnly />
                            </th>
                            <td className="px-1 py-4 text-dark">
                              <input type="number" value={item.dQty} readOnly />
                            </td>
                            <td className="px-1 py-4 text-dark">
                              <input type="number" value={item.qty} readOnly />
                            </td>
                            <td className="px-1 py-4 text-dark">
                              <input
                                type="number"
                                value={item.price}
                                readOnly
                              />
                            </td>
                            <td className="px-1 py-4 flex items-center text-dark">
                              <input
                                type="number"
                                value={item.amount}
                                readOnly
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

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
                        <h6 className="text-gray-700 uppercase py-1 px-2 mb-2">
                          Tax
                        </h6>
                        <h6 className="text-gray-700 uppercase px-2 py-2 mb-2">
                          Remaining Payment
                        </h6>
                        <h6 className="text-gray-700 uppercase px-2 py-2 mb-2">
                          Received Payment
                        </h6>
                        <h6 className="text-white bg-dark uppercase rounded px-2 py-2">
                          Total
                        </h6>
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="number"
                          value={record.subTotal}
                          className="border border-gray-300 rounded px-3 py-1 mb-2"
                          readOnly
                        />
                        <input
                          type="number"
                          value={record.gst}
                          readOnly
                          className="border border-gray-300 rounded px-3 py-1 mb-2"
                        />
                        <input
                          type="number"
                          value={record.tax}
                          className="border border-gray-300 rounded px-3 py-1 mb-2"
                          readOnly
                        />
                        <input
                          type="number"
                          placeholder="0"
                          value={record.remainingPayment}
                          className="border border-gray-300 rounded px-3 py-1 mb-2"
                          readOnly
                        />
                        <input
                          type="number"
                          value={record.receivedPayment}
                          readOnly
                          className="border border-gray-300 rounded px-3 py-1 mb-2"
                        />
                        <input
                          type="number"
                          value={record.total}
                          className="text-white bg-dark border border-gray-300 rounded px-3 py-1"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          <>
            {isDelete && (
              <Popup open={isDelete} closeOnDocumentClick onClose={closePopup}>
                <div className="">
                  <p className="text-gray-700 text-lg m-2 font-medium text-center">
                    User: {recordToDelete.username}
                  </p>
                  <h5 className="text-center">
                    Confirm You are delete this Invoice!
                  </h5>
                  <h5  className="text-center">Invoice Date : {formatDate(recordToDelete.date)}</h5>
                
                  <div className="flex-container">
                    <button
                      className="delete-product px-3 m-1 center-button"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
