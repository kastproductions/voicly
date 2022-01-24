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
  HStack,
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
    setCh(children)
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
  const [warnItemsList, setWarnItemsList] = React.useState([])

  const handleBlur = ({ id, innerHTML }) => {
    const [rowIndex, index] = id.split('-')
    if (+rowIndex > 0 && +(index > 0) && !+innerHTML) {
      if (!state[0][index]) {
        return setWarnItemsList((prev) => prev.filter((_id) => _id !== id))
      }
      return setWarnItemsList((prev) => [...prev, id])
    }
    setWarnItemsList((prev) => prev.filter((_id) => _id !== id))
    const copy = JSON.parse(JSON.stringify(state))
    copy[rowIndex][index] = { ...copy[rowIndex][index], name: innerHTML }
    if (rowIndex !== '0' && (index === '1' || index === '2')) {
      const qty = +copy[rowIndex][1].name
      const price = +copy[rowIndex][2].name
      const lastIndex = copy[rowIndex].length
      copy[rowIndex][lastIndex - 1].name = (qty * price).toFixed(2)
    }
    setState([...copy])
  }

  const handleAddRow = () => {
    setState((prev) => [...prev, prev[prev.length - 1]])
  }

  const total = React.useMemo(() => {
    return state
      .reduce((acc, row, index) => {
        if (index === 0) return 0
        return +row[row.length - 1].name + acc
      }, 0)
      .toFixed(2)
  }, [state])

  return (
    <Stack pt={10} spacing={2} position="relative">
      {state?.map((row, rowIdx) => {
        const { length } = row
        return (
          <Stack isInline width="full">
            <SimpleGrid columns={length} key={rowIdx} spacing={4} width="full">
              {row.map((item, index) => {
                const id = `${rowIdx}-${index}`
                const shouldWarn = warnItemsList.some((_id) => _id === id)
                return (
                  <EditableText
                    borderWidth="2px"
                    borderColor={shouldWarn ? 'red.500' : 'transparent'}
                    textAlign={index === 5 && 'right'}
                    fontSize="sm"
                    textTransform={rowIdx === 0 ? 'uppercase' : 'initial'}
                    fontWeight={rowIdx === 0 ? 'semibold' : 'normal'}
                    key={`${rowIdx}-${index}`}
                    id={`${rowIdx}-${index}`}
                    width="full"
                    onBlur={handleBlur}
                  >
                    {item.name}
                  </EditableText>
                )
              })}
            </SimpleGrid>
          </Stack>
        )
      })}
      <HStack justifyContent="flex-end">
        <Box>{/* <EditableText fontSize="sm">Subtotal</EditableText> */}</Box>
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {total}
          </Text>
        </Box>
      </HStack>
      <Box position="absolute" bottom={0} left={0} just>
        <Button size="sm" variant="link" onClick={handleAddRow}>
          Add row
        </Button>
      </Box>
    </Stack>
  )
}

const gridItems = [
  [
    { id: 1, name: 'item' },
    { id: 2, name: 'quantity' },
    { id: 3, name: 'price €' },
    { id: 4, name: 'discount' },
    { id: 5, name: 'tax %' },
    { id: 6, name: 'total' },
  ],
  [
    { id: 1, name: 'Sample' },
    { id: 2, name: '12' },
    { id: 3, name: '20' },
    { id: 4, name: '15' },
    { id: 5, name: '21' },
    { id: 6, name: '240' },
  ],
  [
    { id: 1, name: 'Sample-2' },
    { id: 2, name: '12' },
    { id: 3, name: '20' },
    { id: 4, name: '15' },
    { id: 5, name: '21' },
    { id: 6, name: '240' },
  ],
]
