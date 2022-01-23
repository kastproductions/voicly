/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Stack,
  Text,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useTheme,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Tooltip,
} from '@chakra-ui/react'
import React, { useState } from 'react'

const data = {
  companyName: 'MB Kast Productions',
  address: `Company address line1 \nCompany address line 2 \nCompany address line1`,
}

export default function CreateInvoice() {
  //   const detailsRef = React.useRef<HTMLParagraphElement>()
  const [state, setState] = React.useState(data)

  const handleBlur = (e) => {
    const { innerText, name } = e.target
    console.log({ name })
    setState((prev) => ({ ...prev, [name]: innerText }))
  }

  console.log({ state })

  return (
    <Stack py={20}>
      <Center>
        <Stack
          maxW="3xl"
          width="full"
          shadow="base"
          height="100vh"
          py={10}
          px={20}
        >
          <Stack isInline justifyContent="space-between" spacing={4}>
            <Box flex={1}>
              <Tooltip
                label="Enter your company name"
                placement="top"
                gutter={0}
              >
                <Text
                  whiteSpace="pre-line"
                  fontSize="3xl"
                  contentEditable
                  suppressContentEditableWarning
                  name="companyName"
                  onBlur={handleBlur}
                >
                  {state.companyName}
                </Text>
              </Tooltip>
              <Tooltip
                label="Enter your company address"
                placement="top"
                gutter={0}
              >
                <Text
                  name="address"
                  whiteSpace="pre-line"
                  fontSize="sm"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={handleBlur}
                >
                  {state.address}
                </Text>
              </Tooltip>
            </Box>
            <Box width={40} height={24} bg="gray.100" />
          </Stack>

          {/* <Editable
            defaultValue="COMPANY NAME"
            fontSize="3xl"
            transition="all 0.1s ease-in-out"
            _hover={{
              shadow: 'outline',
            }}
          >
            <EditablePreview />
            <EditableInput rounded="none" />
          </Editable>
          <Editable
            defaultValue="COMPANY NAME"
            transition="all 0.1s ease-in-out"
            _hover={{
              shadow: 'outline',
            }}
          >
            <EditablePreview />
            <EditableInput rounded="none" />
          </Editable> */}
        </Stack>
      </Center>
    </Stack>
  )
}
