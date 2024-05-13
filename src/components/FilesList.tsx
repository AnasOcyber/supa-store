import { OrderedList, ListItem, Image, HStack, Text } from "@chakra-ui/react";
import apiClient from "../services/api-client";

interface Props {
  filesList: string[];
}

const FilesList = ({ filesList }: Props) => {
  return (
    <OrderedList fontSize="18px" padding="10px" listStyleType="none">
      {filesList?.map((file, index) => (
        <ListItem key={index}>
          <HStack>
            <Image
              boxSize="100px"
              objectFit="cover"
              src={
                apiClient.storage.from("asset").getPublicUrl(file).data
                  .publicUrl
              }
            />
            <Text>{file}</Text>
          </HStack>
        </ListItem>
      ))}
    </OrderedList>
  );
};

export default FilesList;
