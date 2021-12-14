import React from "react";
import { Box, Layer, Text, TextInput, Button } from "grommet";
import { Clipboard } from "grommet-icons";

import { BASE_URL_API } from "./config";

const createShareabelUrl = (filename: string) =>
  `${BASE_URL_API}/files/${filename}`;

type PropsDialogShareableLink = {
  filename: string;
  onClose: () => void;
};

const DialogShareableLink = ({
  filename,
  onClose,
}: PropsDialogShareableLink) => {
  const shareAbleUrl = createShareabelUrl(filename);

  return (
    <Layer position="center" onEsc={onClose} onClickOutside={onClose}>
      <Box margin="medium">
        <Text>Shareable link for:</Text>
        <Text weight="bold">{filename}</Text>

        <Box direction="row" align="center" round="small" border>
          <TextInput
            plain
            type="text"
            value={shareAbleUrl}
            onClick={() => navigator.clipboard.writeText(shareAbleUrl)}
          />

          <Box border={{ color: "dark-4", side: "left" }}>
            <Button
              icon={<Clipboard color="brand" size="medium" />}
              margin={{ right: "xsmall" }}
              onClick={() => navigator.clipboard.writeText(shareAbleUrl)}
            />
          </Box>
        </Box>
        <Button margin={{ top: "medium" }} label="close" onClick={onClose} />
      </Box>
    </Layer>
  );
};

export default DialogShareableLink;
