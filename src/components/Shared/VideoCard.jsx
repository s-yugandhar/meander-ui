import React from "react";
import { Card } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import { deleteFile_Folder } from "../API";

import "../../assets/styles/videoCard.scss";

const VideoCard = (props) => {
  let base_url = "https://meander.ibee.ai/bucket-" + props.userId + "/";
  let dash_base_url =
    "https://meander.ibee.ai/dash/bucket-" + props.userId + "/";
  let hls_base_url = "https://meander.ibee.ai/hls/bucket-" + props.userId + "/";
  let img1080 = "/thumbs/img1080/frame_0000.jpg";
  let img720 = "/thumbs/img720/frame_0000.jpg";
  let img480 = "/thumbs/img480/frame_0000.jpg";
  let img240 = "/thumbs/img240/frame_0000.jpg";

  let mp4 = {
    "1080p": "/mp41080k.mp4",
    "720p": "/mp4720k.mp4",
    "480p": "mp4480k.mp4",
    "240p": "/mp4240k.mp4",
  };

  let bg_url = base_url + props.fileObject._object_name.split(".")[0] + img240;
  let mp4_url =
    base_url + props.fileObject._object_name.split(".")[0] + mp4["1080p"];
  let dash_url =
    dash_base_url +
    props.fileObject._object_name.split(".")[0] +
    mp4["1080p"] +
    "/manifest.mpd";
  let hls_url =
    hls_base_url +
    props.fileObject._object_name.split(".")[0] +
    mp4["1080p"] +
    "/index.m3u8";

  async function deleteFile(id, file) {
    alert("Do you really want to delete file ?");
    if (!file._object_name.includes("temp.dod"))
      deleteFile_Folder(id, file._object_name, false);
    else alert("this is not a file to delete");
  }
  return (
    <Card
      bordered={true}
      hoverable
      actions={[
        <DeleteOutlined
          key="delete"
          onClick={(e) => deleteFile(props.userId, props.fileObject)}
        />,
        <EditOutlined key="edit" onClick={props.editClick} />,
        <LinkOutlined key="embed" onClick={props.embedClick} />,
      ]}
      className="cardVideo"
    >
      <div className="videoCardBlock">
        <div className="videoDuration">10:00</div>
        <div
          className="videoBlock"
          style={{ backgroundImage: bg_url ? "" : "url(" + bg_url + ")" }}
        >
          <button
            className="playBtn"
            type="button"
            onClick={props.playBtnClick}
          >
            <PlayCircleFilled width={40} height={40} />
          </button>
          {
            /*<img alt="example"  src={bg_url}         />*/
            <video
              src={mp4_url}
              autoPlay
              controls
              className="videoInfoImageBlock"
            ></video>
          }
        </div>
        <div className="videoCardInfoBlock">
          <div className="videoTitle">{props.videoTitle}</div>
          <div className="publishedDate">{props.postedOn}</div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
