import React, { useState } from "react";

import {
  Layout,
  Breadcrumb,
  Menu,
  List,
  Avatar,
  Button,
  Skeleton,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Image,
  Card,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const MyVideos = ({ updateTab }) => {
  const { Header, Footer, Sider, Content } = Layout;
  const { SubMenu } = Menu;
  const { Search } = Input;
  const { Option } = Select;
  const { Paragraph, Text } = Typography;

  const [ellipsis, setEllipsis] = useState(true);
  const [addVideo, setAddvideo] = useState(false);

  return (
    <Layout style={{ padding: "24px" }}>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: "100vh",
        }}
      >
        <Row align="middle">
          <Col span={12}>
            <h2 className="page-title">Your Uploaded Videos</h2>
          </Col>
          <Col span={6} style={{ paddingRight: "15px" }}>
            {/* <Row justify="end">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => updateTab("add-video")}
              >
                Add New
              </Button>
            </Row> */}
          </Col>
          <Col span={6}>
            <Search
              placeholder="Enter keyword..."
              allowClear
              onSearch=""
              enterButton
            />
          </Col>
        </Row>
        <Divider orientation="left"></Divider>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              bordered={true}
              hoverable
              cover={
                <img
                  alt="example"
                  src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
              }
              actions={[
                <DeleteOutlined key="delete" />,
                <EditOutlined key="edit" />,
                <LinkOutlined key="embed" />,
              ]}
            >
              <div className="videoDuration">10:00</div>
              <div className="videoInfoBlock">
                <div className="videoTitle">
                  Video title runs here like this and if extend looks like this
                </div>
                <div className="publishedDate">12th Jan, 2021</div>
              </div>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MyVideos;
