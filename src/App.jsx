import React, { useState, useEffect } from "react";
import { Button, Form, Input, Layout, Card, Checkbox, Divider } from "antd";
import "./App.scss";
/* import "antd/dist/antd.css"; */

import AdminModule from "./components/AdminModule";

import { Context } from "./context";
import Login from "./Login";

const App = (props) => {
  let apiUrl = "";
  if (process.env.NODE_ENV === "development") {
    apiUrl = "http://localhost:3006";
  } else if (process.env.NODE_ENV === "production") {
    apiUrl = "https://api.aaonxt.com";
  }

  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const { Header, Footer, Content } = Layout;

  const onSubmit = (val) => {
    console.log("Values from App.jsx - ", val);
  };

  useEffect((prev) => {});

  if (signedIn) {
    return (
      <Context.Provider value={[token, apiUrl]}>
        <AdminModule />
      </Context.Provider>
    );
  } else {
    return <Login onSubmit={onSubmit} />;
  }
};

export default App;
