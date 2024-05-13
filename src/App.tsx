import { Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FileInput from "./components/FileInput";
import FilesList from "./components/FilesList";
import apiClient from "./services/api-client";
import SignupForm from "./components/SignupForm";

function App() {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [filesList, setFilesList] = useState<string[]>([]);

  useEffect(() => {
    apiClient.auth
      .getSession()
      .then(({ data }) => data.session?.access_token && setLoggedIn(true));
  }, [loggedIn]);

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await apiClient.storage.from("asset").list();

      if (error) setError(error.message);
      else {
        const fileList = data?.map(
          (file: any) => !file.name.startsWith(".") && file.name
        );
        setFilesList(fileList);
      }
    }

    fetchFiles();
  }, [fileName]);

  return (
    <Grid
      templateAreas={{ sm: `"form" "files"`, lg: `"form files"` }}
      padding="10px"
    >
      <GridItem area="form">
        {!loggedIn ? (
          <SignupForm />
        ) : (
          <FileInput onUpload={(fileName) => setFileName(fileName)} />
        )}
      </GridItem>
      <GridItem area="files">
        {error && <Text color="red">{error}</Text>}
        <FilesList filesList={filesList} />
      </GridItem>
    </Grid>
  );
}

export default App;
