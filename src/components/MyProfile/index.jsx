import React, { useState } from "react";
import "./myProfile.scss";
import {
   Divider,Layout, Row, Col, Form, Input,   Button, Radio,   Select, Upload,} from "antd";

const MyProfile = () => {
   const [requiredMark, setRequiredMarkType] = useState("optional");
   const { Header, Footer, Sider, Content } = Layout;

   const onRequiredTypeChange = ({ requiredMark }) => {
      setRequiredMarkType(requiredMark);
   };

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
       </Content>
     </Layout>
   );
};

export default MyProfile;
