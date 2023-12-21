import {Box, BoxProps} from "@chakra-ui/react";

export default function Pane(props: BoxProps ) {
  return <Box
    w="full"
    h="full"
    borderWidth='1px'
    borderRadius='xl'
    bg="gray.500"
    overflow="hidden"
    {...props}
  >
  </Box>
}
