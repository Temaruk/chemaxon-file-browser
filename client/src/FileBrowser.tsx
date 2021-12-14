import React from "react";
import moment from "moment";
import {
  Box,
  DataTable,
  Layer,
  Text,
  TextInput,
  Button,
  Notification,
  ColumnConfig,
} from "grommet";
import { Clipboard } from "grommet-icons";

import useFiles from "./hooks/useFiles";
import type { FileEntry } from "./types";
import { BASE_URL_API } from "./config";
import Loader from "./Loader";

const columns: ColumnConfig<FileEntry>[] = [
  {
    property: "filename",
    header: "File Name",
    primary: true,
  },
  {
    property: "uploadDate",
    header: "Upload Date",
    render: (datum) => moment(datum.uploadDate).format("YYYY MMM DD HH:mm"),
    align: "end",
  },
];

const createShareabelUrl = (filename: string) =>
  `${BASE_URL_API}/files/${filename}`;

const FileBrowser = () => {
  const [showShareableLink, setShowShareableLink] = React.useState(false);
  const [clickedFile, setClickedFile] = React.useState<FileEntry>();

  const filesQuery = useFiles();

  const hasError =
    filesQuery.status === "error" && filesQuery.error instanceof Error;
  const isLoading =
    filesQuery.status === "loading" ||
    filesQuery.status === "idle" ||
    !filesQuery.data;

  let placeholder;

  if (hasError) {
    return (
      <Box
        fill
        align="center"
        justify="center"
        direction="row"
        pad="large"
        gap="small"
      >
        <Notification
          status="critical"
          title="Error"
          message="An error occurred while loading files from the server"
        />
      </Box>
    );
  }

  if (isLoading) {
    placeholder = <Loader />;
  }

  return (
    <Box pad="large" align="center" fill="horizontal">
      <DataTable
        // size="medium"
        columns={columns}
        data={filesQuery.data}
        onClickRow={(event) => {
          setShowShareableLink(true);
          setClickedFile(event.datum);
        }}
        placeholder={placeholder}
      />

      {showShareableLink && clickedFile && (
        <Layer
          position="center"
          onEsc={() => setShowShareableLink(false)}
          onClickOutside={() => setShowShareableLink(false)}
        >
          <Box margin="medium">
            <Text>Shareable link for:</Text>
            <Text weight="bold">{clickedFile.filename}</Text>

            <Box direction="row" align="center" round="small" border>
              <TextInput
                plain
                type="text"
                value={createShareabelUrl(clickedFile.filename)}
                onClick={() =>
                  navigator.clipboard.writeText(
                    createShareabelUrl(clickedFile.filename)
                  )
                }
              />

              <Box border={{ color: "dark-4", side: "left" }}>
                <Button
                  icon={<Clipboard color="brand" size="medium" />}
                  margin={{ right: "xsmall" }}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      createShareabelUrl(clickedFile.filename)
                    )
                  }
                />
              </Box>
            </Box>
            <Button
              margin={{ top: "medium" }}
              label="close"
              onClick={() => setShowShareableLink(false)}
            />
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default FileBrowser;
