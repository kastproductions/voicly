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
  Image,
  Input,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const data = {
  companyName: '<b>MB Kast Productions</b>',
  address: `<b><i>ascasc</i></b><div><b><i>asc</i></b></div><d…<i><br></i></b></div><div><b><i>sac</i></b></div>`,
}

function EditableText(props) {
  const { children, onBlur, label = '', ...rest } = props
  const [ch, setCh] = useState('')

  React.useEffect(() => {
    setCh(children || '')
  }, [children])

  const handleBlur = (e) => {
    const { innerText, innerHTML, textContent, value, id } = e.target
    onBlur({ id, innerHTML })
  }

  console.count('rerender')

  return (
    <Tooltip label={label} placement="top-start">
      <Text
        whiteSpace="pre-line"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: ch }}
        onBlur={handleBlur}
        _hover={{
          shadow: 'outline',
        }}
        {...rest}
      />
    </Tooltip>
  )
}

export default function CreateInvoice() {
  //   const detailsRef = React.useRef<HTMLParagraphElement>()
  const [state, setState] = React.useState(data)
  const [logoSrc, setLogoSrc] = React.useState('')
  const inputFileRef = React.useRef<HTMLInputElement>()

  const handleBlur = ({ id, innerHTML }) => {
    console.log({ id })
    console.log({ innerHTML })
    // setState((prev) => ({ ...prev, [id]: innerText }))
  }

  console.log({ state })

  const loadFile = (event) => {
    const src = URL.createObjectURL(event.target.files[0])
    setLogoSrc(src)
  }

  const selectFile = () => {
    inputFileRef.current.click()
  }

  return (
    <Stack py={20} bg="gray.100">
      <Center>
        <Stack
          maxW="3xl"
          width="full"
          shadow="base"
          height="100vh"
          py={10}
          px={20}
          bg="white"
        >
          <Stack isInline justifyContent="space-between" spacing={4}>
            <Box flex={1}>
              <EditableText
                label="Enter your company name"
                fontSize="3xl"
                id="companyName"
                onBlur={handleBlur}
              >
                {state.companyName}
              </EditableText>
              <EditableText
                label="Enter your company address"
                fontSize="sm"
                id="address"
                onBlur={handleBlur}
              >
                {state.address}
              </EditableText>
            </Box>
            <Box
              maxW={28}
              onClick={selectFile}
              cursor="pointer"
              position="relative"
              bg={logoSrc ? 'transparent' : 'gray.100'}
            >
              <Input
                height={0}
                width={0}
                visibility="hidden"
                ref={inputFileRef}
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                // accept="image/png, image/jpeg"
                onChange={loadFile}
              />
              {logoSrc && (
                <Image
                  mt={1}
                  position="absolute"
                  top={0}
                  right={0}
                  src={logoSrc}
                  objectFit="contain"
                />
              )}
            </Box>
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
