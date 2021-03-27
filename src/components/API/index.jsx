
import axios from 'axios';
import { useContext} from 'react';
import {notification} from 'antd';
import {Context} from '../../context'
export const url = "http://188.42.97.42:8000";

//export const url = "http://127.0.0.1:8002";


export const GetFolders= async (userId)=>{
   const getFolders = await axios.post(url + '/list_objects?id=' + userId + '&recursive=true', null, {
      headers: {
         accept: 'application/json',
      }
   }).then(res => {
   
      return res.data;

   })
   return getFolders;

}


export async function GetFiles(userId, folderName) {

   let tempFiles = [];
   if (folderName === '') return [];
   const getFiles = await axios.post(url + '/list_objects?id=' + userId + '&recursive=false&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json',
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


export const CreateNewFolder = async (userId, folderName) => {
   const crtFolder = await axios.post(url + '/create_folder?id=' + userId + '&foldername=' + folderName, null, {
      headers: {
         accept: 'application/json'
      }
   }).then(res => {
      console.log('Create Folder Res - ', res);
      GetFolders(userId);
      return res.data;
   }).catch(err => {

   });

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


export const deleteFile_Folder = async ( userId,objectName , recursive) => {
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

   return getFiles;

}

