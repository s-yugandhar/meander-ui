import React, { useState, useEffect } from "react";

import { Layout, Row, Col, Divider } from "antd";

// Custom imports
import "./playVideo.scss";

const PlayVideo = () => {
  return (
    <div className="full-width play-video-page">
      <Row>
        <Col span={24}>
          <div className="video-player-block full-width">
            <div className="full-width">
              <h2 className="ant-text-gray">
                <strong>Title runs here like this</strong>
              </h2>
            </div>
            <div className="full-width video-player">
              <iframe
                src="https://meander.video/3d79252ccf874d4c88353ab1ea03f4f7/player/c1a6f70900f2496bb587a5303b8c7702"
                width="100%"
                height="400"
                frameborder="0"
                allow=" autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                title="YT2.mp4"
              ></iframe>
            </div>
            <div className="full-width video-plaery-content">
              <p>
                Video player content if any runs here like this like description{" "}
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
                veritatis voluptatum laborum minus distinctio, non quasi aperiam
                aliquid quas! Ipsa aliquam, cupiditate repellendus explicabo
                excepturi ad possimus veritatis modi? Sit.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlayVideo;
