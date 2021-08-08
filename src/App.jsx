import React, { useState, useEffect, useReducer } from "react";
import { Layout } from "antd";
import "./App.scss";
/* import "antd/dist/antd.css"; */

import AdminModule from "./components/AdminModule";

import { Context } from "./context";
import { initialState, reducer } from './reducer';
import {url , GetUserdetails} from '../src/components/API/index'
import Login from "./Login";
import axios from 'axios';
import impLogo from "../src/assets/images/Meander_Logo.svg";

let Logo = impLogo;
let HeaderBG = "black";
const getLogoBG = async(window)=>{
  let domain = window.location.hostname;
  const tempFolders = await axios.get(url + `/getlogo?domain=${domain}`, {
    headers: {
       accept: 'application/json',
          }
 }).then(res => {
   const sett = res.data.settings;
   HeaderBG = sett.HeaderBG !== null ? sett.HeaderBG : HeaderBG;
   Logo = sett.logo !== null ? sett.logo : impLogo;
   //console.log(res.data.settings.logo , res.data.settings, res.data , Logo , HeaderBG );
  return { settings : sett } ;
});
return tempFolders;
}

if(window.location.hostname !== "portal.meander.video")
  getLogoBG(window);        
const App = (props) => {

  let apiUrl = "";

  // Reduer
  const [state, dispatch] = useReducer(reducer, initialState);

  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), userId: localStorage.getItem('userId') });
  const { Header, Footer, Content } = Layout;

  
  useEffect((prev) => {
   // console.log('App page state - ', state , Logo,HeaderBG );      
    state.userId ?
      setSignedIn(true) : setSignedIn(false);
  }, []);


  return (
    <Context.Provider value={{ state: state, dispatch: dispatch }}>
      <AdminModule dyLogo={Logo} dyHeaderBG = {HeaderBG}/>
    </Context.Provider>
  );
};

export default App;
