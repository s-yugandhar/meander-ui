import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";

const VideoCard = (props) => {
  return (
    <Card
      bordered={true}
      hoverable
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
      actions={[
        <DeleteOutlined key="delete" />,
        <EditOutlined key="edit" />,
        <LinkOutlined key="embed" />,
      ]}
    >
      <div className="videoDuration">10:00</div>
      <div className="videoInfoBlock">
        <div className="videoTitle">
          Video title runs here like this and if extend looks like this
        </div>
        <div className="publishedDate">12th Jan, 2021</div>
      </div>
    </Card>
  );
};

export default VideoCard;
