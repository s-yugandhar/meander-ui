
import axios from 'axios';


export const url = "http://188.42.97.42:8000";



export const GetFolders = async (userId) => {
   let tempFolders = [];
   let tempFiles= [];

   const getFolders = await axios.post(url + '/list_objects?id=' + userId + '&recursive=true', null, {
      headers: {
         accept: 'application/json',
      }
   }).then(res => {

      return res.data;
   })

   return getFolders;

}

export const GetFiles = async (userId, folderName) => {
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
      return res.data;
   }).catch(err => {

   });

   return crtFolder;


};
