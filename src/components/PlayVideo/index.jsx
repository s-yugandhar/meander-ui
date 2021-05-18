import React, { useState, useEffect, useContext } from "react";

import { Layout, Row, Col, Divider } from "antd";
import {Context} from '../../context';
// Custom imports
import "./playVideo.scss";
import Logo from "../../assets/images/Meander_Logo.svg";

const PlayVideo = (props) => {
  const {state,dispatch} = useContext(Context);

  return (
    <div className="full-width play-video-page">
      {/*<Row> <button type="button"   onClick={(e)=>{ dispatch({ type: 'PAGE', payload: { page: "videos" } });   }}>Close Player</button> </Row>*/}
      <Row>
        <Col span={24}>
          <div className="video-player-block full-width">
            <div className="full-width video-player">              
              <iframe
                src = { props.obj.playUrl+"?embed=true"}
                //src="https://meander.video/3d79252ccf874d4c88353ab1ea03f4f7/player/c1a6f70900f2496bb587a5303b8c7702"
                width="100%"
                height="400"
                frameborder="0"
                allow=" autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                title= {props.obj.title}
              ></iframe>
            </div>
            <div className="full-width video-plaery-content">
            <div className="full-width">
              <h2 className="ant-text-gray">
                  <strong> { props.obj.title } </strong>
              </h2><h5> { new Date(props.obj.updatetime === "-1" || props.obj.updatetime === -1?
              null : props.obj.updatetime).toLocaleString() }</h5>
            </div>
              <p>
                {props.obj.description}
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlayVideo;
