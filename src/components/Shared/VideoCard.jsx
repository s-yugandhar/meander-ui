import React, { useContext, useState ,lazy ,Suspense} from "react";
import { Menu, Card, Button, message,Row,Col ,Dropdown, Modal,Tooltip,Image, Popover } from "antd";
import {
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  EllipsisOutlined
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
  url,cdn_url,
  GetFiles,
  CreateNewFolder,
} from "../API/index";
import { Context } from "../../context";
import "../../assets/styles/videoCard.scss";
import mp3img from "../../assets/mp3img.png";
import logo from "../../assets/images/meander-1920x1080.png"
import { icons } from "antd/lib/image/PreviewGroup";

const VideoCard = (props) => {
  const { state, dispatch } = useContext(Context);
  const { Meta } = Card;
  const [visible, setVisible] = useState(false);
  const [codesModal,setCodesModal] = useState(false);
  const [code , setCode] = useState("<---- Click on any button to copy the code");

  function getMp4Url(props, type) {
    let tempdoc = ["img720", "img480", "img240"];
    let ipath = props.fileObject.itempath;
    let tempcdn_url = cdn_url + ipath.split(".")[0];
    let dash_cdn = cdn_url+"dash/";
    let hls_cdn = cdn_url +"hls/";
    let img1080 = "/thumbs/img1080/frame_0000.jpg";
    let mp34 = "/audio4.mp3";
    let mp4 = {
      "1080p": "/mp41080k.mp4",
      "720p": "/mp4720k.mp4",
      "480p": "/mp4480k.mp4",
      "240p": "/mp4240k.mp4",
    };
    let dash_url =      dash_cdn + ipath.split(".")[0] +
      "/mp4,108,72,48,24,0k.mp4/urlset/manifest.mpd";
    let hls_url =   hls_cdn +   ipath.split(".")[0] +
      "/mp4,108,72,48,24,0k.mp4/urlset/master.m3u8";
    let mp4_url = tempcdn_url + mp4["1080p"];
    let mp3_url = tempcdn_url + "/audio4.mp3";
    let img_url = tempcdn_url + img1080;
    if (type == "mp3" && props.fileObject.itemtype.includes("audio"))
      return mp3_url;
    if (type == "mp4") return mp4_url;
    if (type == "img") return img_url;
    if (type == "dash") return dash_url;
    if (type == "hls") return hls_url;
  }

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

  const getPlayUrl = (state, dispatch, url, props) => {
    let obj = props.fileObject;
    let temppath = obj.itempath;
    let dbobj = state.videoList.find((ob) => ob.itempath === temppath);
    if (dbobj !== undefined) {
      return `${url}/watch/${state.userId}/${dbobj.id}`;
    } else return null;
  };

  const embedCodeFunc = (state, dispatch, obj) => {
    let temppath = obj.itempath;
    console.log(state.videoList);
    let dbobj = state.videoList.find((ob) => ob.itempath === temppath);
    if (dbobj === undefined) return null;
    let frame = `<iframe src='${url}/watch/${state.userId}/${dbobj.id}?embed=true' width='530'
    height='315' frameborder='0' allow=' autoplay; fullscreen; picture-in-picture'
    allowfullscreen title='${dbobj.title}'></iframe>`;
    return frame;
  };

  const editVideoFunc = (state, dispatch, props, url, play) => {
    let playUrl = play ? getPlayUrl(state, dispatch, url, props) : null;
    let embedUrl = embedCodeFunc(state, dispatch, props.fileObject);
    let userId = props.userId;
    let obj = props.fileObject;
    obj.playUrl = playUrl;
    obj.embedCode = embedUrl;
    dispatch({ type: PAGE, payload: { page: "edit-video" } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: null } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: obj } });
    //dbGetObjByPath(state, dispatch, obj.itempath, false);
  };

  const copyCode = (state, dipatch, url, props) => {
    let code = getPlayUrl(state, dispatch, url, props);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      message.success(`Code Copied `);
    } else {
      alert(`Sorry your browser does not support, please copy here: ${code}`);
    }
  };
  
  const handleMenuClick = (e) => {
    let code = null;
    if (e.key === "iframe")
      code = embedCodeFunc(state, dispatch, props.fileObject);
    if (e.key === "mp3") code = getMp4Url(props, "mp3");
    if (e.key === "hls") code = getMp4Url(props, "hls");
    if (e.key === "dash") code = getMp4Url(props, "dash");
    if (e.key === "mp4") code = getMp4Url(props, "mp4");
    if (e.key === "embed") {
      code = getPlayUrl(state, dispatch, url, props);
      code = code + "?embed=true";
    }
    if (e.key === "play" || e.key === "playnotinmenu") 
      code = getPlayUrl(state, dispatch, url, props);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      message.success(`Code Copied `);
    } else {
      alert(`Sorry your browser does not support, please copy here: ${code}`);
    }
    setCode(code);
    setVisible(false);
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const menuvideo = (
    <Menu onClick={handleMenuClick} key="dbahdlca" title="Click below names to copy code">
      <Menu.Item key="play"> Play</Menu.Item>
      <Menu.Item key="embed">Embed</Menu.Item>
      <Menu.Item key="iframe">Iframe</Menu.Item>
      <Menu.Item key="mp4"> Mp4</Menu.Item>
      <Menu.Item key="dash">Android</Menu.Item>
      <Menu.Item key="hls"> Ios</Menu.Item>{" "}
    </Menu>
  );
  const menuaudio = (
    <Menu onClick={handleMenuClick} key="sbdsldl" title="Click below names to copy code">
      <Menu.Item key="play"> Play</Menu.Item>
      <Menu.Item key="embed">Embed</Menu.Item>
      <Menu.Item key="iframe">Iframe</Menu.Item>
      <Menu.Item key="mp3">Mp3</Menu.Item>{" "}
    </Menu>
  );

  
  return (
    <Card
      bordered={true}
      hoverable={true}
      title={
        <>
          {props.videoTitle}
          <h6>
            {  new Date( props.fileObject.updatetime === "-1" || props.fileObject.updatetime === -1?
              null : props.fileObject.updatetime * 1  ).toLocaleString() }
          </h6>
        </>
      }
      headStyle={{ height: "25%" }}
      bodyStyle={{ height: "55%" }}
      actions={[
        state.userObj !== undefined && state.userObj !== null && 
        state.userObj.roles !== "user" &&   state.userObj.roles !== "viewer"
          ?  <Tooltip title="Click to delete video">
          <DeleteOutlined
            key="delete"
            title={"click to delete object"}
            onClick={(e) =>
              deleteFile(state, dispatch, props.userId, props.fileObject)
            }
          />
        </Tooltip> : null,
         state.userObj !== undefined &&
         state.userObj !== null && state.userObj.roles !== "viewer"
          ?<Tooltip title="Click to edit Metadata">
          <EditOutlined
            key="edit"
            onClick={(e) => editVideoFunc(state, dispatch, props, url, false)}
          />
        </Tooltip> : null,
        state.userObj !== undefined &&
        state.userObj !== null && state.userObj.roles !== "viewer"
         ?<Tooltip title="copy player link">
         <LinkOutlined
           key="playnotinmenu"
           onClick={(e) => handleMenuClick(e)}
         />
       </Tooltip> : null,
        <Popover  content={props.fileObject.itemtype.includes("audio") ? null : null
           }
        title={null}>
          <Button
            htmlType="a"
            key="link"
            onClick={(e) => {setCodesModal(true)}}
            aria-hidden={true}
            style={{ borderColor: "white", padding: 0 }}  >
              <Tooltip title="Copy links to video">
              <EllipsisOutlined style={{ fontSize: "24px" }} /></Tooltip>
          </Button>
          </Popover>
        ,
      ]}
      className="cardVideo"
    >
      <div className="videoCardBlock" id={props.fileObject.id}>
        {/*<div className="videoDuration">10:00</div>
        //style={{ backgroundImage: `url( ${getMp4Url(props,`img`)}) repeat 0 0`  }}
        href={getPlayUrl(state, dispatch, url, props)}
        */}
        <div className="videoBlock">
          
          {/*<VideoCameraOutlined className="videoIconLoading" />*/}
          { document.getElementById(props.fileObject.id)  ?
          <img alt="Thumbnail" 
           src={   
            props.fileObject.itemtype.includes("audio")
            ? mp3img  : getMp4Url(props, "img")
           }
             /> : <img src={logo} alt=""/>}
          <Button
            className="playBtn"
            type="button"
            onClick={(e) => editVideoFunc(state, dispatch, props, url, true)}
          >
            <PlayCircleOutlined  />
          </Button>
        </div>
        {/*<div className="videoCardInfoBlock" style={{  }}>ss
          <div className="videoTitle">{ props.videoTitle}</div>
          <div className="publishedDate">{props.postedOn}</div>
        </div> */}
      </div>
      <Modal title={null}  visible={ codesModal  }  centered={true}
          onCancel={()=> {setCode("<---- Click on any button to copy the code");
          setCodesModal(false);}} closable={true} footer={null}  
          >
            <Row >
              <Col span={6}>
            {props.fileObject.itemtype.includes("audio") ? menuaudio : menuvideo}
              </Col>
              <Col span={2}></Col>
              <Col span={12}>
                {code}
              </Col>
            </Row>
          
          </Modal>
    </Card>
  );
};

export default VideoCard;
