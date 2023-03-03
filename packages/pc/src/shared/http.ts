import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import * as api from "../../httpApi.config";
import { ElMessage } from "element-plus";
import { getToken } from "@/shared/util";
import router from "@/router";

export const apiconfig = api;

const http: AxiosInstance = axios.create({
  timeout: 10000,
});

interface ResponseData<T = any> {
  code: string | number;
  logUUID: string;
  data: T;
  msg: string;
}

http.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    if (response.data.code !== 0) {
      if ([403, 404, 405].includes(response.data.code)) {
        router.push({
          path: "/login",
        });
      }
      ElMessage({
        message: response.data.msg,
        type: "error",
      });
      return Promise.reject(response.data.msg);
    }
    return response;
  },
  (error) => {
    if ([403, 404, 405].includes(error.response.data.code)) {
      ElMessage({
        message: error.response.data.msg,
        type: "error",
      });
      router.push({
        path: "/login",
      });
      return;
    }
    ElMessage({
      message: "网络错误",
      type: "error",
    });
    return Promise.reject(error);
  }
);

export async function get<T>(
  url: string,
  params?: {
    [index: string]: any;
  },
  data?: {
    [index: string]: any;
  }
): Promise<T> {
  const responseData = await http.get<ResponseData<T>>(
    url.startsWith("/") ? url : `${api.proxyPath}${api.apiPath}/${url}`,
    {
      params,
      data,
      headers: {
        Authorization: getToken(),
        userFrom: "admin",
      },
    }
  );
  return responseData.data.data;
}

export async function post<T>(
  url: string,
  data = {},
  params?: {
    [index: string]: any;
  }
): Promise<T> {
  const responseData = await http.post<ResponseData<T>>(
    url.startsWith("/") ? url : `${api.proxyPath}${api.apiPath}/${url}`,
    data,
    {
      params,
      headers: {
        Authorization: getToken(),
        userFrom: "admin",
      },
    }
  );
  return responseData.data.data;
}
