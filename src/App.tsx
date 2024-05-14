import { Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FileInput from "./components/FileInput";
import FilesList from "./components/FilesList";
import apiClient from "./services/api-client";

function App() {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [filesList, setFilesList] = useState<string[]>([]);

  useEffect(() => {
    apiClient.auth
      .getSession()
      .then(({ data }) => data.session?.access_token && setLoggedIn(true));
  }, [isLoggedIn]);

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
      marginTop="24px"
    >
      <GridItem area="form">
        {!isLoggedIn ? (
          <HStack>
            <Button colorScheme="blue">
              <Link to="signup">Sign up</Link>
            </Button>
            <Button>
              <Link to="signin">Sign in</Link>
            </Button>
          </HStack>
        ) : (
          <FileInput onUpload={(fileName) => setFileName(fileName)} />
        )}
      </GridItem>
      <GridItem area="files">
        {!isLoggedIn ? (
          <Text>Please log in to view the content</Text>
        ) : (
          <FilesList filesList={filesList} />
        )}
        {error && <Text color="red">{error}</Text>}
      </GridItem>
    </Grid>
  );
}

export default App;
