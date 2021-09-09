import React, { useContext, useState, lazy, Suspense, useEffect } from "react";
import { Menu, Card, Button, message, Row, Col, Dropdown, Modal, Tooltip, Image, Popover, Badge, Typography } from "antd";
import {
  SwapOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileTextOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  ArrowDownOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import { deleteFile_Folder } from "../API";
import ImageLoad from "../Shared/ImageLoader";
import { PAGE, FOLDER_CREATED, FILE_UPLOADED, FOLDER_NAME, FILE_LIST, FOLDER_LIST } from "../../reducer/types";
import { dbGetObjByPath, url, cdn_url, GetFiles, CreateNewFolder, getServedLinks } from "../API/index";
import { Context } from "../../context";
import "../../assets/styles/videoCard.scss";
import mp3img from "../../assets/mp3img.png";
import logo from "../../assets/images/meander-1920x1080.png";
import { icons } from "antd/lib/image/PreviewGroup";
import UppyUpload from "../UppyUpload/index.jsx";

const ChannelCard = (props) => {
  const { state, dispatch } = useContext(Context);
  const { Meta } = Card;
  const [visible, setVisible] = useState(false);
  const [codesModal, setCodesModal] = useState(false);
  const [code, setCode] = useState("<---- Click on any button to copy the code");
  const [links, setLinks] = useState(null);

  const { Text } = Typography;

  const callServedLinks = (play) => {
    setLinks(null);
    if (links === null || play === true) {
      getServedLinks(state, dispatch, props.folderObj.id, play)
        .then((res) => {
          setLinks(res);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    //callServedLinks(false);
  }, []);

  function getMp4Url(props, type) {
    if (type === "mp3" && props.folderObj.itemtype.includes("audio")) return links["mp3_url"];
    if (type === "mp4") return links["mp4_url"];
    if (type === "img") return links["img_url"];
    if (type === "dash") return links["dash_url"];
    if (type === "hls") return links["hls_url"];
  }

  const onSideNavFolderClick = (folderName) => {
    dispatch({ type: PAGE, payload: { page: "videos" } });
    //dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    GetFiles(state, dispatch, state.userId, folderName).then((res) => {
      console.log("My Videos Files in sidenav - ", res);
      dispatch({ type: FILE_LIST, payload: { fileList: res } });
    });
  };

  async function deleteFile(state, dispatch, id, file) {
    let flag = window.confirm("Do you really want to delete file ?");
    if (flag === false) return;
    if (!file.itempath.includes("temp.dod"))
      deleteFile_Folder(state, dispatch, id, file.itempath.split("/")[1] + "/" + file.itempath.split("/")[2], false).then((res) => {
        console.log(res);
      });
    else alert("this is not a file to delete");
  }

  const getPlayUrl = (state, dispatch, url, props) => {
    let obj = props.folderObj;
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
    let embedUrl = embedCodeFunc(state, dispatch, props.folderObj);
    let userId = props.userId;
    let obj = props.folderObj;
    obj.playUrl = playUrl;
    obj.embedCode = embedUrl;
    dispatch({ type: PAGE, payload: { page: "edit-video" } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: null } });
    dispatch({ type: "EDIT_VIDEO", payload: { editVideo: obj } });
    //dbGetObjByPath(state, dispatch, obj.itempath, false);
  };

  const handleMenuClick = (e) => {
    console.log(e);
    let code = null;
    if (e.key === "iframe") code = embedCodeFunc(state, dispatch, props.folderObj);
    if (e.key === "mp3") code = getMp4Url(props, "mp3");
    if (e.key === "hls") code = getMp4Url(props, "hls");
    if (e.key === "dash") code = getMp4Url(props, "dash");
    if (e.key === "mp4") code = getMp4Url(props, "mp4");
    if (e.key === "embed") {
      code = getPlayUrl(state, dispatch, url, props);
      code = code + "?embed=true";
    }
    if (e.key === "play" || e.key === "playnotinmenu") code = getPlayUrl(state, dispatch, url, props);
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
    <Menu onClick={handleMenuClick} key="dbahdlca" title="Click below names to copy code" className="copyCodeButtonsList">
      <Menu.Item key="play"> Play</Menu.Item>
      <Menu.Item key="embed">Embed</Menu.Item>
      <Menu.Item key="iframe">Iframe</Menu.Item>
      {links && "mp4_url" in links ? (
        <>
          <Menu.Item key="mp4"> Mp4</Menu.Item>
          <Menu.Item key="dash">Android</Menu.Item>
          <Menu.Item key="hls"> Ios</Menu.Item>{" "}
        </>
      ) : null}
    </Menu>
  );
  const menuaudio = (
    <Menu onClick={handleMenuClick} key="sbdsldl" title="Click below names to copy code" className="copyCodeButtonsList">
      <Menu.Item key="play"> Play</Menu.Item>
      <Menu.Item key="embed">Embed</Menu.Item>
      <Menu.Item key="iframe">Iframe</Menu.Item>
      {links ? (
        <>
          {" "}
          <Menu.Item key="mp3">Mp3</Menu.Item>{" "}
        </>
      ) : null}
    </Menu>
  );

  const actionssuccess = [
    props.folderObj.userRole !== "viewer" && props.folderObj.userRole !== "user" ? (
      <Tooltip title="Click to delete video">
        <DeleteOutlined key="delete" title={"click to delete object"} onClick={(e) => {;}} />
      </Tooltip>
    ) : null,
    props.folderObj.userRole !== "viewer" ? (
      <Tooltip title="Click to edit Metadata">
        <EditOutlined key="edit" onClick={(e) => { ;}} />
      </Tooltip>
    ) : null,
    <Tooltip title="copy player link">
      <LinkOutlined key="playnotinmenu" onClick={(e) => handleMenuClick({ key: "playnotinmenu" })} />
    </Tooltip>,
    <Popover content={props.folderObj.itemtype.includes("audio") ? null : null} title={null}>
      <Button
        htmlType="a"
        key="link"
        onClick={(e) => {
          callServedLinks(true);
          setCodesModal(true);
        }}
        aria-hidden={true}
        style={{ borderColor: "white", padding: 0 }}>
        <Tooltip title="Copy links to video">
          <EllipsisOutlined style={{ fontSize: "24px" }} />
        </Tooltip>
      </Button>
    </Popover>,
  ];

  const triggerUppyUpload = (state, dispatch, id) => {};

  const actionPending = [<CloudUploadOutlined key="upload" title={"Continue Uploading this file from file system"} onClick={(e) => setCodesModal(true)} />];

  return (
    <Card
      bordered={true}
      hoverable={true}
      title=""
      /* extra={
        <>
          <Popover
            content={
              <>
                <Badge
                  count={props.folderObj.dislikes}
                  title="dislikes"
                  showZero
                  style={{ backgroundColor: "red" }}
                  overflowCount={999999999}
                ></Badge>
                <Badge
                  count={props.folderObj.likes}
                  title="likes"
                  overflowCount={999999999}
                  showZero
                  style={{ backgroundColor: "yellowgreen" }}
                ></Badge>
                <Badge
                  count={props.folderObj.hits}
                  title="views"
                  overflowCount={999999999}
                  showZero
                  style={{ backgroundColor: "green" }}
                ></Badge>
              </>
            }
          >
            ...
          </Popover>
        </>
      }
      headStyle={{ height: "25%" }}
      bodyStyle={{ height: "55%" }} */
      actions={ actionssuccess }
      className="cardVideo full-width">
      <div className="videoCardBlock full-width" id={props.folderObject.id}>
        {/*<div className="videoDuration">10:00</div>
        //style={{ backgroundImage: `url( ${getMp4Url(props,`img`)}) repeat 0 0`  }}
        href={getPlayUrl(state, dispatch, url, props)}
        */}
        <div className="videoBlock full-width">
          {/*<VideoCameraOutlined className="videoIconLoading" />*/}
          {
            <ImageLoad
              id={props.folderObj.id}
              src={props.folderObj.thumbnail === null ? null : props.folderObj.thumbnail}
              placeholder={logo}
              alt={props.folderObj.foldername + " " + props.folderObj.cleanname}
            />
          }
          <Button className="playBtn" type="button" onClick={(e) => {;}}>
            <PlayCircleOutlined />
          </Button>
        </div>
        <div className="video-content full-width">
          <Text ellipsis={true} className="video-title full-width" title={props.folderName}>
            {props.folderName}
          </Text>
          <Text className="video-date full-width">
            {new Date(true || props.folderObj.updatetime === "-1" || props.folderObj.updatetime === -1 ? null : props.folderObj.updatetime * 1).toLocaleString()}
          </Text>
        </div>
        {/*<div className="videoCardInfoBlock" style={{  }}>ss
          <div className="videoTitle">{ props.videoTitle}</div>
          <div className="publishedDate">{props.postedOn}</div>
        </div> */}
      </div>
      <Modal
        title={null}
        visible={codesModal}
        centered={true}
        onCancel={() => {
          setCode("<---- Click on any button to copy the code");
          setCodesModal(false);
        }}
        closable={true}
        footer={null}>
        (
          <>
            {" "}
            <Row>
              <Col
                span={24}
                style={{
                  color: "#888",
                  fontStyle: "italic",
                  fontSize: "13px",
                  paddingBottom: "12px",
                  textAlign: "left",
                  paddingLeft: "30px",
                }}>
                {" "}
                <ArrowDownOutlined width={"8px"} height={"8px"} color={"#ccc"} /> Click on any button to copy the code
              </Col>
              <Col span={6}>{ null}</Col>
              <Col span={1}></Col>
              <Col
                span={15}
                style={{
                  wordBreak: "break-all",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  border: "2px dashed #e0e0e0",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "3px",
                  padding: "20px",
                  color: "#666",
                }}>
                {code}
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default ChannelCard;
