import React, { Fragment } from "react";
import classNames from "classnames";
import { withTranslation } from 'react-i18next';

import "./SelectSystemConfig.scss";

import {
  Spin,
  Steps,
  Divider,
  message,
  Card,
  Select,
  Button,
  Modal
} from "antd";
import { getOSUrl } from "../../util/api";
import { getItem, setItem } from "../../util/util";
import SelectForm from "./SelectForm";
import SystemConfiguration from "../SystemConfiguration";

const Step = Steps.Step;
const Option = Select.Option;

/**
 * Select system configuration
 */
class SelectSystemConfig extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.t = props.t;

    const currentStep = this.getCurrentStep();
    const { isExistContainer, container } = this.isExistContainer();

    this.state = {
      okLoading: false,
      currentStep,
      osCode: null,
      selectsObj: [],
      port: "80",
      modalVisible: false,
      isExistContainer,
      container,
      skipModalVisible: false
    };
  }

  getCurrentStep = () => {
    return 0;
  };

  isExistContainer = () => {
    let containerInfo = getItem("containerInfo");
    if (!containerInfo) {
      return { isExistContainer: false, container: {} };
    }
    containerInfo = JSON.parse(containerInfo);
    const curTime = Math.floor(new Date().getTime() / 1000);
    // Not expired
    if (curTime < containerInfo.timeout) {
      return { isExistContainer: true, container: containerInfo };
    }
  };

  handleSelectChange = (value, index) => {
    const selectsObj = [];
    const obj = {
      index,
      osCode: value
    };
    selectsObj[index] = obj;
    this.setState({ selectsObj });
  };

  handleNextStep = () => {
    const { currentStep, selectsObj, port } = this.state;
    if (currentStep === 0) {
      if (!selectsObj.length) {
        return message.error(this.t('sentence.err-empty-os'));
      }
    }
    if (currentStep === 1) {
      const result = !/\d./.test(port);

      if (!port || result) {
        return message.error(this.t('sentence.err-port'));
      }
    }
    this.setState({ currentStep: this.state.currentStep + 1 });
  };

  handlePreStep = () => {
    this.setState({ currentStep: this.state.currentStep - 1 });
  };

  handlePortChange = event => {
    const value = event.target.value;
    this.setState({ port: value });
  };

  handleGetForm = form => {
    this._form = form;
  };
  _values = {};
  handleCreate = () => {
    const { validateFields } = this._form;
    validateFields(async (err, values) => {
      if (err) {
        return message.error(this.t('sentence.err-resources'));
      }
      this.setState({ modalVisible: true });
      this._values = values;
    });
  };

  handleOk = async () => {
    this.setState({ okLoading: true });
    const { selectsObj } = this.state;
    const osCode = selectsObj.filter(item => item)[0].osCode;
    const { timeout, cpu, mem, port } = this._values;
    const t = Math.floor(new Date().getTime() / 1000) + timeout * 60 * 60;
    this.p2 = getOSUrl(osCode, t, cpu, mem, port);
    if (timeout || cpu || mem || port) {
      let res;
      try {
        res = await this.p2.promise;
      } catch (err) {
        return console.error(err);
      }
      if (res.shareUrl && res.containerId && res.statusCode && res.openPort) {
        this.setState({
          open: false,
          container: res,
          isExistContainer: true,
          modalVisible: false,
          skipModalVisible: true
        });

        const { system, version } = this.getSystemVersion();

        setItem(
          "containerInfo",
          JSON.stringify({
            system,
            version: version,
            port,
            cpu,
            mem,
            timeout: t,
            timeoutH: timeout,
            innerPort: port,
            externalPort: res.openPort,
            shareUrl: res.shareUrl,
            containerId: res.containerId
          })
        );
        this.props.okCallback(true, {
          shareUrl: res.shareUrl,
          timeout: t,
          containerId: res.containerId
        });
        this._shareUrl = res.shareUrl;
      } else {
        this.setState({ okLoading: false });
        message.error(this.t('sentence.err-creation'));
      }
    }
  };

  generateStepsContent = () => {
    return [
      {
        title: this.t('keyword.os'),
        desc: this.t('prompt.choose-os'),
        content: (
          <Fragment>
            {this.props.osList.map((item, index) => {
              const { selectsObj } = this.state;
              let osCode;
              if (selectsObj[index]) {
                osCode = selectsObj[index].osCode;
              }
              const classes = classNames({
                isSelect: !!selectsObj[index]
              });
              return (
                <Card key={item.label} style={{ width: 200, margin: "10px 25px" }}>
                  <div style={{ textAlign: "center" }}>{item.label}</div>
                  <img
                    style={{
                      display: "block",
                      width: 120,
                      height: 120,
                      margin: "0 auto"
                    }}
                    className={classes}
                    src={item.logoUrl}
                    alt={item.label}
                  />
                  <Select
                    value={osCode}
                    onChange={value => this.handleSelectChange(value, index)}
                    style={{ width: 182, marginTop: 10 }}
                    placeholder={this.t('prompt.choose-os-version')}
                  >
                    {item.subList.map(subItem => (
                      <Option key={subItem.label} value={subItem.osCode}>
                        {subItem.label}
                      </Option>
                    ))}
                  </Select>
                </Card>
              );
            })}
          </Fragment>
        )
      },
      {
        title: this.t('keyword.resources'),
        desc: this.t('prompt.choose-resources'),
        content: <SelectForm getForm={this.handleGetForm} />
      }
    ];
  };

  getSystemVersion = () => {
    const { selectsObj } = this.state;
    const { osList } = this.props;
    if (!selectsObj.length || !osList.length) {
      return { system: "", version: "" };
    }
    const selectObj = selectsObj.filter(item => item)[0];

    const subList = osList[selectObj.index].subList;
    const systemName = osList[selectObj.index].label;
    const systemVersion = subList.find(
      item => item.osCode === selectObj.osCode
    );
    return { system: systemName, version: systemVersion.label };
  };

  render() {
    const {
      okLoading,
      currentStep,
    } = this.state;
    const { osList } = this.props;
    const { system, version } = this.getSystemVersion();
    const steps = this.generateStepsContent();
    return (
      <Spin spinning={osList.length === 0}>
        <div className="select-system-config">
          <div>
            <Steps current={currentStep}>
              {steps.map(step => (
                <Step
                  key={step.title}
                  title={step.title}
                  description={step.desc}
                />
              ))}
            </Steps>
          </div>

          <Divider />

          <div className="select-system-config__step-content">
            {steps[currentStep].content}
          </div>
          <div
            className="
            select-system-config__steps-action"
          >
            <Button
              type="primary"
              disabled={currentStep === 0}
              onClick={this.handleCreate}
            >
              {this.t('keyword.create')}
            </Button>
            <Button disabled={currentStep === 1} onClick={this.handleNextStep}>
              {this.t('keyword.next')}
            </Button>

            <Button disabled={currentStep === 0} onClick={this.handlePreStep}>
              {this.t('keyword.back')}
            </Button>
          </div>
        </div>
        <Modal
          title={this.t('prompt.selected-os-resources')}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={() => this.setState({ modalVisible: false })}
          okText={this.t('keyword.confirm')}
          cancelText={this.t('keyword.cancel')}
        >
          <Spin spinning={okLoading}>
            <SystemConfiguration
              system={system}
              version={version}
              innerPort={this._values.port}
              cpu={this._values.cpu}
              mem={this._values.mem}
              timeout={this._values.timeout}
            />
          </Spin>
        </Modal>
      </Spin>
    );
  }
}

export default withTranslation()(SelectSystemConfig);
