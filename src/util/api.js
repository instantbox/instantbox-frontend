import axios from "axios";
import { getBaseUrl } from "./util";
// 开发环境
if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://34.80.61.20:9010/";

  // 生产环境
} else if (process.env.NODE_ENV === "production") {
  // axios.defaults.baseURL = "http://60.190.81.133:9010/";
  axios.defaults.baseURL = getBaseUrl();
}

// 请求拦截
axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

// 响应拦截
axios.interceptors.response.use(
  function(res) {
    const data = res.data;
    return data;
    // 加上 message
    if (data.statusCode === 1) {
      return data;
    } else {
      throw Error(data.message);
    }
  },
  function(err) {
    return Promise.reject(err);
  }
);

/**
 * 使 this.setState() 在异步请求中可以取消调用：https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * @param {promise} promise 请求对象
 */
export const makeCancelable = promise => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      val => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      error => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    }
  };
};
const apiVersion = "/v2/superinspire";
// 请求列表
const requestUrlList = {
  getOSList: `${apiVersion}/getOSList`,
  getOS: `${apiVersion}/getOS`,
  rmOS: `${apiVersion}/rmOS`
};

/**
 * 获取容器列表
 */
export const getOSList = () => {
  return makeCancelable(axios.get(requestUrlList.getOSList));
};

/**
 * 获取容器跳转的地址
 */
export const getOSUrl = (osCode, timeout, cpu = 1, mem = 0.5, port = 80) => {
  return makeCancelable(
    axios.get(requestUrlList.getOS, {
      params: {
        os: osCode,
        timeout,
        cpu,
        mem,
        port
      }
    })
  );
};

/**
 * 移除容器
 */
export const removeContainerById = (
  containerId,
  shareUrl,
  timestamp = Math.floor(new Date().getTime() / 1000)
) => {
  return makeCancelable(
    axios.get(requestUrlList.rmOS, {
      params: {
        containerId,
        shareUrl,
        timestamp
      }
    })
  );
};
