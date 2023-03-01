import { defineMock } from "vite-plugin-mock-dev-server";
import * as api from "../api.config";

export default defineMock([
  {
    url: `${api.apiPath}/verificationCode`,
    body: {
      a: 1,
      b: 2,
    },
  },
  {
    url: `${api.apiPath}/login`,
    body: {
      a: 1,
      b: 2,
    },
  },
]);
