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

  // Reduer
  const [state, dispatch] = useReducer(reducer, initialState);

  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), userId: localStorage.getItem('userId') });
  const { Header, Footer, Content } = Layout;

  
  useEffect((prev) => {
    console.log('App page state - ', state);
    state.userId ?
      setSignedIn(true) : setSignedIn(false);

  }, []);


  return (
    <Context.Provider value={{ state: state, dispatch: dispatch }}>
      <AdminModule />
    </Context.Provider>
  );
};

export default App;
