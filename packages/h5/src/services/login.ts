import { get, post } from "@/shared/http";

interface requestData {}

interface LoginRespone {}

export function getVerificationCode(data: requestData) {
  return post<LoginRespone>("/service/verificationCode", data);
}

export function login(data: requestData) {
  return post<LoginRespone>("/service/login", data);
}
