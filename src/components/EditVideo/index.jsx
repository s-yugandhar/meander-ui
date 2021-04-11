import React , { useEffect,useContext , useState} from "react";
import {  Layout,  Menu,  Row,  Col,  Divider,  Input,
  Select,  Typography,  Empty,  Modal,  Form,
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
  const [form]= Form.useForm();
  const {state , dispatch} = useContext(Context);
  const [quality , setQuality] = useState("480p");
  const [ fileList, setFileList] = useState([]);
  const [ previewImage , setPreviewImage] = useState(null);
  const [seePreview , setSeePreview] = useState(false);
  let editV = { ...state.editVideo };

  let mp4 = {    "1080p": "/mp41080k.mp4",
      "720p": "/mp4720k.mp4",    "480p": "/mp4480k.mp4",
      "240p": "/mp4240k.mp4",  };
  
  
  function getMp4Url(props , type ){
    let base_url = "https://meander.ibee.ai/bucket-" + props.userId + "/";
    let dash_base_url = "https://meander.ibee.ai/dash/bucket-" + props.userId + "/";
    let hls_base_url = "https://meander.ibee.ai/hls/bucket-" + props.userId + "/";
    let img1080 = "/thumbs/img1080/frame_0000.jpg";
    let img720 = "/thumbs/img720/frame_0000.jpg";
    let img480 = "/thumbs/img480/frame_0000.jpg";
    let img240 = "/thumbs/img240/frame_0000.jpg";
  
    
    let bg_url = base_url + props.fileObject._object_name.split(".")[0] + img240;
    let mp4_url =    base_url + props.fileObject._object_name.split(".")[0] + mp4["1080p"];
    let dash_url =    dash_base_url +  props.fileObject._object_name.split(".")[0] +
      mp4["1080p"] +    "/manifest.mpd";
    let hls_url =    hls_base_url +  props.fileObject._object_name.split(".")[0] +
      mp4["1080p"] +    "/index.m3u8";
      if (type =="mp4") return mp4_url;
      if(type == "img") return bg_url;
      if(type == "dash") return dash_url;
      if(type == "hls")  return  hls_url;
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
          });

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
          <Col span={10}>
            <div className="editVideoFormBlock full-width">
              <Form
                name="basic"
                form={form}
                onFinish={(values)=> updateState(values)}
                layout="vertical"
              >
                <h3>
                <strong>General Info </strong>
                </h3>
                <Form.Item
                  label="Video Title"
                  name={'title'}
                  className="editFormItem"
                >
                  <Input  value={state.editVideo ===  null || state.editVideo === undefined 
                      ? null : state.editVideo.title}/>
                </Form.Item>
                <Form.Item
                  label="Video Description"
                  name={'description'}
                  className="editFormItem"
                >
                  <Input.TextArea rows="3"  />
                </Form.Item>
                <Form.Item
                  label="Thumbnail"
                  name={'thumbnail'}
                  className="editFormItem"
                >
                  <Input value={state.editVideo ===  null || state.editVideo === undefined 
                      ? null : state.editVideo.thumbnail}/>
                </Form.Item>
                
                <Form.Item
                  label="Video Maturity"
                  name={'maturity'}
                  className="editFormItem"
                >
                  <Select
                    placeholder="Select Maturity"
                  >
                    <Option value="U">U (Kids)</Option>
                    <Option value="UA">UA (Teens)</Option>
                    <Option value="A"> Adults</Option>
                    <Option value="S"> Adults</Option>
                    <Option value="13+"> 13+</Option>
                    <Option value="16+"> 16+</Option>
                    <Option value="18+"> 18+</Option>
                  </Select>
                </Form.Item>
                <Divider />
                {/*<h3>
                  <strong>Privacy</strong>
                  <Switch
                    defaultChecked
                    name="privacy"  
                    style={{ marginLeft: "20px" }}
                  />
                </h3>*/}
                <Form.Item
                  label="Who can see?"
                  name={'scope'}
                  className="editFormItem"
                >
                  <Select
                    placeholder="Select Maturity"
                  >
                    <Option value="public">Public</Option>
                    <Option value="private"> Private</Option>
                    <Option value="teamonly"> Team</Option>
                    <Option value="apponly"> App User</Option>
                    <Option value="inactive"> Inactive</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <div style={{ float: "right" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled=""
                    >
                      Update Information
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
          </Col>
          <Col span={1} />
          <Col span={13}>
            <div className="full-width edit-video-block">
              <h3>
              <strong>Your Video Name : {  JSON.stringify(editV.name)}</strong>
              </h3>
              <div>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleUpload}
          beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
        >
          {uploadButton}
        </Upload>

        <Button onClick={handleSubmit} // this button click will trigger the manual upload
        >
            Submit
        </Button>

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
