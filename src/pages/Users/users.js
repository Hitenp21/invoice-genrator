import React, { useState, useEffect, useContext, useMemo } from "react";
import Header from "../Home/components/header";
import "./users.css";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { productContext } from "../context";
import { toast } from "react-toastify";
import api from "../../api";

const Users = () => {
  const [isDelete, setIsDelete] = useState(false);
  const [deletedUser, setDeletedUser] = useState({});
  const { data, refreshFetchData } = useContext(productContext);
  const [usersAllPayment, setUsersAllPayment] = useState([]);
  const [paymentUnit, setPaymentUnit] = useState("default");

  const [sortOrder, setSortOrder] = useState("asc");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    mobileNo: "",
    email: "",
    gstnum: "",
    address: "",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  const filteredAndSortedData = useMemo(() => {
    let filteredData = usersAllPayment;

    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData.sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();

      if (usernameA < usernameB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (usernameA > usernameB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [usersAllPayment, searchQuery, sortOrder]);



  const funDelete = () =>{
    setIsDelete(!isDelete)
  }

  const handleDelete = (user) => {
    funDelete()
    setDeletedUser({ userName: user.username, id: user._id });
  };

  


const handleConfirmDelete = async () => {
  try {
    await api.delete(`/user/ref/delete/${deletedUser.id}`);
    toast.success("User deleted successfully!");
    refreshFetchData();
    funDelete();
  } catch (error) {
    toast.error("Error! User not deleted.");
    console.log(error);
  }
};

  useEffect(() => {
    api
      .get("/payment/allUserPayment")
      .then((response) => {
        setUsersAllPayment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [data]);

  useEffect(() => {
    if (selectedUser && isEditing) {
      setFormData({
        username: selectedUser.username,
        mobileNo: selectedUser.mobileNo,
        email: selectedUser.email,
        gstnum: selectedUser.gstnum,
        address: selectedUser.address,
      });
    }
  }, [selectedUser, isEditing]);

  const openPopup = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const closePopup = () => {
    setSelectedUser(null);
    setFormData({
      username: "",
      mobileNo: "",
      email: "",
      gstnum: "",
      address: "",
    });
    setIsEditing(false);
    setIsFormOpen(false);
    setIsDelete(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedUser) {
        console.log(
          `formData: ${JSON.stringify(formData)} and ${selectedUser._id}`
        );
        api
          .put(`/user/updateUser/${selectedUser._id}`, formData)
          .then((response) => {
            refreshFetchData();
            toast.success("User update successfully!");
          })
          .catch((error) => {
            toast.error("Error! User not update.");

            console.log(error);
          });
      } else {
        api
          .post("/user/addUser", formData)
          .then((response) => {
            toast.success("User add successfully!");
            refreshFetchData();
            setIsFormOpen(false);
          })
          .catch((error) => {
            toast.error("Error! User not add.");

            console.log(error);
          });
      }

      closePopup();
    } catch (error) {
      console.error(error);
    }
  };

  function formatPaymentValue(value, unit) {
    switch (unit) {
      case "k":
        return (value / 1000).toFixed(2);
      case "lac":
        return (value / 1e5).toFixed(2);
      case "cr":
        return (value / 1e7).toFixed(2);
      default:
        return value.toFixed(2);
    }
  }

  const headerTitle = "Users";

  return (
    <div>
      <Header title={headerTitle} />

      <div className="m-2 p-4 rounded-lg shadow-2xl">
        <div className="user-header">
          <div>
            <h4 className="m-2">All Users</h4>
            <p className="m-2">User's Detail</p>
          </div>
          <div className="btn-container m-2">
            <button
              className="user-btn shadow-xl"
              onClick={() => setIsFormOpen(true)}
            >
              Add User
            </button>
          </div>
        </div>
        <Popup open={isFormOpen} closeOnDocumentClick onClose={closePopup}>
          <div className="modal-overlay">
            <div className="modal-container">
              <span className="close" onClick={closePopup}>
                <Link>&times;</Link>
              </span>
              <form onSubmit={handleSubmit}>
                <div className="px-4 mb-2 mx-2">
                  <div className="mb-2 font-medium">User Name *</div>
                  <input
                    type="text"
                    name="username"
                    placeholder="User Name"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-2 w-full border-gray-300 rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="px-4 mb-2 mx-2">
                  <div className="mb-2 font-medium">Mobile Number *</div>
                  <input
                    type="text"
                    name="mobileNo"
                    placeholder="Mobile Number"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    className="border-2 w-full border-gray-300 rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="px-4 mb-2 mx-2">
                  <div className="mb-2 font-medium">Email *</div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border-2 w-full border-gray-300 rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="px-4 mb-2 mx-2">
                  <div className="mb-2 font-medium">GST Number</div>
                  <input
                    type="text"
                    name="gstnum"
                    placeholder="GST Number"
                    value={formData.gstnum}
                    onChange={handleChange}
                    className="border-2 w-full border-gray-300 rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="px-4 mx-2">
                  <div className="mb-2 font-medium">Address</div>
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border-2 w-full border-gray-300 rounded px-3 py-2 mb-2"
                  />
                </div>
                <div className="my-2 mr-2 my-3 px-4">
                  <button
                    type="submit"
                    className="profile-save font-medium mx-2"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Popup>
        <div className="user flex flex-wrap m-2 p-2">
          {data?.map((user, index) => (
            <div
              key={index}
              className="user-class bg-emerald-300 rounded-lg shadow-2xl"
            >
              <img src="/images/customer.png" alt="" />
              <h4 className="m-2">{user.username}</h4>
              <p className="m-2">
                <Link
                  className="text-blue-700 hover:underline underline-offset-2"
                  onClick={() => openPopup(user)}
                >
                  Edit
                </Link>
                &nbsp; &nbsp;
                <Link
                  className="text-red-700 hover:underline underline-offset-2"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </Link>
              </p>
            </div>
          ))}
        </div>
        <>
          {isDelete && (
            <Popup open={isDelete} closeOnDocumentClick onClose={closePopup}>
              <div className="">
                <p className="text-center mt-2">
                  Confirm You are delete this user !<br></br>
                  Also delete all data of user
                </p>
                <ul>
                  <li className="m-2">
                    <div className="font-medium mx-1">User Name</div>
                    <input
                      name="productName"
                      className="border-2 border-gray-300 rounded-lg px-3 m-1 py-1 w-4/5"
                      value={deletedUser.userName}
                      readOnly
                    />
                  </li>
                </ul>
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
      <div className="m-2 mt-4 p-4 rounded-lg shadow-2xl">
        <div className="w-full my-2">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 divide-y">
            <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="flex px-1 py-3">
                  username
                  <Link>
                    <img
                      className="h-6 w-6 ml-2"
                      src="/images/sort.png"
                      alt="filter.png"
                      onClick={handleSort}
                    />
                  </Link>
                </th>
                <th scope="col" className="px-1 py-3 relative">
                  Paid
                  <select
                    value={paymentUnit}
                    onChange={(e) => setPaymentUnit(e.target.value)}
                    className="border border-gray-300 rounded ml-2 px-2 py-1"
                  >
                    <option value="default">₹</option>
                    <option value="k">K</option>
                    <option value="lac">Lac</option>
                    <option value="cr">Cr</option>
                  </select>
                </th>
                <th scope="col" className="px-1 py-3">
                  UnPaid
                </th>

                <th scope="col" className="px-1 py-2">
                  <label
                    className="flex items-center relative"
                    htmlFor="search-button"
                  >
                    <input
                      type="text"
                      name="search-button"
                      aria-label="search-button"
                      placeholder="Search user..."
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      list="frameworks"
                      className="border font-medium border-gray-300 text-ellipsis rounded px-2 py-1"
                    />
                    <datalist id="frameworks">
                      {usersAllPayment?.map((item) => {
                        return <option value={item.username} key={item._id} />;
                      })}
                    </datalist>
                    <Link>
                      <img
                        id="icon"
                        src="/images/search.png"
                        alt="icon"
                        className="h-4 w-4 ml-2"
                        style={{ verticalAlign: "middle" }}
                      />
                    </Link>
                  </label>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData?.map((item, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "even:bg-gray-50 even:dark:bg-gray-800"
                      : "odd:bg-white odd:dark:bg-gray-900"
                  } border-b dark:border-gray-700`}
                >
                  <td className="px-1 py-4 text-dark">
                    <input
                      type="text"
                      value={item.username}
                      className={`font-medium `}
                      readOnly
                    />
                  </td>
                  <td className="px-1 py-4 font-medium text-green-600">
                    {formatPaymentValue(item.paidTotal, paymentUnit)}
                  </td>
                  <td className="px-1 py-4 text-red-500 font-medium">
                    {formatPaymentValue(item.unpaidTotal, paymentUnit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
