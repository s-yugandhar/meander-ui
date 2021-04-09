import React, { useContext } from "react";
import { Card, Button , message } from "antd";
import {
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlayCircleFilled,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { deleteFile_Folder } from "../API";
import {
  PAGE,
  FOLDER_CREATED,
  FILE_UPLOADED,
  FOLDER_NAME,
  FILE_LIST,
  FOLDER_LIST,
} from "../../reducer/types";
import {
  dbGetObjByPath,
  GetFolders,
  url,
  GetFiles,
  CreateNewFolder,
} from "../API/index";

import { Context } from "../../context";

import "../../assets/styles/videoCard.scss";
import mp3img from "../../assets/mp3img.png";

const VideoCard = (props) => {
  const { state, dispatch } = useContext(Context);
  const { Meta } = Card;
  function getMp4Url(props, type) {
    let base_url = "https://meander.ibee.ai/";
    let dash_base_url = "https://meander.ibee.ai/dash/";
    let hls_base_url = "https://meander.ibee.ai/hls/";
    let img1080 = "/thumbs/img1080/frame_0000.jpg";
    let img720 = "/thumbs/img720/frame_0000.jpg";
    let img480 = "/thumbs/img480/frame_0000.jpg";
    let img240 = "/thumbs/img240/frame_0000.jpg";
    let mp32 = "/audio2.mp3";
    let mp33 = "/audio3.mp3";
    let mp34 = "/audio4.mp3";

    let mp4 = {
      "1080p": "/mp41080k.mp4",
      "720p": "/mp4720k.mp4",
      "480p": "/mp4480k.mp4",
      "240p": "/mp4240k.mp4",
    };

    let bg_url = base_url + props.fileObject.itempath.split(".")[0] + img1080;
    let mp4_url =
      base_url + props.fileObject.itempath.split(".")[0] + mp4["1080p"];
    let dash_url =
      dash_base_url +
      props.fileObject.itempath.split(".")[0] +
      mp4["1080p"] +
      "/manifest.mpd";
    let hls_url =
      hls_base_url +
      props.fileObject.itempath.split(".")[0] +
      mp4["1080p"] +
      "/index.m3u8";
    let mp3url = base_url + props.fileObject.itempath.split(".")[0] + mp34;
    if (props.fileObject.itemtype.includes("audio")) return mp3url;
    if (type == "mp4") return mp4_url;
    if (type == "img") return bg_url;
    if (type == "dash") return dash_url;
    if (type == "hls") return hls_url;
  }

  const getPlayUrl = (state, dispatch, url, props) => {
    let obj = props.fileObject;
    let temppath = obj.itempath;
    let dbobj = state.videoList.find((ob) => ob.itempath === temppath);
    if (dbobj !== undefined) {
      return `${url}/${state.userId}/player/${dbobj.id}`;
    } else return null;
  };

  const onSideNavFolderClick = (folderName) => {
    dispatch({ type: PAGE, payload: { page: "my-videos" } });
    dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    GetFiles(state, dispatch, state.userId, folderName).then((res) => {
      console.log("My Videos Files in sidenav - ", res);
      dispatch({ type: FILE_LIST, payload: { fileList: res } });
    });
  };

  const showAllvideos = () => {
    GetFolders(state, dispatch, state.userId);
  };

  async function deleteFile(state, dispatch, id, file) {
    let flag = window.confirm("Do you really want to delete file ?");
    if (flag == false) return;
    if (!file.itempath.includes("temp.dod"))
      deleteFile_Folder(
        state,
        dispatch,
        id,
        file.itempath.split("/")[1] + "/" + file.itempath.split("/")[2],
        false
      ).then((res) => {
        state.folderName === ""
          ? showAllvideos()
          : onSideNavFolderClick(state.folderName);
      });
    else alert("this is not a file to delete");
  }

  const embedCodeFunc = (state, dispatch, obj) => {
    let temppath = obj.itempath;
    console.log(state.videoList);
    let dbobj = state.videoList.find((ob) => ob.itempath === temppath);
    if(dbobj === undefined)
      return null;
      let frame = `<iframe src='${url}/${state.userId}/player/${dbobj.id}' width='530'
    height='315' frameborder='0' allow=' autoplay; fullscreen; picture-in-picture'
    allowfullscreen title='${dbobj.title}'></iframe>`;
      return frame ;
  };


  const editVideoFunc = (state, dispatch, props, url , play) => {
   let playUrl = play ?  getPlayUrl(state,dispatch,url,props) : null;
   let embedUrl = embedCodeFunc(state,dispatch , props.fileObject);
   let userId = props.userId;
   let obj = props.fileObject;
    obj.playUrl = playUrl ;
    obj.embedCode =  embedUrl;
    dispatch({ type: PAGE, payload: { page: "edit-video" } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: null } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: obj } });
    //dbGetObjByPath(state , dispatch , "bucket-"obj.itempath , false );
  };


  const copyCode = (state,dipatch,url,props) => {
    let code =  getPlayUrl(state,dispatch,url,props);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      message.success(`Code Copied is: ${code}`);
    } else {
      alert(`Sorry your browser does not support, please copy here: ${code}`);
    }
  };


  const copyEmbedCode = (state,dipatch,obj) => {
    let code =  embedCodeFunc(state,dispatch,obj);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      message.success(`Code Copied is: ${code}`);
    } else {
      alert(`Sorry your browser does not support, please copy here: ${code}`);
    }
  };

  
  return (
    <Card
      bordered={true}
      hoverable={true}
      title={
        <>
          {props.videoTitle}
          <h6>
            {new Date(props.fileObject.name.split(".")[0] * 1).toLocaleString()}
          </h6>
        </>
      }
      headStyle={{ height: "25%" }}
      bodyStyle={{ height: "55%" }}
      actions={[
        <DeleteOutlined
          key="delete"
          title={"click to delete object"}
          onClick={(e) =>
            deleteFile(state, dispatch, props.userId, props.fileObject)
          }
        />,
        <EditOutlined
          key="edit"
          title={"Click to edit metadata"}
          onClick={(e) =>
            editVideoFunc(state, dispatch, props, url , false)
          }
        />,
        <SwapOutlined key="embed" title={"copy embed code"} onClick={(e)=>  copyEmbedCode(state,dispatch,props.fileObject)} />,
        <LinkOutlined key="link" title={"Copy link to video"} onClick={(e) => copyCode(state,dispatch,url,props)} />,

      ]}
      className="cardVideo"
    >
      <div className="videoCardBlock">
        {/*<div className="videoDuration">10:00</div>
        //style={{ backgroundImage: `url( ${getMp4Url(props,`img`)}) repeat 0 0`  }}
        href={getPlayUrl(state, dispatch, url, props)}
        */}
        <div className="videoBlock">        
          <Button
            className="playBtn"
            type="button"
            onClick={(e)=> editVideoFunc(state, dispatch, props, url , true)}
          >
            <PlayCircleFilled width={40} height={40} />
          </Button>

          <VideoCameraOutlined className="videoIconLoading" />
          {/* <FileTextOutlined className="videoIconLoading" /> */}
          <img
            alt="Thumbnail"
            src={
              props.fileObject.itemtype.includes("audio")
                ? mp3img
                : getMp4Url(props, "img")
            }
          />

          {/*  <video
              id = {props.fileObject.itempath}
              src={getMp4Url(props,"mp4")}
              controls
              className="videoInfoImageBlock"
            ></video>*/}
        </div>
        {/*<div className="videoCardInfoBlock" style={{  }}>ss
          <div className="videoTitle">{ props.videoTitle}</div>
          <div className="publishedDate">{props.postedOn}</div>
        </div> */}
      </div>
    </Card>
  );
};

export default VideoCard;
