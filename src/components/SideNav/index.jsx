import React, { useState } from "react";
import { Layout, Menu } from "antd";

const SideNav = ({ updateTab }) => {
  const { Sider } = Layout;
  const [selectedKeys, setSelectedKeys] = useState([]);
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["my-videos"]}
        selectedKeys={selectedKeys}
        onSelect={(info) => setSelectedKeys(info.selectedKeys)}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="my-videos" onClick={() => updateTab("my-videos")}>
          My Videos
        </Menu.Item>
        <Menu.Item key="add-videos" onClick={() => updateTab("add-video")}>
          Add Video
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideNav;
