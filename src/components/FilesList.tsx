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
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import pdfIcon from "../assets/pdf.png";

interface Props {
  filesList: string[];
}

const FilesList = ({ filesList }: Props) => {
  const [files, setFiles] = useState<string[]>(filesList);

  useEffect(() => {
    setFiles(filesList);
  }, [filesList]);

  const handleClick = async (file: string) => {
    const isConfirmed = confirm("Are you sure you want to delete this file?");
    if (isConfirmed) {
      const { error } = await apiClient.storage.from("asset").remove([file]);
      if (!error) {
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
      } else {
        console.error("Error deleting file:", error);
      }
    }
  };

  return (
    <TableContainer>
      <Table>
        <Tbody>
          {files?.map((file, index) => (
            <Tr key={index}>
              <Td>
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex columnGap="10px" alignItems="center">
                    {file.endsWith(".pdf") ? (
                      <Image boxSize="80px" objectFit="cover" src={pdfIcon} />
                    ) : (
                      <Image
                        boxSize="80px"
                        objectFit="cover"
                        src={
                          apiClient.storage.from("asset").getPublicUrl(file)
                            .data.publicUrl
                        }
                      />
                    )}
                    <Text>{file}</Text>
                  </Flex>
                  <Flex alignItems="center" columnGap="10px">
                    <Link
                      href={
                        apiClient.storage.from("asset").getPublicUrl(file).data
                          .publicUrl
                      }
                      download
                    >
                      Download
                    </Link>
                    <Button colorScheme="red" onClick={() => handleClick(file)}>
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
  );
};

export default FilesList;
