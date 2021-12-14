import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Grommet, Header, Heading, Main, grommet } from "grommet";

import FileUploader from "./FileUploader";
import FileBrowser from "./FileBrowser";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Grommet plain theme={grommet}>
        <Header background="light-4" pad="medium" height="xsmall">
          <Heading>ChemAxon File Browser</Heading>
        </Header>
        <Main>
          <FileUploader />
          <FileBrowser />
        </Main>
      </Grommet>
    </QueryClientProvider>
  );
};

export default App;
