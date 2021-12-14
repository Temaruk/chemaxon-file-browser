import React from "react";
import { Form, FileInput, FormField, Button, Layer, Box } from "grommet";

import useUpload from "./hooks/useUpload";

const MAX_SIZE_FILE = 3 * 1024 * 1024;

const FileUploader = () => {
  const [show, setShow] = React.useState(false);
  const [formValue, setFormValue] = React.useState({ fileInput: [] });

  const uploadMutation = useUpload();

  const resetForm = () => {
    setFormValue({ fileInput: [] });
  };

  return (
    <>
      <Box align="center" pad="small">
        <Button
          margin={{ top: "medium" }}
          label="Upload new file"
          onClick={() => setShow(true)}
        />
      </Box>
      {show && (
        <Layer
          position="center"
          onEsc={() => setShow(false)}
          onClickOutside={() => {
            setShow(false);
            resetForm();
          }}
        >
          <Box align="center" margin="medium">
            <Form
              value={formValue}
              onChange={(nextValue) => setFormValue(nextValue)}
              onReset={() => resetForm()}
              onSubmit={({ value }) => {
                const data = new FormData();
                data.append("file", value.fileInput[0]);
                uploadMutation.mutate(data);
                setShow(false);
                resetForm();
              }}
            >
              <FormField
                label="Upload new file"
                name="fileInput"
                htmlFor="fileInput"
                required
              >
                <FileInput
                  name="fileInput"
                  id="fileInput"
                  maxSize={MAX_SIZE_FILE}
                />
              </FormField>

              <Button label="Submit" primary type="submit" />
            </Form>
          </Box>
        </Layer>
      )}
    </>
  );
};

export default FileUploader;
