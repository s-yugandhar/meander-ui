
import axios from 'axios';
import {message, notification } from 'antd';
import {  PAGE,FOLDER_CREATED,  FILE_UPLOADED,  FOLDER_NAME ,FILE_LIST,
    EDIT_VIDEO,VIDEO_LIST,FOLDER_LIST,USER_OBJ }  from '../../reducer/types';
import {  FolderAddOutlined,  CheckCircleOutlined,
   ExclamationCircleOutlined, FolderOutlined,} from "@ant-design/icons";
import { Content } from 'antd/lib/layout/layout';

export const url = "https://meander.video";
//export const url = "http://127.0.0.1:8002";
export const cdn_url = "https://cdns.meander.video/";


const getParentAssingnedRole = async (child_id) => {
   const arcAcc = JSON.parse(localStorage.getItem("archive"));
   if (arcAcc === null)  return "viewer";
   const token = arcAcc === null ? null : arcAcc.token ;
   const userId = arcAcc === null ? null : arcAcc.userId ;
   const tempFolders = await axios.get(url + `/users/${userId}`, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+token,
            }
   }).then(res => {
      console.log(res);
      return res.data;   });
      if( tempFolders !== undefined && tempFolders !== null && 
          tempFolders.roles === "reseller" || tempFolders.roles === "super_admin")
            return "self";
   if(  tempFolders !== undefined && tempFolders !== null && 
      tempFolders.access !== undefined && tempFolders.access !== null   ){
         if( tempFolders.access.admin.includes(child_id))
            return "admin";
         if( tempFolders.access.user.includes(child_id))
            return "user";
         
      }   return "viewer";
}

export const GetUserdetails= async (state,dispatch ,userId)=>{
   if (userId === undefined )   return [];
       //dispatch({  type : FOLDER_LIST ,  payload : { folderList : []  }});
   const tempFolders = await axios.get(url + `/users/${userId}`, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
            }
   }).then(res => {
      console.log(res);
      return res.data;   });
   console.log(" userdata in get ", tempFolders);
   if(state.archiveAccount !== null){
      let shroles  = await getParentAssingnedRole(tempFolders.id);
      if( shroles !== "self")  tempFolders.roles = shroles;
   }
      dispatch({type:"USER_OBJ",payload:{userObj : tempFolders}});
   return tempFolders;
}

export const GetFolders= async (state,dispatch ,userId)=>{
   if (userId === undefined )   return [];
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
   dispatch({   type: PAGE,   payload: {    page: 'videos'    } });
   console.log(" data in get folders", state.folderList);
   return tempFolders;
}

export async function GetFiles(state,dispatch,userId, folderName) {
   let tempFiles = [];
   if (folderName === '') return [];
   const getFiles = await axios.post(url + '/list_objects?id=' + userId + '&recursive=false&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
      }
   }).then(res => {
      dispatch({type:VIDEO_LIST , payload : { videoList : res.data.dblist }});
      return true;
   })
   return getFiles ? true : false;
}


export const CreateNewFolder = async (state,dispatch ,userId, folderName) => {
   if(folderName in state.folderList)
      {  //notification.open({message:"Folder Exists with files in it",
         //icon: <ExclamationCircleOutlined style={{ color: "red" }}/>    });
         return "";}
   const crtFolder = axios.post(url + '/create_folder?id=' + userId + '&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json' ,Authorization : "bearer "+state.token,
      } }).then(res=>{
      if (res.data.status_code === 200 ) {
         dispatch({ type: 'FOLDER_LIST',
          payload: { folderList:  Array.from( new Set(state.folderList).add(folderName)  ) } });
          dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
          dispatch({ type: FOLDER_CREATED, payload: { folderCreated: folderName } });
      if( folderName !== "default");
         //notification.open({message:"Folder Exists, Upload a file to retain folder",
          //icon: <ExclamationCircleOutlined style={{ color: "red" }}/>    });
    } else if (res.data.status_code === 201) {
      if( folderName !== "default")
      //notification.open({
       // message: `Successfully created : ${folderName} `,
        //description: `Upload a file to retain folder `,
       // icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,      });
      dispatch({ type: FOLDER_CREATED, payload: { folderCreated: folderName } });
      //GetFolders(state,dispatch,state.userId);
      dispatch({ type: 'FOLDER_LIST',
          payload: { folderList:  Array.from( new Set(state.folderList).add(folderName)  ) } });
          dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    } else {;
      //notification.open({message:'Unknown error occured in create Folder'});
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
      //notification.open({message: "deleting temporary chunks after upload success"});
      return "";
   }).catch(err => {
      //notification.open({message: `deleting temporary chunks after upload Failed ,
       //please delete objects with number names manually` });
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
      //notification.open({ message : "Delete file in  cdn" });
      console.log(  "delete success" , res , objectName , recursive , userId);
      return "";   }).catch(err=>  
         notification.open({ message : "Error in deleting file in cdn" })
         );
   
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
      notification.open({ message : "Uploaded successfully!" });
      console.log(  "upload success" , res );
      dispatch({type:'EDIT_VIDEO', payload : { editVideo : res.data[0]}  });
      return true;
   });
   return getFiles? true : false;
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
   }).catch(err=> notification.open({message : " Update failed"}))
   ;
   
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
      notification.open({ message : "Deleted the video succesfully" });
         console.log(  "delete video obj " , res );
     
   }).catch(err=> notification.open({ message : "Error while deleting video" }) );
   return getFiles;
}


export const listPlaylist=async (state,dispatch)=>{ 
   const getFiles = await axios.get(url + `/listplaylist?user_id=${state.userId}` , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
      
         console.log(  "playlist list" , res );
      dispatch({ type : "DBFOLDER_LIST" , payload :{ dbfolderList : res.data   }});
      return res.data;
   });
   return getFiles;
}

export const createPlaylist=async (state,dispatch,name,ftype)=>{
   const getFiles = await axios.get(url + `/createplaylist?user_id=${state.userId}&name=${name}&ftype=${ftype}` , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
         console.log(  "createFolder/playlist" , res );
      return res.data;
   }).then(err=>{ return null; } );
   return getFiles;
}

export const updatePlaylist= async (state,dispatch,ftype,pid,vid,pos)=>{
   if (pos === null || pos === undefined) pos=-1;
   if (ftype === null) return;
   const getFiles = await axios.get(url + `/addtoplaylist?user_id=${state.userId}&pid=${pid}&ftype=
   ${ftype}&vid=${vid}&pos=${pos}` , {
      headers: {
         accept: 'application/json',  Authorization : "bearer "+state.token,
      }
   }).then(res => {
         notification.open({message:   res.data +"playlist update operation"});
   }).then(err=>{ return null; } );
   return getFiles;
}

export const getPublicItems=async(state,dispatch,key)=>{
   const tempFolders = await axios.get(url + `/searchvideos?key=${key}`, {
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {     
       dispatch({type:"PUBLIC_VIDEOS",payload:{publicVideos : res.data}});
       return res.data;   }).catch(err=> {
         return [] });
      return tempFolders;
};