import React, { useContext,useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import 'uppy/dist/uppy.min.css';
import '@uppy/core/dist/style.css'
import '@uppy/drag-drop/dist/style.css'
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { Dashboard, useUppy } from '@uppy/react'
import './uppyUpload.scss';
import { Drawer } from 'antd';
import {Context} from '../../context';
import { FILE_UPLOADED , FILE_LIST, UPPY_SUCCESS, UPPY_FAILED ,UPPY_BATCHID } from '../../reducer/types';
import { GetFiles , deleteAfterUpload } from '../API';

const UppyUpload = (props) => {
   const [visible, setVisible] = useState(props.visible);
   const { state, dispatch } = useContext(Context);

   const localUserId = localStorage.getItem('userId');
 

   const closeUploadVideo = () => {
      props.visible = false;
   }

   const uppy = useUppy(() => {
      return new Uppy( {  autoProceed : true}  ).use(AwsS3Multipart, {
         limit: 1,
         companionUrl: 'http://188.42.97.42:8000/',
         getChunkSize(file) {
            var chunks = Math.ceil(file.size / (5 * 1024 * 1024));
            return file.size < 5 * 1024 * 1024 ? 5 * 1024 * 1024 : Math.ceil(file.size / (chunks - 1));
         }
      })
   });

  function updateFiles(id , folderName){
   GetFiles(id , folderName).then(res => {
      console.log('My Videos Files in sidenav - ', res);
       dispatch({
        type: FILE_LIST,
        payload: {
          fileList: res
        }}); });
      }

   uppy.on('complete', (result) => {
      console.log(result , "inside uppy complete event")
      let succes = result.successful;
      let failed = result.failed;
      let batchId = result.uploadID;
      succes.map((obj,ind)=>{
         if( obj.progress.uploadComplete=== true){
            dispatch({ type: FILE_UPLOADED,  payload: { fileNmae:  obj.name }   })
            deleteAfterUpload(obj.s3Multipart.uploadId);
         }
      });

      dispatch({ type: UPPY_SUCCESS,  payload: { uppySuccess: succes  }   })
      dispatch({ type: UPPY_FAILED,  payload: { uppyFailed: failed  }   })
      dispatch({ type: UPPY_BATCHID,  payload: { uppyBatchId: batchId  }   })
      updateFiles(state.userId,state.folderName);
    });

   useEffect(()=>{
      uppy.setMeta( { userId: localUserId , foldername : state.folderName})

   },[state.folderName,localUserId])

   return (
      <Drawer
         title="Upload Videos"
         placement="right"
         closable={true}
         onClose={closeUploadVideo}
         visible={props.visible}
         key="right"
         mask={false}
         className="uploadVideoDrawer"
      >
         <Dashboard
            uppy={uppy}
            locale={{
               strings: {
                  dashboardTitle: "Drag & Drop or Click to upload",
                  poweredBy2: ""
               }
            }}
            showProgressDetails={true}
         />
      </Drawer>

   )

}

export default UppyUpload;