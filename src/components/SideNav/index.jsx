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
  PlusCircleFilled,
  FolderAddOutlined,
  CheckCircleOutlined,
  FolderOutlined,
} from "@ant-design/icons";

import axios from "axios";

import { url } from '../API/index';
import { Context } from '../../Context';

const SideNav = ({ updateTab, openUploadVideo }) => {
  const [selectedKeys, setSelectedKeys] = useState(['my-videos']);
  const [errMsg, setErrMsg] = useState(null);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [folderSubmitBtn, setFolderSubmitBtn] = useState(false);
  const [folders, setFolders] = useState([]);

  const { Sider } = Layout;
  const { SubMenu } = Menu;


  const context = useContext(Context);

  const showCreateFolder = () => {
    setIsModalVisible(true);
  };

  const createNewFolder = (value) => {
    console.log(context);
    setFolderSubmitBtn(true);
    axios.post(url + '/create_folder?id=' + context.state.userId + '&foldername=' + value.folderName, null, {
      headers: {
        accept: 'application/json'
      }
    }).then(res => {
      console.log('Create Folder Res - ', res);

      if (res.data.status_code === 200) {
        setErrMsg(res.data.detail);
        setFolderSubmitBtn(false);
      } else {
        setIsModalVisible(false);
        notification.open({
          message: `Successfully created`,
          description: `Successfully ${value.folderName} created`,
          icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,
        });
        updateTab('my-videos');
        setErrMsg(null);
      }

    }).catch(err => {

    });


  };

  const createFolderModalClose = () => {
    setIsModalVisible(false);
    setErrMsg(null);
  }

  const getFolders = () => {
    axios.post(url + '/list_objects?id=' + context.state.userId + '&recursive=true', null, {
      headers: {
        accept: 'application/json',
      }
    }).then(res => {
      console.log(res.data);
      let tempFolders = [];
      res.data.map(Ob => {
        if (Ob._object_name.includes('temp.dod')) {
          tempFolders.push(Ob._object_name);
        }
      });
      setFolders(tempFolders);
    })


  }

  useEffect(() => {
    getFolders();
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

            <Menu.Item key="my-videos" onClick={() => updateTab("my-videos")}>All Videos</Menu.Item>

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


            {folders.map((folder, index) => {
              return (
                <Menu.Item key={'folder-' + index} onClick="" title={folder.replace('temp.dod', '')}>
                  <FolderOutlined /> {folder.split('/')[0]}
                </Menu.Item>
              )

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
          onFinish={createNewFolder}
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
