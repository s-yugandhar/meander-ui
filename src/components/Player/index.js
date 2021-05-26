import React, { useState, useEffect, useContext , useRef } from "react";
import { Layout, Row, Col, Divider, Input,Card , Typography } from "antd";
import { EyeOutlined , LikeOutlined , DislikeOutlined } from "@ant-design/icons";
import {Context} from '../../context';
import 'video.js/dist/video-js.css';
import Logo from "../../assets/images/Meander_Logo.svg";
import videojs from 'video.js'; 
import "../../assets/styles/videoCard.scss";
import videoJsContribQualityLevels from 'videojs-contrib-quality-levels';
import videojsHlsQualitySelector from 'videojs-hls-quality-selector';
import axios from 'axios';
import {url , cdn_url, getPublicItems, getServedLinks } from "../API/index";
import ImageLoad from '../Shared/ImageLoader';
import logo from "../../assets/images/meander-1920x1080.png"

videojs.registerPlugin('qualityLevel', videoJsContribQualityLevels)
videojs.registerPlugin('hlsQualitySelector', videojsHlsQualitySelector)

// eslint-disable-next-line import/prefer-default-export
const usePlayer = ({ src, controls, autoplay }) => {
  const options = {
    fill: true,
    fluid: false,
    preload: 'auto',
    responsive:true,
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },},
      plugins:{
      qualityLevel: {}, hlsQualitySelector: { displayCurrentQuality: true },}
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
    <div data-vjs-player style={{width:'70vh*(4/3)',height:'70vh !important',}}>
      <video ref={playerRef} className="video-js" style={{height:'70vh',width:'70vh*(4/3)'}} />
    </div>
  );
};

VideoPlayer.defaultProps = {
  controls: true,
  autoplay: true,
};

export const PlayerPage=()=>{
    const {state,dispatch} = useContext(Context);
    const [flag,setFlag] = useState(false);
    const [aVideo,setAVideo] = useState(null);
    const [links,setLinks]=useState(null);
    const [object,setObject] = useState(null);
    const { Paragraph, Text } = Typography;


    const buildImage= (play,ob)=>{
      setLinks(null);
        getServedLinks(state,dispatch,ob.id,false)
      .then(res => {  setLinks(res); }).catch(err=> {});
    }
    
    function getMp4Url(props, type) {  
      if (type === "mp3" && props.fileObject.itemtype.includes("audio"))
        return links['mp3_url'];
      if (type === "mp4") return links['mp4_url'];
      if (type === "img") return links['img_url'];
      if (type === "dash") return links['dash_url'];
      if (type === "hls") return links['hls_url'];
    }
      const buildLink=(ob)=>{
        console.log(links , aVideo , "pre build");
        getServedLinks(state,dispatch,ob.id,true).then(res=>
         { setLinks(res);
            setAVideo(res.hls_url);
            setObject(res.obj);
         }).catch(err => 
          { setAVideo(null) ; console.log(err)}
        );
        console.log(links , aVideo , "post build");
        if(links === null || links === undefined)
          return null;
      }

      useEffect(()=>{
        if( flag ){   let arr = [];
        state.publicVideos.map((ob) => {
          getServedLinks(state,dispatch,ob.id,false).then(res=>
                {setLinks(res);
                  ob.img_url = res.img_url;
                  arr.push(ob)} ).catch(err=>{     });
        });
        dispatch({ type:"PUBLIC_VIDEOS",payload:{ publicVideos : arr  }});
        setFlag(false);
      }
      },[flag])

      useEffect(()=>{
          getPublicItems(state,dispatch,"m").then((res)=>{
                setFlag(true);
          }).catch(err=>{ setFlag(false) });
      },[])
    
    return (       
        <Layout>
            <Row>
                <Col span={aVideo === null ? 0 : 18}>
                    <Card title={null} >
                        {aVideo !== null?
                        <>
                        <VideoPlayer src={aVideo} controls={true}
                        autoplay={true} 
                        ></VideoPlayer>
                        {object !== null && object !== undefined?
                       <>
                       <br/>
                       <Row>
                         <Col span={12}>
                         <h2>{object.title}</h2>
                         </Col> 
                         <Col span={6}></Col>
                         <Col span={6}><h3>{object.hits}&nbsp; <EyeOutlined/> &nbsp;&nbsp;
                       {object.dislikes } &nbsp;<DislikeOutlined/> &nbsp;&nbsp;
                       {object.likes } &nbsp;<LikeOutlined/> &nbsp;&nbsp;</h3></Col> </Row>
                    <h4> {  new Date( object.updatetime === "-1" || object.updatetime === -1?
                       null : object.updatetime * 1  ).toDateString() }<br/>
                    </h4>
                       <p>{object.description}</p></>                      
                      :null}                       
                         </>: null }             
                    </Card>
                </Col >
                    {aVideo !== null  ? <Col span={ 6} 
                    style={{height:"250px"}}>
                    { state.publicVideos !== undefined? 
                    state.publicVideos.map((ob)=>{
                        return (                                    
                        <Card title={null} onClick={(e)=> buildLink(ob)}
                        bordered={true}
                         actions={null} bodyStyle={{height:'200px', paddingTop:"0px",paddingBottom:"0px"}}>
                           <strong>{ob.title}</strong> <br/>
                            <img  src={ "img_url" in ob ? ob.img_url : logo } 
                              alt={ob.title + " " +ob.description} style={{width:'180px',height:'120px'}}/>
                             
                                 <br/>    <h5>
                                {  new Date( ob.updatetime === "-1" || ob.updatetime === -1?
                                    null : ob.updatetime * 1  ).toDateString() }<br/>
                                 &nbsp;&nbsp;{ob.hits}&nbsp; <EyeOutlined/> &nbsp;
                                  {ob.dislikes } &nbsp;<DislikeOutlined/> &nbsp;
                                  {ob.likes } &nbsp;<LikeOutlined/></h5>
                                  
                        </Card>
                        )
                    }) : null } </Col> : state.publicVideos !== undefined? 
                        state.publicVideos.map((ob)=>{
                            return (   <Card title={null} onClick={(e)=> buildLink(ob)}
                            bordered={true}
                             actions={null} bodyStyle={{height:'200px', paddingTop:"0px",paddingBottom:"0px"}}>
                               <strong>{ob.title }</strong> <br/>
                                <img  src={ "img_url" in ob ? ob.img_url : logo } 
                                  alt={ob.title + " " +ob.description} style={{width:'180px',height:'120px'}}/>
                                 
                                     <br/>    <h5>
                                    {  new Date( ob.updatetime === "-1" || ob.updatetime === -1?
                                        null : ob.updatetime * 1  ).toDateString() }<br/>
                                     &nbsp;&nbsp;{ob.hits}&nbsp; <EyeOutlined/> &nbsp;
                                      {ob.dislikes } &nbsp;<DislikeOutlined/> &nbsp;
                                      {ob.likes } &nbsp;<LikeOutlined/> </h5>
                                      
                            </Card>       )
                        }) : null }
            </Row>
        </Layout>
    )
}
