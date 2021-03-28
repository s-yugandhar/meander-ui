
import axios from 'axios';
import {notification } from 'antd';
import {  PAGE,FOLDER_CREATED,  FILE_UPLOADED,  FOLDER_NAME ,FILE_LIST,
    VIDEO_LIST,FOLDER_LIST} from '../../reducer/types';
import {  FolderAddOutlined,  CheckCircleOutlined, 
   ExclamationCircleOutlined, FolderOutlined,} from "@ant-design/icons";

export const url = "http://188.42.97.42:8000";

//export const url = "http://127.0.0.1:8002";


export const GetFolders= async (state,dispatch ,userId)=>{
 

   if (userId === undefined ) 
      return []; 
       //dispatch({  type : FOLDER_LIST ,  payload : { folderList : []  }});
 
   const tempFolders = await axios.post(url + '/list_objects?id=' + userId + '&recursive=true', null, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
            }
   }).then(res => {   return res.data;   })
   
   dispatch({   type: PAGE,   payload: {    page: 'my-videos'    } });
   dispatch({  type : FOLDER_LIST ,  payload : { folderList : tempFolders  }});
   dispatch({  type : FOLDER_NAME , payload : {folderName : ''}});
   return tempFolders;

}


export async function GetFiles(userId, folderName) {

   let tempFiles = [];
   if (folderName === '') return [];
   const getFiles = await axios.post(url + '/list_objects?id=' + userId + '&recursive=false&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json', //Authorization : "bearer "+state.token,
      }
   }).then(res => {
      res.data.map(Ob => {
         if (!Ob._object_name.includes('temp.dod')) {
            tempFiles.push(Ob);
         }
      });

      console.log('Get Files after filter - ', tempFiles);
      return tempFiles;
   });

   return getFiles;

}


export const CreateNewFolder = async (state,dispatch ,userId, folderName) => {
   const crtFolder = axios.post(url + '/create_folder?id=' + userId + '&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json' ,Authorization : "bearer "+state.token,
      } }).then(res=>{
      if (res.data.status_code === 200 ) {
      notification.open({message:res.data.detail ,
          icon: <ExclamationCircleOutlined style={{ color: "red" }}/>    });
    } else if (res.data.status_code === 201) {
      notification.open({
        message: `Successfully created`,
        description: `Successfully ${folderName} created`,
        icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,
      });
      dispatch({ type: FOLDER_CREATED, payload: { folderCreated: folderName } });
    } else {
      notification.open({message:'Unknown error occured'});
    }});
    GetFolders(state,dispatch,state.userId);
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
   const getFiles = await axios.delete(url + `/users/${state.userId}/video/${obj.obid}`, 
   {"path": obj.itempath} , {
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


export const dbGetObjByPath=async(state,dispatch , path )=>{
   const getFiles = await axios.post(url + `/users/${state.userId}/video/`, 
   {"path": path , "recursive": true} , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      //notification.open({ message : "Get objects from db succesful" });
      //if(res.status === 200){ 
         console.log(  "get video obj in db" , res );
      dispatch({ type : VIDEO_LIST , payload :{ videoList : res.data   }});
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