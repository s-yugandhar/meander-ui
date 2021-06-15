import React, { useContext,useState, useEffect } from 'react';

import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Drawer,
  Button,
  message,
  notification,
  Divider,
} from "antd";
import Uppy from "@uppy/core";
import "uppy/dist/uppy.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { Dashboard, useUppy } from "@uppy/react";
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
   const [uploadVideo, setUploadVideo] = useState(false);
   const [stateEdit, setStateEdit] = useState(false);
   const { state, dispatch } = useContext(Context);

   const localUserId = localStorage.getItem("userId");
   const token = localStorage.getItem("token");

   const uppy = useUppy(() => {
     return new Uppy({
       allowMultipleUploads: false,
       autoProceed: false,
       debug: true,
       restrictions: { allowedFileTypes: [videomime, audiomime] },
     }).use(AwsS3Multipart, {
       limit: 1,
       companionUrl: url,
       getChunkSize(file) {
         var chunks = Math.ceil(file.size / (5 * 1024 * 1024));
         return file.size < 5 * 1024 * 1024
           ? 5 * 1024 * 1024
           : Math.ceil(file.size / (chunks - 1));
       },
     });
   });

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
       completeEvent(result);
     });
     return () => uppy.off("complete");
   }, [uppy]);

   useEffect(() => {
     if (stateEdit !== false) {
       setStateEdit(false);
       closeUploadVideo();
       dispatch({ type: "PAGE", payload: { page: "edit-video" } });
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
          ? state.dbfolderList.find((ob) => ob.id === state.folderName)
          : undefined;
      uppy.setOptions({
        onBeforeFileAdded: (currentFile, files) => {
          let time = Date.now();
          let uuid = state.userId + String(time);
          const modifiedFile = {
            ...currentFile,
            name: uuid + "." + currentFile.name.split(".")[1],
            meta: {
              title: currentFile.name,
              description: currentFile.name,
              time: time,
              uuidname: uuid,
            },
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
        foldername: state.folderName === "" ? "default" : state.folderName,
      });
    }, [state.folderName, localUserId]);


   return (
     <>
       <div className="uploadSelectfolderBlock">
         <Select
           size="medium"
           style={{ width: "100%", maxWidth: "360px" }}
           placeholder="search folder"
           optionFilterProp="children"
           showSearch={true}
           value={state.folderName === "" ? "default" : state.folderName}
           onChange={(value) => {
             dispatch({
               type: FOLDER_NAME,
               payload: { folderName: value },
             });
             if (state.folderName !== "")
               GetFiles(state, dispatch, state.userId, state.folderName);
           }}
         >
           {state.dbfolderList !== undefined && state.dbfolderList !== null
             ? state.dbfolderList.map((obj, ind) => {
                 return obj.foldertype === "folder" ? (
                   <>
                     {" "}
                     <Option key={obj.id} value={obj.id}>
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
       <div className="uploadFileUppyBlock">
         <Dashboard
           uppy={uppy}
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