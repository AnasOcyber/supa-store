import {
  Button,
  Flex,
  Image,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import pdfIcon from "../assets/pdf.png";
import apiClient from "../services/api-client";

interface FileItem {
  name: string;
  signedUrl: string;
}
interface Props {
  filesList: string[];
  userSession?: Session;
}

const FilesList = ({ filesList, userSession }: Props) => {
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchFilesData = async () => {
      if (userSession?.user) {
        const filesData: FileItem[] = [];
        for (const file of filesList) {
          const signedUrl = await getAssetUrl(file);
          filesData.push({ name: file, signedUrl });
        }
        setFiles(filesData);
      }
    };
    fetchFilesData();
  }, [filesList, userSession]);

  const getAssetUrl = async (file: string) => {
    if (userSession?.user) {
      const { data } = await apiClient.storage
        .from("asset")
        .createSignedUrl(`${userSession.user.id}/${file}`, 3600);

      return data?.signedUrl ?? "";
    }
    return "";
  };

  const handleDelete = async (file: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (userSession && isConfirmed) {
      const filePath = `${userSession.user.id}/${file}`;
      const { data, error } = await apiClient.storage
        .from("asset")
        .remove([filePath]);
      if (data) {
        setFiles((prevFiles) => prevFiles.filter((f) => f.name !== file));
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <Tbody>
            {files.map((fileItem, index) => (
              <Tr key={index}>
                {error && <Text>{error}</Text>}
                <Td>
                  <Flex justifyContent="space-between">
                    <Flex columnGap="10px" alignItems="center">
                      {fileItem.name.endsWith(".pdf") ? (
                        <Image boxSize="80px" objectFit="cover" src={pdfIcon} />
                      ) : (
                        <Image
                          boxSize="80px"
                          objectFit="cover"
                          src={fileItem.signedUrl}
                        />
                      )}
                      <Text>{fileItem.name}</Text>
                    </Flex>
                    <Flex alignItems="center" columnGap="10px">
                      <Link href={fileItem.signedUrl} download>
                        Download
                      </Link>
                      <Button
                        colorScheme="red"
                        onClick={() => handleDelete(fileItem.name)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FilesList;
