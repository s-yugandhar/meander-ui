import React, { useState, useEffect, useContext } from "react";
import {  Layout,  Menu,  Modal,  Divider,  Button,
  Form,  Input,  notification,  Alert,} from "antd";
import {  FolderAddOutlined,  CheckCircleOutlined,  FolderOutlined,} from "@ant-design/icons";
import {  FOLDER_CREATED,  FILE_UPLOADED,  FOLDER_NAME ,FILE_LIST, FOLDER_LIST} from '../../reducer/types';
import { url, GetFolders, GetFiles, CreateNewFolder } from '../API/index';

import { Context } from '../../Context.jsx';

const SideNav = ({ updateTab, openUploadVideo }) => {
  const [selectedKeys, setSelectedKeys] = useState(['my-videos']);
  const [errMsg, setErrMsg] = useState(null);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderSubmitBtn, setFolderSubmitBtn] = useState(false);
  const [folders, setFolders] = useState([]);

  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const { state, dispatch } = useContext(Context);

  const showCreateFolder = () => {
    setIsModalVisible(true);
  };

  const callCreateFolder = (value) => {
    console.log(state);
    setFolderSubmitBtn(true);

    CreateNewFolder(state.userId, value.folderName).then(res => {
      if (res.status_code === 200) {
        setErrMsg(res.detail);
        setFolderSubmitBtn(false);
      } else if (res.status_code === 201) {
        setIsModalVisible(false);

        notification.open({
          message: `Successfully created`,
          description: `Successfully ${value.folderName} created`,
          icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,
        });
        updateTab('my-videos');
        setErrMsg(null);
        dispatch({ type: FOLDER_CREATED, payload: { folderCreated: value.folderName } });
        setFolderSubmitBtn(false);
      } else {
        setErrMsg('Unknown error occured');
      }
    })


  };

  const createFolderModalClose = () => {
    setIsModalVisible(false);
    setErrMsg(null);
  }

  const folderDetail = (folderName) => {
    dispatch({
      type: FOLDER_NAME, payload: {
        folderName: folderName
      }
    });
    GetFiles(state.userId, folderName).then(res => {
      console.log('My Videos Files in sidenav - ', res);
       dispatch({
        type: FILE_LIST,
        payload: {
          fileList: res
        }});
  });  }


  const showAllvideos = () => {
    GetFolders(state.userId).then(res => {
      console.log('Get Folders res - ', res);
      dispatch({  type : FOLDER_LIST ,  payload : { folderList : res  }});
      dispatch({  type : FOLDER_NAME , payload : {folderName : ''}});
    });
  }

  // const sidenavFolders = GetFolders(state.userId);

  useEffect(() => {
    //getFolders();

    showAllvideos();


  }, []);

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultOpenKeys={['my-videos-submenu']}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu key="my-videos-submenu" title="My Videos">

            <Menu.Item key="my-videos" onClick={() => showAllvideos()}>All Videos</Menu.Item>
̉̉
            <Menu.Item disabled={true} className="createFolderMenuItem" key="cf">
              <Button
                type="primary"
                shape="round"
                icon={<FolderAddOutlined className="createFolderBtnIcon" />}
                size="middle"
                onClick={showCreateFolder}
                className="createFolderBtn"
              >
                Create Folder
              </Button>
            </Menu.Item>


            {state.folderList.map((folder, index) => {
              return  folder._object_name.includes("temp.dod")?  (
                <Menu.Item key={'folder-' + index} 
                onClick={() => folderDetail(folder._object_name.split('/')[0])} title={folder._object_name.split('/')[0]}>
                  <FolderOutlined /> {folder._object_name.split('/')[0]}
                </Menu.Item>
              ) : null

            }
            )}

          </SubMenu>
          <Menu.Item key="add-videos" onClick={() => openUploadVideo(true)}>
            Add Video
          </Menu.Item>

        </Menu>
      </Sider>
      <Modal
        title="Create New Folder"
        destroyOnClose={true}
        visible={isModalVisible}
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
          {errMsg ? <Alert message={errMsg} closable
            onClose={() => setErrMsg(null)} type="error" style={{ marginBottom: '20px' }} /> : null}
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: 'Please enter any name!',
              }, {
                pattern: /^[A-Za-z0-9 ]+$/,
                message: 'Special characters are not allowed',
              },
              { max: 35, message: 'Maximum 35 characters' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" disabled={folderSubmitBtn}>
              Create Folder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SideNav;
