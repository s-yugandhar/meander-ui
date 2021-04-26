import React , { useEffect,useContext , useState} from "react";
import {  Layout,  Menu,  Row,  Col,  Divider,  Input,
  Select,  Typography,  Empty,  Modal,  Form, Collapse,
  Button,  message,  Switch,  Tooltip,  Upload} from "antd";

import { PlayCircleOutlined ,ReloadOutlined,  DeleteOutlined,
  DownloadOutlined } from "@ant-design/icons";
import "./editVideo.scss";
import axios from 'axios';
import {dbUpdateObj , url} from '../API';
import { Context } from '../../context';
import PlayVideo from "../PlayVideo";
import Logo from "../../assets/images/Meander_Logo.svg";


const EditVideo = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Option } = Select;
  const {Panel} = Collapse;
  const [form]= Form.useForm();
  const {state , dispatch} = useContext(Context);
  const [quality , setQuality] = useState("480p");
  const [ fileList, setFileList] = useState([]);
  const [ previewImage , setPreviewImage] = useState(null);
  const [seePreview , setSeePreview] = useState(false);
  const [trans,setTrans] =  useState(false);
  let editV = { ...state.editVideo };

  let mp4 = {    "1080p": "/mp41080k.mp4",
      "720p": "/mp4720k.mp4",    "480p": "/mp4480k.mp4",
      "240p": "/mp4240k.mp4",  };
  
      const isTranscodeDone=(imgurl)=>{
        var image = new Image();
        image.onload = function(){  if(this.width > 0){ setTrans(true);  }   }
        image.onerror= function(){  setTrans(false); }
        image.src = imgurl;
      }
  
      function getMp4Url( state, type) {
        if( state.editVideo !== null && state.editVideo !== undefined){
        let tempdoc = ["img720", "img480", "img240"];
        let ipath = state.editVideo.itempath;
        let cdn_url = "https://meander.ibee.ai/" + ipath.split(".")[0];
        let dash_cdn = "https://meander.ibee.ai/dash/";
        let hls_cdn = "https://meander.ibee.ai/hls/";
        let img1080 = "/thumbs/img1080/frame_0000.jpg";
        let mp34 = "/audio4.mp3";
        let mp4 = {  "1080p": "/mp41080k.mp4",      "720p": "/mp4720k.mp4",
          "480p": "/mp4480k.mp4",       "240p": "/mp4240k.mp4",       };
        let dash_url =   dash_cdn +  ipath.split(".")[0] +
          "/mp4,108,72,48,24,0k.mp4/urlset/manifest.mpd";
        let hls_url =   hls_cdn +  ipath.split(".")[0] +
          "/mp4,108,72,48,24,0k.mp4/urlset/master.m3u8";
        let mp4_url = cdn_url + mp4["1080p"];
        let mp3_url = cdn_url + "/audio4.mp3";
        let img_url = cdn_url + img1080;
        if (type == "mp3" && state.editVideo.itemtype.includes("audio"))
          return mp3_url;
        if (type == "mp4") return mp4_url;
        if (type == "img") return img_url;
        if (type == "dash") return dash_url;
        if (type == "hls") return hls_url; }
      }
    
    const updateState=(values)=>{
      console.log(values);
      let obj = { ...state.editVideo};
      let ke = Object.keys(values);
      ke.forEach((ke,index)=>{
          obj[ke] = values[ke];
      });
      //obj['owner_id'] = state.userId;
      console.log(obj);
      dbUpdateObj(state,dispatch,  obj  );
      }

      const uploadButton = (
        <div>
          <PlayCircleOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

      const handleCancel = () => { setSeePreview(false); }

  const handlePreview = file => {
    setSeePreview(true);
      setPreviewImage(file.thumbUrl);
  }

  const handleBeforeUpload = (fileList) =>{
    fileList.fileList.map((obj,index)=>{
      obj.originFileobj.name = "img"+String(index)+ obj.originFileobj.name.split(".")[1];
   });
   return false;
  }


  const handleUpload = (fileList) => {
    console.log(JSON.stringify(fileList))
    setFileList(fileList.fileList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if ( state.editVideo === null || state.editVideo === undefined )
      return "";
    let formData = new FormData();
    let foldername = state.editVideo.itempath.split("/")[1];
    let filename = state.editVideo.itempath.split("/")[2];
    let file = fileList[0].originFileObj
    formData.append("file", file);
    console.log(formData);
    axios.post(url+`/uploadthumb/${state.userId}/${foldername}/${filename}`, formData)
      .then(res => {
        if(res.data.status_code === 200){
        dispatch({type : "EDIT_VIDEO",payload :
        { editVideo : { ...state.editVideo, thumbnail : res.data.uploadURL } }});
          message.success("Thumbnail updated");}
      })
      .catch(err => {
        console.log("err", err);
        message.error("Error in Thumbnail updation");
      });
  };

      useEffect(()=>{

        form.setFieldsValue({ 
          'title' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.title,
          'description' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.description,
          'maturity' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.maturity,
          'scope' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.scope,
          'thumbnail' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.thumbnail,
          'duration' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.duration,
          'playlistid' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.playlistid,
          'playlistindex' : state.editVideo ===  null || state.editVideo === undefined 
          ? null : state.editVideo.playlistindex,
          });
          if(state.editVideo !==  null && state.editVideo !== undefined && 
            state.editVideo.transcode_state !== "complete")
              isTranscodeDone( getMp4Url( state , "img" ) );
      },[state.editVideo])

      
  return (
    <Layout className="main">
      
      {  state.editVideo !== null && state.editVideo !== undefined && state.editVideo.playUrl !== null 
          && state.editVideo.playUrl !== undefined   ?
      <Row>
            <Col span={18}>
              <PlayVideo   obj={state.editVideo}  />
            </Col>
          </Row> 
      :<Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <Row align="stretch">
            <div className="editVideoFormBlock full-width">
              <Form
                name="basic"
                form={form}
                onFinish={(values)=> updateState(values)}
                layout="vertical"
              >    
                <Collapse accordion>
                <Panel header="General Info" key="1">
                <Row><Col span={11}>
                <Form.Item
                  label="Title"
                  name={'title'}
                  className="editFormItem "
                >
                  <Input  value={state.editVideo ===  null || state.editVideo === undefined 
                      ? null : state.editVideo.title}/>
                </Form.Item>                  
                <Form.Item
                  label="Duration in secs"
                  name={'duration'}
                  className="editFormItem"
                >
                  <Input   />
                </Form.Item></Col>
                <Col span={1}></Col>
                <Col span={11}>
                <Form.Item
                  label="Description"
                  name={'description'}
                  className="editFormItem"
                >
                  <Input.TextArea rows="5"  />
                </Form.Item></Col></Row>
                <Row >
                <Col span={11}>  
                <Form.Item
                  label="Playlist Name"
                  name={'playlistid'}
                  className="editFormItem"
                >
                  <Input   />
                </Form.Item> </Col>
                <Col span={1}></Col>
                <Col span={11}>
                <Form.Item
                  label="Playlist Position"
                  name={'playlistindex'}
                  className="editFormItem"
                >
                  <Input   />
                </Form.Item>  </Col> </Row>
                <Col span={11}>
                <Form.Item
                  label="Who can see?"
                  name={'scope'}
                  className="editFormItem"
                >
                  <Select
                    placeholder="Select Privacy"
                  >
                    <Option value="public">Public</Option>
                    <Option value="private"> Private</Option>
                    <Option value="teamonly"> Team</Option>
                    <Option value="apponly"> App User</Option>
                    <Option value="inactive"> Inactive</Option>
                  </Select>
                </Form.Item>   </Col> 
                </Panel>       
                {/*<h3>
                  <strong>Privacy</strong>
                  <Switch
                    defaultChecked
                    name="privacy"  
                    style={{ marginLeft: "20px" }}
                  />
                </h3>*/
                }
                  <Panel header="Attach/View Thumbnail" key="2">
                  <Row><Col span={11}>                
                <Form.Item
                  label=" Attach Thumbnail"
                  name={'thumbnail'}
                  className="editFormItem"
                >
                  <Input value={state.editVideo ===  null || state.editVideo === undefined 
                      ? null : state.editVideo.thumbnail}/>
                </Form.Item>
                {"upload custom thumbnail or paste link"}
                <Upload          listType="picture-card"
                fileList={fileList}          onPreview={handlePreview}
                onChange={handleUpload}
                beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                >  {uploadButton}  </Upload>
                <Button onClick={handleSubmit} // this button click will trigger the manual upload
                >          Submit    </Button></Col>
                <Col span={1}></Col>
                {trans ?
                <Col span={11}>
                  {"Auto generated Thumbnail"}
                  <img  style={{height:"200px",width:"250px"}} src={getMp4Url(state,"img")} alt="Auto Generated Thumbnail"/>
                </Col>: null}
                </Row>
                </Panel>
                <Panel header={"Actions todo..."} key={3}>
                  <Row>
                    <Col span={11}></Col>
                    <Col span={11}></Col>
                  </Row>
                </Panel>
                </Collapse>
                <Form.Item>
                  <div style={{ float: "right" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled=""
                    >
                      Save
                    </Button>
                  </div>
                  {/*<div style={{ float: "left", paddingTop: "5px" }}>
                    <Button
                      type="ghost"
                      danger
                      htmlType="button"
                      size="middle"
                      disabled=""
                      style={{ marginRight: "5px" }}
                    >
                      <Tooltip title="Delete Video">
                        <DeleteOutlined />
                      </Tooltip>
                    </Button>
                    <Button
                      type="ghost"
                      htmlType="button"
                      size="middle"
                      disabled=""
                      className="ant-btn-warning"
                    >
                      Replace Video <ReloadOutlined />
                    </Button>
              </div>*/}
                </Form.Item>

                <Form.Item></Form.Item>
                
                
              </Form>
            </div>
          <Col span={1} />
          <Col span={13}>
            <div className="full-width edit-video-block">
              <h3>
              <strong>Your Video Name : {  JSON.stringify(editV.name)}</strong>
              </h3>
              <div>
        
        <Modal
          visible={seePreview}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>

              {editV !== null && editV.itempath !== undefined?
              <><div className="video-container">              
              { editV.itemtype.includes("video") ?
              <video className="video" controls key={quality} poster={Logo}>
                    <source label={quality} id={quality} src={ "https://meander.ibee.ai/"+editV.itempath.split(".")[0] +mp4[quality]} 
                    type="video/mp4"/>
                </video> :
                <audio className="video" controls key={'keyaudio'} poster={Logo}>
                  <source label={"a4"} id={"a4"} 
                   src={"https://meander.ibee.ai/"+editV.itempath.split(".")[0] +"/audio4.mp3"} />
                  </audio> }
              </div>
              <div className="edit-video-actions">
                {editV.itemtype.includes("video") ?
                <>
                  <Select onChange={(value)=> setQuality(value) } value={quality}
                style={{float : "right"}}  size="small" shape="round" > 
                <Option value="1080p"> 1080p</Option>
                <Option value="720p"> 720p</Option>
                <Option value="480p"> 480p</Option>
                <Option value="240p"> 240p</Option>
                </Select>
                
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  size="small"
                  style={{ float: "right" }}
                  shape="round"
                  htmlType={"a"}
                  href={  "https://meander.ibee.ai/"+editV.itempath.split(".")[0] +mp4[quality]}
                  //sssstarget={"_blank"}
                  download={ editV.title+".mp4"}
                  //onClick={(e)=>{;}}
                >
                  {editV.name.split(".")[0]+".mp4 "+ quality}
                </Button> </>: 
                <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="small"
                style={{ float: "right" }}
                shape="round"
                htmlType={"a"}
                href={  "https://meander.ibee.ai/"+editV.itempath.split(".")[0] +"/audio4.mp3"}
                //sssstarget={"_blank"}
                download={ editV.title+".mp3"}
                //onClick={(e)=>{;}}
              >
                {editV.name.split(".")[0]+".mp3 "}                
                </Button>}
              </div> </>: null}
            </div>
          </Col>
        </Row> 
              </Content> }
    </Layout>
  );
};

export default EditVideo;
