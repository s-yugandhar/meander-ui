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
import {Context} from '../../Context.jsx';

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