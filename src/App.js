import React, { Component } from "react";
import "./App.scss";
import Typed from "typed.js";
import { getOSList, getOSUrl, removeContainerById } from "./util/api";
import LoadingScreen from "react-loading-screen";

import { getItem, setItem, rmItem } from "./util/util";
import { Button, Tooltip, Divider, Card, Modal } from "antd";
import SelectSystemConfig from "./components/SelectSystemConfig";
import SystemConfiguration from "./components/SystemConfiguration";

class App extends Component {
  constructor(props) {
    super(props);
    const { isExistContainer, container } = this.isExistContainer();

    this.state = {
      open: false,
      osList: [],
      selectedVersion: {},
      selectedOS: {},
      timeout: 24,
      cpu: 1,
      memory: 512,
      port: 80,
      container,
      isExistContainer,
      screenLoading: false,
      externalPort: 0, // 外部端口（后端返回的端口号）
      port: 0, // 内部端口（填写表单填写的端口号）
      skipModalVisible: false
    };
  }

  componentDidMount = () => {
    this.getOSList();
    this.subscribeEvent();

    this.typed = new Typed(".app__desc-content", {
      strings: [
        `Want to experiment with something on a Linux distribution? Let's start!`
      ],
      typeSpeed: 50
    });
  };

  componentWillUnmount = () => {};

  isExistContainer = () => {
    let containerInfo = getItem("containerInfo");
    if (!containerInfo) {
      return { isExistContainer: false, container: {} };
    }
    containerInfo = JSON.parse(containerInfo);
    const curTime = Math.floor(new Date().getTime() / 1000);
    // 未过期
    if (curTime < containerInfo.timeout) {
      return { isExistContainer: true, container: containerInfo };
    }
  };

  subscribeEvent = () => {};

  getOSList = async () => {
    this.p1 = getOSList();
    let res;
    try {
      res = await this.p1.promise;
    } catch (err) {
      return console.error(err);
    }
    const osList = res;
    if (osList.length) {
      osList[0].selected = true;
    }
    this.setState({ osList });
  };

  handleStartClick = () => {};

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOSSelect = selectedOS => {
    const osList = [...this.state.osList];

    const i = osList.findIndex(os => selectedOS.label === os.label);

    osList.forEach((os, j) => {
      if (i === j) {
        os.selected = false;
      }
      os.selected = i === j;
    });
    this.setState({ osList });
  };

  handleOSVersionSelect = (selectedOS, selectedVersion) => {
    this.setState({
      open: true,
      selectedOS,
      selectedVersion
    });
  };

  handleSelectAgain = async () => {
    this.setState({ screenLoading: true, screenText: "删除中..." });
    const { container } = this.state;
    const timestamp = Math.floor(new Date().getTime() / 1000);
    this.p3 = removeContainerById(
      container.containerId,
      container.shareUrl,
      timestamp
    );
    let res;
    try {
      res = await this.p3.promise;
    } catch (err) {
      return console.error(err);
    }
    if (res.statusCode !== 1) {
      this.setState({ screenLoading: false });
      return console.error(res.message);
    }
    this.setState({
      isExistContainer: false,
      container: {},
      screenLoading: false
    });
    rmItem("containerInfo");
  };

  handleOkCallback = () => {
    const { isExistContainer, container } = this.isExistContainer();
    this.setState({ isExistContainer, container, skipModalVisible: true });
  };

  render() {
    const {
      isExistContainer,
      screenLoading,
      screenText,
      externalPort,
      port,
      container
    } = this.state;
    return (
      <LoadingScreen
        loading={screenLoading}
        bgColor="#d0d0d0"
        spinnerColor="#252525"
        textColor="#676767"
        text={screenText}
      >
        <div className="app">
          <h1 className="app__title">
            <span className="app__title-span">
              Super Inspire
              {/* <span className="app__title-icon" /> */}
            </span>
          </h1>
          <div className="app__desc">
            <div className="app__text-editor-wrap">
              <div className="app__title-bar">
                Arch
                Linux/Debian/CentOS/Defora/Ubuntu/Ubuntu衍生版/Deepin/LineageOS/openSUSE
              </div>
              <div className="app__text-body">
                <span style={{ marginRight: 10 }}>$</span>
                <span className="app__desc-content" />
              </div>
            </div>
          </div>

          <Divider style={{ marginTop: 100 }}>
            {isExistContainer ? "您已创建系统" : "选择系统配置"}
          </Divider>

          {isExistContainer && (
            <Card>
              <div className="app__ports">
                <SystemConfiguration
                  showInnerPort
                  showExternalPort
                  system={container.system}
                  version={container.version}
                  cpu={container.cpu}
                  mem={container.mem}
                  timeout={container.timeoutH}
                  innerPort={container.innerPort}
                  externalPort={container.externalPort}
                />
              </div>
            </Card>
          )}

          <div className="app__os-list">
            {isExistContainer ? (
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Tooltip title="若打开的页面报错，请重新点击">
                  <Button
                    size="large"
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      const containerInfo = JSON.parse(
                        getItem("containerInfo")
                      );
                      window.open(containerInfo.shareUrl);
                    }}
                    style={{ margin: 10 }}
                  >
                    打开已创建的系统
                  </Button>
                </Tooltip>

                <Button
                  size="large"
                  color="secondary"
                  variant="outlined"
                  onClick={this.handleSelectAgain}
                  style={{ margin: 10 }}
                >
                  重新选择
                </Button>
              </div>
            ) : (
              <SelectSystemConfig okCallback={this.handleOkCallback} />
            )}
          </div>
        </div>
        <Modal
          title="提示"
          visible={this.state.skipModalVisible}
          onOk={() => {
            window.open(this.state.container.shareUrl);
            this.setState({ skipModalVisible: false });
          }}
          okText="确定"
          cancelText="取消"
          onCancel={() => this.setState({ skipModalVisible: false })}
        >
          <p>系统已创建，是否跳转到系统页面？</p>
        </Modal>
      </LoadingScreen>
    );
  }
}

export default App;
