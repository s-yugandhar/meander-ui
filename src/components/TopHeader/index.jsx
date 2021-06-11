import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Drawer,
  Button,
  message,
  notification,
  Divider,
} from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
// custom imports
import {
  GetUserdetails,
  url,
  getPublicItems,
  GetSharedUsersdetails,
} from "../API";
import axios from "axios";
import { Context } from "../../context";
import { Header } from "antd/lib/layout/layout";
import { Link } from "react-router-dom";
import { IoGridSharp } from "react-icons/io5";
import {ImUser } from "react-icons/im";
import {
  IoGrid,
  IoNotificationsSharp,
  IoChevronDownSharp,
} from "react-icons/io5";

const TopHeader = (props) => {
  const dyHeaderBG = props.dyHeaderBG;
  const dyLogo = props.dyLogo;
  const { Option } = Select;
  const { state, dispatch } = useContext(Context);
  const localUserId = localStorage.getItem("userId");
  const [listUsers, setListUsers] = useState([]);
  const [acUser, setAcUser] = useState(null);
  const [fUser, setFUser] = useState(null);

  const archive = JSON.parse(localStorage.getItem("archive"));
  const friend = JSON.parse(localStorage.getItem("friend"));

  useEffect(() => {
    console.log(props);
  });

  const toggleToUser = async (state, dispatch, record) => {
    let flag = window.confirm("Do you really want to switch profile");
    if (flag === false) {
      return;
    }
    let userId = state.userId;
    let token = state.token;
    if (archive !== null) {
      userId = archive.userId;
      token = archive.token;
    }

    const tempFolders = await axios
      .get(url + `/sharedtoken/${userId}/${record.id}`, {
        headers: {
          accept: "application/json",
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        //message.success(`No of rows updated ${res.data}`);
        switchToProfile(state, dispatch, res.data.id, res.data.access_token);
        return res.data;
      });
    console.log(" userdata in get manageuser ", tempFolders);
    return tempFolders;
  };

  const toggleToFriend = async (state, dispatch, record) => {
    let flag = window.confirm("Do you really want to switch profile");
    if (flag === false) {
      return;
    }
    let userId = state.userId;
    let token = state.token;
    const friend = JSON.parse(localStorage.getItem("friend"));
    if (friend !== null) {
      userId = friend.userId;
      token = friend.token;
    }

    const tempFolders = await axios
      .get(url + `/sharedtoken/${userId}/${record.id}`, {
        headers: {
          accept: "application/json",
          Authorization: "bearer " + token,
        },
      })
      .then((res) => {
        //message.success(`No of rows updated ${res.data}`);
        switchToFriend(state, dispatch, res.data.id, res.data.access_token);
        return res.data;
      });
    console.log(" userdata in get manageuser ", tempFolders);
    return tempFolders;
  };

  const switchToProfile = (state, dispatch, sharedid, sharedtoken) => {
    let previd = localStorage.getItem("userId");
    let prevtoken = localStorage.getItem("token");
    localStorage.setItem("userId", sharedid);
    localStorage.setItem("token", sharedtoken);
    const archive = JSON.parse(localStorage.getItem("archive"));
    if (archive === null) {
      localStorage.setItem(
        "archive",
        JSON.stringify({ userId: previd, token: prevtoken })
      );
      dispatch({
        type: "ARCHIVE_ACCOUNT",
        payload: { archiveAccount: { token: prevtoken, userId: previd } },
      });
    }
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token: sharedtoken, userId: sharedid, page: "videos" },
    });
    GetUserdetails(state, dispatch, state.userId);
    window.location.reload();
  };

  const switchToFriend = (state, dispatch, sharedid, sharedtoken) => {
    let previd = localStorage.getItem("userId");
    let prevtoken = localStorage.getItem("token");
    localStorage.setItem("userId", sharedid);
    localStorage.setItem("token", sharedtoken);
    const friend = JSON.parse(localStorage.getItem("friend"));
    if (friend === null) {
      localStorage.setItem(
        "friend",
        JSON.stringify({ userId: previd, token: prevtoken })
      );
      dispatch({
        type: "ARCHIVE_ACCOUNT",
        payload: { archiveAccount: { token: prevtoken, userId: previd } },
      });
    }
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { token: sharedtoken, userId: sharedid, page: "videos" },
    });
    GetUserdetails(state, dispatch, state.userId);
    window.location.reload();
  };

  const switchToFSelf = (state, dispatch, friend) => {
    if (friend !== null) {
      localStorage.setItem("userId", friend.userId);
      localStorage.setItem("token", friend.token);
      localStorage.setItem("friend", null);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: friend.token,
          userId: friend.userId,
          page: "videos",
        },
      });
      GetUserdetails(state, dispatch, state.userId).then((res) =>
        window.location.reload()
      );
    }
  };

  const switchToSelf = (state, dispatch, archive) => {
    if (archive !== null) {
      localStorage.setItem("userId", archive.userId);
      localStorage.setItem("token", archive.token);
      localStorage.setItem("archive", null);
      dispatch({ type: "ARCHIVE_ACCOUNT", payload: { archiveAccount: null } });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: state.archiveAccount.token,
          userId: state.archiveAccount.userId,
          page: "videos",
        },
      });
      GetUserdetails(state, dispatch, state.userId).then((res) =>
        window.location.reload()
      );
    }
  };

  const GetAllUserdetails = async (state, dispatch, userId) => {
    if (userId === undefined) return [];
    const tempFolders = await axios
      .get(url + `/users/${userId}/getusers`, {
        headers: {
          accept: "application/json",
          Authorization: "bearer " + state.token,
        },
      })
      .then((res) => {
        if (res.status == 200) setListUsers(res.data);
        return res.data;
      });
    console.log(" userdata in get ", tempFolders);
    return tempFolders;
  };

  const GetSharedUsersdetails = async (state, dispatch, userId) => {
    if (userId === undefined) return [];
    let ob = state.userObj;
    let prems = [...ob.access.viewer, ...ob.access.user, ...ob.access.admin];
    state.accessIn.map((obj) => {
      let dex = prems.indexOf(obj.id);
      if (dex > -1) prems.splice(dex, 1);
    });
    prems.map(async (access_id) => {
      const tempFolders = await axios
        .get(url + `/getfriend/${userId}/${access_id}`, {
          headers: {
            accept: "application/json",
            Authorization: "bearer " + state.token,
          },
        })
        .then((res) => {
          if (res.status == 200)
            dispatch({
              type: "ACCESS_IN",
              payload: { accessIn: [...state.accessIn, res.data] },
            });
          return res.data;
        });
      return tempFolders;
    });
  };

  const userMenu = (
    <Menu>
      {
        state.archiveAccount !== null ? (
          <Menu.Item onClick={() => switchToSelf(state, dispatch, archive)}>
            Switch To Own Account
          </Menu.Item>
        ) : null
        /*<Menu.Item onClick={() => { setSelectedTab('profile') ;
      dispatch({ type: PAGE, payload: { page: 'profile' } }); }}>
        My Profile
      </Menu.Item>*/
      }
      <Menu.Item onClick={(e) => logout()}>Logout</Menu.Item>
    </Menu>
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("archive");
    dispatch({ type: "FOLDER_LIST", payload: { folderList: [] } });
    dispatch({ type: "FILE_LIST", payload: { fileList: [] } });
    dispatch({ type: "VIDEO_LIST", payload: { videoList: [] } });
    dispatch({ type: "ARCHIVE_ACCOUNT", payload: { archiveAccount: null } });
    //window.location.reload();
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
  };

  useEffect(() => {
    GetUserdetails(state, dispatch, state.userId);
    console.log("headerroles", archive);
    if (state.userObj) {
      setAcUser(
        state.userObj !== undefined && state.userObj !== null
          ? state.userObj.email
          : null
      );
    }
    if (
      (state.userObj &&
        (state.userObj.roles === "reseller" ||
          state.userObj.roles === "super_admin")) ||
      archive !== null
    ) {
      let userId = state.userId;
      let token = state.token;
      if (archive !== null) {
        userId = archive.userId;
        token = archive.token;
      }
      GetAllUserdetails({ token: token }, dispatch, userId);
    } else {
    }
  }, [state.videoList]);

  return (
    <Header
      className="header"
      style={{ backgroundColor: dyHeaderBG, borderBottom: "1px solid #ddd" }}
    >
      <Row>
        <Col span={4}>
          {window.location.hostname === "portal.meander.video" ? (
            <div style={{ color: "white" }} className="brandingLogoBlock">
              <img src={dyLogo} alt="" className="brandingLogo" />
            </div>
          ) : (
            <div style={{ color: dyHeaderBG }} className="brandingLogoBlock">
              <img src={dyLogo} alt="" className="brandingLogo" />
            </div>
          )}
        </Col>
        <Col span={2}>
          {/*<Input.Search
             onChange={(e) => getPublicItems(state, dispatch, e.target.value)}
             placeholder={
               "Search Public videos by title or description & play, Eg : Luke"
             }
             style={{ marginTop: "15px" }}
           ></Input.Search>*/}
        </Col>

        <Col span={18}>
          <Row justify="end" align="middle" style={{ height: "64px" }}>
            {/* Switch User drodpwon */}
            <Col className="top-header-col">
              {(state.userObj &&
                (state.userObj.roles === "reseller" ||
                  state.userObj.roles === "super_admin")) ||
              archive !== null ? (
                <Select
                  size="middle"
                  className="switchAccountSelect whiteSelect"
                  style={{ width: "200px" }}
                  placeholder="Switch to"
                  optionFilterProp="children"
                  showSearch={true}
                  value={acUser !== null ? acUser : null}
                  bordered={false}
                  onChange={(value) => {
                    if (value === "Switch to Self") {
                      switchToSelf(state, dispatch, archive);
                      return;
                    }
                    if (acUser !== value) {
                      let user = listUsers.find((o) => o.email === value);
                      if (user) setAcUser(user.email);
                      toggleToUser(state, dispatch, { id: user.id });
                    }
                  }}
                >
                  {listUsers.length > 0
                    ? listUsers.map((obj, ind) => {
                        return (
                          <>
                            {" "}
                            <Option
                              key={obj.id}
                              value={
                                archive === null
                                  ? obj.email
                                  : archive && archive.userId !== obj.id
                                  ? obj.email
                                  : "Switch to Self"
                              }
                            >
                              {" "}
                              {archive === null
                                ? obj.email
                                : archive && archive.userId !== obj.id
                                ? obj.email
                                : "Switch to Self"}
                              {"   "}{" "}
                            </Option>{" "}
                          </>
                        );
                      })
                    : null}
                </Select>
              ) : null}
            </Col>

            {/* Upload to dropdown */}
            {/* <Col span={6} className="top-header-col">
              {state.userObj !== null &&
              state.userObj !== undefined &&
              state.userObj.access !== null &&
              friend === null ? (
                <Row justify="end" className="full-width">
                  <Col
                    span={24}
                    style={{ color: "#aaa", paddingBottom: "3px" }}
                  >
                    Upload to
                  </Col>
                  <Col span={24}>
                    <Select
                      size="middle"
                      className="w-100"
                      placeholder="search id"
                      optionFilterProp="children"
                      showSearch={true}
                      value={fUser !== null ? fUser : null}
                      onChange={(value) => {
                        setFUser(value);
                        toggleToFriend(state, dispatch, { id: value });
                      }}
                    >
                      {state.userObj !== undefined &&
                      state.userObj !== null &&
                      state.userObj.access !== null
                        ? state.userObj.access.admin.map((obj, ind) => {
                            return (
                              <>
                                {" "}
                                <Option
                                  key={obj}
                                  value={
                                    friend === null
                                      ? obj
                                      : friend && friend.userId !== obj
                                      ? obj
                                      : "Switch to Self"
                                  }
                                >
                                  {" "}
                                  {friend === null
                                    ? obj
                                    : friend && friend.userId !== obj
                                    ? obj
                                    : "Switch to Self"}
                                  {"   "}{" "}
                                </Option>{" "}
                              </>
                            );
                          })
                        : null}
                    </Select>
                  </Col>
                </Row>
              ) : friend !== null ? (
                <Button onClick={(e) => switchToFSelf(state, dispatch, friend)}>
                  Switch To Self
                </Button>
              ) : null}
            </Col> */}

            {/* Docs */}
            <Col className="top-header-col">
              <Button type="link" className="topHeaderIconBtn text">
                Docs
              </Button>
            </Col>

            {/* Group List */}
            <Col className="top-header-col">
              <Button type="link" className="topHeaderIconBtn">
                <IoGrid className="topHeaderIcon" />
              </Button>
            </Col>

            {/* Group List */}
            <Col className="top-header-col">
              <Button type="link" className="topHeaderIconBtn">
                <IoNotificationsSharp className="topHeaderIcon" />
              </Button>
            </Col>

            {/* User Account Dropdown */}
            <Col className="top-header-col">
              {localUserId ? (
                <Dropdown overlay={userMenu} trigger={["click"]}>
                  <Button
                    htmlType="button"
                    type="link"
                    className="ant-dropdown-link w-100 my-account-dropdown topHeaderIconBtn"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      color: dyHeaderBG === "black" ? "white" : "black",
                    }}
                  >
                    <ImUser className="topHeaderIcon" />
                    <IoChevronDownSharp style={{ width: "15px" }} />
                  </Button>
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  pl="0px"
                  onClick={() =>
                    dispatch({ type: "PAGE", payload: { page: "login" } })
                  }
                >
                  <Avatar size={30} icon={<UserOutlined />} />
                </Button>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default TopHeader;
