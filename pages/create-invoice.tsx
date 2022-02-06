/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
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
  VisuallyHiddenInput,
  TableCaption,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  TextProps,
  VStack,
  IconButton,
} from '@chakra-ui/react'
import axios from 'axios'
import React, { useReducer, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { useReactToPrint } from 'react-to-print'

import 'react-datepicker/dist/react-datepicker.css'
import Head from 'next/head'

import { useCodeMirror } from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { oneDark } from '@codemirror/theme-one-dark'
import { proxy, useSnapshot } from 'valtio'

import { FiSettings, FiPrinter, FiEdit } from 'react-icons/fi'
import { Editable } from '../components/editable'
import { InvoiceTable } from '../components/invoice-table'

const state = proxy({
  margin: { bottom: '1', top: 1, left: 3, right: 1.5 },
  setMargin: (key, value) => {
    state.margin[key] = value || 0.5
  },
})

function useStore() {
  return useSnapshot(state)
}

// const code = `<div>Hello</div>`

// function CodeEditor() {
//   const editor = React.useRef()
//   const { setContainer } = useCodeMirror({
//     container: editor.current,
//     extensions: [html()],
//     value: code,
//     theme: oneDark,
//     height: '100%',
//   })

//   React.useEffect(() => {
//     if (editor.current) {
//       setContainer(editor.current)
//     }
//   }, [editor, setContainer])

//   return <Box width="full" ref={editor} />
// }
const date = new Date()
const dueDate = new Date(date.getFullYear(), date.getMonth() + 1, 15)

// paymentDetails: `Account name: MB Kast productions\nBank name: Paysera LT, UAB\nIBAN: LT503500010014583277`,

// const data = {
//   invoiceNoLabel: 'INVOICE NO.',
//   invoiceNo: '009',
//   dueDateLabel: 'DUE DATE:',
//   dueDate,
//   refLabel: 'P.O. REF#',
//   ref: '',
//   companyName: 'MB Kast Productions',
//   address: `305830693\nMokyklos g. 13, Verstaminu k., Lazdiju raj., LT-67412\nhello@kastproductions.com`,
//   invoiceIssueDate: date.toLocaleDateString(),
//   invoiceTitle: `INVOICE`,
//   clientLabel: `CLIENT`,
//   clientCompanyName: `Brand On Demand`,
//   clientCompanyDetails: `40203267663\n Jelgava, Peldu iela 7, LV-3002`,
//   notesLabel: '',
//   notesDetails: ``,
//   paymentsLabel: 'Payment Advice',
//   paymentsDetails: `Account name: MB Kast productions\nBank name: Paysera LT, UAB\nIBAN: LT503500010014583277`,
// }

const printNode = {
  '@media print': {
    display: 'none',
  },
}

const avoidPrintBreak = {
  '@media print': {
    'page-break-inside': 'avoid',
  },
}

type DateInputProps = {
  label?: string
  date?: string
  [key: string]: string
}

function TopBar(props) {
  const { printPage, onToggle } = props
  return (
    <HStack
      h={20}
      bg="gray.900"
      position="sticky"
      top={0}
      left={0}
      width="full"
      zIndex={999}
      justifyContent="space-between"
      px={6}
    >
      <HStack spacing={3}>
        <Button onClick={onToggle} leftIcon={<FiSettings />}>
          Settings
        </Button>
      </HStack>
      <HStack spacing={3}>
        <Button leftIcon={<FiEdit />}>Save as draft</Button>
        <Button onClick={printPage} leftIcon={<FiPrinter />}>
          Print
        </Button>
      </HStack>
    </HStack>
  )
}

function DateInput({ label = 'Select date', date, ...rest }: DateInputProps) {
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
  )
}

