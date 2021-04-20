
import axios from 'axios';
import {notification } from 'antd';
import {  PAGE,FOLDER_CREATED,  FILE_UPLOADED,  FOLDER_NAME ,FILE_LIST,
    EDIT_VIDEO,VIDEO_LIST,FOLDER_LIST,USER_OBJ }  from '../../reducer/types';
import {  FolderAddOutlined,  CheckCircleOutlined,
   ExclamationCircleOutlined, FolderOutlined,} from "@ant-design/icons";

export const url = "https://meander.video";

//export const url = "http://127.0.0.1:8002";


export const GetUserdetails= async (state,dispatch ,userId)=>{
   if (userId === undefined )
      return [];
       //dispatch({  type : FOLDER_LIST ,  payload : { folderList : []  }});
   const tempFolders = await axios.get(url + `/users/${userId}`, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
            }
   }).then(res => {
      console.log(res);
      return res.data;   })
   console.log(" userdata in get ", tempFolders);
   dispatch({  type : USER_OBJ , payload : { userObj : tempFolders}});
   return tempFolders;
}


export const GetFolders= async (state,dispatch ,userId)=>{
   if (userId === undefined )
      return [];
   let setfolders = new Set();    
   //dispatch({  type : FOLDER_LIST ,  payload : { folderList : []  }});
   const tempFolders = await axios.post(url + '/list_objects?id=' + userId + '&recursive=true', null, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
            }
   }).then(res => {
      console.log(res);
      return res.data;   })
      tempFolders.dblist.map(obj=>{
         setfolders.add( obj.itempath.split("/")[1]  );
      });
      setfolders.add("default");
   dispatch({  type : FOLDER_NAME , payload : {folderName : ''}});
   dispatch( { type : FOLDER_LIST , payload :{ folderList : [...setfolders] }  });   
   dispatch({ type : VIDEO_LIST , payload : {videoList :tempFolders.dblist } });
   dispatch({   type: PAGE,   payload: {    page: 'my-videos'    } });   
   console.log(" data in get folders", state.folderList);
   return tempFolders;
}

export async function GetFiles(state,dispatch,userId, folderName) {
   let tempFiles = [];
   if (folderName === '') return [];
   const getFiles = await axios.post(url + '/list_objects?id=' + userId + '&recursive=false&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json', //Authorization : "bearer "+state.token,
      }
   }).then(res => {           
      dispatch({type:VIDEO_LIST , payload : { videoList : res.data.dblist }});
      return res.data.dblist;
   });
   return getFiles;
}


export const CreateNewFolder = async (state,dispatch ,userId, folderName) => {
   const crtFolder = axios.post(url + '/create_folder?id=' + userId + '&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json' ,Authorization : "bearer "+state.token,
      } }).then(res=>{
      if (res.data.status_code === 200 ) {
         dispatch({ type: 'FOLDER_LIST',
          payload: { folderList:  Array.from( new Set(state.folderList).add(folderName)  ) } });
          dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
      if( folderName !== "default")
         notification.open({message:"Folder Exists, Upload a file to retain folder",
          icon: <ExclamationCircleOutlined style={{ color: "red" }}/>    });
    } else if (res.data.status_code === 201) {
      if( folderName !== "default")
      notification.open({
        message: `Successfully created : ${folderName} `,
        description: `Upload a file to retain folder `,
        icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,
      });
      dispatch({ type: FOLDER_CREATED, payload: { folderCreated: folderName } });
      //GetFolders(state,dispatch,state.userId);
      dispatch({ type: 'FOLDER_LIST',
          payload: { folderList:  Array.from( new Set(state.folderList).add(folderName)  ) } });
          dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    } else {
      notification.open({message:'Unknown error occured in create Folder'});
    }});

   return crtFolder;
};


