import React, { useContext,useState, useEffect ,useRef } from 'react';
import {  Button, Select, Row , Col , Card, Checkbox } from "antd";
import { Context } from "../../context";
import { dbAddObj,  dbGetObjByPath,  deleteAfterUpload,
  GetFiles,  GetUserdetails,  url,  getPublicItems,} from "../API";
import RecordRTC,{CanvasRecorder ,  MediaStreamRecorder ,
 invokeSaveAsDialog , getSeekableBlob  } from 'recordrtc';
 import UppyUpload from '../UppyUpload';
 import localForage from "localforage";
import {fabric} from 'fabric';



var meanderStore = localForage.createInstance({ driver : localForage.INDEXEDDB, 
name        : 'myApp',version     : 1.0,storeName   : 'MeanderMediaStore', 
description : 'Store to save video,audio,screen locally before uploading'});

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

function _getArrayBufferToBlob(buffer, type) {
  return new Blob([buffer], {type: type});
}

function _getBlobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      resolve(reader.result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}


const isClient = typeof window === 'object';
const on = (obj: any, ...args: any[]) => obj.addEventListener(...args);
const off = (obj: any, ...args: any[])  => obj.removeEventListener(...args);
const noop = () => {};

const useMediaDevices = () => {
  const [state, setState] = useState([]);

  useEffect(() => {
    const onChange = () => {
      navigator.mediaDevices.enumerateDevices()
        .then((devices) => {//console.log(devices);
             setState(devices);  }).catch(noop);
    };

    on(navigator.mediaDevices, 'devicechange', onChange);
    onChange();

    return () => { off(navigator.mediaDevices, 'devicechange', onChange);  };
  }, []);
  return state;
};

var recorder = null;
var vidStream = null;
var audStream = null;
var scrStream = null;

async function getStreams( config ){
  const video  = document.getElementById('c');
  video.muted = true;    video.volume = 0;
  var audopt =  { type: 'audio', mimeType : 'audio/mp3',  numberOfAudioChannels: isEdge ? 1 : 2,
    checkForInactiveTracks: true,    bufferSize: 16384  };
  if(isSafari) { audopt.sampleRate = 44100; audopt.bufferSize = 4096;  audopt.numberOfAudioChannels = 2;  }
 vidStream = config.video ? await navigator.mediaDevices.getUserMedia(
  { video: {    width: { min: 480, ideal: 1280, max: 1920 }, height: { min: 360, ideal: 720, max: 1080 } }  }) : null;

 audStream = config.audio ? await navigator.mediaDevices.getUserMedia({ audio : config.audio}) : null;
 scrStream = config.screen ? navigator.mediaDevices.getDisplayMedia ? await navigator.mediaDevices.getDisplayMedia({video : true})
            :  await   navigator.getDisplayMedia({video : true}) : null ;
/*let streams=[];
if(config.screen === true && scrStream){ streams.push(scrStream)} ;
if(config.video === true && vidStream){ streams.push(vidStream)} ;
if(config.audio === true && audStream){ streams.push(audStream)};*/
let streams = null;
if(config.screen === true && scrStream){ streams = scrStream} ;
if(config.video === true && vidStream){  /*streams.addTrack(vidStream.getVideoTracks()[0] )*/
  if(scrStream) {
    video.srcObject = vidStream;  } else { streams = vidStream;} } ;
if(config.audio === true && audStream){  if(streams === null) streams = audStream; else streams.addTrack(audStream.getAudioTracks()[0]); };

var mimeType = 'video/webm';
var options =  {  type: mimeType  , mimeType : mimeType , recordingType : MediaStreamRecorder || CanvasRecorder , canvas: {
  width: 1080,  height: 720},      };
if(config.audio === true && config.video === false && config.screen === false){
  mimeType = 'audio/webm';  options = audopt; }
//previewStream : function(stream){ video.src = stream}
recorder = RecordRTC( streams,options) ;
console.log(recorder);
recorder.startRecording();
return recorder;
}

async function stopRecordingCallback() {
  const video  = document.getElementById('canvasvideo');
  //video.src = video.srcObject = null;
   video.muted = true;    video.volume = 0;
    recorder.stopRecording(async function(blob) {
      video.src =  blob;
       var blo = await recorder.getBlob();
        var ext =  blo.type.startsWith("video") ? '.webm' : ".mp3";
       let filename =  String(Date.now()  )+ ext;
       console.log(blo.type , blo.size)
       //let fil =  new File( [blo] , filename );
       blo.name = filename;
       if(!isEdge){
       getSeekableBlob(recorder.getBlob(), function(seekableBlob) {
        let fil = { filename : filename ,name : filename , data :seekableBlob , size : blo.size ,  type : blo.type};
        meanderStore.setItem(filename, fil );        console.log( meanderStore.keys());     });}
        else{  let fil = { filename : filename ,name : filename , data :blo , size : blo.size ,  type : blo.type};
                meanderStore.setItem(filename, fil );        console.log( meanderStore.keys()); 
        } recorder = vidStream = audStream = scrStream = null;
   }); 
}

