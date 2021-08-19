import React, { useContext,useState, useEffect } from 'react';
import {  Select } from "antd";
import Uppy from "@uppy/core";
import "uppy/dist/uppy.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import '@uppy/webcam/dist/style.css'
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import Webcam from "@uppy/webcam";
import ScreenCapture from "@uppy/screen-capture";
import { Dashboard, useUppy, DragDrop } from "@uppy/react";
import { Context } from "../../context";
import "./uppyUpload.scss";

import {
  FILE_LIST,
  FILE_UPLOADED,
  FOLDER_NAME,
  UPPY_SUCCESS,
  UPPY_BATCHID,
  UPPY_FAILED,
  PAGE,
} from "../../reducer/types";

import {
  dbAddObj,
  dbGetObjByPath,
  deleteAfterUpload,
  GetFiles,
  GetUserdetails,
  url,
  getPublicItems,
} from "../API";

const UppyUpload = (props) => {

   const { Option } = Select;
   const videomime = "video/*";
   const audiomime = "audio/*";
   const imagemime = "image/*";
   const [uploadVideo, setUploadVideo] = useState(false);
   const [stateEdit, setStateEdit] = useState(false);
   const { state, dispatch } = useContext(Context);

   const localUserId = localStorage.getItem("userId");
   const token = localStorage.getItem("token");
   const uploadIdToContinueUpload = props.uploadId;

   const uppy = useUppy(() => {
     return new Uppy({
       allowMultipleUploads: false,
       autoProceed: false,
       debug: true,
       restrictions: { allowedFileTypes: [videomime, audiomime , imagemime] },
     }).use(Webcam, {
      onBeforeSnapshot: () => Promise.resolve(),
      countdown: false,
      modes: [    'video-audio',     'video-only',       'audio-only',      'picture'    ],
      mirror: true,
      videoConstraints: {        facingMode: 'user',
        width: { min: 720, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 800, max: 1080 },
      },
      showRecordingLength: true,
      preferredVideoMimeType: null,
      preferredImageMimeType: null,
      showVideoSourceDropdown : true,
      locale: {}
    }).use(ScreenCapture,{id:'MyScreenCapture'}).use(AwsS3Multipart, {
       limit: 1,
       companionUrl: url+"/swift/",
       Headers : { "uppy-auth-token" : "bearer "+token  },
       companionHeaders:{ "uppy-auth-token" : "bearer "+token  },
       getChunkSize(file) {
         var minChunkSize  = file.size/500;
          minChunkSize = minChunkSize < 9 * 1024 * 1024 ? 9 * 1024 * 1024 : minChunkSize ;
         var chunks = Math.ceil(file.size / (minChunkSize));
         return file.size < minChunkSize  ? minChunkSize  : Math.ceil(file.size / (chunks - 1));
       },
     });
   });

   //, "Authorization" : "bearer "+token
   const completeEvent = (result) => {
     console.log(result, "inside uppy complete event");
     let succes = result.successful;
     let failed = result.failed;
     let batchId = result.uploadID;
     let insertObj = [];
     succes.map((obj, ind) => {
       if (obj.progress.uploadComplete === true) {
         let idt = obj.s3Multipart.uploadId;
         dispatch({ type: FILE_UPLOADED, payload: { fileName: obj.name } });
         //deleteAfterUpload(idt);
         let path =
           "bucket-" +
           idt.split("-")[0] +
           "/" +
           idt.split("-")[1] +
           "/" +
           idt.split("-")[2];
         let builtObj = {
           name: obj.name,
           title: obj.meta.title,
           description: obj.meta.description,
           itempath: path,
           itemtype: obj.type,
           itemsize: obj.size,
           upload_state: "complete",
           scope: "private",
           updatetime: obj.meta.time,
         };
         insertObj.push(builtObj);
       }
     });
     dispatch({ type: UPPY_SUCCESS, payload: { uppySuccess: succes } });
     dispatch({ type: UPPY_FAILED, payload: { uppyFailed: failed } });
     dispatch({ type: UPPY_BATCHID, payload: { uppyBatchId: batchId } });
     if (insertObj.length > 0) {
       if (stateEdit === false) {
         dbAddObj(state, dispatch, insertObj);
         setStateEdit(insertObj[0].itempath);
       }
     }
   };

   const closeUploadVideo = () => {
     uppy.reset();
     setUploadVideo(false);
   };

   useEffect(() => {
     uppy.on("complete", (result) => {
       //completeEvent(result);
     });
     return () => uppy.off("complete");
   }, [uppy]);

   useEffect(() => {
     if (stateEdit !== false) {
       setStateEdit(false);
       closeUploadVideo();
       //dispatch({ type: "PAGE", payload: { page: "edit-video" } });
     }
   }, [state.editVideo]);

   useEffect(() => {
     if (state.folderCreated !== null && state.folderCreated !== "") {
       setUploadVideo(true);
     }
   }, [state.folderCreated]);

    useEffect(() => {
      const dispName =
        state.dbfolderList !== undefined && state.dbfolderList !== null
          ? state.dbfolderList.find((ob) => ob.id === state.folder ? state.folder.id : null)
          : undefined;
      uppy.setOptions({
        onBeforeFileAdded: (currentFile, files) => {
          var time = Date.now();     var uuid =  String(time);
          var chunks =   Math.ceil( currentFile.data.size / (5*1024*1024));
          if(dispName === undefined || dispName === null)
            uppy.info("Please select a folder");
          const modifiedFile = {        ...currentFile,
            name: uuid + "." + currentFile.name.split(".")[1],
            size : currentFile.data.size ,  type : currentFile.type ,
            meta : { filename :uuid + "." +currentFile.name.split(".")[1],     userId : state.userId , 
            foldername : dispName === undefined || dispName === null ? "default" : dispName.folderName,
            title : currentFile.name , name : currentFile.name , total_size : currentFile.data.size,
            type : currentFile.type , time : String(time) , total_chunks :  chunks-1,
            chunk_size : currentFile.data.size < 5*1024*1024 ?   5*1024*1024 :  Math.ceil(currentFile.data.size /(chunks-1)) ,
            uploadIdToContinue : uploadIdToContinueUpload }
          };
          return modifiedFile;
        },
        locale: {
          strings: {
            dropPaste:
              dispName === undefined || dispName === null
                ? `Drag & Drop or %{browse}`
                : `Drag & Drop or %{browse} to upload files to : ` +
                  dispName.foldername,
          },
        },
      });
      uppy.setMeta({
        userId: state.userId,
        foldername: state.folder ?  state.folder.id : "default",
      });
    }, [state.folder, localUserId]);


   return (
     <>
       <div className="uploadSelectfolderBlock">
         <Select
           size="medium"
           style={{ width: "100%", maxWidth: "360px" }}
           placeholder="search folder"
           optionFilterProp="children"
           showSearch={true}
           value={state.folder ?  state.folder.foldername : "default"}
           onChange={(value) => {
             dispatch({
               type: FOLDER_NAME,
               payload: { folder : value },
             });
             if (state.folder)
               GetFiles(state, dispatch, state.userId, state.folder.foldername);
           }}
         >
           {state.dbfolderList !== undefined && state.dbfolderList !== null
             ? state.dbfolderList.map((obj, ind) => {
                 return obj.foldertype === "folder" ? (
                   <>
                     {" "}
                     <Option key={obj.id} value={obj}>
                       {" "}
                       {obj.foldername}
                       {"   "}{" "}
                     </Option>{" "}
                   </>
                 ) : null;
               })
             : null}
         </Select>{" "}
       </div>
       <div className="uploadFileUppyBlock" >
       {/* <DragDrop   width="80%"   height="80%"
          note="Images up to 200×200px"
          // assuming `this.uppy` contains an Uppy instance:
          uppy={uppy}
          locale={{    strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: 'Drop here or %{browse}',
            // Used as the label for the link that opens the system file selection dialog.
            browse: 'browse',
            },
          }}
        />  */}    
         
         <Dashboard
           uppy={uppy}
           plugins={[]}
           showProgressDetails={true}
           proudlyDisplayPoweredByUppy={false}
           showRemoveButtonAfterComplete={true}
           showLinkToFileUploadResult={false}
           fileManagerSelectionType={"files"}
           inline={true}
            width="100%"
         />
       </div>
     </>

   )

}

export default UppyUpload;