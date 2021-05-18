import React, { useState, useEffect, useContext } from "react";
import {  Button,  Form,  Input,  Layout,  Card,   Typography,  Row,  Col} from "antd";
import axios from "axios";
import qs from "qs";
import { url } from "./components/API";
import { CreateNewFolder } from './components/API';
import { Context } from "./context";

const Login = (props) => {

  const { Header, Footer, Content } = Layout;
  const { Title, Text } = Typography;
  const [signup, setSignup] = useState(false);
  const [commonError, setCommonError] = useState("");

  // Context
  const { state, dispatch } = useContext(Context);

  const passwordRegEx = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;

  /* const signUpPassword = (rule, value, callback) => { }; */
  const loginHeaders = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };


  const setSignedIn = (values) => {
    console.log(values);

    const loginBody = JSON.stringify({
      username: values.signupName,
      email: values.signupEmail,
      password: values.signupPassword,
      domain_name: window.location.hostname
    });

    const signupHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }

    axios
      .post(url + "/signup", loginBody, signupHeader)
      .then((signupRes) => {
        console.log('Signup Res - ', signupRes);

        loginNow({
          loginEmail: values.signupEmail,
          loginPassword: values.signupPassword
        });

      })
      .catch((err) => {
        console.log("Login Error - ", err);
        setCommonError("Account not found");

        setTimeout(() => {
          setCommonError("");
        }, 5000);
      });
  };

  const loginNow = async (values) => {

    console.log('Login Values - ', values);

    const loginBody = qs.stringify({
      email: values.loginEmail,
      password: values.loginPassword,
    });
    let  resp = await axios.post(url + "/token", loginBody, loginHeaders)
      .then((loginRes) => {
        console.log('Login Res - ', loginRes);
        // props.onSubmit({ token: loginRes.data.access_token, userId: loginRes.data.id });
        return loginRes;
      })
      .catch((err) => {
        console.log("Login Error - ", err);
        setCommonError("Account not found");

        setTimeout(() => {
          setCommonError("");
        }, 5000);
      });

      if(resp!== undefined && resp.status === 200){
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: resp.data.access_token ? resp.data.access_token : null,
            userId: resp.data.id ? resp.data.id : null,
            page: 'videos'
          }
        });
        localStorage.setItem("userId",resp.data.id ? resp.data.id : null);
        localStorage.setItem("token",resp.data.access_token ? resp.data.access_token : null)
        dispatch({type:"FOLDER_NAME",payload:{ folderName : "" }});
        window.location.reload(false);
      }
  }

  useEffect(() => {
    console.log('login page context - ', state);
  })

  if (signup) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eeeeee",
          }}
        >
          <Row>
            <Title level={3}>Signup</Title>
          </Row>
          <Card style={{ width: 400 }}>
            <Form
              name="basic"
              initialValues={{ signupName: '', signupEmail: '', signupPassword: '' }}
              onFinish={setSignedIn}
              layout="vertical"
            >
              <Form.Item
                label="Name"
                name="signupName"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="signupEmail"
                rules={[
                  {
                    required: true,
                    message: "Please enter correct email!",
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="signupPassword"
                rules={[
                  {
                    required: true,
                    message: 'Channel ID is required',
                  }, {
                    pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: 'Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ',
                  }
                ]}
              >
                <Input.Password name="signupPassword" id="signupPassword" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Signup
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Row align="middle" style={{ marginTop: "20px" }}>
            <Col>
              <Title level={5}>
                Already have an account{" "}
                <Button type="link" onClick={() => setSignup(false)}>
                  Login Now
                </Button>
              </Title>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  } else {
    return (

      <Layout style={{ minHeight: "100vh" }}>
        <Content
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#eeeeee",
          }}
        >
          <Row>
            <Title level={3}>Login</Title>
          </Row>
          <div style={{ width: "460px" }}>
            <Card>
              {commonError ? (
                <Row justify="center">
                  <Text type="danger" strong>
                    {commonError}
                  </Text>
                </Row>
              ) : null}
              <Form
                name="basic"
                initialValues={{
                  loginEmail: "",
                  loginPassword: "",
                }}
                onFinish={loginNow}
                layout="vertical"
              >
                <Form.Item
                  label="Email"
                  name="loginEmail"
                  rules={[
                    {
                      type: "email",
                      required: true,
                      message: "Please enter your email!",
                    },
                  ]}
                >
                  <Input
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="loginPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                {/* <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item> */}
                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>{" "}
          <Row align="middle" style={{ marginTop: "20px" }}>
            { window.location.hostname === "portal.meander.video"
            || window.location.hostname.includes("localhost") ?
              <Col>
              <Title level={5}>
                Don't have an account{" "}
                <Button type="link" onClick={() => setSignup(true)}>
                  Create Account Now
                </Button>
              </Title>
            </Col> : null }
          </Row>
        </Content>
      </Layout>
    );
  }
};

export default Login;
