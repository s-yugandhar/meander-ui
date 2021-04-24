import React, { useState, useEffect, useContext } from "react";
import {
  Layout,
  Menu,
  Modal,
  Divider,
  Button,
  Form,
  Input,
  notification,
  Alert,
} from "antd";
import {
  FolderAddOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  CloudUploadOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import {
  PAGE,
  FOLDER_CREATED,
  FILE_UPLOADED,
  FOLDER_NAME,
  FILE_LIST,
  FOLDER_LIST,
} from "../../reducer/types";
import {
  dbGetObjByPath,
  GetFolders,
  url,
  GetFiles,
  CreateNewFolder,
} from "../API/index";

import { Context } from "../../context";

const SideNav = ({ updateTab, openUploadVideo }) => {
  const [selectedKeys, setSelectedKeys] = useState(["my-videos"]);
  const [errMsg, setErrMsg] = useState(null);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [folderSubmitBtn, setFolderSubmitBtn] = useState(false);
  const [folders, setFolders] = useState([]);
  const [cModal, setCModal] = useState(false);
  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const { state, dispatch } = useContext(Context);

  const showCreateFolder = () => {
    setCModal(true);
  };

  const createFolderModalClose = () => {
    setCModal(false);
    setErrMsg(null);
  };

  const folderDetail = (folderName) => {
    dispatch({ type: PAGE, payload: { page: "my-videos" } });
    dispatch({ type: FOLDER_NAME, payload: { folderName: folderName } });
    dbGetObjByPath(
      state,
      dispatch,
      "bucket-" + state.userId + "/" + folderName,
      true
    );
    GetFiles(state, dispatch, state.userId, folderName).then((res) => {
      console.log("My Videos Files in sidenav - ", res);
      dispatch({ type: FILE_LIST, payload: { fileList: res } });
    });
  };

  const showAllvideos = () => {
    GetFolders(state.userId);
  };

  const callCreateFolder = (values) => {
    console.log(state);
    CreateNewFolder(state, dispatch, state.userId, values.folderName);
    createFolderModalClose();
  };

  const loadPage = (name) => {
    dispatch({ type: PAGE, payload: { page: name } });
  };

  useEffect(() => {
    //getFolders();
  }, []);

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={["partners-submenu"]}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu key="partners-submenu" title="Partners">
            <Menu.Item key="customers">Customers</Menu.Item>
            <Menu.Item key="listu" onClick={() => loadPage("manage-users")}>
              Users
            </Menu.Item>
            <Menu.Item
              key="reseller-settings"
              onClick={() => loadPage("reseller-settings")}
            >
              Settings
            </Menu.Item>
            <Menu.Item key="reseller-reports">Reports</Menu.Item>
          </SubMenu>

          <SubMenu key="my-videos-submenu" title="Products">
            <Menu.Item
              key="dashboard"
              onClick={() => GetFolders(state, dispatch, state.userId)}
            >
              Dashboard
            </Menu.Item>
            <Menu.Item
              disabled={true}
              className="createFolderMenuItem"
              key="cfv"
            >
              <Button
                key={"xcvz"}
                type="primary"
                shape="round"
                icon={<FolderAddOutlined className="createFolderBtnIcon" />}
                size="middle"
                onClick={showCreateFolder}
                className="createFolderBtn"
              >
                {" "}
                Create Folder
              </Button>
            </Menu.Item>
            {state.folderList !== undefined && state.folderList.length > 0
              ? state.folderList.map((folder, index) => {
                  return (
                    <Menu.Item
                      key={"folder-" + index}
                      onClick={() => folderDetail(folder)}
                      title={folder}
                    >
                      <FolderOutlined /> {folder}
                    </Menu.Item>
                  );
                })
              : null}
            <Menu.Item
              disabled={true}
              className="createFolderMenuItem"
              key="add-videos"
            >
              <Button
                key={"xcvz"}
                type="primary"
                shape="round"
                icon={
                  <VideoCameraAddOutlined className="createFolderBtnIcon" />
                }
                size="middle"
                onClick={() => openUploadVideo(true)}
                className="createFolderBtn"
              >
                Upload Video
              </Button>
            </Menu.Item>
            {/* <Menu.Item key="" onClick={() => openUploadVideo(true)}>
              Add Video
            </Menu.Item> */}
            <Divider className="my-05" />
            {/* <Menu.Item key="preport" title="Coming soon">
              Performance by item
            </Menu.Item> */}
            <Menu.Item key="ureport" title="Coming soon">
              Usage Report
            </Menu.Item>
            {state.userObj !== null &&
            state.userObj !== undefined &&
            (state.userObj.roles === "reseller" ||
              state.userObj.roles === "super_admin") ? (
              <>
                <Divider className="my-05" />
                <Menu.Item key="subdets">Subscription Details</Menu.Item>
                {/* <Menu.Item key="updowmgrade">Upgrade / Downgrade</Menu.Item> */}
              </>
            ) : null}

            {/* {state.userObj !== null &&
            state.userObj !== undefined &&
            (state.userObj.roles === "reseller" ||
              state.userObj.roles === "super_admin") ? (
              <>
                <Divider className="my-05" />
                <Menu.Item key="subdets">Subscription Details</Menu.Item>
                <Menu.Item key="updowmgrade">Upgrade / Downgrade</Menu.Item>
              </>
            ) : null} */}

            {/* <Menu.Item     key="manage-videos"
              onClick={() => loadPage('manage-videos')}
            >            Manage Video            </Menu.Item>
            <Menu.Item              key="manage-users"
              onClick={() => loadPage("manage-users")}
            >              Manage Users     </Menu.Item>  */}
          </SubMenu>
          {/*<SubMenu key="my-audios-submenu" title="My Audios">
            <Menu.Item              key="my-audios"
              onClick={() => GetFolders(state, dispatch, state.userId)}
            >              All Items     </Menu.Item>
            <Menu.Item
              disabled={true}
              className="createFolderMenuItem"
              key="cfa"
            >
              <Button
                key={"xcvz"}
                type="primary"
                shape="round"
                icon={<FolderAddOutlined className="createFolderBtnIcon" />}
                size="middle"
                onClick={showCreateFolder}
                className="createFolderBtn"
              >
                {" "}
                Create Folder
              </Button>
            </Menu.Item>
            { state.folderList !== undefined && state.folderList.length > 0
              ? state.folderList.map((folder, index) => {
                    return <Menu.Item
                      key={"folder-" + index}
                      onClick={() =>
                        folderDetail(folder)
                      }
                      title={folder}
                    >
                      <FolderOutlined /> {folder}
                    </Menu.Item>
                })
              : null}
            <Menu.Item key="add-videos" onClick={() => openUploadVideo(true)}>
              Add Audio
            </Menu.Item>
          </SubMenu>*/}
          {/* <SubMenu key="analytics" title="Analytics">
            <Menu.Item key="preport" title="Coming soon">
              Performance by item
            </Menu.Item>
            <Menu.Item key="ureport" title="Coming soon">
              Usage Report
            </Menu.Item>
          </SubMenu> */}
          {/* {state.userObj !== null &&
          state.userObj !== undefined &&
          (state.userObj.roles === "reseller" ||
            state.userObj.roles === "super_admin") ? (
            <> */}
          {/* <SubMenu key="settings" title="Settings"> */}
          {/*<SubMenu key="playlists" title="Playlists">
                <Menu.Item key="listp" >List</Menu.Item>
                <Menu.Item key="createp">Create</Menu.Item>
              </SubMenu>
              <SubMenu key="channels" title="Channels">
                <Menu.Item key="listl" >List</Menu.Item>
                <Menu.Item key="createl">Create</Menu.Item>
              </SubMenu>*/}
          {/* <SubMenu key="users" title="Manage Users">
                  <Menu.Item
                    key="listu"
                    onClick={() => loadPage("manage-users")}
                  >
                    List
                  </Menu.Item>
                </SubMenu> */}
          {/* </SubMenu> */}
          {/* <SubMenu key="billing" title="Billing">
                <Menu.Item key="subdets">Subscription Details</Menu.Item>
                <Menu.Item key="updowmgrade">Upgrade / Downgrade</Menu.Item>
              </SubMenu>
            </>
          ) : null} */}
        </Menu>
      </Sider>
      <Modal
        title="Create New Folder"
        destroyOnClose={true}
        visible={cModal}
        onOk=""
        onCancel={createFolderModalClose}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{}}
          onFinish={callCreateFolder}
          layout="vertical"
        >
          {/*errMsg ? (
            <Alert   message={errMsg}
              closable type="error"
              onClose={() => setErrMsg(null)}
              style={{ marginBottom: "20px" }}
            />
          ) : null */}
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please enter any name!",
              },
              {
                pattern: /^[A-Za-z0-9 ]+$/,
                message: "Special characters are not allowed",
              },
              { max: 35, message: "Maximum 35 characters" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              disabled={folderSubmitBtn}
            >
              Create Folder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SideNav;
