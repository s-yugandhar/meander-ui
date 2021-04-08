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
  }


  useEffect(() => {
    //getFolders();
  }, []);

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={["my-videos-submenu"]}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu key="my-videos-submenu" title="My Videos">
            <Menu.Item
              key="my-videos"
              onClick={() => GetFolders(state, dispatch, state.userId)}
            >
              All Items
            </Menu.Item>
            ̉̉
            <Menu.Item
              disabled={true}
              className="createFolderMenuItem"
              key="cf"
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
            {state.folderList !== undefined
              ? state.folderList.map((folder, index) => {
                  return folder._object_name.includes("temp.dod") ? (
                    <Menu.Item
                      key={"folder-" + index}
                      onClick={() =>
                        folderDetail(folder._object_name.split("/")[0])
                      }
                      title={folder._object_name.split("/")[0]}
                    >
                      <FolderOutlined /> {folder._object_name.split("/")[0]}
                    </Menu.Item>
                  ) : null;
                })
              : null}
            <Menu.Item key="add-videos" onClick={() => openUploadVideo(true)}>
              Add Audio/Video
            </Menu.Item>
            <Menu.Item
              key="manage-videos"
              onClick={() => loadPage('manage-videos')}
            >
              Manage Video
            </Menu.Item>
            <Menu.Item
              key="manage-users"
              onClick={() => loadPage("manage-users")}
            >
              Manage Users
            </Menu.Item>
          </SubMenu>
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
