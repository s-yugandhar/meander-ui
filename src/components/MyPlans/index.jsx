import React, {useState, useEffect, useContext} from 'react';
import { Table, Tag, Space, Modal, Button, Row, Col } from "antd";
import axios from 'axios';
import {
  CheckCircleOutlined
} from "@ant-design/icons";
//custom imports
import {Context} from '../../context';
import {url} from '../API';
import "./myplans.scss";

const MyPlans = () => {
  const [visible, setVisible] = useState(false);
  const [plansData, setPlansData] = useState([]);
    const {state, dispatch} = useContext(Context);
   const { Column, ColumnGroup } = Table;

   const columns = [
     {
       title: "Plan Name",
       dataIndex: "planName",
       key: "planName",
     },
     {
       title: "Duration",
       dataIndex: "duration",
       key: "duration",
     },
     {
       title: "Store Size",
       dataIndex: "storeSize",
       key: "storeSize",
     },
     {
       title: "Bandwidth",
       dataIndex: "bandwidth",
       key: "bandwidth",
     },
     {
       title: "Price",
       dataIndex: "price",
       key: "price",
     },
   ];

   const data = [
     {
       title: "Plan Name",
       dataIndex: "planName",
       key: "planName",
     },
     {
       title: "Duration",
       dataIndex: "duration",
       key: "duration",
     },
     {
       title: "Store Size",
       dataIndex: "storeSize",
       key: "storeSize",
     },
     {
       title: "Bandwidth",
       dataIndex: "bandwidth",
       key: "bandwidth",
     },
   ];

   const getPlansData = () => {
     axios.get(url+"/plans").then((res) => {
       setPlansData(res.data);
     });
   };

   const buyPlan = (id) => {
    axios
      .post(
        url + `/orders/${state.userId}/${state.userId}/?planid=${id}`, null,
        {
          headers: {
            Authorization: "bearer " + state.token,
          },
        }
      )
      .then((ordRes) => {
        console.log("Orders res - ", ordRes.data);
        if(ordRes.data.success === false) 
        {alert(` Error in order Creation : ${ordRes.data.detail} `);
      return;}
        if ( ordRes.data.amount <= 0) {

          alert('Hurray!!!, there is nothing to pay, Enjoy!');
          return ;
        } else {
          const rzrpy = new window.Razorpay({
            // key: "rzp_test_AnDnT0POdzl9fb",
            key: "rzp_test_AnDnT0POdzl9fb",
            name: "Meander",
            order_id: ordRes.data.id,
            handler: function (response) {
              axios.post(
                  `${url}/orders/${ordRes.data.id}/${response.razorpay_payment_id}/${response.razorpay_signature}`,
                  null,
                  {
                    headers: {
                      accept: "application/json",
                      Authorization: "bearer " + state.token,
                    },
                  }
                )
                .then((res) => {
                  console.log("Order ID Charge", res.data);
                  if(res.data.success === true)
                    alert(`hurray ${res.data.detail}`);
                  else 
                  alert(`  Nooooooooooo ${res.data.detail}`)
                });
            },
            prefill: {
              name:
                state.userObj && state.userObj.username
                  ? state.userObj.username
                  : "",
              email:
                state.userObj && state.userObj.email ? state.userObj.email : "",
              contact:
                state.userObj && state.userObj.phone
                  ? state.userObj.phone
                  : "",
            },
            notes: {
              address: "Meander",
            },
            theme: {
              color: "#ec1c29",
            },
          });
          rzrpy.open();
        }
        // Razorpay Ends
      });
   }

   useEffect(() => {
    console.log('Plans state - ', state);
    getPlansData();


   }, []);

   return (
     <div className="full-width plans-page">
       <div className="full-width">
         <Row style={{ marginBottom: "10px" }}>
           <Col span={12}>
             <h1>My Plans</h1>
           </Col>
           <Col span={12} style={{ textAlign: "right" }}>
             <Button type="primary" onClick={() => setVisible(true)}>
               Purchase Plan
             </Button>
           </Col>
         </Row>
       </div>
       <div className="plans-table full-width">
         <Table columns={columns}></Table>

         <ul>
           {plansData && plansData.length > 0
             ? plansData.map((plan, index) => (
                 <li>
                   <Button type="primary" onClick={() => buyPlan(plan.id)}>
                     {plan.planname}
                   </Button>
                 </li>
               ))
             : null}
         </ul>
       </div>

       {/* Modal Starts */}
       <Modal
         title="Purchase Plan"
         centered
         visible={visible}
         onOk={() => setVisible(false)}
         onCancel={() => setVisible(false)}
         width={1000}
         footer={null}
       >
         <div className="">
           <div className="compare-price-table-block">
             <div className="compare-price-table list-unstyled">
               <div className="compare-table-row header">
                 <div className="compare-table-col desc"></div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan"
                         key={"pld" + index}
                       >
                         {plan.planname}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row price-row">
                 <div className="compare-table-col desc">Price</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col font-size-lg each-plan justify-content-center"
                         key={"plpric" + index}
                       >
                         <strong>{plan.priceinrs}</strong>
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row storage-size">
                 <div className="compare-table-col desc">Storage Size</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan"
                         key={"plstorize" + index}
                       >
                         {plan.storesize ? plan.storesize : ""}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row bandwidth">
                 <div className="compare-table-col desc">Bandwidth</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan"
                         key={"plstorize" + index}
                       >
                         {plan.bandwidth ? plan.bandwidth : ""}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row bandwidth">
                 <div className="compare-table-col desc">Plan Duration</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan"
                         key={"pldur" + index}
                       >
                         {plan.planduration ? plan.planduration : ""}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row">
                 <div className="compare-table-col desc">Privacy</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plprv" + index}
                       >
                         {plan.privacy && plan.privacy === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.privacy === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row ">
                 <div className="compare-table-col desc">Player</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plplyr" + index}
                       >
                         {plan.player && plan.player === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.player === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>
               <div className="compare-table-row ">
                 <div className="compare-table-col desc">Analytics</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"planal" + index}
                       >
                         {plan.analytics && plan.analytics === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.analytics === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row ">
                 <div className="compare-table-col desc">Collaboration</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plcolb" + index}
                       >
                         {plan.collaboration && plan.collaboration === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.collaboration === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row ">
                 <div className="compare-table-col desc">Support</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plsupp" + index}
                       >
                         {plan.support && plan.support === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.support === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>
               <div className="compare-table-row ">
                 <div className="compare-table-col desc">Streaming</div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plstr" + index}
                       >
                         {plan.streaming && plan.streaming === 1 ? (
                           <CheckCircleOutlined
                             width={"34px"}
                             height={"34px"}
                             style={{ color: "#17b978" }}
                           />
                         ) : plan.streaming === 0 ? (
                           ""
                         ) : (
                           ""
                         )}
                       </div>
                     ))
                   : null}
               </div>

               <div className="compare-table-row ">
                 <div className="compare-table-col desc"></div>
                 {plansData && plansData.length > 0
                   ? plansData.map((plan, index) => (
                       <div
                         className="compare-table-col justify-content-center each-plan icon-block"
                         key={"plbynw" + index}
                       >
                         <Button
                           type="primary"
                           onClick={() => buyPlan(plan.id)}
                           size="large"
                         >
                           Buy Now
                         </Button>
                       </div>
                     ))
                   : null}
               </div>
             </div>
           </div>
         </div>
       </Modal>
       {/* Modal Ends */}
     </div>
   );
}

export default MyPlans;