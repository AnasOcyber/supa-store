import { Button, HStack, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import apiClient from "../services/api-client";
import { Session } from "@supabase/supabase-js";

interface Props {
  onUpload: (fileName: string) => void;
  userSession?: Session;
}

const FileInput = ({ onUpload, userSession }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setFile(event.target.files[0]);
  };

  const handleClick = async () => {
    if (file && userSession) {
      const filePath = `${userSession.user.id}/${file.name}`;

      const { data, error } = await apiClient.storage
        .from("asset")
        .upload(filePath, file);

      if (data) onUpload(file.name);

      if (error) setError(error.message);
    }
  };

  return (
    <>
      {error && <Text color="red">{error}</Text>}
      <HStack marginTop="24px" spacing="24px">
        <Input onChange={handleChange} type="file" width="420px" />
        <Button colorScheme="green" type="submit" onClick={handleClick}>
          Upload
        </Button>
      </HStack>
    </>
  );
};

export default FileInput;
