import React, { useState, useEffect } from "react";
import { Button, Form, Input, Layout, Card, Checkbox, Divider } from "antd";
import "./App.scss";
/* import "antd/dist/antd.css"; */

import AdminModule from "./components/AdminModule";

import { Context, AuthContext } from "./context";
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
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), userId: localStorage.getItem('userId') });
  const { Header, Footer, Content } = Layout;

  const onSubmit = (val) => {
    console.log("Values from App.jsx - ", val);
    localStorage.setItem("token", val.token);
    localStorage.setItem('userId', val.userId);
    setAuth({
      token: val.token,
      userId: val.userId
    });

  };


  useEffect((prev) => {

    if (auth.token) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }

  }, [auth]);

  if (signedIn) {
    return (
      <AuthContext.Provider value={{ token: auth.token, userId: auth.userId }}>
        <Context.Provider value={{ apiUrl }}>
          <AdminModule />
        </Context.Provider>
      </AuthContext.Provider>
    );
  } else {
    return <Login onSubmit={onSubmit} />;
  }
};

export default App;
