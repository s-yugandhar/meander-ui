import React, { useState , useContext, useEffect } from "react";
import "./myProfile.scss";
import {
   Layout, Row, Col,Card , } from "antd";
import {Context} from '../../context';
import {USER_OBJ} from '../../reducer/types';
import { GetUserdetails } from '../API/index';
import ManageUsers from "../ManageUsers";
import Friends from "../Friends";
import Settings from  "../Settings";
import ShareAccess from "../ShareAccess";
import MyPlans from "../MyPlans";


const MyProfile = () => {
   const [requiredMark, setRequiredMarkType] = useState("optional");
   const { Header, Footer, Sider, Content } = Layout;
    const [tabnow,setTabNow] = useState("settings");

    const {state,dispatch} = useContext(Context);

   const onRequiredTypeChange = ({ requiredMark }) => {
      setRequiredMarkType(requiredMark);
   };

   useEffect(()=>{

    if( state.userId !== null && state.userId !== undefined)
    GetUserdetails(state,dispatch,state.userId);
   },[]);

   const tabListNoTitle = [
    //{    key: 'general',   tab: 'General',  },
    {     key: 'settings',    tab: 'Profile',   },
    {    key: 'inviteusers',   tab: 'Team',  },
    {    key: 'plans',   tab: 'Plans',  },
    //{    key: 'friends',   tab: 'Member of',  },
    //{    key: 'project',   tab: 'project'  },
  ];

  const contentListNoTitle = {
    general : <><Row> <Col>   <h3 className="page-title">My Profile</h3> </Col>
  </Row>{ state.userObj !== undefined ?
 <Row> Welcome {state.userObj.username} - your Role is {state.userObj.roles}</Row> : null }</>,
    friends:  <Friends/>,
    settings: <Settings/> ,
    inviteusers : <ShareAccess/>,
    plans: <MyPlans />,
    project: <p>To Do</p>,
  };

   return (
     <>
         <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={ tabnow }
          onTabChange={key => {setTabNow(key)}}
        >
          {contentListNoTitle[tabnow]}
        </Card>
       </>
   );
};

export default MyProfile;
