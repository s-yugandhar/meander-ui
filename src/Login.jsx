import React, { useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Card,
  Checkbox,
  Divider,
  Typography,
  Row,
  Col,
} from "antd";
import axios from "axios";
import qs from "qs";

import { url } from "../src/components/API";

const Login = (props) => {
  const { Header, Footer, Content } = Layout;
  const { Title, Text } = Typography;
  const [signup, setSignup] = useState(false);
  const [commonError, setCommonError] = useState("");

  const phoneRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const signUpPassword = (rule, value, callback) => {};

  const setSignedIn = (values) => {
    console.log(values);

    const loginHeaders = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    };

    const loginBody = qs.stringify({
      email: values.email,
      password: values.password,
    });

    props.onSubmit({ token: "sadf233ddws" });

    /* axios
      .post(url + "/token", loginBody, loginHeaders)
      .then((loginRes) => {
        console.log(loginRes);
        localStorage.setItem("token", loginRes.data.access_token);
        props.onSubmit({ token: loginRes.data.access_token });
      })
      .catch((err) => {
        console.log("Login Error - ", err);
        setCommonError("Account not found");

        setTimeout(() => {
          setCommonError("");
        }, 5000);
      }); */
  };

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
              initialValues={{ remember: true }}
              onFinish={setSignedIn}
              layout="vertical"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your email!" },
                ]}
              >
                <Input value="abcd@abcd.com" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please enter your email!",
                  },
                ]}
              >
                <Input value="" name="signupEmail" id="signupEmail" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    validator: signUpPassword,
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              >
                <Input
                  type="password"
                  name="signupPassword"
                  id="signupPassword"
                />
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
                  loginEmail: "abcd@abcd.com",
                  loginPassword: "asdfASDF@#343",
                }}
                onFinish={setSignedIn}
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
                    type="email"
                    value=""
                    name="loginEmail"
                    id="loginEmail"
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
                  <Input
                    type="password"
                    value=""
                    name="loginPassword"
                    id="loginPassword"
                  />
                </Form.Item>

                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
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
            <Col>
              <Title level={5}>
                Don't have an account{" "}
                <Button type="link" onClick={() => setSignup(true)}>
                  Create Account Now
                </Button>
              </Title>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
};

export default Login;
