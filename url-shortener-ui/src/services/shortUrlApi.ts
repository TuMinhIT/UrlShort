import { api } from "./api";
import type {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
} from "../features/url-shortener/types";

const resource = "/api/url";

async function fetchPublicIp() {
  const response = await api.get(resource);
  console.log(response);
  return response.data;
}

async function createShortUrl(payload: CreateShortUrlRequest) {
  const response = await api.post(`${resource}/shorten`, payload);
  const data = response.data;

  return data satisfies CreateShortUrlResponse;
}

async function getUrlsByIp() {
  const response = await api.get("/api/url");
  // console.log(response.data);
  return response.data;
}

async function getClickCount(shortCode: string) {
  const response = await api.get(`${resource}/click/${shortCode}`);
  console.log("count" + response.data);
  return response.data;
}

export const shortenerApi = {
  fetchPublicIp,
  createShortUrl,
  getUrlsByIp,
  getClickCount,
};