const Recording = (props) => {

   const { Option } = Select;
   const CheckboxGroup = Checkbox.Group;
   const { state, dispatch } = useContext(Context);
   const localUserId = localStorage.getItem("userId");
   const token = localStorage.getItem("token");
   const [ activeAudio , setActiveAudio] = useState(null);
   const [ activeVideo , setActiveVideo] = useState(null);
   const [ audioList , setAudioList] = useState([]);
   const [ videoList , setVideoList] = useState([]);
   const [ config , setConfig] = useState({});
   const [ renderUppy , setRenderUppy] = useState(false);
   const [ preview , setPreview] = useState(false);
   const plainOptions = props.mimeType && props.mimeType.startsWith("audio") ? ['audio']  : ['audio', 'video', 'screen'];
   const defaultCheckedList = props.mimeType && props.mimeType.startsWith("audio") ? ['audio']  : [ 'audio','screen'];
   const [ localKeys , setLocalKeys] =  useState([]);  
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const mediaDev = useMediaDevices();
  

  const onChangeCheckBox = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);    setCheckAll(e.target.checked);
  };

   
    useEffect(()=>{     
        let tempAudio = [] ;   let tempVideo = [] ;
        mediaDev.map((obj,ind)=>{
        if(obj.kind === 'video' || obj.kind === 'videoinput')   tempVideo.push(obj);                
        if(obj.kind === 'audio' || obj.kind ===  'audioinput')  tempAudio.push(obj);
        });
        setAudioList(tempAudio);  setVideoList(tempVideo);
    },[mediaDev])

    useEffect(()=>{
      meanderStore.keys().then(function(keys){setLocalKeys(keys); });
      var conf = { audio : false , video : false , screen : false};
      checkedList.map(ob=>{   conf[ob] = true  });
      setConfig(conf);     console.log(checkedList , localKeys );
      const ele = document.getElementById('c');
      ele.style.display = 'none';
      if(checkedList.includes('video')) ele.style.display = 'flex' ;

    },[checkedList])
        

    async function SaveRecording(typ,key){
      meanderStore.getItem(key).then(function(value) {
      if( typ === 'local') invokeSaveAsDialog(value.data , key );
      if( typ === 'upload') {
        var fileObj = { name: key,  type: value.type, data: value.data, 
          size : value.size ,  source: 'Local', isRemote: false };
          console.log(key);  setRenderUppy(value);   }
      if(typ === 'play'){  const video  = document.getElementById('canvasvideo');
         video.src =  URL.createObjectURL(value.data) ;    }        });
  }

    return (
        <>                
        { renderUppy === false ?
        <>
        <div style={{ width:"100vw",  display:"flex" , flexFlow : "column" ,height:"100%",left:"150px"  }} >
          <Row>
        <Col span = {12}><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        Check all  </Checkbox>  <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChangeCheckBox} />
     </Col>
         { videoList.length > 15 ? 
         <Col span = {4}> <Select
           size="medium"  style={{ width: "100%", maxWidth: "200px" }}
           placeholder="select video"   optionFilterProp="children"
           showSearch={false}       value={ activeVideo ? activeVideo.label : null }
           onChange={(value) => {   setActiveVideo(JSON.parse(value))        }}
          >
          {  videoList.map((obj, ind) => {
             return  ( <> {" "}
                     <Option key={obj.deviceId} value={JSON.stringify(obj) } >
                       {" "} {obj.label}  {"   "} </Option>{" "}  </>  )  })  }  
          </Select> </Col> : ""         } 
        <Col span = {4}> { audioList.length > 15 ? <Select
           size="medium"   style={{ width: "100%", maxWidth: "200px" }}
           placeholder="select audio"    optionFilterProp="children"
           showSearch={false}  value={ activeAudio ? activeAudio.label : null }
           onChange={(value) => {   setActiveAudio(JSON.parse(value))  }}
          >
          {  audioList.map((obj, ind) => {
             return ( <> <Option key={obj.deviceId} value={ JSON.stringify(obj) } >
                     {" "} {obj.label}  {"   "}   </Option>   </>  )  })  }  
          </Select> : ""  } </Col>
        </Row>
        <Row >
          {/*<Card >
        <video id="inlinevideo" controls autoPlay playsInline style={{maxWidth:"200px",maxHeight:"100px"}}></video></Card>*/}
        <Card>
        <video id="canvasvideo" controls autoPlay playsInline style={{maxWidth:"400px",maxHeight:"300px"}}></video></Card>
        
        </Row>
        <Row>
          {localKeys.length < 5 ?<>
            <Button id="btn-start-recording" onClick={(e)=>{ getStreams(config);  }}>Start Recording</Button>
            <Button id="btn-stop-recording" onClick={(e)=>{ stopRecordingCallback() } } >Stop Recording</Button> </>:
            <p> {"Upload or Delete Following videos to continue using recording"} </p>}
        </Row>
        {
                localKeys.map((key,ind)=>{
                    return <Row span={18}>
                       <Col span={6}>{ind}. {key}</Col>
                       <Col span={3}><Button id={key+"play"} onClick={(e)=>{  SaveRecording('play',key) } } > Play</Button></Col>
                       <Col span={3}><Button id={key+"save-to-local"} onClick={(e)=>{  SaveRecording('local',key) } } > Save</Button></Col>
                       <Col span={3}><Button id={key+"upload"} onClick={(e)=>{  SaveRecording('upload',key) } } > Upload </Button></Col>
                       <Col span={3}><Button id={key+"remove"} onClick={(e)=>{ meanderStore.removeItem(key)  }}> Delete</Button></Col>
                    </Row>
                })
            }

        </div> </>: 
        <UppyUpload fileObj={renderUppy} mimeType={renderUppy.type}/>}
        </>
    )
}



export { Recording };
  
