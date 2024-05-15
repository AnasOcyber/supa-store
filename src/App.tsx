import { Button, Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
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
  const [userSession, setUserSession] = useState<Session>();

  useEffect(() => {
    apiClient.auth
      .getSession()
      .then(({ data: { session } }) => session && setUserSession(session));
  }, []);

  useEffect(() => {
    setLoggedIn(!!userSession?.access_token);
  }, [userSession]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (userSession?.user) {
        const { data, error } = await apiClient.storage
          .from("asset")
          .list(userSession.user.id);

        if (data) {
          const fileList = data?.map((file) => file.name).filter(Boolean) || [];
          setFilesList(fileList);
        } else setError(error.message);
      }
    };

    fetchFiles();
  }, [userSession, fileName]);

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
          <FileInput
            onUpload={(fileName) =>
              setFileName(`${userSession?.user.id}/${fileName}`)
            }
            userSession={userSession}
          />
        )}
      </GridItem>
      <GridItem area="files">
        {!isLoggedIn ? (
          <Text>Please log in to view the content</Text>
        ) : (
          <FilesList filesList={filesList} userSession={userSession} />
        )}
        {error && <Text color="red">{error}</Text>}
      </GridItem>
    </Grid>
  );
}

export default App;
