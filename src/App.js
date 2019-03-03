import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import "./App.scss";
import Typed from "typed.js";
import { getOSList, removeContainerById } from "./util/api";
import LoadingScreen from "react-loading-screen";

import { getItem, rmItem } from "./util/util";
import { Button, Tooltip, Divider, Card, Modal } from "antd";
import SelectSystemConfig from "./components/SelectSystemConfig";
import SystemConfiguration from "./components/SystemConfiguration";
import LanguageSwitcher from "./components/LanguageSwitcher";

class App extends Component {
  constructor(props) {
    super(props);
    this.t = props.t;

    const { isExistContainer, container } = this.isExistContainer();

    this.state = {
      open: false,
      osList: [],
      selectedVersion: {},
      selectedOS: {},
      timeout: 24,
      cpu: 1,
      memory: 512,
      port: 80, // Internal port (entered by user)
      externalPort: 0, // External port (assigned by api)
      container,
      isExistContainer,
      screenLoading: false,
      skipModalVisible: false
    };
  }

  componentDidMount = () => {
    this.getOSList();
    this.subscribeEvent();

    if (document.getElementsByClassName('app__desc-content').length > 0) {
      this.typed = new Typed(".app__desc-content", {
        strings: [
          this.t('site.typed')
        ],
        typeSpeed: 50
      });
    }
  };

  componentWillUnmount = () => {};

  isExistContainer = () => {
    let containerInfo = getItem("containerInfo");
    if (containerInfo) {
      containerInfo = JSON.parse(containerInfo);
      const curTime = Math.floor(new Date().getTime() / 1000);
      // Check if it's still valid
      if (curTime < containerInfo.timeout) {
        return { isExistContainer: true, container: containerInfo };
      } else {
        rmItem("containerInfo");
      }
    }
    return { isExistContainer: false, container: {} }; 
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
    this.setState({ screenLoading: true, screenText: this.t('prompt.purging') });
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
              {this.t('site.heading')}
            </span>
          </h1>
          <div className="app__desc">
            <div className="app__text-editor-wrap">
              <div className="app__title-bar">
                {this.state.osList.map(os => os.label).join(' / ') || this.t('site.heading')}
              </div>
              <div className="app__text-body">
                <span style={{ marginRight: 10 }}>$</span>
                <span className="app__desc-content" />
              </div>
            </div>
          </div>
          <LanguageSwitcher className="app__lang-switcher" i18n={this.props.i18n} />

          <Divider style={{ marginTop: 100 }}>
            {isExistContainer ? this.t('prompt.created-os') : this.t('prompt.select-os')}
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
                <Tooltip title={this.t('sentence.open-webshell-try-again')}>
                  <Button
                    size="large"
                    color="primary"
                    variant="outlined"
                    onClick={() => {
                      const containerInfo = JSON.parse(
                        getItem("containerInfo")
                      );
                      window.open(containerInfo.shareUrl.replace('http://:', `http://${window.location.hostname}:`));
                    }}
                    style={{ margin: 10 }}
                  >
                    {this.t('prompt.open-os')}
                  </Button>
                </Tooltip>

                <Button
                  size="large"
                  type="danger"
                  color="secondary"
                  variant="outlined"
                  onClick={this.handleSelectAgain}
                  style={{ margin: 10 }}
                >
                  {this.t('prompt.purge-os')}
                </Button>
              </div>
            ) : (
              <SelectSystemConfig osList={this.state.osList} okCallback={this.handleOkCallback} />
            )}
          </div>
        </div>
        <Modal
          title={this.t('keyword.notice')}
          visible={this.state.skipModalVisible}
          onOk={() => {
            window.open(this.state.container.shareUrl.replace('http://:', `http://${window.location.hostname}:`));
            this.setState({ skipModalVisible: false });
          }}
          okText={this.t('keyword.ok')}
          cancelText={this.t('keyword.cancel')}
          onCancel={() => this.setState({ skipModalVisible: false })}
        >
          <p>{this.t('sentence.open-webshell')}</p>
        </Modal>
      </LoadingScreen>
    );
  }
}

export default withTranslation()(App);
