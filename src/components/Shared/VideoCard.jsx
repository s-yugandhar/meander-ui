import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";

const VideoCard = (props) => {
  return (
    <Card
      bordered={true}
      hoverable
      actions={[
        <DeleteOutlined key="delete" />,
        <EditOutlined key="edit" />,
        <LinkOutlined key="embed" />,
      ]}
      className="cardVideo"
    >

      <div className="videoCardBlock">
        <div className="videoDuration">10:00</div>
        <div className="videoInfoImageBlock" style={{ backgroundImage: 'url("https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png")' }}>
          {/* <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          /> */}
        </div>
        <div className="videoCardInfoBlock">
          <div className="videoTitle">
            {props.videoTitle}
          </div>
          <div className="publishedDate">{props.postedOn}</div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
