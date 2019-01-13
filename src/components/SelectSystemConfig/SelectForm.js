import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "./SelectSystemConfig.scss";
import classNames from "classnames";
import {
  Spin,
  Steps,
  Divider,
  message,
  Card,
  Select,
  Button,
  Input,
  Form
} from "antd";
import { makeCancelable, getOSList } from "../../util/api";

const Step = Steps.Step;
const { Meta } = Card;
const Option = Select.Option;
const FormItem = Form.Item;

const rules = {
  port: [
    {
      required: true,
      message: "请输入端口号"
    },
    {
      validator: (rule, value, callback) => {
        if (
          (/^\d+$/g.test(value) && value >= 1 && value <= 65535) ||
          value === ""
        ) {
          return callback();
        }
        callback("端口号格式或范围有误");
      },
      message: "端口号范围： 1 ~ 65535"
    }
  ],
  cpu: [
    {
      required: true,
      message: "请输入 CPU 核数"
    },
    {
      validator: (rule, value, callback) => {
        if (
          (/^\d+$/g.test(value) && value >= 1 && value <= 4) ||
          value === ""
        ) {
          return callback();
        }
        callback("CPU 格式或范围有误");
      },
      message: "CPU 范围：1 ~ 4"
    }
  ],
  mem: [
    {
      required: true,
      message: "请输入空间大小"
    },
    {
      validator: (rule, value, callback) => {
        if (
          (/^\d+$/g.test(value) && value >= 1 && value <= 3584) ||
          value === ""
        ) {
          return callback();
        }
        callback("空间大小格式或范围有误");
      },
      message: "空间大小范围：1 ~ 3584"
    }
  ],
  timeout: [
    {
      required: true,
      message: "请输入使用时长"
    },
    {
      validator: (rule, value, callback) => {
        if (
          (/^\d+$/g.test(value) && value >= 1 && value <= 24) ||
          value === ""
        ) {
          return callback();
        }
        callback("使用时长格式或范围有误");
      },
      message: "使用时长范围：1 ~ 24"
    }
  ]
};

/**
 * 填写系统性能参数的表单
 */
export class SelectForm extends React.Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    this.props.getForm && this.props.getForm(this.props.form);
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 }
    };
    return (
      <Form layout="horizontal">
        <FormItem label="端口号" {...formItemLayout}>
          {getFieldDecorator("port", {
            initialValue: "80",
            rules: rules.port
          })(<Input style={{ width: 200 }} placeholder="如：80" />)}
        </FormItem>
        <FormItem label="CPU 核数" {...formItemLayout}>
          {getFieldDecorator("cpu", {
            initialValue: "1",
            rules: rules.cpu
          })(<Input style={{ width: 200 }} placeholder="如：1" />)}
        </FormItem>
        <FormItem label="空间大小（M）" {...formItemLayout}>
          {getFieldDecorator("mem", {
            initialValue: "512",
            rules: rules.mem
          })(<Input style={{ width: 200 }} placeholder="如：512" />)}
        </FormItem>
        <FormItem label="使用时长（h）" {...formItemLayout}>
          {getFieldDecorator("timeout", {
            initialValue: "24",
            rules: rules.timeout
          })(<Input style={{ width: 200 }} placeholder="如：24" />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(SelectForm);
