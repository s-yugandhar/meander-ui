import React, { useContext , useState } from "react";
import { Button, Card, Dropdown, Menu, Tooltip , Modal,Form , Input} from "antd";
import {   EditOutlined, DeleteOutlined,   LinkOutlined,
   FolderFilled,   EllipsisOutlined,   DeleteFilled} from "@ant-design/icons";
import {deletePlaylist , listPlaylist , editPlaylistName} from '../API';
import { Context} from '../../context'
import {FOLDER_NAME , FOLDER_LIST} from '../../reducer/types';
import axios from "axios";

const FolderCard = (props) => {

   const {state,dispatch}    = useContext(Context);
   const [editPop,setEditPop] = useState(false);  
   const showAllvideos = () => {
      listPlaylist(state,dispatch);
    }

   const deleteFolder = (id ) => {
      let flag = window.confirm('Do you really want to delete folder ?');
    if (flag === false) return;
      deletePlaylist(state , dispatch ,id  ).then((res)=>{ showAllvideos()});
   }

   const editFolder = (values) => {
     console.log(values);
    let obj = props.folderObj ;
    obj.foldername = values.folderName;obj.cleanname= values.folderName;
    if(obj.acl === null || obj.acl === undefined) obj.acl = {}
      editPlaylistName(state,dispatch,props.folderObj.id,obj);
   }

   const menu = (
      <Menu>
         <Menu.Item key="delete-folder">
            <Button type="link" className="delete-folder-btn" onClick={(e)=>deleteFolder(props.userId,props.folderName )}><DeleteFilled /> Delete</Button>
         </Menu.Item>
      </Menu>
   );

   return (
     <>
     <Card
       bordered={true}
       className="cardVideo cardFolder full-width"
       actions={[
           <Tooltip title="Click to delete video">
             <DeleteOutlined
               key="delete"
               title={"click to delete object"}
               onClick={()=> deleteFolder(props.folderObj.id)}
             />
           </Tooltip>,
           <Tooltip title="Click to edit Metadata">
             <EditOutlined
               key="edit"
               onClick={()=> setEditPop(true)}
             />
           </Tooltip>
          ]}
     >
       <div className="videoCardBlock folderCardBlock">
         <Button
           type="default"
           htmlType="button"
           className="folderBtn"
           onClick={props.folderOnClick}
         >
           <FolderFilled className="folderIcon" />

           <div className="videoCardInfoBlock">
             <div className="videoTitle folderTitle">{props.folderName}</div>
             <div className="publishedDate folderInfo">
               {props.videosCount} {" videos"}
             </div>
           </div>
         </Button>
       </div>
       {/* <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" className="ant-dropdown-link floatingFolderOptions" onClick={e => e.preventDefault()}>
               <EllipsisOutlined className="folderDropDownIcon" />
            </Button>
         </Dropdown> */}
       {/* <Button type="link" className="floatingFolderOptions"><EllipsisOutlined className="folderDropDownIcon" /></Button> */}
     <Modal title="Edit Folder" destroyOnClose={true} visible={editPop} onOk="" onCancel={()=>setEditPop(false)} footer={null}>
        <Form name="basic" initialValues={{ folderName : props.folderName }} onFinish={editFolder} layout="vertical">
          {/*errMsg ? (
            <Alert   message={errMsg}
              closable type="error"
              onClose={() => setErrMsg(null)}
              style={{ marginBottom: "20px" }}
            />
          ) : null */}
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please enter any name!",
              },
              { max: 35, message: "Maximum 35 characters" },
            ]}>
            <Input />
          </Form.Item>
          {/*<Form.Item
            label="Access to"
            name="accessTo"
            rules={[
              {
                require: true,
              },
            ]}>
            <Select mode="multiple" size="middle" placeholder="Please select" onChange="" style={{ width: "100%" }}>
              <Option>Access 1</Option>
              <Option>Access 2</Option>
              <Option>Access 3</Option>
          </Select>
          </Form.Item>*/}
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" >
              save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </Card>
     </>
   );
};

export default FolderCard;
