import axios from "axios";
import { appEnv } from "../config/env";

export const api = axios.create({
  baseURL: appEnv.apiBaseUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
