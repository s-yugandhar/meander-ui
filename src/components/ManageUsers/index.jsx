import React, { useContext } from "react";
import { Layout, Row, Divider, Table, Switch, Button, Col } from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";

// custom imports
import { Context } from "../../context";

const ManageUsers = () => {
  const { Content } = Layout;
  const { state, dispatch } = useContext(Context);

  // Table Columns
  let tableColmnsTitle = [
    {
      title: "#",
      dataIndex: "serialNo",
      key: "serialNo",
    },
    {
      title: "Video Name",
      dataIndex: "videoName",
      key: "videoName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Video Description",
      dataIndex: "videoDesc",
      key: "videoDesc",
    },

    {
      title: "Published",
      key: "status",
      render: () => <Switch checkedChildren="Yes" unCheckedChildren="No" />,
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <>
          <Button icon={<EditOutlined />} onClick="" />
          <Button icon={<DeleteOutlined />} onClick="" />
        </>
      ),
    },
  ];

  let tableData = [];

  if (state.videoList) {
    state.videoList.map((itm, ind) => {
      tableData.push({
        key: ind,
        serialNo: ind + 1,
        videoName: itm.title,
        videoDesc: itm.desc,
        type: itm.itemtype,
        size: (itm.itemsize / (1024 * 1024)).toFixed(2) + "MB",
      });
    });
  }

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
        <Row align="middle">
          <Col span={24}>
            <h2 className="page-title">
              Manage Users -{" "}
              {state.videoList === undefined ? 0 : state.videoList.length}
            </h2>
            <Divider />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Table dataSource={tableData} columns={tableColmnsTitle}></Table>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ManageUsers;
