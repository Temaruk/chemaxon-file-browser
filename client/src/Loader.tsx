import React from "react";
import { Box, Text, Spinner } from "grommet";

const Loader = () => (
  <Box
    fill
    align="center"
    justify="center"
    direction="row"
    pad="large"
    gap="small"
    background={{ color: "background-front", opacity: "strong" }}
  >
    <Spinner />
    <Text weight="bold">Loading ...</Text>
  </Box>
);

export default Loader;
