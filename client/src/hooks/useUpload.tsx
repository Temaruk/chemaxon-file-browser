import { useMutation, useQueryClient } from "react-query";
import { uploadFile } from "../api/api";

const useUpload = () => {
  const queryClient = useQueryClient();

  return useMutation(uploadFile, {
    onSuccess: () => {
      queryClient.invalidateQueries("files");
    },
  });
};

export default useUpload;
