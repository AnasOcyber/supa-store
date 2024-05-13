import { Button, HStack, Input, Text } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import apiClient from "../services/api-client";

interface Props {
  onUpload: (fileName: string) => void;
}

const FileInput = ({ onUpload }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0)
      setFile(event.target.files[0]);
  };

  const handleClick = async () => {
    if (file) {
      try {
        const { data } = await apiClient.storage
          .from("asset")
          .upload(file.name, file);

        if (data) {
          onUpload(file.name);
        }
      } catch (error: any) {
        setError(error.message);
      }
    }
  };

  return (
    <>
      {error && <Text color="red">{error}</Text>}
      <HStack marginTop="10px">
        <Input onChange={handleChange} type="file" width="500px" />
        <Button type="submit" onClick={handleClick}>
          Upload
        </Button>
      </HStack>
    </>
  );
};

export default FileInput;
