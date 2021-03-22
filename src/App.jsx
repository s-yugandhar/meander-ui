import React, { useState, useEffect, useReducer } from "react";
import { Layout } from "antd";
import "./App.scss";
/* import "antd/dist/antd.css"; */

import AdminModule from "./components/AdminModule";

import { Context } from "./context";
import { initialState, reducer } from './reducer';
import Login from "./Login";

const App = (props) => {

  let apiUrl = "";
  if (process.env.NODE_ENV === "development") {
    apiUrl = "http://localhost:3006";
  } else if (process.env.NODE_ENV === "production") {
    apiUrl = "https://api.aaonxt.com";
  }

  // Reduer
  const [state, dispatch] = useReducer(reducer, initialState);

  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), userId: localStorage.getItem('userId') });
  const { Header, Footer, Content } = Layout;

  const onSubmit = (val) => {
    console.log("Values from App.jsx - ", val);

    /* context.dispatch({
      type: 'LOGIN_SUCCESS',
      payload: {
        token: val.token ? val.token : null,
        userId: val.userId ? val.userId : null,
        page: 'my-videos'
      }
    }) */

    setAuth({
      token: val.token,
      userId: val.userId
    });

  };


  useEffect((prev) => {
    console.log('App page state - ', state);
    state.userId ?
      setSignedIn(true) : setSignedIn(false);

  }, []);


  return (
    <Context.Provider value={{ state: state, dispatch: dispatch }}>
      {/* {signedIn ?
        <AdminModule />
        : <Login onSubmit={onSubmit} />} */}

      <AdminModule />
    </Context.Provider>
  );
};

export default App;
