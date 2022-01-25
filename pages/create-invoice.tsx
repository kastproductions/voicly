/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChevronDownIcon } from '@chakra-ui/icons'
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'

import React, { useReducer, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const date = new Date()
const dueDate = new Date()

dueDate.setDate(dueDate.getDate() + 14)

const data = {
  invoiceNoLabel: 'INVOICE NO.',
  invoiceNo: '#00001',
  dueDateLabel: 'DUE DATE:',
  dueDate: dueDate.toLocaleDateString(),
  refLabel: 'P.O. REF#',
  ref: '023892-23-200',
  companyName: 'MB Kast Productions',
  address: `Mokyklos g. 13, Verstaminu k., Lazdiju raj LT-67412\nPhone: +37063692435\nwww.kastproductions.com\nhello@hastproductions.com`,
  invoiceIssueDate: date.toLocaleDateString(),
  invoiceTitle: `INVOICE`,
  clientLabel: `CLIENT:`,
  clientCompanyName: `CLIENT COMPANY NAME`,
  clientCompanyDetails: `Mokyklos g. 13,Verstaminu k., Lazdiju raj LT-67412 Phone: +37063692435\nwww.kastproductions.com\nhello@hastproductions.com`,
  notesLabel: 'NOTES',
  notesDetails: `Aliqua nulla nulla duis exercitation commodo quis nisi dolore.`,
  paymentsLabel: 'PAYMENTS:',
  paymentsDetails:
    'Elit ut voluptate do magna nostrud do. Ex exercitation culpa pariatur ea exercitation. Aute eu nulla velit incididunt deserunt.',
}

function EditableText(props) {
  const { label = '', isDisabled, ...rest } = props

  return (
    <Tooltip label={label} placement="top-start">
      <Stack isInline>
        <EditableElement isDisabled={isDisabled}>
          <Text
            whiteSpace="pre-line"
            _hover={{
              shadow: isDisabled ? 'none' : 'outline',
            }}
            {...rest}
          />
        </EditableElement>
      </Stack>
    </Tooltip>
  )
}

function DateInput({ label = 'Select date', date, ...rest }) {
  const [startDate, setStartDate] = useState(date || new Date())

  return (
    <Tooltip label={label} placement="top-start">
      <Stack
        isInline
        sx={{
          input: {
            width: 'auto',
            border: 'none',
            outline: 'none',
            fontSize: 'md',
            color: 'gray.900',
            lineHeight: 'base',
            fontWeight: 'normal',
            _focus: {
              shadow: 'outline',
            },
            _hover: {
              shadow: 'outline',
            },
            ...rest,
          },
        }}
      >
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
        />
      </Stack>
    </Tooltip>

    // <Box position="relative">
    //   <label htmlFor="input-id">Change Date</label>
    //   <Input id="input-id" ref={ref} type="date" />
    //   <Button top={0} left={0} onClick={onChange}>
    //     Hello
    //   </Button>
    // </Box>
  )
}

export default function CreateInvoice() {
  //   const detailsRef = React.useRef<HTMLParagraphElement>()
  const [state, setState] = React.useState(data)
  const [logoSrc, setLogoSrc] = React.useState('')
  const [value, setValue] = React.useState('')
  const inputFileRef = React.useRef<HTMLInputElement>()

  const handleBlur = ({ target }) => {
    setState((prev) => ({ ...prev, [target.id]: target.innerText }))
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
          pl="30mm"
          py="10mm"
          pr="15mm"
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
            <Box maxW={28} width="full" pt={1}>
              <Tooltip label="Upload logo" placement="top-start">
                <Box
                  minH={20}
                  onClick={selectFile}
                  cursor="pointer"
                  position="relative"
                  borderStyle="dashed"
                  borderColor="gray.300"
                  borderWidth={logoSrc ? 0 : '3px'}
                  _hover={{
                    shadow: logoSrc ? 'none' : 'outline',
                  }}
                >
                  <Input
                    height={0}
                    width={0}
                    visibility="hidden"
                    ref={inputFileRef}
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={loadFile}
                  />
                  <Image
                    display={logoSrc ? 'block' : 'none'}
                    position="absolute"
                    top={0}
                    right={0}
                    src={logoSrc}
                    objectFit="contain"
                    _hover={{
                      shadow: 'outline',
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          </Stack>
          <Stack isInline pt={10} spacing={4}>
            <Box width="50%">
              <DateInput />
              <Stack isInline>
                <Box>
                  <EditableText
                    bg="gray.900"
                    px={3}
                    color="white"
                    label="Invoice title"
                    fontSize="3xl"
                    fontWeight="semibold"
                    id="invoiceTitle"
                    onBlur={handleBlur}
                  >
                    {state.invoiceTitle}
                  </EditableText>
                </Box>
              </Stack>
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
                id="clientCompanyName"
                fontWeight="bold"
                width="full"
                textAlign="right"
                label="Client company name"
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
          <Stack spacing={0}>
            <HStack>
              <EditableText
                fontWeight="bold"
                fontSize="sm"
                label="invoiceNoLabel"
                id="invoiceNoLabel"
                onBlur={handleBlur}
              >
                {state.invoiceNoLabel}
              </EditableText>
              <EditableText
                fontSize="sm"
                label="invoiceNo"
                id="invoiceNo"
                onBlur={handleBlur}
              >
                {state.invoiceNo}
              </EditableText>
            </HStack>
            <HStack>
              <EditableText
                fontWeight="bold"
                fontSize="sm"
                label="dueDateLabel"
                id="dueDateLabel"
                onBlur={handleBlur}
              >
                {state.dueDateLabel}
              </EditableText>
              <DateInput fontSize="sm" />
            </HStack>
            <HStack>
              <EditableText
                fontWeight="bold"
                fontSize="sm"
                label="refLabel"
                id="refLabel"
                onBlur={handleBlur}
              >
                {state.refLabel}
              </EditableText>
              <EditableText
                fontSize="sm"
                label="ref"
                id="ref"
                onBlur={handleBlur}
              >
                {state.ref}
              </EditableText>
            </HStack>
          </Stack>
          <ItemsTable />
          <Stack pt={10} spacing={10}>
            <Box>
              <EditableText
                fontWeight="bold"
                fontSize="sm"
                label="Notes label"
                id="notesLabel"
                onBlur={handleBlur}
              >
                {state.notesLabel}
              </EditableText>
              <EditableText
                fontSize="sm"
                width="full"
                label="Notes details"
                id="notesDetails"
                onBlur={handleBlur}
              >
                {state.notesDetails}
              </EditableText>
            </Box>
            <Box>
              <EditableText
                color="gray.500"
                fontWeight="bold"
                fontSize="sm"
                label="Payments label"
                id="paymentsLabel"
                onBlur={handleBlur}
              >
                {state.paymentsLabel}
              </EditableText>
              <EditableText
                color="gray.500"
                fontSize="sm"
                width="full"
                label="Payments details"
                id="paymentsDetails"
                onBlur={handleBlur}
              >
                {state.paymentsDetails}
              </EditableText>
            </Box>
          </Stack>
        </Stack>
      </Center>
    </Stack>
  )
}

const EditableElement = (props): JSX.Element => {
  const { onChange, children, isDisabled } = props
  const element = React.useRef<HTMLElement>()
  let elements = React.Children.toArray(children)
  if (elements.length > 1) {
    throw Error("Can't have more than one child")
  }
  const onMouseUp = () => {
    onChange && onChange(element.current)
  }
  React.useEffect(() => {
    onChange && onChange(element.current)
  }, [onChange])

  elements = React.cloneElement(elements[0], {
    contentEditable: !isDisabled,
    suppressContentEditableWarning: true,
    ref: element,
    onKeyUp: onMouseUp,
  })
  return elements
}

function ItemsTable() {
  const [state, setState] = React.useState(gridItems)
  const [warnItemsList, setWarnItemsList] = React.useState([])
  const [count, rerender] = React.useReducer((s, a = 1) => s + a, 0)
  console.log({ state })
  const handleBlur = ({ target }) => {
    const { id, innerText } = target
    const [rowIndex, index] = id.split('-')
    // do not delete esentials
    if (
      rowIndex === '0' &&
      ['0', '1', '2', '5'].includes(index) &&
      !innerText
    ) {
      rerender()
      return
    }

    if (+rowIndex > 0 && !+innerText) {
      if (!state[0][index].value) {
        const idds = [...Array(state.length - 1)].map((_, i) => {
          return `${i + 1}-${index}`
        })
        return setWarnItemsList((prev) =>
          prev.filter((_id) => !idds.includes(_id))
        )
      }
      return setWarnItemsList((prev) => [...prev, id])
    }
    setWarnItemsList((prev) => prev.filter((_id) => _id !== id))
    const copy = JSON.parse(JSON.stringify(state))
    copy[rowIndex][index] = { ...copy[rowIndex][index], value: innerText }
    if (rowIndex !== '0' && (index === '1' || index === '2')) {
      const qty = +copy[rowIndex][1].value
      const price = +copy[rowIndex][2].value
      const lastIndex = copy[rowIndex].length
      copy[rowIndex][lastIndex - 1].value = (qty * price).toFixed(2)
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
        return +row[row.length - 1].value + acc
      }, 0)
      .toFixed(2)
  }, [state])

  return (
    <Stack pt={10} spacing={1} position="relative" key={count}>
      {state?.map((row, rowIdx) => {
        const { length } = row
        return (
          <Stack
            isInline
            width="full"
            borderBottomColor="gray.200"
            borderBottomWidth="1px"
            pb="4px"
            // px={2}
            pt={rowIdx === 0 ? 1 : 0}
            bg={rowIdx === 0 ? 'gray.100' : 'transparent'}
          >
            <SimpleGrid columns={length} key={rowIdx} spacing={1} width="full">
              {row.map(({ value }, index) => {
                const id = `${rowIdx}-${index}`
                const shouldWarn = warnItemsList.some((_id) => _id === id)
                return (
                  <EditableText
                    isDisabled={rowIdx > 0 && index === 5}
                    id={id}
                    key={id}
                    borderWidth="2px"
                    borderColor={shouldWarn ? 'red.500' : 'transparent'}
                    textAlign={index === 5 && 'right'}
                    fontSize="sm"
                    textTransform={rowIdx === 0 ? 'uppercase' : 'initial'}
                    fontWeight={rowIdx === 0 ? 'semibold' : 'normal'}
                    width="full"
                    onBlur={handleBlur}
                  >
                    {value}
                  </EditableText>
                )
              })}
            </SimpleGrid>
          </Stack>
        )
      })}
      <HStack justifyContent="flex-end">
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            {total}
          </Text>
        </Box>
      </HStack>
      <HStack position="absolute" bottom={0} left={0} spacing={4}>
        <Box>
          <Button size="sm" variant="link" onClick={handleAddRow}>
            Add row
          </Button>
        </Box>
        <Box>
          <EditColumns />
        </Box>
      </HStack>
    </Stack>
  )
}

const gridItems = [
  [
    { id: 1, value: 'item' },
    { id: 2, value: 'quantity' },
    { id: 3, value: 'price €' },
    { id: 4, value: 'discount %' },
    { id: 5, value: 'tax %' },
    { id: 6, value: 'total €' },
  ],
  [
    { id: 1, value: 'Sample' },
    { id: 2, value: '12' },
    { id: 3, value: '20' },
    { id: 4, value: '15' },
    { id: 5, value: '21' },
    { id: 6, value: '240' },
  ],
  [
    { id: 1, value: 'Sample-2' },
    { id: 2, value: '12' },
    { id: 3, value: '20' },
    { id: 4, value: '15' },
    { id: 5, value: '21' },
    { id: 6, value: '240' },
  ],
]

function EditColumns() {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="link"
        size="sm"
        rightIcon={<ChevronDownIcon />}
      >
        Actions
      </MenuButton>
      <MenuList fontSize="sm" rounded="none">
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  )
}
