import axios from "axios";
import { getBaseUrl } from "./util";

axios.defaults.baseURL = getBaseUrl();

axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  function(res) {
    const data = res.data;
    return data;
    //// Return error message
    // if (data.statusCode === 1) {
    //   return data;
    // } else {
    //   throw Error(data.message);
    // }
  },
  function(err) {
    return Promise.reject(err);
  }
);

/**
 * Allow requests to be cancelled
 * Reference: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 * @param {promise} promise Request
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

/*
 * Available API endpoints
 */
const apiVersion = "/v2/superinspire";
const requestUrlList = {
  getOSList: `${apiVersion}/getOSList`,
  getOS: `${apiVersion}/getOS`,
  rmOS: `${apiVersion}/rmOS`
};

/**
 * Fetch OS list
 */
export const getOSList = () => {
  return makeCancelable(axios.get(requestUrlList.getOSList));
};

/**
 * Create container
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
 * Remove container
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
