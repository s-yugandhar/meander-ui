import React from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Button,
  Card,
  List,
  Upload,
} from "antd";
import { IoCalendarOutline, IoAdd, IoArrowForward } from "react-icons/io5";
import { BiRupee } from "react-icons/bi";

// Custom imports
import "./pDashboard.scss";

const PDashboard = () => {
  const { Option } = Select;
  const { Text } = Typography;

  return (
    <Layout className="full-width page-layout">
      {/* Calendar & Bill Status Starts */}
      <Row className="bg-white p-15" align="middle">
        <Col span="10">
          <Select
            defaultValue="last30days"
            style={{ width: "150px" }}
            onChange=""
          >
            <Option value="last30days">Last 30 days</Option>
            <Option value="">Last 2 months</Option>
            <Option value="">Last 3 months</Option>
            <Option value="">Last 4 months</Option>
          </Select>
          <Input
            addonAfter={<IoCalendarOutline style={{ fontSize: "18px" }} />}
            defaultValue=""
            placeholder="Select date"
            style={{ width: "170px" }}
          />
        </Col>
        <Col span="4"></Col>
        <Col span="10">
          <Row align="middle" justify="end">
            <Col
              className="pr-1 mr-1"
              style={{ borderRight: "1px solid #ccc", textAlign: "right" }}
            >
              <p className="my-0">
                Current billing:{" "}
                <strong>
                  <BiRupee width="12" color={"#666"} /> 9,99,999.00
                </strong>
              </p>
              <p className="my-0">Make payment by 11 June 2021, 12:00 PM</p>
            </Col>
            <Col>
              <Button type="ghost">Make Payment</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Calendar & Bill Status Ends */}

      {/* Totals Columns Starts */}
      <Row align="stretch" className="py-1" gutter={15}>
        {/* Total Videos Column */}
        <Col span="6">
          <Card title="Total Videos" className="totalColumn">
            <div className="totalNumber">9,99,999</div>
            <div className="totalCompare">20% up from Last Month</div>
          </Card>
        </Col>

        {/* Total Audios Column */}
        <Col span="6">
          <Card title="Total Audios" className="totalColumn">
            <div className="totalNumber">9,99,999</div>
            <div className="totalCompare">20% up from Last Month</div>
          </Card>
        </Col>

        {/* Data Transfer Column */}
        <Col span="6">
          <Card title="Data Transfer" className="totalColumn">
            <div className="totalNumber">300 TB</div>
            <div className="totalCompare">20% up from Last Month</div>
          </Card>
        </Col>

        {/* API Requests Column */}
        <Col span="6">
          <Card title="API Requests" className="totalColumn">
            <div className="totalNumber">9,99,999</div>
            <div className="totalCompare">20% up from Last Month</div>
          </Card>
        </Col>
      </Row>
      {/* Totals Columns Ends */}

      {/* Big Graph Starts */}
      <Row className="py-1">
        <Col span="24">
          <Card
            title="Data Transfer, Storage, API requests"
            className="bigGraph"
          />
        </Col>
      </Row>
      {/* Big Graph Ends */}

      {/* Billing Recent Activity Starts */}
      <Row align="stretch" className="py-1" gutter="15">
        {/* Billing Column */}
        <Col span="12">
          <Card title="Billing Usage Split" style={{ height: "300px" }}>
            Some Graph
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col span="12">
          <Card title="Recent Activity" style={{ height: "300px" }}>
            <List itemLayout="horizontal" className="activityList">
              <List.Item className="activityItem">
                <Text ellipsis="1" className="activityTitle">
                  Some activity title runs here like this Some activity title
                  runs here like this Some activity title runs here like this
                </Text>
                <Text className="activityTiming">30min ago</Text>
              </List.Item>
              <List.Item className="activityItem">
                <Text ellipsis="1" className="activityTitle">
                  Some activity title runs here like this Some activity title
                  runs here like this some times
                </Text>
                <Text className="activityTiming">30min ago</Text>
              </List.Item>
              <List.Item className="activityItem">
                <Text ellipsis="1" className="activityTitle">
                  Some activity title runs here like this
                </Text>
                <Text className="activityTiming">30min ago</Text>
              </List.Item>
              <List.Item className="activityItem">
                <Text ellipsis="1" className="activityTitle">
                  Some activity title runs here title runs here like this
                </Text>
                <Text className="activityTiming">30min ago</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
      {/* Billing Recent Activity Ends */}

      {/* Recent Videos Starts */}
      <Row className="py-1">
        <Col span="24">
          <Card title="Recent Videos" class="recentVideosCard">
            <Row align="stretch" gutter={15}>
              {/* Upload New Video */}
              <Col span="3">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader bg-white w-100 recent-add-video"
                  showUploadList={false}
                  action=""
                  beforeUpload=""
                  onChange=""
                >
                  <IoAdd style={{ fontSize: "20px", color: "#bbb" }} />
                </Upload>
              </Col>

              {/*  List of recent videos */}
              <Col span="6">
                <Card style={{ minHeight: "200px" }}></Card>
              </Col>
              <Col span="6">
                <Card style={{ minHeight: "200px" }}></Card>
              </Col>
              <Col span="6">
                <Card style={{ minHeight: "200px" }}></Card>
              </Col>

              {/* View All Cards */}
              <Col span="3">
                <Button className="viewAllBtn">
                  View All
                  <br /> <IoArrowForward />
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* Recent Videos Ends */}
    </Layout>
  );
};

export default PDashboard;
