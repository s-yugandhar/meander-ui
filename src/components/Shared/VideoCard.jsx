import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import { deleteFile_Folder} from '../API';

const VideoCard = (props) => {
  
  
  async function deleteFile(id , file){
    alert('Do you really want to delte folder and its content ?');
      if( !file._object_name.includes("temp.dod")   )
      deleteFile_Folder(id , file._object_name , false  );
      else 
      alert("this is not a folder to delete")
  }  
  return (
    <Card
      bordered={true}
      hoverable
      actions={[
        <DeleteOutlined key="delete"     onClick={(e)=>  deleteFile(props.userId, props.fileObject )}      />,
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
