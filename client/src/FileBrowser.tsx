import React from "react";
import moment from "moment";
import { Box, DataTable, Notification, ColumnConfig } from "grommet";

import useFiles from "./hooks/useFiles";
import type { FileEntry } from "./types";
import Loader from "./Loader";
import DialogShareableLink from "./DialogShareableLink";

const columns: ColumnConfig<FileEntry>[] = [
  {
    property: "filename",
    header: "File Name",
    primary: true,
    sortable: true,
    search: true,
  },
  {
    property: "uploadDate",
    header: "Upload Date",
    render: (datum) => moment(datum.uploadDate).format("YYYY MMM DD HH:mm"),
    align: "end",
    sortable: true,
  },
];

const FileBrowser = () => {
  const [showDialogShareableLink, setShowDialogShareableLink] =
    React.useState(false);
  const [clickedFile, setClickedFile] = React.useState<FileEntry>();
  const [sort, setSort] = React.useState<{
    property: string;
    direction: "asc" | "desc";
  }>({
    property: "uploadDate",
    direction: "desc",
  });

  const filesQuery = useFiles();

  const hasError =
    filesQuery.status === "error" && filesQuery.error instanceof Error;
  const isLoading =
    filesQuery.status === "loading" ||
    filesQuery.status === "idle" ||
    filesQuery.isFetching ||
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
        columns={columns}
        data={filesQuery.data}
        onClickRow={(event) => {
          setShowDialogShareableLink(true);
          setClickedFile(event.datum);
        }}
        placeholder={placeholder}
        sort={sort}
        onSort={setSort}
      />

      {showDialogShareableLink && clickedFile && (
        <DialogShareableLink
          filename={clickedFile.filename}
          onClose={() => setShowDialogShareableLink(false)}
        />
      )}
    </Box>
  );
};

export default FileBrowser;
