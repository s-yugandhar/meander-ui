import React, { useContext } from "react";
import { Button, Card, Dropdown, Menu } from "antd";
import {   EditOutlined, DeleteOutlined,   LinkOutlined,
   FolderFilled,   EllipsisOutlined,   DeleteFilled} from "@ant-design/icons";
import {deleteFile_Folder , GetFolders} from '../API';
import { Context} from '../../context'
import {FOLDER_NAME , FOLDER_LIST} from '../../reducer/types';

const FolderCard = (props) => {

   const {state,dispatch}= useContext(Context);

   const showAllvideos = () => {
      GetFolders(state,dispatch,state.userId);
    }


   const deleteFolder = (id , folder) => {
      let flag = window.confirm('Do you really want to delete folder and its content ?');
    if (flag == false) return;
      if( folder in state.folderList   )
      deleteFile_Folder(state , dispatch ,id , folder , true  ).then((res)=>{ showAllvideos()});
      else 
      alert("this is not a folder to delete");
      showAllvideos();
   }

   const menu = (
      <Menu>
         <Menu.Item key="delete-folder">
            <Button type="link" className="delete-folder-btn" onClick={(e)=>deleteFolder(props.userId,props.folderName )}><DeleteFilled /> Delete</Button>
         </Menu.Item>
      </Menu>
   );

   return (
      <Card
         bordered={true}
         className="cardVideo cardFolder"
      >
         <div className="videoCardBlock folderCardBlock">
            <Button type="default" htmlType="button" className="folderBtn" onClick={props.folderOnClick}>

               <FolderFilled className="folderIcon" />

               <div className="videoCardInfoBlock">
                  <div className="videoTitle folderTitle">
                     {props.folderName}
                  </div>
                  <div className="publishedDate folderInfo">{props.videosCount} Videos</div>
               </div>
            </Button>
         </div>
         <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" className="ant-dropdown-link floatingFolderOptions" onClick={e => e.preventDefault()}>
               <EllipsisOutlined className="folderDropDownIcon" />
            </Button>
         </Dropdown>
         {/* <Button type="link" className="floatingFolderOptions"><EllipsisOutlined className="folderDropDownIcon" /></Button> */}

      </Card>
   );
};

export default FolderCard;
