import axios from "axios";

import type { FileEntry } from "../types";
import { BASE_URL_API } from "../config";

const apiClient = axios.create({
  baseURL: BASE_URL_API,
});

type ResponseGetFiles = FileEntry[];

const getFiles = async () => {
  const { data } = await apiClient.get<ResponseGetFiles>("/files");
  return data;
};

const uploadFile = (formData: FormData) => {
  return apiClient.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getFileShareLink = async (fileid: string) => {
  const { data } = await apiClient.get(`/files/${fileid}`);
  return data;
};

export { getFiles, uploadFile, getFileShareLink };
