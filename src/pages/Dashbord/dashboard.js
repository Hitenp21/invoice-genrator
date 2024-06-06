import Header from "../Home/components/header";
import "./dashboard.css";
import { useContext, useEffect, useState } from "react";
import { productContext } from "../context";
import api from "../../api";

export default function DashBoard({ activeItem, handleItemClick }) {
  const { data } = useContext(productContext);
  const [dashboardData, setDashboardData] = useState({});
  const [userCount, setUserCount] = useState('');
  
  useEffect(() => {
    setUserCount(data.length);
    api
      .get("/invoice/count")
      .then((res) => {
        setDashboardData({count:res.data.count , totalSum : res.data.totalSum})
      })
      .catch((error) => {
        console.log(error);
      });
  },[data]);

  return (
    <div>
      <title>My Title</title>
      <meta name="description" content="Helmet application" />
      <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

      <div>
        <>
          <Header title={"Dashboard"} />
        </>
        <div className="sales shadow-2xl">
          <div>
            <h4>Today's Sales</h4>
            <p>Sales Summary</p>
          </div>
          <div className="sales-div">
            <div
              className="sub-content bg-cyan-400 rounded-lg shadow-2xl"
              onClick={() => {}}
            >
              <img src="/images/cart.png" alt="" />
              <h4>₹ {dashboardData.totalSum}</h4>
              <p>Today Sales</p>
            </div>
            <div
              className={`sub-content bg-amber-300 rounded-lg shadow-2xl ${activeItem === 'record' ? 'active' : ''}`}
              onClick={() => handleItemClick("record")}
            >
              <img src="/images/pi-chart.png" alt="" />
              <h4>{dashboardData.count ? dashboardData.count : 0}</h4>
              <p>All orders</p>
            </div>
            <div
              className={`sub-content bg-emerald-300 rounded-lg shadow-2xl ${activeItem === 'users' ? 'active' : ''}`}
              onClick={() => handleItemClick("users")}
            >
              <img src="/images/customer.png" alt="" />
              <h4>{userCount}</h4>
              <p>Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
