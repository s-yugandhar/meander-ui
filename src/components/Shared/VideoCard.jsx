import React,{useContext} from "react";
import { Card , Button } from "antd";
import { SoundFilled,
  EditOutlined,  DeleteOutlined,  LinkOutlined,  PlayCircleFilled,} from "@ant-design/icons";
import { deleteFile_Folder } from "../API";
import {  PAGE,FOLDER_CREATED,  FILE_UPLOADED,  FOLDER_NAME ,FILE_LIST, FOLDER_LIST} from '../../reducer/types';
import { dbGetObjByPath ,GetFolders, url, GetFiles, CreateNewFolder } from '../API/index';

import { Context } from '../../context';

import "../../assets/styles/videoCard.scss";
import  mp3img from "../../assets/mp3img.png";

const VideoCard = (props) => {

  const {state,dispatch} = useContext(Context);
  const { Meta }= Card;
  function getMp4Url(props , type ){
  let base_url = "https://meander.ibee.ai/" ;
  let dash_base_url = "https://meander.ibee.ai/dash/";
  let hls_base_url = "https://meander.ibee.ai/hls/";
  let img1080 = "/thumbs/img1080/frame_0000.jpg";
  let img720 = "/thumbs/img720/frame_0000.jpg";
  let img480 = "/thumbs/img480/frame_0000.jpg";
  let img240 = "/thumbs/img240/frame_0000.jpg";
  let mp32 = "/audio2.mp3";
  let mp33 = "/audio3.mp3";
  let mp34 = "/audio4.mp3";

  let mp4 = {    "1080p": "/mp41080k.mp4",
    "720p": "/mp4720k.mp4",    "480p": "/mp4480k.mp4",
    "240p": "/mp4240k.mp4",  };

  let bg_url = base_url + props.fileObject.itempath.split(".")[0] + img1080;
  let mp4_url =    base_url + props.fileObject.itempath.split(".")[0] + mp4["1080p"];
  let dash_url =    dash_base_url +  props.fileObject.itempath.split(".")[0] +
    mp4["1080p"] +    "/manifest.mpd";
  let hls_url =    hls_base_url +  props.fileObject.itempath.split(".")[0] +
    mp4["1080p"] +    "/index.m3u8";
    let mp3url = base_url + props.fileObject.itempath.split(".")[0] + mp34;
    if( props.fileObject.itemtype.includes("audio"))
      return mp3url;
    if (type =="mp4") return mp4_url;
    if(type == "img") return bg_url;
    if(type == "dash") return dash_url;
    if(type == "hls")  return  hls_url;
  }

  const getPlayUrl=(state,dispatch,url,props )=>{
    let obj = props.fileObject;
    let temppath = obj.itempath;
    let dbobj = state.videoList.find((ob)=>ob.itempath === temppath );
    if( dbobj !== undefined){
    return `${url}/${state.userId}/player/${dbobj.id}`
    }
    else return null; 
}


  
  const onSideNavFolderClick = (folderName) => {
    dispatch({   type: PAGE,   payload: {    page: 'my-videos'    } });
    dispatch({type: FOLDER_NAME, payload: { folderName: folderName }});
    GetFiles(state,dispatch ,state.userId, folderName).then(res => {
      console.log('My Videos Files in sidenav - ', res);
       dispatch({ type: FILE_LIST,payload: {   fileList: res   }});
  });  }

  const showAllvideos = () => {
    GetFolders(state, dispatch , state.userId);
  }
  
  async function deleteFile(state,dispatch,id, file) {
    let flag = window.confirm("Do you really want to delete file ?");
    if (flag == false) return;
    if (!file.itempath.includes("temp.dod"))
      deleteFile_Folder(state,dispatch, id, file.itempath.split("/")[1]+"/"+file.itempath.split("/")[2], false).
      then((res)=>{ state.folderName === "" ? showAllvideos() : onSideNavFolderClick(state.folderName) ;});
    else alert("this is not a file to delete");
  }

  const editVideoFunc = (state,dispatch,userId , obj) => {
    dispatch({ type: PAGE,payload:{page:'edit-video'} });
    dispatch({ type: "EDIT_VIDEO",payload:{ editVideo: null } });
    dispatch({ type: "EDIT_VIDEO",payload:{ editVideo: obj } });
    //dbGetObjByPath(state , dispatch , "bucket-"obj.itempath , false );
   };
  
  return (
    <Card
      bordered={true}
      hoverable={true}
      title={props.videoTitle}
      headStyle = {{height : "10%"  }}
      bodyStyle={{ height : "70%"  }}
      actions={ [
         <DeleteOutlined     key="delete"
          onClick={(e) => deleteFile(state,dispatch,props.userId, props.fileObject)}
      />,
        <EditOutlined key="edit" onClick={(e) => editVideoFunc(state,dispatch,props.userId, props.fileObject)} />
      ,<LinkOutlined key="embed" onClick={props.embedClick} />  ]
      }
      className="cardVideo"
    >
      <div className="videoCardBlock"  >
        {/*<div className="videoDuration">10:00</div>
        //style={{ backgroundImage: `url( ${getMp4Url(props,`img`)}) repeat 0 0`  }} 
        */}
        <div  className="videoBlock">  
             <Button
            className="playBtn"
            type="button"
            htmlType="a"
            href = {getPlayUrl(state,dispatch,url,props)}
            target="_blank"
            //onClick={props.playBtnClick}
          >
            <PlayCircleFilled width={40} height={40} />
          </Button>
          
          <img alt="Thumbnail"  src={ props.fileObject.itemtype.includes("audio") ? mp3img: getMp4Url(props,"img")}   
                  style={{ width:"100%",height:"inherit" }}  />
           
           {  /*  <video
              id = {props.fileObject.itempath}
              src={getMp4Url(props,"mp4")}
              controls
              className="videoInfoImageBlock"
            ></video>*/
          }
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
