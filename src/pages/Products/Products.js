import { useContext, useEffect, useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./product.css";
import "../../index.css";
import { productContext } from "../context";
import Header from "./../Home/components/header";
import api from "../../api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";



export default function Products() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const { data, refreshFetchData } = useContext(productContext);
  const [productPageData, setProductPageData] = useState();
  const [deletedProduct, setDeletedProduct] = useState({});

  const [selectedProductData, setSelectedProductData] = useState(
    data[0]?.products
  );
  const [activeProductId, setActiveProductId] = useState(data[0]?._id);

  useEffect(() => {
    setProductPageData(data);
  }, [data]);

  useEffect(() => {
    const product = data.find((item) => item._id === activeProductId);

    if (product) {
      setSelectedProductData(product?.products);
    }
  }, [activeProductId, data]);

  const [user, setUser] = useState({
    id: data[0]?.id,
    name: data[0]?.username,
  });

  const [formData, setFormData] = useState({
    productName: "",
    defaultQty: "",
    qty: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = (item) => {
    setIsDelete(true);
    setDeletedProduct({ productName: item.productName, id: item._id });
  };

  const handleConfirmDelete = async () => {
    await api
      .delete(`/product/deleteProduct/${deletedProduct.id}`)
      .then((response) => {
        toast.success("Product Deleted successful!");

        setActiveProductId(activeProductId);
        refreshFetchData();
      })
      .catch((error) => {
        toast.error("Error! Not deleted product.");

        console.log(error);
      });

    closePopup();
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const { productName, defaultQty, qty, price } = formData;
    const productData = {
      fromUser: activeProductId,
      productName: productName,
      dQty: parseInt(defaultQty, 10),
      qty: parseInt(qty, 10),
      price: parseFloat(price),
    };
  
    api.post("/product", { productData })
      .then((res) => {
        toast.success("Product added successfully!");
        refreshFetchData();
      })
      .catch((error) => {
        toast.error("Error! Product not added.");
        console.error(error);
      });
  
    closePopup();
  
    setFormData({
      productName: "",
      defaultQty: "",
      qty: "",
      price: "",
    });
  };
  


  const handleProductClick = (product) => {
    setSelectedProductData(product.products);
    setUser({ id: product._id, name: product.username });
    setActiveProductId(product._id);
  };

  const [editingRow, setEditingRow] = useState(0);

  const handleEdit = (item) => {
    setEditingRow(item);
    setFormData(item);
  };

  const handleSave = (item) => {
    api
      .put("/product/updateProduct", formData)
      .then((response) => {
        toast.success("Product update successful!");

        refreshFetchData();
      })
      .catch((error) => {
        toast.error("Error! Not update product.");

        console.log(error);
      });
    setFormData({
      productName: "",
      defaultQty: "",
      qty: "",
      price: "",
    });
    setEditingRow(null);
  };

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setIsDelete(false);
  };
  const headerTitle = "Product";
  return (
    <div className="product-container">
      <>
        <Header title={headerTitle} />
      </>
      <div className="m-1 p-4 rounded-lg shadow-2xl">
        <div className="product-header">
          <div>
            <h4 className="m-2">All Products</h4>
            <p className="m-2">Product's Detail</p>
          </div>
          <div className="btn-container">
            <button className="product-btn shadow-xl" onClick={openPopup}>
              Add Product
            </button>
          </div>

          {isOpen && (
            <Popup open={isOpen} closeOnDocumentClick onClose={closePopup}>
              <form onSubmit={handleSubmit}>
                <div className="">
                  <p className="text-gray-700 text-lg m-2 font-medium text-center">
                    User: {user.name}
                  </p>
                  <ul>
                    <li className="m-2">
                      <div className="font-medium mx-1">Product Name</div>
                      <input
                        name="productName"
                        className="border-2 border-gray-300 rounded-lg px-3 m-1 py-1 w-4/5"
                        value={formData.productName}
                        onChange={handleChange}
                      />
                    </li>
                    <li className="m-2">
                      <div className="font-medium mx-1">Pcs per Box</div>
                      <input
                        name="defaultQty"
                        className="border-2 border-gray-300 rounded px-3 m-1 py-1 w-4/5"
                        value={formData.defaultQty}
                        onChange={handleChange}
                      />
                    </li>
                    <li className="m-2">
                      <div className="font-medium mx-1">Box</div>
                      <input
                        name="qty"
                        className="border-2 border-gray-300 rounded px-3 m-1 py-1 w-4/5"
                        value={formData.qty}
                        onChange={handleChange}
                      />
                    </li>
                    <li className="m-2">
                      <div className="font-medium mx-1">Price</div>
                      <input
                        name="price"
                        className="border-2 border-gray-300 rounded px-3 m-1 py-1 w-4/5"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    </li>
                  </ul>
                  <div className="flex-container">
                    <button
                      type="submit"
                      className="save-product px-3 m-1 center-button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </Popup>
          )}
        </div>
        <div className="user flex flex-wrap m-2 p-2">
          {productPageData?.map((product) => (
            <div
              key={product._id}
              id={product._id}
              className={`product-class bg-sky-500 m-2 mx-3 border-2 rounded-lg shadow-2xl transition-all duration-300  ${
                activeProductId === product._id
                  ? "scale-110 border-2 ring-orange-950 border-orange-300"
                  : "scale-100"
              }`}
              onClick={() => handleProductClick(product)}
            >
              <Link>
                <img src="/images/product.png" alt="" />
                <h5 className="m-2">{product.username}'s Product</h5>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <>
        <div className="m-1 p-2 rounded-lg shadow-2xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base	 text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProductData?.map((item, index) => (
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
                    className="px-6 py-4 font-medium text-gray-500 whitespace-nowrap"
                  >
                    {editingRow === item ? (
                      <input
                        type="text"
                        name="productName"
                        defaultValue={item.productName}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      item.productName
                    )}
                  </th>
                  <td className="font-medium px-6 py-4">
                    {editingRow === item ? (
                      <input
                        type="number"
                        name="dQty"
                        defaultValue={item.dQty}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                        min="0"
                      />
                    ) : (
                      item.dQty
                    )}
                  </td>
                  <td className="font-medium px-6 py-4">
                    {editingRow === item ? (
                      <input
                        type="number"
                        name="qty"
                        defaultValue={item.qty}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                        min="0"
                      />
                    ) : (
                      item.qty
                    )}
                  </td>
                  <td className="font-medium px-6 py-4">
                    {editingRow === item ? (
                      <input
                        type="number"
                        name="price"
                        defaultValue={item.price}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-1"
                        min="0"
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    {editingRow === item ? (
                      <>
                        <button
                          className="font-medium text-white hover:underline mr-2"
                          onClick={() => handleSave(item)}
                        >
                          Save
                        </button>
                        <button
                          className="font-medium text-white hover:underline"
                          onClick={() => setEditingRow(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline underline-offset-2"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </Link>
                        <div>&nbsp; &nbsp;</div>
                        <Link
                          className="font-medium text-red-600 hover:underline underline-offset-2"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </Link>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isDelete && (
          <Popup open={isDelete} closeOnDocumentClick onClose={closePopup}>
            <div className="">
              <p className="text-gray-700 text-lg m-2 font-medium text-center">
                User: {user.name}
              </p>
              <p className="text-center">
                Confirm You are delete this product!
              </p>
              <ul>
                <li className="m-2">
                  <div className="font-medium mx-1">Product Name</div>
                  <input
                    name="productName"
                    className="border-2 border-gray-300 rounded-lg px-3 m-1 py-1 w-4/5"
                    value={deletedProduct.productName}
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
  );
}
