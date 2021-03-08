import React from 'react';
import { Button, Tooltip } from 'antd';

import {
   CloudUploadOutlined
} from "@ant-design/icons";


const UploadVideoFloatingBtn = (props) => {
   return (
      <Tooltip placement="left" title="Upload New Video">
         <Button
            type="button"
            onClick={props.onClick}
            className="floating-btn add-new-video-btn"
         >
            <CloudUploadOutlined key="add-video" />
         </Button>
      </Tooltip>
   )
}


export default UploadVideoFloatingBtn;