import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./SystemConfiguration.scss";

import { Divider, Form } from "antd";
const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};
const FormItem = Form.Item;

const customLabel = title => {
  return (
    <span style={{ display: "inline-block", width: 80, textAlign: "left" }}>
      {title}
    </span>
  );
};

/**
 * Show current system configuration
 */
class SystemConfiguration extends React.Component {
  static propTypes = {
    /**
     * OS name
     */
    system: PropTypes.string,

    /**
     * OS version
     */
    version: PropTypes.string,

    /**
     * CPU
     */
    cpu: PropTypes.string,

    /**
     * Memory
     */
    mem: PropTypes.string,

    /**
     * Time-to-live
     */
    timeout: PropTypes.any,

    /**
     * Port exposed inside container
     */
    innerPort: PropTypes.string,

    /**
     * Port that is publically accessible
     */
    externalPort: PropTypes.any,

    /**
     * Should show innerPort
     * Default: false
     */
    showInnerPort: PropTypes.bool,

    /**
     * Should show external port
     * Default: false
     */
    showExternalPort: PropTypes.bool
  };

  static defaultProps = {
    showInnerPort: false,
    showExternalPort: false
  };

  getSystemVersion = () => {
    const { system, version } = this.props;
    return (
      <Fragment>
        {system}
        <Divider type="vertical" />
        {version}
      </Fragment>
    );
  };

  render() {
    const {
      cpu,
      mem,
      timeout,
      showInnerPort,
      showExternalPort,
      innerPort,
      externalPort
    } = this.props;
    
    return (
      <Form>
        <FormItem label={customLabel("系统")} {...formItemLayout}>
          {this.getSystemVersion()}
        </FormItem>
        <FormItem label={customLabel("端口号")} {...formItemLayout}>
          {innerPort}
        </FormItem>
        <FormItem label={customLabel("CPU 核数")} {...formItemLayout}>
          {cpu} 核
        </FormItem>
        <FormItem label={customLabel("空间大小")} {...formItemLayout}>
          {mem} M（{(mem / 1024).toFixed(2)} G）
        </FormItem>
        <FormItem label={customLabel("使用时长")} {...formItemLayout}>
          {timeout} 小时
        </FormItem>
        {showInnerPort && (
          <FormItem label={customLabel("内部端口号")} {...formItemLayout}>
            {innerPort}
          </FormItem>
        )}

        {showExternalPort && (
          <FormItem label={customLabel("外部端口号")} {...formItemLayout}>
            {externalPort}
          </FormItem>
        )}
      </Form>
    );
  }
}

export default Form.create()(SystemConfiguration);
