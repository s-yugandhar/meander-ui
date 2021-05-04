import React, { useContext, useState, useEffect } from "react";
import {
  Layout,  Row,  Divider,  Table,  Switch,
  Button,  Form,  Col,  Upload,  message,
  Input,  Select, Radio,} from "antd";
import {
  EditOutlined,  DeleteOutlined,  LinkOutlined,
  PlusOutlined,  ReloadOutlined,  FileImageOutlined,
} from "@ant-design/icons";
// custom imports
import { Context } from "../../context";
import ColorPicker from "../Settings/color-picker"
import axios from "axios";
import { url } from "../API/index";


const Settings = () => {
  const { Content } = Layout;
  const [form] = Form.useForm();
  const {state,dispatch} = useContext(Context);
  const [fileList, setFileList] = useState([]);
  const [ previewImage , setPreviewImage] = useState(null);
  const [ colorcode , setColorCode] = useState(null);
  const [seePreview , setSeePreview] = useState(false);

  const handleCancel = () => { setSeePreview(false); }

  const handlePreview = file => {
    setSeePreview(true);
      setPreviewImage(file.thumbUrl);
  }

  const handleBeforeUpload = (fileList) =>{
    //let email = state.userObj.email;
    let uuid = "thumb"+ state.userObj.id ;
    fileList.fileList.map((obj,index)=>{
      obj.originFileobj.name = uuid + obj.originFileobj.name.split(".")[1];
   });
   return false;
  }

  const handleUpload = (fileList) => {
    setFileList(fileList.fileList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if ( state.userObj === null || state.userObj === undefined )
      return "";
    if (state.userObj.settings === null || state.userObj.settings === undefined)
      dispatch({type : "USER_OBJ", payload : { userObj : { ...state.userObj , settings : {} } }});
    let formData = new FormData();
    let foldername = "default";
    let filename = "resellerprofile.ext";
    let file = fileList[0].originFileObj
    formData.append("file", file);
    axios.post(url+`/uploadthumb/${state.userId}/${foldername}/${filename}`, formData,
    { headers: { Authorization : "bearer "+state.token, } }
    ).then(res => {
        if(res.data.status_code === 200){
        dispatch({type : "USER_OBJ",payload :
        { userObj : { ...state.userObj, settings : {...state.userObj.settings  ,logo : res.data.uploadURL} } }});
        setPreviewImage(res.data.uploadURL);
        setFileList([]);
        message.success("Thumbnail updated , now save settings");        
        }
      }).catch(err => {
        console.log("err", err);
        message.error("Error in Thumbnail updation");
      });
  };


  const uploadButton = (
    <div>
      <FileImageOutlined />
      <div className="ant-upload-text">Upload Logo</div>
    </div>
  );

  const uploadButtonBanner = (
    <div>
      <FileImageOutlined />
      <div className="ant-upload-text">Upload Banner</div>
    </div>
  );

  useEffect(()=>{

    if( state.userObj !== null && state.userObj !== undefined ){
    form.setFieldsValue({ 
      'is_person' : state.userObj.is_person,
      'companyname' : state.userObj.company  ? state.userObj.company.name :null,
      'address' : state.userObj.company  ? state.userObj.company.address :null,
      'contact' : state.userObj.company  ? state.userObj.company.contact :null, 
      'gstn' : state.userObj.gstn ,
      'headerbgcolor' : state.userObj.settings  ? state.userObj.settings.headerbgcolor :null ,
      'logo' : state.userObj.settings  ? state.userObj.settings.logo : previewImage ,   
    });      
      setPreviewImage(state.userObj.settings  ? state.userObj.settings.logo :null);
      setColorCode(state.userObj.settings  ? state.userObj.settings.headerbgcolor :null);
  }
  },[state.userObj])

  const updateInApi= async (state,dispatch ,obj )=>{
    if (state.userId === undefined || state.userId === null)
       return ;
    const tempFolders = await axios.post(url + `/users/${state.userId}/updateuser`, obj ,{
       headers: {
          accept: 'application/json', Authorization : "bearer "+state.token,
             }
    }).then(res => {
          message.success(`No of rows updated ${res.data}`);
          setPreviewImage(res.data.uploadURL);
           return res.data;   });
    console.log(" userdata in get manageuser ", tempFolders);
    return tempFolders;
  }

  const updateRecord=(values)=>{
    let company= { "name": values.companyname , "address": values.address , "contact":values.address};
    let settings = { "logo": previewImage , 'headerbgcolor' : colorcode };
    let obj = { ...state.userObj , "company" : company , "settings" : settings};
    console.log(values , obj);    
    let ke = Object.keys(values);
    ke.forEach((ke,index)=>{
        obj[ke] = values[ke];
    });
        updateInApi(state,dispatch,obj);
    }


  return (
    <>
        <Row>
          <Col span={24}>
            {/* Form Starts */}
            <Form
              name="basic"
              form={form}
              onFinish={(values) => updateRecord(values)}
              layout="vertical"
            >
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Is Individual
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="is_person">
                  <Radio.Group onChange={(e)=> 
                  dispatch({type:"USER_OBJ",payload:{ userObj : { ...state.userObj , is_person :e.target.value }}}) } 
                  value={state.userObj.is_person} >
                  <Radio defaultChecked value={true}>{"person"}</Radio>
                  <Radio  value={false}>{"Company"}</Radio></Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Company Name:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="companyname">
                    <Input  />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  GSTN# :
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="gstn">
                    <Input  />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Address:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="address">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Contact Us:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="contact">
                    <Input  />
                  </Form.Item>
                </Col>
              </Row>
              { state.userObj.roles === "reseller"?
              <>
              <h3> <strong>{"your domain : " + state.userObj.domain_name }</strong></h3>
              <Row>
                <Col span={8} xs={8} md={8} lg={8}>
                <img  style={{height:"120px",width:"180px"}} src={ state.userObj.settings ? state.userObj.settings.logo : null} 
                  alt="Logo loads here "/>
                </Col>
                <Col span={8} xs={8} md={8} lg={8}>
                <Upload          listType="picture-card"
                fileList={fileList}          onPreview={handlePreview}
                onChange={handleUpload}
                beforeUpload={() => handleBeforeUpload} // return false so that antd doesn't upload the picture right away
                >  {uploadButton}  </Upload> 
                { fileList.length === 1 ? <Button onClick={handleSubmit} // this button click will trigger the manual upload
                >  Upload Logo </Button>:null}
                
                </Col>
              </Row>
                  <br/>
              {/*<Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Banner
                </Col>
                <Col span={12} xs={12} md={16} lg={18}>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleUpload}
                    beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                  >
                    {uploadButtonBanner}
                  </Upload>
                </Col>
              </Row>*/}

              <Row>
                <Col span={12} xs={12} md={8} lg={6}>
                  Header Background Color:
                </Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Form.Item className="editFormItem" name="headerbgcolor">
                    <ColorPicker value={ colorcode}
                    onChange ={e =>  setColorCode(e.target.value)   }/>
                  </Form.Item>
                </Col>
              </Row>
              </> : null }
              <Row style={{ marginTop: "20px" }}>
                <Col span={12} xs={12} md={8} lg={6}></Col>
                <Col span={12} xs={12} md={16} lg={10}>
                  <Button htmlType="submit" type="primary">
                    Save Settings
                  </Button>
                  <Button htmlType="reset" type="default" style={{marginLeft: '20px'}}>
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
            {/* Form Ends */}
          </Col>
        </Row>
      </>
  );
};

export default Settings;
