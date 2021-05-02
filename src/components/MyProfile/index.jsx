import React, { useState , useContext, useEffect } from "react";
import "./myProfile.scss";
import {
   Divider,Layout, Row, Col, Form, Input,   Button, Radio,   Select, Upload,} from "antd";
import {Context} from '../../context';
import {USER_OBJ} from '../../reducer/types';
import { GetUserdetails } from '../API/index';
import ManageUsers from "../ManageUsers";
import Friends from "../Friends";


const MyProfile = () => {
   const [requiredMark, setRequiredMarkType] = useState("optional");
   const { Header, Footer, Sider, Content } = Layout;
    const {state,dispatch} = useContext(Context);

   const onRequiredTypeChange = ({ requiredMark }) => {
      setRequiredMarkType(requiredMark);
   };

   useEffect(()=>{

    if( state.userId !== null && state.userId !== undefined)
    GetUserdetails(state,dispatch,state.userId);
   },[state.userId]);


   return (
     <Layout className="main">
       <Content
         className="site-layout-background"
         style={{
           padding: 24,
           margin: 0,
           minHeight: "100vh",
         }}
       >
         <Row>
           <Col>
             <h3 className="page-title">My Profile</h3>
           </Col>
         </Row>
         { state.userObj !== undefined ?
        <Row> Welcome {state.userObj.username} - your Role is {state.userObj.roles}</Row> : null }
        {/*<Row> {JSON.stringify(state.userObj)}</Row>
        <ManageVideos></ManageVideos>
         <ManageUsers></ManageUsers>*/}
         <Friends/>
       </Content>
     </Layout>
   );
};

export default MyProfile;