export const deleteAfterUpload = async (uploadId) => {
   const crtFolder = await axios.delete(url + '/s3/multipart/' + uploadId , null, {
      headers: {
         accept: 'application/json'
      }
   }).then(res => {
      console.log('delete after upload - ', res);
      notification.open({message: "deleting temporary chunks after upload success"});
      return "";
   }).catch(err => {
      notification.open({message: `deleting temporary chunks after upload Failed ,
       please delete objects with number names manually` });
       return "";
   });
   return crtFolder;
};


export const deleteFile_Folder = async (state,dispatch, userId,objectName , recursive) => {
   let recflag = recursive === false ? '&recursive=false&object_name=' : '&recursive=true&object_name='
   if (objectName === '') return null;
   const getFiles = await axios.delete(url + '/delete_objects?id=' + userId + recflag + objectName, null, {
      headers: {
         accept: 'application/json',
      }
   }).then(res => {
      notification.open({ message : "Delete action succesful" });
      console.log(  "delete success" , res , objectName , recursive , userId);
      return "";   });
   /*.then(err=>{ console.log(  "delete failed" , err , objectName , recursive , userId); } );*/
      if (getFiles === ""){
         let path = recursive ===true ? objectName+"/" : objectName;
            dbRemoveObj( state, dispatch , "bucket-"+userId +"/"+path , recursive );
      }
   return getFiles;
}

export const dbAddObj=async(state,dispatch, obj)=>{
   const getFiles = await axios.post(url + `/users/${state.userId}/items/` , JSON.stringify(obj)    , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      notification.open({ message : "Delete action succesful" });
      console.log(  "delete success" , res );
      return "";   });
   /*.then(err=>{ console.log(  "delete failed" , err , objectName , recursive , userId); } );*/
   return getFiles;
}

export const dbGetObjList=async(state,dispatch)=>{
   const getFiles = await axios.get(url + `/users/${state.userId}/items/` , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      //notification.open({ message : "Get objects from db succesful" });
      //if(res.status === 200){
         console.log(  "delete success" , res );
      dispatch({ type : VIDEO_LIST , payload :{ videoList : res.data   }});
      //return "";}
      //else{
      //   console.log("Error in getting objects from db");
      // }
   });
   /*.then(err=>{ console.log(  "delete failed" , err , objectName , recursive , userId); } );*/
   return getFiles;
}

export const dbUpdateObj=async(state,dispatch ,obj)=>{
   const getFiles = await axios.post(url + `/users/${state.userId}/video/update/`,
   obj , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      if( res.data === true){
       notification.open({message : " Update succesful"});
       console.log(  "update success" , res );
      dispatch({ type : VIDEO_LIST , payload :{ videoList : res.data   }});}
      else {
         notification.open({message : " Update failed"});

      }
   });
   /*.then(err=>{ console.log(  "delete failed" , err , objectName , recursive , userId); } );*/
   return getFiles;
}


export const dbGetObjByPath=async(state,dispatch , path , recursive )=>{
   const getFiles = await axios.post(url + `/users/${state.userId}/video/`,
   {"path": path , "recursive": recursive} , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      //notification.open({ message : "Get objects from db succesful" });
      //if(res.status === 200){
         console.log(  "get video obj in db" , res );
  if( recursive === true) dispatch({ type : VIDEO_LIST , payload :{ videoList : res.data   }});
      else  dispatch({ type : EDIT_VIDEO , payload :{ editVideo : res.data[0]   }});
   //return "";}
      //else{
      //   console.log("Error in getting objects from db");
      // }
   });
   /*.then(err=>{ console.log(  "delete failed" , err , objectName , recursive , userId); } );*/
   return getFiles;
}

export const dbRemoveObj=async( state , dispatch ,path , recursive )=>{
   const getFiles = await axios.post(url + `/users/${state.userId}/video/delete/`,
   {"path": path , "recursive": recursive} , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      notification.open({ message : "objects removal from db succesful" });
      //if(res.status === 200){
         console.log(  "delete video obj " , res );
     // dispatch({ type : VIDEO_LIST , payload :{ videoList : res.data   }});
      //return "";}
      //else{
      //   console.log("Error in getting objects from db");
      // }
   });
   return getFiles;
}
