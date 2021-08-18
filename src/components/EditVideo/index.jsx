import React, { useEffect, useContext, useState } from "react";
import {
  Layout,
  Menu,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Modal,
  Form,
  Collapse,
  Button,
  message,
  Upload,
  Radio,
  Card,
  Tooltip,
  notification,
  Tabs,
} from "antd";

import {
  PlayCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  LoadingOutlined,
  PlusSquareOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "./editVideo.scss";
import axios from "axios";
import {
  dbUpdateObj,
  url,
  cdn_url,
  listPlaylist,
  createPlaylist,
  getServedLinks,
} from "../API";
import { Context } from "../../context";
import PlayVideo from "../PlayVideo";
import Logo from "../../assets/images/Meander_Logo.svg";
import Loading from "../Loading";

const tabs = [
  { key: "pvideo", tab: "Play Video" },
  { key: "ginfo", tab: "General Info" },
  { key: "thumbnail", tab: "Attach/View THumbnail" },
  { key: "getlinks", tab: "Get Links" },
];

const EditVideo = (props) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { Option } = Select;
  const { Panel } = Collapse;
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(Context);
  const [quality, setQuality] = useState("480p");
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [seePreview, setSeePreview] = useState(false);
  const [trans, setTrans] = useState(true);
  const [seewhat, setSeeWhat] = useState(1);
  const [copywhat, setCopyWhat] = useState("play");
  const [showcode, setShowCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plist, setPlist] = useState([]);
  const [flag, setFlag] = useState(false);
  const [links, setLinks] = useState(null);
  let editV = { ...state.editVideo };

  const { TabPane } = Tabs;

  let mp4 = {
    "1080p": "/mp41080k.mp4",
    "720p": "/mp4720k.mp4",
    "480p": "/mp4480k.mp4",
    "240p": "/mp4240k.mp4",
  };

  const isTranscodeDone = (imgurl) => {
    if (trans === false) {
      var image = new Image();
      image.onload = function () {
        if (this.width > 0) {
          setTrans(true);
        }
      };
      image.onerror = function () {
        setTrans(false);
      };
      image.src = imgurl;
    }
  };

  function getMp4Url(state, type) {
    if (links === null || links === undefined) return null;
    if (type === "mp3" && state.editVideo.itemtype.includes("audio"))
      return links.mp3_url;
    if (type === "mp4") return links.mp4_url;
    if (type === "img") return links.img_url;
    if (type === "dash") return links.dash_url;
    if (type === "hls") return links.hls_url;
  }

  const getPlayUrl = (state, dispatch) => {
    return `${url}/watch/${state.userId}/${state.editVideo.id}`;
  };

  const embedCodeFunc = (state, dispatch, obj) => {
    let dbobj = state.editVideo;
    let frame = `<iframe src='${url}/watch/${state.userId}/${dbobj.id}?embed=true' width='530'
        height='315' frameborder='0' allow=' autoplay; fullscreen; picture-in-picture'
        allowfullscreen title='${dbobj.title}'></iframe>`;
    return frame;
  };

  const handleMenuClick = (e) => {
    let code = null;
    console.log(e);
    e.key = e.target.value;
    if (e.key === "iframe")
      code = embedCodeFunc(state, dispatch, props.fileObject);
    if (e.key === "mp3") code = getMp4Url(state, "mp3");
    if (e.key === "hls") code = getMp4Url(state, "hls");
    if (e.key === "dash") code = getMp4Url(state, "dash");
    if (e.key === "mp4") code = getMp4Url(state, "mp4");
    if (e.key === "embed") {
      code = getPlayUrl(state, dispatch, url, props);
      code = code + "?embed=true";
    }
    if (e.key === "play") code = getPlayUrl(state, dispatch, url, props);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      message.success(`Code Copied `);
    } else {
      alert(`Sorry your browser does not support, please copy here: ${code}`);
    }
    setShowCode(code);
  };

  const menuvideo = (
    <>
      <Row>
        <Col span="24">
          <Radio.Group
            onChange={(e) => {
              setCopyWhat(e.target.value);
              handleMenuClick(e);
            }}
            value={copywhat}
          >
            <Radio key="play" value="play">
              {" "}
              Play
            </Radio>
            <Radio key="embed" value="embed">
              Embed
            </Radio>
            <Radio key="iframe" value="iframe">
              Iframe
            </Radio>
            <Radio key="mp4" value="mp4">
              {" "}
              Mp4
            </Radio>
            <Radio key="dash" value="dash">
              Android
            </Radio>
            <Radio key="hls" value="hls">
              {" "}
              Ios
            </Radio>{" "}
          </Radio.Group>
        </Col>
        <Col span="24" style={{wordBreak: "break-all", padding: "10px", backgroundColor: "#eee", borderRadius: "5px", marginTop: "15px"}}>{showcode}</Col>
      </Row>
    </>
  );
  const menuaudio = (
    <>
      <Radio.Group
        onChange={(e) => {
          setCopyWhat(e.target.value);
          handleMenuClick(e);
        }}
        value={copywhat}
      >
        <Radio key="play" value="play">
          {" "}
          Play
        </Radio>
        <Radio key="embed" value="embed">
          Embed
        </Radio>
        <Radio key="iframe" value="iframe">
          Iframe
        </Radio>
        <Radio key="mp3" value="mp3">
          {" "}
          Mp3
        </Radio>
      </Radio.Group>
      <br />
      <br />
      {showcode}
    </>
  );

  const updateState = (values) => {
    console.log(values);
    let obj = { ...state.editVideo };
    let ke = Object.keys(values);
    ke.forEach((ke, index) => {
      obj[ke] = values[ke];
    });
    //obj['owner_id'] = state.userId;
    console.log(obj);
    dbUpdateObj(state, dispatch, obj);
  };

  const uploadButton = (
    <div>
      <PlayCircleOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handleCancel = () => {
    setSeePreview(false);
  };

  const handlePreview = (file) => {
    setSeePreview(true);
    setPreviewImage(file.thumbUrl);
  };

  const handleBeforeUpload = (fileList) => {
    //let email = state.userObj.email;
    let uuid = "thumb" + state.userObj.id;
    fileList.fileList.map((obj, index) => {
      obj.originFileobj.name = uuid + obj.originFileobj.name.split(".")[1];
    });
    return false;
  };

  const handleUpload = (fileList) => {
    console.log(JSON.stringify(fileList));
    setFileList(fileList.fileList);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (state.editVideo === null || state.editVideo === undefined) return "";
    let formData = new FormData();
    let foldername = state.editVideo.itempath.split("/")[1];
    let filename = state.editVideo.itempath.split("/")[2];
    let file = fileList[0].originFileObj;
    formData.append("file", file);
    console.log(formData);
    axios
      .post(
        url + `/uploadthumb/${state.userId}/${foldername}/${filename}`,
        formData,
        { headers: { Authorization: "bearer " + state.token } }
      )
      .then((res) => {
        if (res.data.status_code === 200) {
          dispatch({
            type: "EDIT_VIDEO",
            payload: {
              editVideo: { ...state.editVideo, thumbnail: res.data.uploadURL },
            },
          });
          message.success("Thumbnail updated");
        }
      })
      .catch((err) => {
        console.log("err", err);
        message.error("Error in Thumbnail updation");
      });
    setLoading(false);
  };

  // Tabs OnChange
  const callback = (key) => {
    console.log("Tab change key - ", key);
  };

  useEffect(() => {
    if (links === null) {
      getServedLinks(state, dispatch, state.editVideo.id, true)
        .then((res) => {
          setLinks(res);
        })
        .catch((err) => {
          setLinks(null);
        });
    }
    listPlaylist(state, dispatch);

    form.setFieldsValue({
      title:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.title,
      description:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.description,
      maturity:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.maturity,
      scope:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.scope,
      thumbnail:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.thumbnail,
      duration:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.duration,
      playlistid:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.playlistid,
      playlistindex:
        state.editVideo === null || state.editVideo === undefined
          ? null
          : state.editVideo.playlistindex,
    });
    let loopid = null;
    if (state.editVideo !== null && state.editVideo !== undefined) {
      isTranscodeDone(getMp4Url(state, "img"));
      loopid = setInterval(
        () => isTranscodeDone(getMp4Url(state, "img")),
        5000
      );
    }

    return () => {
      if (loopid !== null) clearInterval(loopid);
    };
  }, [state.editVideo]);

  return (
    <Layout className="main">
      <Content
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
              onFinish={(values) => updateState(values)}
              layout="vertical"
            >
              <Row align="stretch">
                <Col span="12">
                  <Row>
                    {" "}
                    {/* Tabs Starts */}
                    <Col span="24">
                      <Tabs onChange={callback} type="card">
                        <TabPane
                          tab="General Info"
                          key="1"
                          style={{ padding: "25px" }}
                        >
                          <Row>
                            <Col span={24}>
                              <Form.Item
                                label="Description"
                                name={"description"}
                                className="editFormItem"
                              >
                                <Input.TextArea rows="5" />
                              </Form.Item>
                            </Col>

                            {/* Thumbnail Block Starts */}
                            <Col span="24" style={{ marginBottom: "24px" }}>
                              <Row>
                                <Col span="8" style={{ padding: "10px" }}>
                                  <img
                                    style={{
                                      height: "240px",
                                      width: "360px",
                                    }}
                                    src={state.editVideo.thumbnail}
                                    alt="Attached Thumbnail"
                                  />
                                </Col>
                                <Col span="8" style={{ padding: "10px" }}>
                                  <img
                                    style={{
                                      height: "240px",
                                      width: "360px",
                                    }}
                                    src={state.editVideo.thumbnail}
                                    alt="Attached Thumbnail"
                                  />
                                </Col>
                                <Col span="8" style={{ padding: "10px" }}>
                                  <img
                                    style={{
                                      maxWidth: "100%",
                                      maxHeight: "200px",
                                    }}
                                    src={state.editVideo.thumbnail}
                                    alt="Attached Thumbnail"
                                  />
                                </Col>
                                <Col span="24px">
                                  <Button
                                    type="default"
                                    style={{ marginRight: "10px" }}
                                  >
                                    Select from Video
                                  </Button>
                                  <Button
                                    type="default"
                                    style={{ marginRight: "10px" }}
                                  >
                                    Upload
                                  </Button>
                                  <Button
                                    type="default"
                                    style={{ marginRight: "10px" }}
                                  >
                                    Random
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                            {/* Thumbnail Block Ends */}

                            <Col span={24}>
                              <Form.Item
                                label="Title"
                                name={"title"}
                                className="editFormItem "
                              >
                                <Input
                                  value={
                                    state.editVideo === null ||
                                    state.editVideo === undefined
                                      ? null
                                      : state.editVideo.title
                                  }
                                />
                              </Form.Item>
                              <Form.Item
                                label="Who can view this video?"
                                name={"scope"}
                                className="editFormItem"
                              >
                                <Select placeholder="Select Privacy">
                                  <Option value="public">Public</Option>
                                  <Option value="private"> Private</Option>
                                  {/* <Option value="teamonly"> Team</Option>
                                  <Option value="apponly"> App User</Option>
                                  <Option value="inactive"> Inactive</Option> */}
                                </Select>
                              </Form.Item>
                            </Col>

                            <Col span={24}>
                              <Form.Item
                                label="Title"
                                name={"title"}
                                className="editFormItem "
                              >
                                <Input value="" />
                              </Form.Item>
                              <Form.Item
                                label="Embed links works?"
                                name={"scope"}
                                className="editFormItem"
                              >
                                <Select placeholder="Select Privacy">
                                  <Option value="everyWhere">Everywhere</Option>
                                  <Option value="nowhere">Nowheer</Option>
                                  <Option value="specificDomains">
                                    Specific Domains
                                  </Option>
                                </Select>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Row>
                                <Col span="24">Playlist Name</Col>
                                <Col span="18">
                                  <Form.Item
                                    name={"playlistid"}
                                    className="editFormItem"
                                  >
                                    <Select
                                      style={{ width: "100%" }}
                                      placeholder="Search"
                                      showSearch={true}
                                      mode="multiple"
                                    >
                                      {state.dbfolderList.length > 0
                                        ? state.dbfolderList.map((obj) => {
                                            return obj.foldertype ===
                                              "playlist" ? (
                                              <Option
                                                key={obj.id}
                                                value={obj.id}
                                              >
                                                {obj.foldername}
                                              </Option>
                                            ) : null;
                                          })
                                        : null}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span="6">
                                  <Tooltip
                                    title={"Click plus to create New Name"}
                                  >
                                    <Button
                                      type="default"
                                      onClick={(e) => setFlag(true)}
                                      width="100%"
                                      color="#888"
                                    >
                                      <PlusOutlined color="#999999" />
                                      Add New
                                    </Button>
                                  </Tooltip>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24}>
                              <Row>
                                <Col span="24">Channel Name</Col>
                                <Col span="18">
                                  <Form.Item
                                    name={"playlistid"}
                                    className="editFormItem"
                                  >
                                    <Select
                                      style={{ width: "100%" }}
                                      placeholder="Search"
                                      showSearch={true}
                                      mode="multiple"
                                    >
                                      {state.dbfolderList.length > 0
                                        ? state.dbfolderList.map((obj) => {
                                            return obj.foldertype ===
                                              "playlist" ? (
                                              <Option
                                                key={obj.id}
                                                value={obj.id}
                                              >
                                                {obj.foldername}
                                              </Option>
                                            ) : null;
                                          })
                                        : null}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span="6">
                                  <Tooltip
                                    title={"Click plus to create New Name"}
                                  >
                                    <Button
                                      type="default"
                                      onClick={(e) => setFlag(true)}
                                      width="100%"
                                      color="#888"
                                    >
                                      <PlusOutlined color="#999999" />
                                      Add New
                                    </Button>
                                  </Tooltip>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </TabPane>
                        {/*   <TabPane
                          tab="Attach/View Thumbnail"
                          key="2"
                          style={{ padding: "25px" }}
                        >
                          <Row>
                            <Col span={11}>
                              <Form.Item
                                label=" Attach Thumbnail"
                                name={"thumbnail"}
                                className="editFormItem"
                                placeholder={
                                  "Upload a thumbnail to attach link here"
                                }
                              >
                                <Input
                                  type={"hidden"}
                                  value={
                                    state.editVideo === null ||
                                    state.editVideo === undefined
                                      ? null
                                      : state.editVideo.thumbnail
                                  }
                                />
                              </Form.Item>
                              <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleUpload}
                                beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                              >
                                {" "}
                                {uploadButton}{" "}
                              </Upload>
                              <Button
                                onClick={handleSubmit} // this button click will trigger the manual upload
                              >
                                {" "}
                                Upload{" "}
                              </Button>
                            </Col>
                            <Col span={1}></Col>
                            {trans ? (
                              <Col span={11}>
                                <div>
                                  <Radio.Group
                                    onChange={(e) => setSeeWhat(e.target.value)}
                                    value={seewhat}
                                  >
                                    <Radio defaultChecked value={1}>
                                      {"Thumbnail"}
                                    </Radio>
                                    <Radio value={2}>{"Play "}</Radio>
                                    {state.editVideo !== null &&
                                    state.editVideo !== undefined &&
                                    state.editVideo.thumbnail ? (
                                      <Radio value={3}>{"Custom Thumb"}</Radio>
                                    ) : null}
                                  </Radio.Group>
                                  {seewhat === 1 ? (
                                    <img
                                      style={{
                                        height: "240px",
                                        width: "360px",
                                      }}
                                      src={getMp4Url(state, "img")}
                                      alt="Auto Generated Thumbnail"
                                    />
                                  ) : null}
                                  {seewhat === 3 ? (
                                    <img
                                      style={{
                                        height: "240px",
                                        width: "360px",
                                      }}
                                      src={state.editVideo.thumbnail}
                                      alt="Attached Thumbnail"
                                    />
                                  ) : null}
                                  {seewhat === 2 ? (
                                    <>
                                      {editV !== null &&
                                      editV.itempath !== undefined ? (
                                        <div className="video-container">
                                          {editV.itemtype.includes("video") ? (
                                            <video
                                              className="video"
                                              controls
                                              key={quality}
                                              poster={
                                                getMp4Url(state, "img")
                                                  ? getMp4Url(state, "img")
                                                  : Logo
                                              }
                                              style={{
                                                height: "240px",
                                                width: "360px",
                                              }}
                                            >
                                              <source
                                                label={quality}
                                                id={quality}
                                                src={
                                                  cdn_url +
                                                  editV.itempath.split(".")[0] +
                                                  mp4[quality]
                                                }
                                                type="video/mp4"
                                              />{" "}
                                            </video>
                                          ) : (
                                            <audio
                                              className="video"
                                              controls
                                              key={"keyaudio"}
                                              poster={Logo}
                                            >
                                              <source
                                                label={"a4"}
                                                id={"a4"}
                                                src={
                                                  cdn_url +
                                                  editV.itempath.split(".")[0] +
                                                  "/audio4.mp3"
                                                }
                                              />
                                            </audio>
                                          )}
                                        </div>
                                      ) : null}
                                    </>
                                  ) : null}
                                </div>
                              </Col>
                            ) : (
                              <Col span={11}>
                                {" "}
                                {`A autogenerated thumbnail will load
                here as soon as video processing is completed`}{" "}
                              </Col>
                            )}
                          </Row>
                        </TabPane>
                       */}{" "}
                        <TabPane
                          tab="Get Links"
                          key="3"
                          style={{ padding: "25px" }}
                        >
                          <Row>
                            <Col span={18}>
                              {trans
                                ? state.editVideo.itemtype.includes("video")
                                  ? menuvideo
                                  : menuaudio
                                : `List of buttons will appear as soon as video processing is completed ,
                      click them to copy code`}
                            </Col>
                          </Row>
                        </TabPane>
                      </Tabs>
                    </Col>
                    {/* Tabs Ends */}
                  </Row>
                </Col>

                {/* Video Block */}
                <Col
                  span="12"
                  align="center"
                  justifyContent="center"
                  style={{ backgroundColor: "#eee", padding: "15px" }}
                >
                  <>
                    {editV !== null && editV.itempath !== undefined ? (
                      <div
                        className="video-container"
                        style={{ position: "relative", height: "100%" }}
                      >
                        {editV.itemtype.includes("video") ? (
                          <video
                            className="video"
                            controls
                            key={quality}
                            poster={
                              getMp4Url(state, "img")
                                ? getMp4Url(state, "img")
                                : Logo
                            }
                            style={{
                              height: "100%",
                              width: "100%",
                            }}
                          >
                            <source
                              label={quality}
                              id={quality}
                              src={
                                cdn_url +
                                editV.itempath.split(".")[0] +
                                mp4[quality]
                              }
                              type="video/mp4"
                            />{" "}
                          </video>
                        ) : (
                          <audio
                            className="video"
                            controls
                            key={"keyaudio"}
                            poster={Logo}
                          >
                            <source
                              label={"a4"}
                              id={"a4"}
                              src={
                                cdn_url +
                                editV.itempath.split(".")[0] +
                                "/audio4.mp3"
                              }
                            />
                          </audio>
                        )}
                      </div>
                    ) : null}
                  </>
                </Col>
                {/* Video End */}
              </Row>
              <Divider />
              <Row style={{ marginTop: "20px" }}>
                <Col span="24">
                  <Form.Item>
                    <>
                      <div style={{ float: "left" }}>
                        <Button
                          size="large"
                          type="text"
                          style={{ color: "#999" }}
                        >
                          {trans ? (
                            "Video Processing Completed"
                          ) : (
                            <>
                              {"Video is in Processing  "}{" "}
                              <LoadingOutlined size="large" />
                            </>
                          )}
                        </Button>
                      </div>
                      <div style={{ float: "right" }}>
                        <Button
                          type="default"
                          htmlType="reset"
                          size="large"
                          disabled=""
                          style={{ marginLeft: "10px", width: "150px" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          size="large"
                          disabled=""
                          style={{ marginLeft: "10px", width: "150px" }}
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
                    </>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <Col span={1} />
          <Col span={13}>
            <div>
              <Modal visible={seePreview} footer={null} onCancel={handleCancel}>
                {" "}
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>{" "}
            </div>
          </Col>
        </Row>
      </Content>
      <Modal
        title="Create New Playlist"
        destroyOnClose={true}
        visible={flag}
        onOk=""
        onCancel={() => setFlag(false)}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{}}
          onFinish={(val) => {
            createPlaylist(state, dispatch, val.folderName, "playlist")
              .then((res) => {
                notification.open({ message: "Playlist Created succesfully" });
                listPlaylist(state, dispatch);
              })
              .catch((err) =>
                notification.open({
                  message: "Cannot create duplicate playlist",
                })
              );
          }}
          layout="vertical"
        >
          <Form.Item
            label="Playlist Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please enter any name!",
              },
              { max: 64, message: "Maximum 64 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Create Playlist
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default EditVideo;
