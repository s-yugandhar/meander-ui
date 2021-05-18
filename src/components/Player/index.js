import React, { useState, useEffect, useContext , useRef } from "react";

import { Layout, Row, Col, Divider, Input,Card } from "antd";
import {Context} from '../../context';
import 'video.js/dist/video-js.css';
import Logo from "../../assets/images/Meander_Logo.svg";
import videojs from 'video.js'; 
import axios from 'axios';
import {url , cdn_url } from "../API/index";


// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls, autoplay }) => {
  const options = {
    fill: true,
    fluid: true,
    preload: 'auto',
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },
    },
  };
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      ...options,
      controls,
      autoplay,
      sources: [src],
    });
    setPlayer(vjsPlayer);

    return () => {
      if (player !== null) {
        player.dispose();
      }
    };
  }, []);
  useEffect(() => {
    if (player !== null) {
      player.src({ src });
    }
  }, [src]);

  return videoRef;
};

export const VideoPlayer = ({ src, controls, autoplay }) => {
  const playerRef = usePlayer({ src, controls, autoplay });

  return (
    <div data-vjs-player>
      <video ref={playerRef} className="video-js" />
    </div>
  );
};

VideoPlayer.defaultProps = {
  controls: true,
  autoplay: true,
};

export const PlayerPage=()=>{
    const {state,dispatch} = useContext(Context);
    const [vlist,setVlist] = useState([]);
    const [aVideo,setAVideo] = useState(null);

    function getMp4Url(props, type) {
        let tempdoc = ["img720", "img480", "img240"];
        let ipath = props.fileObject.itempath;
        let tempcdn_url = cdn_url + ipath.split(".")[0];
        let dash_cdn = cdn_url+"dash/";
        let hls_cdn = cdn_url +"hls/";
        let img1080 = "/thumbs/img1080/frame_0000.jpg";
        let mp34 = "/audio4.mp3";
        let mp4 = {   "1080p": "/mp41080k.mp4",     "720p": "/mp4720k.mp4",
          "480p": "/mp4480k.mp4",    "240p": "/mp4240k.mp4",
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

      const buildLink=(ob)=>{

        let hls = getMp4Url({fileObject : ob },"hls");
            let mp4 = getMp4Url({fileObject : ob },"mp4");
            let dash = getMp4Url({fileObject : ob },"dash");
            ob.hls = hls;
            ob.dash =dash;
            ob.mp4 = mp4;
            setAVideo(hls);
      }
    
    return (       
        <Layout>
            <Row>
                <Col span={aVideo === null ? 0 : 18}>
                    <Card title={null}>
                        {aVideo !== null?
                        <VideoPlayer src={aVideo} controls={true}
                        autoplay={true}
                        ></VideoPlayer> : null }             
                    </Card>
                </Col>
                    {aVideo !== null  ? <Col span={ 6}>
                    { state.publicVideos !== undefined? 
                    state.publicVideos.map((ob)=>{
                        return ( 
                                   
                        <Card title={null} onClick={(e)=> buildLink(ob)}>
                                 {ob.title}     <h6>
                                {  new Date( ob.updatetime === "-1" || ob.updatetime === -1?
                                    null : ob.updatetime * 1  ).toLocaleString() }
                                </h6>
                            <img style={{ height:125,width:200}} src={getMp4Url({fileObject:ob},"img")} alt={ob.title}></img>
                        </Card>
                        )
                    }) : null } </Col> : state.publicVideos !== undefined? 
                        state.publicVideos.map((ob)=>{
                            return ( 
                                       
                            <Card title={null} onClick={(e)=> buildLink(ob)}>
                                     {ob.title}     <h6>
                                    {  new Date( ob.updatetime === "-1" || ob.updatetime === -1?
                                        null : ob.updatetime * 1  ).toLocaleString() }
                                    </h6>
                                <img style={{ height:125,width:200}} 
                                src={ob.thumbnail !== null && ob.thumbnail !== undefined ? 
                                    ob.thumbnail : getMp4Url({fileObject:ob},"img")} 
                                alt={ob.title}></img>
                            </Card>
                            )
                        }) : null }

            </Row>
        </Layout>
    )
}
