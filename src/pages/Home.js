import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { productContext } from "./context";
import Users from './Users/users';
import Records from './Records/records';
import Products from './Products/Products';
import DashBoard from './Dashbord/dashboard';
import Invoice from './Invoice/Invoice';
import Payment from "./Payment/payment";
import Logout from "./Logout";
import Sidebar from './sidebar';
import api from "../api";

export default function Home() {
  const navigator = useNavigate();
  const [activeItem, setActiveItem] = useState("home");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    api
      .get("/api/getData")
      .then((response) => {
        setData(response.data.user.subUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handleItemClick = (screen) => {
    setActiveItem(screen);
    if(screen === "home") {
      navigator("dashboard");
    } else if(screen === "users") {
      navigator("users");
    } else {
      navigator(`${screen}`);
    }
  };

  const refreshFetchData = () => {
    setRefresh(!refresh);
  };



  return (
    <div>
      <productContext.Provider value={{ data, refreshFetchData }}>
        <Container fluid className="">
          <Row className="">
            <Col sm={3}>
              <Sidebar activeItem={activeItem} handleItemClick={handleItemClick} />
            </Col>
            <Col sm={9} className="content">
              <Routes>
                <Route path="dashboard" element={<DashBoard activeItem={activeItem} handleItemClick={handleItemClick} />} />
                <Route path="users" element={<Users />} />
                <Route path="invoice" element={<Invoice />} />
                <Route path="record" element={<Records />} />
                <Route path="product" element={<Products />} />
                <Route path="payment" element={<Payment />} />
                <Route path="logout" element={<Logout />} />
              </Routes>
            </Col>
          </Row>
        </Container>
      </productContext.Provider>
    </div>
  );
}
