
import axios from 'axios';
import { AuthContext, Context } from '../../context';
export const url = "http://188.42.97.42:8000";


export const getFolders = (userId) => {
   let tempFolders = [];
   axios.post(url + '/list_objects?id=' + userId + '&recursive=true', null, {
      headers: {
         accept: 'application/json',
      }
   }).then(res => {
      console.log(res.data);

      res.data.map(Ob => {
         if (Ob._object_name.includes('temp.dod')) {
            tempFolders.push(Ob._object_name);
         }
      });
   })

   return tempFolders;

}