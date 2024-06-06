import { useContext, useEffect, useMemo, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "../Products/product.css";
import "../Records/records.css";
import "../../index.css";
import ReactDatePicker from "react-datepicker";
import { productContext } from "../context";
import Header from "./../Home/components/header";
import { Link } from "react-router-dom";
import api from "../../api";

export default function Payment() {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [username, setUserName] = useState();
  const [toDate, setToDate] = useState();
  // const [recordsData, setRecordsData] = useState();
  const { data } = useContext(productContext);
  const [users, setUsers] = useState([]);

  const [activeRecordId, setActiveRecordId] = useState(null);
  
  const toggleDetails = (id) => {
    setActiveRecordId((prevId) => (prevId === id ? null : id));
  };

  const [sortOrder, setSortOrder] = useState({
    field: "paymentStatus",
    order: "asc",
  });

  const handleSort = (field) => {
    setSortOrder((prevSortOrder) => ({
      field: field,
      order:
        prevSortOrder.field === field
          ? prevSortOrder.order === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

   useMemo(() => {
    return users?.map((user) => ({
      ...user,
      invoices: user.invoices.sort((a, b) => {
        if (sortOrder.field === "paymentStatus") {
          if (a.paymentStatus === b.paymentStatus) {
            return 0;
          }
          if (sortOrder.order === "asc") {
            return a.paymentStatus ? 1 : -1;
          } else {
            return a.paymentStatus ? -1 : 1;
          }
        } else if (sortOrder.field === "date") {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (sortOrder.order === "asc") {
            return dateA - dateB;
          } else {
            return dateB - dateA;
          }
        }
        return 0;
      }),
    }));
  }, [users, sortOrder]);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    api
      .get("/payment")
      .then((res) => {
        setUsers(res.data);
      });

    // fetchData();
    setUsers(data);
  }, [data]);

  const fetchData = async () => {
    try {
      api
        .get("/payment")
        .then((res) => {
          setUsers(res.data);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePaymentStatusChange = (e, invoiceId) => {
    api
      .put(
        `/payment/update/${invoiceId}`,
        {
          paymentStatus: e.target.checked,
        }
      )
      .then((res) => {
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

        // setRecordsData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    setUserName();
    setIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${year}-${month}-${day}   ${formattedHours}:${minutes} ${ampm}`;
  };

  const headerTitle = "Payment";
  return (
    <div className="product-container">
      <>
        <Header title={headerTitle} />
      </>
      <div className="m-1 p-4 rounded-lg shadow-2xl">
        <div className="product-header">
          <div>
            <h4 className="m-2">All Payments</h4>
            <p className="m-2">Payment's Detail</p>
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
                        setUserName(filteredData[0].username);
                      }
                    }}
                  />
                  <datalist id="frameworks">
                    {data?.map((item) => {
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
          {users?.map((user) => (
            <div key={user._id} className="m-1 mt-4 p-4 rounded-lg shadow-lg">
              <div className="flex ">
                <button
                  className="bg-white w-full flex items-center justify-between p-2"
                  onClick={() => toggleDetails(user._id)}
                >
                  <div className="flex items-center ">
                    <img
                      className="h-5 w-5 mr-4"
                      src={
                        activeRecordId === user._id
                          ? "/images/dropup.png"
                          : "/images/dropdown.png"
                      }
                      alt={
                        activeRecordId === user._id
                          ? "dropup icon"
                          : "dropdown icon"
                      }
                    />
                    <h3 className="text-dark mt-1">
                      {user.username}'s Payment Detail
                    </h3>
                  </div>
                </button>
              </div>

              <>
                {activeRecordId === user._id && (
                  <>
                    <div className="w-full my-2">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 divide-y">
                        <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-1 py-3"></th>

                            <th scope="col" className="flex px-1 py-3">
                              Status
                              <Link>
                                <img
                                  className="h-6 w-6 ml-2"
                                  src="/images/sort.png"
                                  alt="filter.png"
                                  onClick={() => handleSort("paymentStatus")}
                                />
                              </Link>
                            </th>
                            <th scope="col" className="px-1 py-3">
                              username
                            </th>
                            <th scope="col" className="px-1 py-3">
                              total
                            </th>
                            <th scope="col" className=" flex px-1 py-3">
                              Date
                              <Link>
                                <img
                                  className="h-6 w-6 ml-2"
                                  src="/images/sort.png"
                                  alt="filter.png"
                                  onClick={() => handleSort("date")}
                                />
                              </Link>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {user?.invoices?.map((item, index) => (
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
                                className="py-2 mx-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.paymentStatus}
                                  onChange={(e) =>
                                    handlePaymentStatusChange(e, item._id)
                                  }
                                  className={`form-checkbox h-5 w-5 ${
                                    item.paymentStatus
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                />
                              </th>
                              <td className="px-1 py-4 text-dark">
                                <input
                                  type="text"
                                  value={item.paymentStatus ? "Paid" : "UnPaid"}
                                  className={`font-medium ${
                                    item.paymentStatus
                                      ? "text-green-600"
                                      : "text-red-500"
                                  }`}
                                  readOnly
                                />
                              </td>
                              <td className="px-1 py-4 text-dark">
                                <input
                                  type="text"
                                  value={item.username}
                                  className="font-medium"
                                  readOnly
                                />
                              </td>
                              <td className="px-1 py-4 text-dark">
                                <input
                                  type="number"
                                  value={item.total}
                                  className="font-medium"
                                  readOnly
                                />
                              </td>
                              <td className="px-1 py-4 flex items-center text-dark">
                                <input
                                  type="text"
                                  value={formatDate(item.date)}
                                  className="font-medium"
                                  readOnly
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                   
                  </>
                )}
              </>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
