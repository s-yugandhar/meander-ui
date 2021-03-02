import React, { useState } from "react";
import {
  Layout,
  Menu,
  Modal,
  Divider,
  Button,
  Form,
  Input,
  notification,
} from "antd";
import {
  PlusCircleFilled,
  FolderAddOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const SideNav = ({ updateTab }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  /* const [api, contextHolder] = notification.useNotification(); */
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { Sider } = Layout;
  const { SubMenu } = Menu;

  const showCreateFolder = () => {
    setIsModalVisible(true);
  };

  const createNewFolder = (value) => {
    setIsModalVisible(false);
    notification.open({
      message: `Successfully created`,
      description: `Successfully ${value.folderName} created`,
      icon: <CheckCircleOutlined style={{ color: "#5b8c00" }} />,
    });
  };

  return (
    <>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["my-videos"]}
          selectedKeys={selectedKeys}
          onSelect={(info) => setSelectedKeys(info.selectedKeys)}
          style={{ height: "100%", borderRight: 0 }}
        >
          {/* <Menu.Item key="my-videos" onClick={() => updateTab("my-videos")}>
            My Videos
          </Menu.Item> */}
          <SubMenu key="sub1" title="My Videos">
            <Menu.Item key="cf" style={{ paddingLeft: 0, textAlign: "center" }}>
              <Button
                type="primary"
                shape="round"
                icon={<FolderAddOutlined />}
                size="middle"
                onClick={showCreateFolder}
              >
                Create Folder
              </Button>
            </Menu.Item>
            <Menu.Item key="folder-1">Folder 1</Menu.Item>
            <Menu.Item key="folder-2">Folder 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="add-videos" onClick={() => updateTab("add-video")}>
            Add Video
          </Menu.Item>
        </Menu>
      </Sider>
      <Modal
        title="Create New Folder"
        visible={isModalVisible}
        onOk=""
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          name="basic"
          initialValues={{}}
          onFinish={createNewFolder}
          layout="vertical"
        >
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                type: "string",
                required: true,
                message: "Please enter any name!",
              },
            ]}
          >
            <Input value="" type="text" name="folderName" id="folderName" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large">
              Create Folder
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SideNav;
