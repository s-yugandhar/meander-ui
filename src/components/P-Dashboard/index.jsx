import React,{useContext,useEffect,useState} from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Button,
  Empty,
  Card,
  List,
  Upload,
} from "antd";
import { IoCalendarOutline, IoAdd, IoArrowForward } from "react-icons/io5";
import { BiRupee } from "react-icons/bi";
// Custom imports
import "./pDashboard.scss";
import axios from 'axios';
import {url} from '../API/index';
import { Context } from '../../context';
//import {LineChart , Line,XAxis,YAxis , Label, Tooltip} from 'recharts';
import VideoCard from "../Shared/VideoCard";

const PDashboard = () => {
  const { Option } = Select;
  const { Text } = Typography;
  const {state , dispatch} = useContext(Context);
  const [pageData,setPageData] = useState(null);
  const [chartData,setChartData] = useState(null);


  const getDashboardData= async (state,dispatch,ndays)=>{

    const dData = await axios.get(url + `/dashboard?user_id=${state.userId}&ndays=${ndays}`, {
      headers: {
         accept: 'application/json', Authorization : "bearer "+state.token,
            }
   }).then(res => {
      console.log(res.data);
      setPageData(res.data);
      return res.data;   }).catch(
        err => {setPageData(null);}
      );
      return dData;
  }


  useEffect(()=>{
    if(pageData == null){
      getDashboardData(state,dispatch,30);
    }else{
      let cf = pageData.cfmetrics;
      let cdata = []
      cf.map(obj=>{
        let temp = { 'date' : obj.dimensions.date ,
        'Bytes_MB' : Number( obj.sum.edgeResponseBytes/(1024*1024)).toFixed(2) ,
         'Hits': Number(obj.sum.visits)  }
        cdata.push(temp);
      })
      setChartData(cdata);
    };
  },[pageData])


  return (
    <Layout className="full-width page-layout">
      {/* Calendar & Bill Status Starts */}
      <Row className="bg-white p-15" align="middle">
        <Col span="10">
          <Select
            defaultValue="30"
            style={{ width: "150px" }}
            onChange={(value)=>getDashboardData(state,dispatch , value)}
          >
            <Option value="30">Last 30 days</Option>
            <Option value="15">Last 15 days</Option>
            <Option value="7">Last 7 days</Option>

          </Select>
          {/*<Input
            addonAfter={<IoCalendarOutline style={{ fontSize: "18px" }} />}
            defaultValue=""
            placeholder="Select date"
            style={{ width: "170px" }}
          />*/}
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
        <div className="totalNumber">{pageData ? pageData.total_video : 0}</div>
        <div className="totalCompare">{pageData ? Number(100*(pageData['30d_video']/(pageData.total_video-pageData['30d_video']))).toFixed(2) : 0}% up from Last Month</div>
          </Card>
        </Col>

        {/* Total Audios Column */}
        <Col span="6">
          <Card title="Total Audios" className="totalColumn">
          <div className="totalNumber">{pageData ? pageData.total_audio : 0}</div>
          <div className="totalCompare">{pageData ? Number(100*(pageData['30d_audio']/(pageData.total_audio-pageData['30d_audio']))).toFixed(2) : 0}% up from Last Month</div>
          </Card>
        </Col>

        {/* Data Transfer Column */}
        <Col span="6">
          <Card title="Data Transfer" className="totalColumn">
            <div className="totalNumber">NA</div>
            <div className="totalCompare">NA</div>
          </Card>
        </Col>

        {/* API Requests Column */}
        <Col span="6">
          <Card title="API Requests" className="totalColumn">
            <div className="totalNumber">NA</div>
            <div className="totalCompar">NA</div>
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
        >
          {/* chartData !== null ? 
         <LineChart width={500} height={200} data={chartData}>
          <XAxis dataKey={'date'}>        </XAxis>
          <YAxis  yAxisId="right" domain={['auto','dataMax']} orientation="right" dataKey="Hits">
          <Label value="API Requests" angle={-90}/>       </YAxis>
          <YAxis  yAxisId="left" domain={['auto','dataMax']} dataKey="Bytes_MB" >
              <Label value="Data Served in MB" angle={-90}/>
                 </YAxis>
             <Line dataKey={'Hits'} yAxisId="right" stroke="green"   ></Line>
             <Line dataKey={'Bytes_MB'} yAxisId="left" stroke="orange" ></Line>

            <Tooltip />
          </LineChart>: null */}
        </Card>
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

              { pageData !== null && pageData !== undefined ?
              pageData.recent_video.map((obj)=>{
                return <List.Item className="activityItem" key={obj.id}>
                <Text ellipsis="1" className="activityTitle">
                  {obj.title}
                </Text>
                <Text className="activityTiming">{new Date(obj.updatetime).toLocaleString()}</Text>
              </List.Item>

              }): "Recently uploaded videos List Here" }
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
              {
                pageData !== null ?
                pageData.recent_video.map((file, index) => {
                  return state.filterType === "all" ||
                    file.itemtype.includes(state.filterType) ? (
                    <Col span="6" key={"file-" + index}>
                      <VideoCard
                        videoTitle={file.title}
                        fileObject={file}
                        userId={state.userId}
                      />
                    </Col>
                  ) : (
                    <Empty style={{ marginTop: "80px" }} />
                  );
              }) :
                  <Empty style={{ marginTop: "80px" }} />
            }

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
