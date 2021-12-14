import { useQuery } from "react-query";
import { getFiles } from "../api/api";

const useFiles = () => {
  return useQuery("files", getFiles, { keepPreviousData: true });
};

export default useFiles;