const InvoiceContainer = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const snap = useStore()
  return (
    <Box
      ref={ref}
      boxShadow="base"
      mx="auto"
      minW="210mm"
      maxW="210mm"
      minH="297mm"
      height="full"
      bg="white"
      position="relative"
      pt={`${snap.margin.top}cm`}
      pb={`${snap.margin.bottom}cm`}
      pr={`${snap.margin.right}cm`}
      pl={`${snap.margin.left}cm`}
    >
      <Box
        top="297mm"
        left={0}
        position="absolute"
        width="full"
        height={0}
        borderBottomColor="gray.500"
        borderBottomWidth="2px"
        borderStyle="dashed"
        sx={printNode}
      />
      {props.children}
    </Box>
  )
})

export default function CreateInvoice() {
  const invoiceRef = React.useRef<HTMLDivElement>()
  const textAreaRef = React.useRef<HTMLTextAreaElement>()
  const iframeRef = React.useRef<HTMLIFrameElement>()
  const snap = useStore()

  const [isPrinting, setIsPrinting] = React.useState(false)
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

  const printPage = () => {
    const headTag = document.head
    const st = [...headTag.getElementsByTagName('STYLE')]
    const styleTags = st.reduce((acc, next) => {
      acc += next.outerHTML
      return acc
    }, '')

    axios
      .post(
        '/api/pdf',
        {
          innerHTML: invoiceRef.current.innerHTML,
          styleTags,
          margin: Object.entries(snap.margin).reduce((acc, [key, value]) => {
            acc[key] = `${value}cm`
            return acc
          }, {}),
        },
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'application/pdf',
          },
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${Date.now()}.pdf`
        link.click()
      })
      .catch(console.log)
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" /> */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        /> */}
        {/* <script src="https://cdn.tailwindcss.com" /> */}
      </Head>
      <Stack isInline spacing={0}>
        <Sidebar isOpen={isOpen} />
        <Box
          width="full"
          height="100vh"
          overflowY="auto"
          overflowX="hidden"
          bg="gray.100"
        >
          <TopBar printPage={printPage} onToggle={onToggle} />
          <HStack p={4} bg="gray.100">
            <InvoiceContainer ref={invoiceRef}>
              {/* <InvoiceToPrint /> */}
              {/* <InvoiceSample /> */}
              <InvoiceTable />
            </InvoiceContainer>
          </HStack>
        </Box>
      </Stack>
    </>
  )
}

function Sidebar(props) {
  const { isOpen } = props
  const snap = useStore()
  return (
    <Stack
      position="sticky"
      top={0}
      left={0}
      h="100vh"
      bg="white"
      w={isOpen ? 'sm' : 0}
      transition="all 0.2s ease-in-out"
    >
      <Stack
        height="full"
        p={6}
        pt={20}
        opacity={isOpen ? 1 : 0}
        visibility={isOpen ? 'visible' : 'hidden'}
        transition={isOpen ? 'all 0.5s ease-in-out' : 'all 0.1s ease-in-out'}
        shadow="base"
        spacing={10}
      >
        <Stack>
          <Text fontSize="sm" fontWeight="bold">
            Margins (cm)
          </Text>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Top</Text>
            </Box>
            <Box w="24">
              <NumberInput
                onChange={(str, num) => snap.setMargin('top', num)}
                value={snap.margin.top}
                min={0.5}
                max={5}
                step={0.1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Right</Text>
            </Box>
            <Box w="24">
              <NumberInput
                onChange={(str, num) => snap.setMargin('right', num)}
                value={snap.margin.right}
                min={0.5}
                max={5}
                step={0.1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Bottom</Text>
            </Box>
            <Box w="24">
              <NumberInput
                onChange={(str, num) => snap.setMargin('bottom', num)}
                value={snap.margin.bottom}
                min={0.5}
                max={5}
                step={0.1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Left</Text>
            </Box>
            <Box w="24">
              <NumberInput
                onChange={(str, num) => snap.setMargin('left', num)}
                value={snap.margin.left}
                min={0.5}
                max={5}
                step={0.1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </HStack>
        </Stack>
        <Stack>
          <Text fontSize="sm" fontWeight="bold">
            Fonts
          </Text>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Heading</Text>
            </Box>
            <Box w={40}>
              <Select />
            </Box>
          </HStack>
          <HStack justifyContent="space-between">
            <Box>
              <Text>Body</Text>
            </Box>
            <Box w={40}>
              <Select />
            </Box>
          </HStack>
        </Stack>
        <Stack>
          <Text fontSize="sm" fontWeight="bold">
            Templates
          </Text>
          <SimpleGrid columns={2} spacing={4}>
            <Box height={28} shadow="base" rounded="md" />
            <Box height={28} shadow="base" rounded="md" />
            <Box height={28} shadow="base" rounded="md" />
            <Box height={28} shadow="base" rounded="md" />
            <Box height={28} shadow="base" rounded="md" />
          </SimpleGrid>
        </Stack>
        <Stack />
      </Stack>
    </Stack>
  )
}

/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
  {
    name: 'Jane Cooper',
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: 'jane.cooper@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
  },
]

type InvoiceToPrintProps = {}

// function InvoiceToPrint(props: InvoiceToPrintProps) {
//   const [state, setState] = React.useState(data)
//   const [logoSrc, setLogoSrc] = React.useState('')
//   const [value, setValue] = React.useState('')
//   const inputFileRef = React.useRef<HTMLInputElement>(null)

//   const handleBlur = ({ id, innerText }) => {
//     setState((prev) => ({ ...prev, [id]: innerText }))
//   }

//   const loadFile = (event) => {
//     const src = URL.createObjectURL(event.target.files[0])
//     setLogoSrc(src)
//   }

//   const selectFile = () => {
//     inputFileRef.current.click()
//   }
//   console.log({ state })

//   return (
//     <Box height="full">
//       <Stack
//         isInline
//         justifyContent="space-between"
//         spacing={4}
//         sx={avoidPrintBreak}
//       >
//         <Box width="full">
//           <Editable onBlur={handleBlur}>
//             <Text
//               label="Enter your company name"
//               fontSize="3xl"
//               id="companyName"
//             >
//               {state.companyName}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text
//               label="Enter your company address"
//               fontSize="sm"
//               id="address"
//               color="gray.500"
//             >
//               {state.address}
//             </Text>
//           </Editable>
//         </Box>
//         <Box maxW={28} width="full" pt={1}>
//           <Tooltip label="Upload logo" placement="top-start">
//             <Box
//               minH={20}
//               onClick={selectFile}
//               cursor="pointer"
//               position="relative"
//               borderStyle="dashed"
//               borderColor="gray.300"
//               borderWidth={logoSrc ? 0 : '3px'}
//               _hover={{
//                 shadow: logoSrc ? 'none' : 'outline',
//               }}
//               sx={{
//                 '@media print': {
//                   display: logoSrc ? 'block' : 'none',
//                 },
//               }}
//             >
//               <VisuallyHiddenInput
//                 ref={inputFileRef}
//                 onChange={loadFile}
//                 type="file"
//                 accept="image/*"
//               />
//               {logoSrc && (
//                 <Image
//                   position="absolute"
//                   top={0}
//                   right={0}
//                   src={logoSrc}
//                   objectFit="contain"
//                   _hover={{
//                     shadow: 'outline',
//                   }}
//                 />
//               )}
//             </Box>
//           </Tooltip>
//         </Box>
//       </Stack>
//       <Stack as="section" isInline mt={10} spacing={4} sx={avoidPrintBreak}>
//         <Box width="50%">
//           <DateInput />
//           <Stack isInline>
//             <Box>
//               <Editable onBlur={handleBlur}>
//                 <Text
//                   bg="gray.900"
//                   px={3}
//                   color="white"
//                   label="Invoice title"
//                   fontSize="3xl"
//                   fontWeight="semibold"
//                   id="invoiceTitle"
//                 >
//                   {state.invoiceTitle}
//                 </Text>
//               </Editable>
//             </Box>
//           </Stack>
//         </Box>
//         <Box width="50%">
//           <Editable onBlur={handleBlur}>
//             <Text
//               color="gray.500"
//               width="full"
//               textAlign="right"
//               label="Client label"
//               id="clientLabel"
//             >
//               {state.clientLabel}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text
//               id="clientCompanyName"
//               // fontSize="lg"
//               fontWeight="bold"
//               width="full"
//               textAlign="right"
//               label="Client company name"
//             >
//               {state.clientCompanyName}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontSize="sm"
//               width="full"
//               textAlign="right"
//               label="Client company details"
//               id="clientCompanyDetails"
//             >
//               {state.clientCompanyDetails}
//             </Text>
//           </Editable>
//         </Box>
//       </Stack>
//       <Stack sx={avoidPrintBreak} as="section" spacing={0}>
//         <HStack>
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontWeight="bold"
//               fontSize="sm"
//               label="invoiceNoLabel"
//               id="invoiceNoLabel"
//             >
//               {state.invoiceNoLabel}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text fontSize="sm" label="invoiceNo" id="invoiceNo">
//               {state.invoiceNo}
//             </Text>
//           </Editable>
//         </HStack>
//         <HStack>
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontWeight="bold"
//               fontSize="sm"
//               label="dueDateLabel"
//               id="dueDateLabel"
//             >
//               {state.dueDateLabel}
//             </Text>
//           </Editable>
//           <DateInput fontSize="sm" date={state.dueDate} />
//         </HStack>
//         <HStack display={state.ref ? 'flex' : 'none'}>
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontWeight="bold"
//               fontSize="sm"
//               label="refLabel"
//               id="refLabel"
//             >
//               {state.refLabel}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text fontSize="sm" label="ref" id="ref">
//               {state.ref}
//             </Text>
//           </Editable>
//         </HStack>
//       </Stack>
//       <Stack>
//         <ItemsTable />
//       </Stack>
//       <Stack sx={avoidPrintBreak} as="section" spacing={10}>
//         <Stack
//           mt={10}
//           spacing={0}
//           display={state.notesDetails ? 'flex' : 'none'}
//         >
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontWeight="bold"
//               fontSize="sm"
//               label="Notes label"
//               id="notesLabel"
//             >
//               {state.notesLabel}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text
//               fontSize="sm"
//               width="full"
//               label="Notes details"
//               id="notesDetails"
//             >
//               {state.notesDetails}
//             </Text>
//           </Editable>
//         </Stack>
//         <Stack spacing={0}>
//           <Editable onBlur={handleBlur}>
//             <Text
//               color="gray.500"
//               fontWeight="bold"
//               fontSize="sm"
//               label="Payments label"
//               id="paymentsLabel"
//               textTransform="uppercase"
//             >
//               {state.paymentsLabel}
//             </Text>
//           </Editable>
//           <Editable onBlur={handleBlur}>
//             <Text
//               color="gray.500"
//               fontSize="sm"
//               width="full"
//               label="Payments details"
//               id="paymentsDetails"
//             >
//               {state.paymentsDetails}
//             </Text>
//           </Editable>
//         </Stack>

//         <Text
//           textAlign="right"
//           fontSize="xs"
//           color="gray.400"
//           sx={{
//             display: 'none',
//             '@media print': {
//               display: 'block',
//             },
//           }}
//         >
//           Invoice Template by voicly.com
//         </Text>
//       </Stack>
//     </Box>
//   )
// }

function ItemsTable() {
  const [state, setState] = React.useState(gridItems)
  // const [warnItemsList, setWarnItemsList] = React.useState([])
  // const [count, rerender] = React.useReducer((s, a = 1) => s + a, 0)

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
    <Box>
      <Stack mt={10} spacing={1} position="relative">
        <ItemsTableBetter state={state} setState={setState} />
      </Stack>
      <HStack spacing={0} position="relative" width="full">
        <HStack justifyContent="flex-end" width="full">
          <Box bg="gray.900" p={1} px={3} pl={9} mt={10}>
            <Text fontWeight="bold" fontSize="lg" color="white">
              {total} €
            </Text>
          </Box>
        </HStack>
        <HStack
          position="absolute"
          bottom={0}
          top={0}
          left={0}
          spacing={4}
          sx={printNode}
        >
          <Box>
            <Button size="sm" variant="link" onClick={handleAddRow}>
              Add row
            </Button>
          </Box>
          <Box>
            <EditColumns />
          </Box>
        </HStack>
      </HStack>
    </Box>
  )
}
// @ts-ignore
function ItemsTableBetter({ state, setState }) {
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

  return (
    <Table color="gray.900" variant="none">
      <Thead sx={avoidPrintBreak}>
        <Tr fontSize="sm" sx={avoidPrintBreak}>
          {state[0]?.map((item, index) => {
            const id = `${index}`
            const textAlign = index === state[0].length - 1 ? 'right' : 'left'
            return (
              <Editable>
                <Th key={id} px={1} py={3} textAlign={textAlign}>
                  {item.value}
                </Th>
              </Editable>
            )
          })}
        </Tr>
      </Thead>
      <Tbody>
        {state.map((row, index) => {
          if (!index) return null
          const id = `${index}`
          return (
            <Tr
              key={id}
              fontSize="sm"
              borderTopWidth="1px"
              borderTopColor="gray.300"
              sx={avoidPrintBreak}
            >
              {row.map((item, idx) => {
                const id = `${index}-${idx}`
                const textAlign = idx === row.length - 1 ? 'right' : 'left'
                return (
                  <Editable isDisabled={textAlign === 'right'}>
                    <Td px={2} key={id} py={3} textAlign={textAlign}>
                      {item.value}
                    </Td>
                  </Editable>
                )
              })}
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

const gridItems = [
  [
    { id: 1, value: 'item' },
    { id: 2, value: 'quantity (hr worked)' },
    { id: 3, value: 'price €' },
    { id: 6, value: 'total €' },
    // { id: 4, value: 'discount %' },
    // { id: 5, value: 'tax %' },
  ],
  [
    { id: 1, value: 'Frontend Software Development' },
    { id: 2, value: '36' },
    { id: 3, value: '68.75' },
    { id: 6, value: '2475.00' },
    // { id: 4, value: '15' },
    // { id: 5, value: '21' },
  ],
]

function InvoiceSample() {
  const lastColWidth = React.useRef<HTMLTableCellElement>()
  const [width, setWidth] = React.useState(0)
  const [key, setKey] = React.useState(0)

  const updateWidth = () => {
    const width = lastColWidth.current?.clientWidth
    console.log({ width })
    setWidth(width || 0)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    updateWidth()
  }, [key])

  return (
    <Box width="full" color="gray.900" fontFamily="monospace">
      <Stack isInline width="full">
        <Stack width="full">
          <HStack>
            <Editable>
              <Text fontWeight="bold" fontSize="xl">
                PVM SĄSKAITA FAKTŪRA
              </Text>
            </Editable>
          </HStack>
          <HStack fontSize="sm" spacing={1}>
            <Editable>
              <Text>Nr.</Text>
            </Editable>
            <Editable>
              <Text>000001</Text>
            </Editable>
          </HStack>
          <HStack>
            <DateInput fontSize="sm" />
          </HStack>
        </Stack>
        <Box minW={28} height={20} bg="gray.100" />
      </Stack>

      <SimpleGrid columns={2} mt={7} borderWidth="1px" borderColor="gray.900">
        <Stack borderRight="1px solid" borderColor="gray.900" p={3}>
          <Editable>
            <Text textAlign="center" fontWeight="bold" fontSize="sm">
              Pardavėjo rekvizitai
            </Text>
          </Editable>
          <Editable>
            <Text>
              Pavadinimas / Vardas, pavardė: UAB "Pirkėjo pavadinimas" Įmonės
              kodas / Asmens kodas: 301454441 PVM kodas: LT048911610 Adresas:
              Pardavėjo 10-10, Kaunas Telefonas: +370 666 88 888 El. p. adresas:
              info@fdp.lt Internetinės svetainės: www.fdp.lt Banko pavadinimas
              A/s: LT1473000620490950059
            </Text>
          </Editable>
        </Stack>
        <Stack p={3}>
          <Editable>
            <Text textAlign="center" fontWeight="bold" fontSize="sm">
              Pirkėjo rekvizitai
            </Text>
          </Editable>
          <Editable>
            <Text>
              Pavadinimas / Vardas, pavardė: UAB "Pirkėjo pavadinimas" Įmonės
              kodas / Asmens kodas: 301454441 PVM kodas: LT048911610 Adresas:
              Pardavėjo 10-10, Kaunas
            </Text>
          </Editable>
        </Stack>
      </SimpleGrid>

      <Box mt={7}>
        <Table
          variant="unstyled"
          size="sm"
          sx={{
            tableLayout: 'auto',
            borderCollapse: 'collapse',
            border: '1px solid black',
            'th, td': {
              borderWidth: '1px',
              borderColor: 'gray.900',
              textTransform: 'none',
              textAlign: 'center',
              fontSize: 'sm',
              fontFamily: 'monospace',
              px: 2,
            },
          }}
          width="full"
        >
          <Thead>
            <Tr>
              <Editable>
                <Th>Eil. Nr.</Th>
              </Editable>
              <Editable onBlur={() => setKey((prev) => prev + 1)}>
                <Th>Prekės ar paslaugos pavadinimas</Th>
              </Editable>
              <Editable>
                <Th>Mato vnt.</Th>
              </Editable>
              <Editable>
                <Th>Kiekis</Th>
              </Editable>
              <Editable>
                <Th>Kaina, EUR</Th>
              </Editable>
              <Editable>
                <Th>Suma, EUR</Th>
              </Editable>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>1.</Td>
              <Td>Sąskaitos faktūros pavyzdys </Td>
              <Td>1</Td>
              <Td>2</Td>
              <Td>30.00</Td>
              <Editable>
                <Td ref={lastColWidth}>60.00</Td>
              </Editable>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <HStack mt={7} spacing={0} justifyContent="flex-end">
        <Stack isInline spacing={0}>
          <Box
            border="1px solid black"
            py={1}
            px={2}
            minW={32}
            borderRight="none"
          >
            <Text fontWeight="bold" fontSize="sm" textAlign="center">
              Iš viso:
            </Text>
          </Box>
          <Box
            borderWidth="1px"
            borderColor="gray.900"
            py={1}
            // px={2}
            width={`${width}px`}
          >
            <Text fontSize="sm" textAlign="center">
              60.00
            </Text>
          </Box>
        </Stack>
      </HStack>
      <VStack mt={7}>
        <Text fontSize="sm">
          Sąskaitą apmokėti iki: 2019 rugsėjo 15 d. Papildoma informacija:
          atsiskaitymas bankiniu pavedimu.
        </Text>
      </VStack>
    </Box>
  )
}

function EditColumns() {
  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="link"
        size="sm"
        width="full"
        rightIcon={<ChevronDownIcon />}
      >
        Actions
      </MenuButton>
      <MenuList width="full" mt={-5} fontSize="sm" rounded="none">
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  )
}

// function DrawerExample() {
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const btnRef = React.useRef()

//   return (
//     <>
//       <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
//         Open
//       </Button>
//       <Drawer
//         isOpen={isOpen}
//         placement="left"
//         onClose={onClose}
//         finalFocusRef={btnRef}
//         blockScrollOnMount={false}
//         closeOnOverlayClick={false}
//       >
//         {/* <DrawerOverlay /> */}
//         <DrawerContent>
//           <DrawerCloseButton />
//           <DrawerHeader>Create your account</DrawerHeader>

//           <DrawerBody>
//             <Input placeholder="Type here..." />
//           </DrawerBody>

//           <DrawerFooter>
//             <Button variant="outline" mr={3} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button colorScheme="blue">Save</Button>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </>
//   )
// }
