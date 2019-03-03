import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withTranslation } from 'react-i18next';

import { Divider, Form } from "antd";
const formItemLayout = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 }
};
const FormItem = Form.Item;

const customLabel = title => {
  return (
    <span style={{ display: "inline-block", width: 110, textAlign: "right" }}>
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

  constructor(props) {
    super(props);
    this.t = props.t;
  }

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
        <FormItem label={customLabel(this.t('keyword.os'))} {...formItemLayout}>
          {this.getSystemVersion()}
        </FormItem>
        <FormItem label={customLabel(this.t('keyword.port'))} {...formItemLayout}>
          {innerPort}
        </FormItem>
        <FormItem label={customLabel(this.t('keyword.cpu-core-count'))} {...formItemLayout}>
          {cpu}
        </FormItem>
        <FormItem label={customLabel(this.t('keyword.memory'))} {...formItemLayout}>
          {mem} M（{(mem / 1024).toFixed(2)} G）
        </FormItem>
        <FormItem label={customLabel(this.t('keyword.ttl-in-hours'))} {...formItemLayout}>
          {timeout}
        </FormItem>
        {showInnerPort && (
          <FormItem label={customLabel(this.t('keyword.internal-port'))} {...formItemLayout}>
            {innerPort}
          </FormItem>
        )}
        {showExternalPort && (
          <FormItem label={customLabel(this.t('keyword.external-port'))} {...formItemLayout}>
            {externalPort}
          </FormItem>
        )}
      </Form>
    );
  }
}

export default Form.create()(withTranslation()(SystemConfiguration));
