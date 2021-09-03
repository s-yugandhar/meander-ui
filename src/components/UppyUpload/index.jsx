import React, { useContext,useState, useEffect } from 'react';
import {  Button, Select } from "antd";
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
  createPlaylist
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
   const uploadMime = props.mimeType.startsWith("audio") ? [ audiomime] : [ videomime] ;
   const compUrl = props.mimeType.startsWith("audio") ? '/audioupload/swift/' : '/videoupload/swift/' ;
   const fileObj = props.fileObj ? props.fileObj : null;


const uppy = useUppy(() => {
     return new Uppy({
       allowMultipleUploads: false,
       autoProceed: false,
       debug: true,
       restrictions: { allowedFileTypes: uploadMime },
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
    }).use(AwsS3Multipart, {
       limit: 1,
       companionUrl: url+ compUrl,
       Headers : { "uppy-auth-token" : "bearer "+token  },
       companionHeaders:{ "uppy-auth-token" : "bearer "+token  },
       getChunkSize(file) {
         if(file.size < 5*1024*1024*1024){
          var minChunkSize = 6*1024*1024;
         var chunks = Math.ceil(file.size / (minChunkSize));
         return file.size < minChunkSize  ? file.size  : Math.ceil(file.size / (chunks - 1));}
         else{
           return 0;
         }
       },
     });
   });

   //, "Authorization" : "bearer "+token
   const completeEvent = (result) => {
     console.log(result, "inside uppy complete event");
     let succes = result.successful;   let failed = result.failed;     let batchId = result.uploadID;
     let insertObj = [];
     succes.map((obj, ind) => {
       if (obj.progress.uploadComplete === true) {
         let idt = obj.s3Multipart.uploadId;
         //deleteAfterUpload(idt);
         let body = obj.response.body;
         console.log(body.obj);
         insertObj.push(body.obj);   
       }
     });
     dispatch({ type: UPPY_SUCCESS, payload: { uppySuccess: succes } });
     dispatch({ type: UPPY_FAILED, payload: { uppyFailed: failed } });
     dispatch({ type: UPPY_BATCHID, payload: { uppyBatchId: batchId } });
     dispatch({ type: "EDIT_VIDEO", payload : { editVideo : insertObj[0] }});
     dispatch({ type: "PAGE", payload: { page: "edit-video" } });
     
   };

   const closeUploadVideo = () => {
     uppy.reset();
     setUploadVideo(false);
   };

   useEffect(() => {
     uppy.on("complete", (result) => {
       completeEvent(result);
     });
     return () => uppy.off("complete");
   }, [uppy]);


    useEffect(() => {

      uppy.setOptions({
        onBeforeFileAdded: (currentFile, files) => {
          var time = Date.now();     var uuid =  String(time);
          if(currentFile.data.size > 5*1024*1024*1024) return false;
          var minChunkSize = 6*1024*1024;
         var chunks = Math.ceil(currentFile.data.size / (minChunkSize));
          const modifiedFile = {        ...currentFile,
            name: uuid + "." + currentFile.name.split(".")[1],
            size : currentFile.data.size ,  type : currentFile.type ,
            meta : { filename :uuid + "." +currentFile.name.split(".")[1],     userId : state.userId ,
            foldername : state.folder ?  state.folder.id :  ""  ,
            title : currentFile.name , name : currentFile.name , total_size : currentFile.data.size,
            type : currentFile.type , time : String(time) , total_chunks :  chunks-1,
            chunk_size : currentFile.data.size < minChunkSize  ? currentFile.data.size  : Math.ceil(currentFile.data.size / (chunks - 1)),
            uploadIdToContinue : uploadIdToContinueUpload }
          };
          console.log(  JSON.stringify( modifiedFile.meta ) );
          return modifiedFile;
        },
        locale: {
          strings: {
            dropPaste:
              state.folder
                ?  `  Drag & Drop to upload files to or %{browse}`:
                   `  Drag & Drop or %{browse}`,
          },
        },
      });

      if(fileObj !== null)
        uppy.addFile(fileObj);

      uppy.setMeta({
        userId: state.userId,
        foldername: state.folder ?  state.folder.id : "",
      });
    }, [state.folder, localUserId , uppy , fileObj]);


   return (
     <div className="meander-upload">
       { props.mimeType.startsWith('audio') ||   props.mimeType.startsWith('video') ? "" :
       <p>Possible error in upload , mimeType doesn't start with audio or video</p> }
       <div className="uploadSelectfolderBlock">
         Folder : <Select
           size="medium"
           style={{ width: "100%", maxWidth: "360px" , marginTop : "5px", marginBottom :"5px" }}
           placeholder="search folder"
           optionFilterProp="children"
           showSearch={true}
           value={state.folder ?  state.folder.foldername : ''  }
           onChange={(value) => {
             dispatch({
               type: FOLDER_NAME,
               payload: { folder : JSON.parse(value) },
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
                     <Option key={obj.id} value={JSON.stringify(obj) } >
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
       <div className="uploadFileUppyBlock" style={{marginBottom: "5px", marginTop:"5px" }}  >
       {/* <DragDrop   width="80%"   height="80%"
          note="Images up to 200×200px"
          // assuming `this.uppy` contains an Uppy instance:
          uppy={uppy}
          locale={{    strings: {          // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropHereOr: 'Drop here or %{browse}',
            // Used as the label for the link that opens the system file selection dialog.
            browse: 'browse',
            },
          }}
        />  */}
         <Dashboard    uppy={uppy}   plugins={[]}
           showProgressDetails={true}
           proudlyDisplayPoweredByUppy={false}
           showRemoveButtonAfterComplete={true}
           showLinkToFileUploadResult={false}
           fileManagerSelectionType={"files"}
           inline={true}         width="100%" height="400px"
      />
       </div>
     </div>

   )

}

export default UppyUpload;
