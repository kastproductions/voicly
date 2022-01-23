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
  SimpleGrid,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'

const date = new Date()

const data = {
  companyName: 'MB Kast Productions',
  address: `Mokyklos g. 13, Verstaminu k., Lazdiju raj LT-67412<div>Phone: +37063692435\nwww.kastproductions.com\n<span>hello@hastproductions.com&nbsp;</span></div>`,
  invoiceIssueDate: date.toLocaleDateString(),
  invoiceTitle: `INVOICE`,
  clientLabel: `CLIENT:`,
  clientCompanyName: `<b>CLIENT COMPANY NAME</b>`,
  clientCompanyDetails: `Mokyklos g. 13,<div>Verstaminu k.,<div>Lazdiju raj LT-67412<div>Phone: +37063692435\nwww.kastproductions.com\n<span>hello@hastproductions.com</span></div></div></div>`,
}

function EditableText(props) {
  const { children, onBlur, label = '', id, ...rest } = props
  const [ch, setCh] = useState('')

  React.useEffect(() => {
    setCh(children || '')
  }, [children])

  const handleBlur = React.useCallback(
    (e) => {
      const { innerText, innerHTML, textContent } = e.target
      onBlur && onBlur({ id, innerHTML })
    },
    [onBlur, id]
  )

  return (
    <Tooltip label={label} placement="top-start">
      <Stack isInline>
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
      </Stack>
    </Tooltip>
  )
}

export default function CreateInvoice() {
  //   const detailsRef = React.useRef<HTMLParagraphElement>()
  const [state, setState] = React.useState(data)
  const [logoSrc, setLogoSrc] = React.useState('')
  const inputFileRef = React.useRef<HTMLInputElement>()

  const handleBlur = ({ id, innerHTML }) => {
    setState((prev) => ({ ...prev, [id]: innerHTML }))
  }

  const loadFile = (event) => {
    const src = URL.createObjectURL(event.target.files[0])
    setLogoSrc(src)
  }

  const selectFile = () => {
    inputFileRef.current.click()
  }
  console.log({ state })
  return (
    <Stack py={20} bg="gray.100">
      <Center>
        <Stack
          minW="210mm"
          minH="297mm"
          maxW="210mm"
          maxH="297mm"
          shadow="base"
          py={10}
          px={20}
          bg="white"
        >
          <Stack isInline justifyContent="space-between" spacing={4}>
            <Box width="full">
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
                color="gray.500"
                onBlur={handleBlur}
              >
                {state.address}
              </EditableText>
            </Box>
            <Tooltip label="Upload logo" placement="top-start">
              <Box maxW={28} width="full">
                <Box
                  minH={20}
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
                  <Image
                    display={logoSrc ? 'block' : 'none'}
                    mt={1}
                    position="absolute"
                    top={0}
                    right={0}
                    src={logoSrc}
                    objectFit="contain"
                  />
                </Box>
              </Box>
            </Tooltip>
          </Stack>
          <Stack isInline pt={10} spacing={4}>
            <Box width="50%">
              <EditableText
                label="Invoice date"
                id="invoiceIssueDate"
                onBlur={handleBlur}
              >
                {state.invoiceIssueDate}
              </EditableText>
              <EditableText
                label="Invoice title"
                fontSize="3xl"
                fontWeight="semibold"
                id="invoiceTitle"
                onBlur={handleBlur}
              >
                {state.invoiceTitle}
              </EditableText>
            </Box>
            <Box width="50%">
              <EditableText
                color="gray.500"
                width="full"
                textAlign="right"
                label="Client label"
                id="clientLabel"
                onBlur={handleBlur}
              >
                {state.clientLabel}
              </EditableText>
              <EditableText
                width="full"
                textAlign="right"
                label="Client company name"
                id="clientCompanyName"
                onBlur={handleBlur}
              >
                {state.clientCompanyName}
              </EditableText>
              <EditableText
                fontSize="sm"
                width="full"
                textAlign="right"
                label="Client company details"
                id="clientCompanyDetails"
                onBlur={handleBlur}
              >
                {state.clientCompanyDetails}
              </EditableText>
            </Box>
          </Stack>
          <ItemsTable />
        </Stack>
      </Center>
    </Stack>
  )
}

function ItemsTable() {
  const [state, setState] = React.useState(gridItems)

  const handleBlur = ({ id, innerHTML }) => {
    const [rowIndex, index] = id.split('-')
    const copy = [...state]
    // if (!innerHTML) {
    //   const rowsCount = copy.length - 1
    //   delete copy[rowIndex][index]
    //   Array(rowsCount)
    //     .fill(null)
    //     .forEach((it, idx) => {
    //       delete copy[+rowIndex + (idx + 1)][index]
    //     })
    //   setState([...copy])
    // } else {
    copy[rowIndex][index] = { ...copy[rowIndex][index], name: innerHTML }
    setState([...copy])
    // }
  }

  return (
    <Stack pt={10} spacing={0}>
      {state?.map((row, rowIdx) => {
        const { length } = row
        return (
          <SimpleGrid columns={length} key={rowIdx} spacing={4}>
            {row.map((item, index) => (
              <EditableText
                fontSize="sm"
                textTransform={rowIdx === 0 ? 'uppercase' : 'initial'}
                key={`${rowIdx}-${index}`}
                id={`${rowIdx}-${index}`}
                width="full"
                onBlur={handleBlur}
              >
                {item.name}
              </EditableText>
            ))}
          </SimpleGrid>
        )
      })}
    </Stack>
  )
}

const gridItems = [
  [
    { id: 1, name: 'item' },
    { id: 1, name: 'quantity' },
    { id: 1, name: 'price €' },
    { id: 1, name: 'discount' },
    { id: 1, name: 'tax %' },
    { id: 1, name: 'total' },
  ],
  [
    { id: 1, name: 'Sample' },
    { id: 1, name: '12' },
    { id: 1, name: '20' },
    { id: 1, name: '15' },
    { id: 1, name: '21' },
    { id: 1, name: '240' },
  ],
]
