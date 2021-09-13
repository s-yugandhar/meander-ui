import React, { useState, useEffect, useContext } from "react";
import { Button, Form, Input, Layout, Card, Typography, Row, Col } from "antd";
import axios from "axios";
import qs from "qs";
import { url } from "./components/API";
import { CreateNewFolder } from "./components/API";
import { Context } from "./context";

import brandLogoImg from "./assets/images/Meander_Logo.svg";

const Login = (props) => {
  const { Header, Footer, Content } = Layout;
  const { Title, Text } = Typography;
  const [signup, setSignup] = useState(false);
  const [commonError, setCommonError] = useState("");
  const [inviteLink, setInviteLink] = useState(false);
  const [action, setAction] = useState(false);

  // Context
  const { state, dispatch } = useContext(Context);

  const passwordRegEx =
    /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/;

  /* const signUpPassword = (rule, value, callback) => { }; */
  const loginHeaders = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  };

  const urlSearchParams = new URLSearchParams(window.location.search);
  const setPasswordReq = (values) => {
    console.log(values);
    const loginBody = JSON.stringify({
      otp: values.otp,
      email: values.email,
      password: values.password,
      repassword: values.repassword,
      token: urlSearchParams.get("token"),
    });

    const signupHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    axios
      .post(url + "/setpassword", loginBody, signupHeader)
      .then((signupRes) => {
        console.log("Signup Res - ", signupRes);
        setCommonError(signupRes.data);
      })
      .catch((err) => {
        console.log("Login Error - ", err);
        setTimeout(() => {}, 5000);
      });
  };

  const setSignedIn = (values) => {
    console.log(values);

    const loginBody = JSON.stringify({
      username: values.signupName,
      email: values.signupEmail,
      password: values.signupPassword,
      domain_name: window.location.hostname,
    });

    const signupHeader = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    axios
      .post(url + "/signup", loginBody, signupHeader)
      .then((signupRes) => {
        console.log("Signup Res - ", signupRes);

        loginNow({
          loginEmail: values.signupEmail,
          loginPassword: values.signupPassword,
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
    console.log("Login Values - ", values);

    const loginBody = qs.stringify({
      email: values.loginEmail,
      password: values.loginPassword,
    });
    let resp = await axios
      .post(url + "/token", loginBody, loginHeaders)
      .then((loginRes) => {
        console.log("Login Res - ", loginRes);
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

    if (resp !== undefined && resp.status === 200) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          token: resp.data.access_token ? resp.data.access_token : null,
          userId: resp.data.id ? resp.data.id : null,
          page: "p-dashboard",
        },
      });
      localStorage.setItem("userId", resp.data.id ? resp.data.id : null);
      localStorage.setItem(
        "token",
        resp.data.access_token ? resp.data.access_token : null
      );
      dispatch({ type: "FOLDER_NAME", payload: { folderName: "" } });
      //window.location.reload(false);
    }
  };

  useEffect(() => {
    //console.log('login page context - ', state);
    const pathname = window.location.pathname;
    console.log(pathname);
    setAction(false);
    if (pathname.includes("email_link")) {
      const temp = urlSearchParams.get("action");
      setAction(temp);
      if (temp === "forgot" || temp === "signup") {
        setInviteLink(pathname);
      }
      if (temp === "invite" || temp === "verifyemail") {
        setInviteLink(pathname);
        setPasswordReq({
          otp: 123456,
          email: "email@email.com",
          password: "password",
          repassword: "password",
        });
      }
    }
  }, []);

  if (inviteLink) {
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
          <h3>
            {"Email Actions Page for signup,forgot,invite or verifyemail"}
          </h3>
          <br />
          <h3>
            {"Please wait until you see a message or a form in this page"}
          </h3>
          <br />

          <h3>{commonError}</h3>
          <div style={{ width: "460px" }}>
            {action === "forgot" || action === "signup" ? (
              <Form
                name="basic"
                initialValues={{
                  email: "",
                  password: "",
                  repassword: "",
                  otp: "",
                }}
                onFinish={setPasswordReq}
                layout="vertical"
              >
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
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Enter Otp"
                  name="otp"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your 6-digit otp",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                    {
                      pattern:
                        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                      message:
                        "Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  label="Re-enter Password"
                  name="repassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                    {
                      pattern:
                        /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                      message:
                        "Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ paddingLeft: "25px", paddingRight: "25px" }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            ) : (
              <p>{""}</p>
            )}
          </div>
        </Content>
      </Layout>
    );
  } else if (signup && inviteLink === false) {
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
          <div style={{ width: "460px" }}>
            <Row style={{ backgroundColor: "var(--secondary)" }}>
              <Col span="12" className="meander-logo">
                <img src={brandLogoImg} alt="Meander" />
              </Col>
              <Col span="12" className="loginSignupTitle">
                <Title level={3}>Signup</Title>
              </Col>
            </Row>
            <Row>
              <Card style={{ width: "100%" }}>
                <Form
                  name="basic"
                  initialValues={{
                    signupName: "",
                    signupEmail: "",
                    signupPassword: "",
                  }}
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
                        message: "password is required",
                      },
                      {
                        pattern:
                          /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                        message:
                          "Please enter minimum 8 letter password, with at least a symbol, upper and lower case letters and a number ",
                      },
                    ]}
                  >
                    <Input.Password name="signupPassword" id="signupPassword" />
                  </Form.Item>

                  <Form.Item style={{textAlign: "center"}}>
                    <Button type="primary" htmlType="submit" size="large">
                      Signup
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Row>
            <Row align="middle" style={{ marginTop: "20px" }}>
              <Col span="24">
                <Title level={5} style={{width: "100%", textAlign: "center"}}>
                  Already have an account{" "}
                  <Button type="link" onClick={() => setSignup(false)}>
                    Login Now
                  </Button>
                </Title>
              </Col>
            </Row>
          </div>
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
          <div style={{ width: "460px" }}>
            <Row style={{ backgroundColor: "var(--secondary)" }}>
              <Col span="12" className="meander-logo">
                <img src={brandLogoImg} alt="Meander" />
              </Col>
              <Col span="12" className="loginSignupTitle">
                <Title level={3}>Login</Title>
              </Col>
            </Row>
            <Row style={{ width: "100%" }}>
              <Card style={{ width: "100%" }}>
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
                    <Input />
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
            </Row>
          </div>{" "}
          <Row align="middle" style={{ marginTop: "20px" }}>
            {window.location.hostname === "portal.meander.video" ||
            window.location.hostname.includes("localhost") ? (
              <Col>
                <Title level={5}>
                  Don't have an account{" "}
                  <Button type="link" onClick={() => setSignup(true)}>
                    Create Account Now
                  </Button>
                </Title>
              </Col>
            ) : null}
          </Row>
        </Content>
      </Layout>
    );
  }
};

export default Login;
