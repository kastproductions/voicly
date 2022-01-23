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
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Editable,
  EditableInput,
  EditablePreview,
  TableCaption,
  Icon,
  Alert,
  AlertIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  LinkBox,
  LinkOverlay,
  Badge,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import React, { useReducer } from 'react'
import { useReactToPrint } from 'react-to-print'
import { proxy, useSnapshot, subscribe } from 'valtio'
import { FiPrinter, FiCheck } from 'react-icons/fi'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
// import { Editor } from "../components/editor"
import dynamic from 'next/dynamic'
import { Router, useRouter } from 'next/dist/client/router'
import {
  useFirestoreQuery,
  useFirestoreQueryData,
} from '@react-query-firebase/firestore'
import {
  query,
  collection,
  limit,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore'
import { firestore } from '../utils/firebase'
import { getFingerprint } from '../utils/fingerprint'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })
// const DEFAULT_INVOICE = {
//   title: "I N V O I C E",
//   companyName: "Example Inc.",
//   companyInfo: "example.com\ninfo@example.com",
//   recipient: "Michael Scott Paper Company Inc.\n1725 Slough Avenue\nScranton, Pennsylvania",
//   information: [
//     [{ value: "Invoice #" }, { value: "044" }],
//     [{ value: "Date" }, { value: new Intl.DateTimeFormat().format(new Date()) }],
//   ],
//   lineItems: [
//     [{ value: "Description" }, { value: "Quantity" }, { value: "Price" }],
//     [{ value: "Wheel of cheese" }, { value: 1 }, { value: 500 }],
//     [{ value: "Jar of sausages" }, { value: 2 }, { value: 2.99 }],
//     [{ value: "Tin of waffles" }, { value: 2 }, { value: 3.01 }],
//   ],
//   summary: [
//     [{ value: "Subtotal" }, undefined, "0.0"],
//     [{ value: "Tax Rate" }, { value: 0 }, "0.0"],
//     [{ value: "Total" }, { value: "$" }, "0.0"],
//   ],
//   notes: "",
// }

const DEFAULT_INVOICE = {
  title: 'I N V O I C E',
  information: [
    [{ value: 'Invoice no' }, { value: 'AA.00001' }],
    [
      { value: 'Issued on' },
      { value: new Intl.DateTimeFormat().format(new Date()) },
    ],
    [
      { value: 'Due to' },
      { value: new Intl.DateTimeFormat().format(new Date()) },
    ],
  ],
  buyer: 'me',
  seller: 'you',
  items: [
    [
      { value: 'service' },
      { value: 'units' },
      { value: 'amount' },
      { value: 'price' },
    ],
    [
      { value: 'Wheel of cheese' },
      { value: 'pc' },
      { value: 5 },
      { value: 20 },
    ],
    [
      { value: 'Jar of sausages' },
      { value: 'pc' },
      { value: 2 },
      { value: 10 },
    ],
    [{ value: 'Tin of waffles' }, { value: 'pc' }, { value: 3 }, { value: 14 }],
  ],
  taxes: [[{ value: 'VAT' }, { value: 21 }]],
  summary: [
    [{ value: 'Subtotal' }, undefined, '0.0'],
    [{ value: 'Tax Rate' }, { value: 0 }, '0.0'],
    [{ value: 'Total' }, { value: '$' }, '0.0'],
  ],
  notes: '',
}

const invoiceList = [DEFAULT_INVOICE, DEFAULT_INVOICE]

export default function Home() {
  // const { colorMode, toggleColorMode } = useColorMode()

  // const componentRef = React.useRef<HTMLDivElement>(null)
  // const onPrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onBeforeGetContent: () => {
  //     // snap.setIsPrinting(true)
  //   },
  //   onAfterPrint: () => {
  //     // snap.setIsPrinting(false)
  //   },
  // })
  // const disclosure = useDisclosure()
  // const { isOpen, onOpen, onClose, onToggle } = disclosure

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link> */}
      </Head>
      <Box
        py={16}
        fontFamily="Inter, sans-serif"
        bg="gray.100"
        minH="100vh"
        color="gray.900"
      >
        <Stack mx="auto" maxW="5xl" width="full" spacing={6}>
          <Stack spacing={10}>
            <Received />
            <InvoiceHeader />
          </Stack>
          <InvoiceList />
        </Stack>
      </Box>
      {/* <Box position="absolute" left="-10000px" width="1px" height="1px" top="auto" overflow="hidden">
        <InvoiceToPrint ref={componentRef} />
      </Box> */}
    </>
  )
}

function InvoiceHeader() {
  const router = useRouter()
  return (
    <Stack isInline justifyContent="space-between">
      <Stack width="full">
        <Text fontSize="xl" fontWeight="bold" lineHeight="none">
          Invoices
        </Text>
      </Stack>
      <Box>
        {/* <InvoiceDrawer onPrint={onPrint} /> */}

        <Button
          onClick={() => router.push('/create')}
          // ref={btnRef}
          _hover={{ bg: 'blue.400' }}
          letterSpacing="wider"
          size="lg"
          fontSize="xs"
          bg="blue.500"
          textTransform="uppercase"
          color="white"
          fontWeight="bold"
          _active={{}}
        >
          + new invoice
        </Button>
      </Box>
    </Stack>
  )
}

function InvoiceList() {
  const ref = query(collection(firestore, 'user/QqRKh8emY1adnphvCRbo/invoice'))
  const { isLoading, data } = useFirestoreQueryData(['invoice'], ref, {
    subscribe: true,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  // console.log({ data })

  return (
    <Stack>
      <Stack
        width="full"
        isInline
        alignItems="center"
        justifyContent="space-between"
        px={6}
      >
        {['No', 'Date', 'Client', 'Amount', 'Status'].map((item, index) => {
          const first = index === 0
          const last = index === 4
          return (
            <Box key={item} flex={1}>
              <Text
                textAlign={first ? 'start' : last ? 'end' : 'center'}
                fontWeight="semibold"
                fontSize="sm"
                color="gray.500"
              >
                {item}
              </Text>
            </Box>
          )
        })}
      </Stack>
      <Stack width="full" spacing={3}>
        {invoiceList.map(({ title, information }) => {
          return (
            <Button
              key={title}
              height={16}
              px={6}
              width="full"
              bg="white"
              rounded="md"
              boxShadow="base"
              justifyContent="space-between"
              fontSize="sm"
              _hover={{
                boxShadow: 'outline',
              }}
            >
              <Box flex={1}>
                <Text fontWeight="black" textAlign="start">
                  {information[0][1].value}
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontWeight="semibold" textAlign="center" color="gray.600">
                  {information[1][1].value}
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontWeight="semibold" textAlign="center" color="gray.600">
                  Tony Stark
                </Text>
              </Box>
              <Box flex={1}>
                <Text fontWeight="semibold" textAlign="center" color="gray.600">
                  1000.00
                </Text>
              </Box>
              <Stack isInline flex={1} justifyContent="flex-end">
                <Box>
                  <Badge
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    // width={16}
                    px={4}
                    isInline
                    textTransform="capitalize"
                    fontWeight="bold"
                    textAlign="end"
                    py={2}
                    colorScheme="green"
                    rounded="full"
                    bg="green.50"
                    color="green.500"
                    fontSize="xs"
                  >
                    <Box mr={1} ml={-1}>
                      <Icon as={FiCheck} fontSize="md" strokeWidth="3" />
                    </Box>
                    Paid
                  </Badge>
                </Box>
              </Stack>
            </Button>
          )
        })}
      </Stack>
    </Stack>
  )
}

function Received() {
  return (
    <Stack isInline>
      <Stack spacing={10}>
        <Box>
          <Text fontWeight="bold" lineHeight="none" fontSize="xl">
            Payments
          </Text>
        </Box>
        <Stack
          p={6}
          px={10}
          boxShadow="base"
          width="auto"
          bg="white"
          rounded="md"
          isInline
          spacing={10}
        >
          <Stack position="relative">
            <Text
              textTransform="uppercase"
              fontSize="xs"
              color="gray.400"
              fontWeight="semibold"
              letterSpacing="widest"
              lineHeight="none"
            >
              Total received
            </Text>
            <Box position="absolute" top={3} left={-5}>
              <Text fontSize="2xl" fontWeight="semibold" color="gray.400">
                $
              </Text>
            </Box>
            <Text fontSize="5xl" fontWeight="bold" lineHeight="none">
              84,254.50
            </Text>
          </Stack>
          <Stack flex={1} spacing={5}>
            <Stack spacing={2}>
              <Stack isInline spacing={2} alignItems="center">
                <Box rounded="full" bg="blue.500" boxSize={2} />
                <Text
                  lineHeight="none"
                  fontSize="xs"
                  color="blue.500"
                  fontWeight="bolder"
                >
                  Pending
                </Text>
              </Stack>
              <Text lineHeight="none" fontWeight="medium" color="gray.600">
                $5600.00
              </Text>
            </Stack>
            <Stack spacing={2}>
              <Stack isInline spacing={2} alignItems="center">
                <Box rounded="full" bg="orange.500" boxSize={2} />
                <Text
                  lineHeight="none"
                  fontSize="xs"
                  color="orange.500"
                  fontWeight="bolder"
                >
                  In drafts
                </Text>
              </Stack>

              <Text lineHeight="none" fontWeight="medium" color="gray.600">
                $2100.00
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

function SizeExample() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = React.useState('md')
  const [key, rerender] = React.useReducer(
    (state, action = 1) => state + action,
    0
  )

  React.useEffect(() => {
    setTimeout(() => {
      rerender()
    }, 3000)
  }, [])

  return (
    <>
      <Button
        onClick={onOpen}
        // ref={btnRef}
        _hover={{ bg: 'blue.400' }}
        letterSpacing="wider"
        size="lg"
        fontSize="xs"
        bg="blue.500"
        textTransform="uppercase"
        color="white"
        fontWeight="bold"
        _active={{}}
      >
        + new invoice
      </Button>

      <Drawer onClose={onClose} isOpen={false} size="full">
        <DrawerOverlay />
        <DrawerContent height="full">
          {/* <DrawerHeader>Invoice</DrawerHeader> */}
          <DrawerBody bg="gray.100" />
        </DrawerContent>
      </Drawer>
    </>
  )
}

// const useRefDimensions = (refs: { current: HTMLDivElement }[]) => {
//   const [dimensions, setDimensions] = React.useState(widths: )
//   React.useEffect(() => {
//     if (ref.current) {
//       const { current } = ref
//       const boundingRect = current.getBoundingClientRect()
//       const { width, height } = boundingRect
//       setDimensions({ width: Math.round(width), height: Math.round(height) })
//     }
//   }, [ref])
//   return dimensions
// }

const InvoiceToPrint = React.forwardRef((props, ref) => {
  return (
    // @ts-ignore
    <Stack spacing={2} bg="white" width="21cm" ref={ref}>
      <Box mx={20} my={32}>
        <Text>Hello world</Text>
      </Box>
    </Stack>
  )
})

InvoiceToPrint.displayName = 'InvoiceToPrint'

// const state = proxy({
//   invoiceItems: [],
//   addInvoiceItem(item) {
//     state.invoiceItems.push(item)
//   },
// })

// function useState() {
//   return useSnapshot(state)
// }

// const dd = {
//   invoiceTitle: "INVOICE",
//   no: { name: "Serial No.", value: "AA.00002" },
//   date: { name: "Invoice date:", value: "2020-04-30" },
//   seller: {
//     name: "Seller",
//     value: `Tony Stark\nAvengers Mansion\n890 Fifth Avenue\nManhattan New York 10004`,
//   },
//   buyer: {
//     name: "Buyer",
//     value: `Tony Stark\nAvengers Mansion\n890 Fifth Avenue\nManhattan New York 10004`,
//   },
//   table: {
//     headerNames: {
//       service: "Service",
//       units: "Units",
//       amount: "Amount",
//       price: "Price",
//       total: "Total",
//     },
//     sampleRow: {
//       service: "Service",
//       units: "days",
//       amount: "5.00",
//       price: "100",
//     },
//   },
//   notes: "Notes",
// }

// const defaultInvoiceItem = {
//   id: "123",
//   service: "Web Development",
//   units: "days",
//   amount: "8.00",
//   price: "100.00",
// }

// interface InvoiceItem {
//   id: string
//   service: string
//   units: string
//   amount: string
//   price: string
//   total: string
// }

// const state = proxy({
//   isPrinting: false,
//   invoiceItems: [],
//   totalAmount: "0",
//   defaultInvoiceItem: {},
//   invoiceLocalData: {},
//   // setInvoiceLocalDataOnce() {
//   //   let invoiceLocalData = JSON.parse(localStorage.getItem("invoiceLocalData") || "null")
//   //   if (!invoiceLocalData) {
//   //     invoiceLocalData = dd
//   //     localStorage.setItem("invoiceLocalData", JSON.stringify(invoiceLocalData))
//   //   }

//   //   const invoiceItems = JSON.parse(localStorage.getItem("invoiceItems") || "[]")
//   //   localStorage.setItem("invoiceItems", JSON.stringify(invoiceItems))

//   //   state.invoiceLocalData = invoiceLocalData
//   //   state.invoiceItems = invoiceItems
//   //   state.defaultInvoiceItem = invoiceItems.length ? invoiceItems[invoiceItems.length - 1] : defaultInvoiceItem
//   // },
//   // updateInvoice(keys: (keyof typeof dd)[], value: string) {
//   //   let data = state.invoiceLocalData as typeof dd
//   //   keys.forEach((key) => {
//   //     if (keys[keys.length - 1] === key) {
//   //       data[key] = value
//   //     } else {
//   //       data = data[key]
//   //     }
//   //   })
//   // },
//   updateTotalAmount() {
//     const totalAmount = state.invoiceItems
//       .reduce((acc, { amount, price }) => {
//         acc += Number(amount) * Number(price)
//         return acc
//       }, 0)
//       .toFixed(2)
//     state.totalAmount = totalAmount
//   },
//   setIsPrinting(bool: boolean) {
//     state.isPrinting = bool
//   },
//   addInvoiceItem(item: InvoiceItem) {
//     if (Object.values(item).some((val) => !val)) return
//     const price = (+item.price).toFixed(2)
//     const amount = (+item.amount).toFixed(2)
//     const newItem = { ...item, price, amount, id: nanoid(), total: getTotal({ price, amount }) }
//     state.defaultInvoiceItem = newItem
//     state.invoiceItems = [...state.invoiceItems, newItem]
//   },
//   removeInvoiceItem(id: string) {
//     state.invoiceItems = state.invoiceItems.filter((item) => item.id !== id)
//   },
//   updateInvoiceItem({ id, prop, value }: { id: string; prop: keyof InvoiceItem; value: string }) {
//     state.invoiceItems = [...state.invoiceItems].map((item) => {
//       const isNumber = prop === "amount" || prop === "price"
//       console.log({ isNumber, prop, value })
//       return item.id === id
//         ? {
//             ...item,
//             [prop]: isNumber ? (+value).toFixed(2) : value,
//           }
//         : item
//     })
//     // const shoudRecalcTotal = prop === "amount" || prop === "price"
//     // state.invoiceItems.map((item) => {
//     //   if (item.id === id && shoudRecalcTotal) {
//     //     const total = getTotal({ price: item.price, amount: item.amount })
//     //     return {
//     //       ...item,
//     //       total,
//     //       [prop]: value,
//     //     }
//     //   }
//     //   return { ...item, [prop]: value }
//     // })
//   },
// })

// function getTotal({ price, amount }) {
//   return (Number(amount) * Number(price)).toFixed(2)
// }

// // subscribe(state, () => {
// //   if (state.invoiceLocalData.length !== 0) {
// //     localStorage.setItem("invoiceLocalData", JSON.stringify(state.invoiceLocalData))
// //   }
// //   if (state.invoiceItems.length !== 0) {
// //     localStorage.setItem("invoiceItems", JSON.stringify(state.invoiceItems))
// //   }
// // })

// function useStore() {
//   return useSnapshot(state)
// }

// function useFingerprint() {
//   const { data } = useQuery("fingerprint", getFingerprint)
//   return data
// }

// function useInitializeData() {
//   const fingerprint = useFingerprint()
//   const queryClient = useQueryClient()

//   React.useEffect(() => {
//     if (!fingerprint) return
//     const callback = (data) => {
//       queryClient.setQueryData("data", data)
//     }
//     const unsubscribe = subscribeOnDataChange({ fingerprint, callback })
//     return () => {
//       if (unsubscribe) unsubscribe()
//     }
//   }, [fingerprint])
// }

// function useRemoteData() {
//   return useQuery("data")
// }

// export default function Home() {
//   useInitializeData()
//   const { data } = useRemoteData()
//   const snap = useStore()

//   // const theme = useTheme()
//   const componentRef = React.useRef<HTMLDivElement>(null)
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onBeforeGetContent: () => {
//       snap.setIsPrinting(true)
//     },
//     onAfterPrint: () => {
//       snap.setIsPrinting(false)
//     },
//   })
//   const disclosure = useDisclosure()
//   const { isOpen, onOpen, onClose, onToggle } = disclosure
//   // const isOpen = true
//   if (!data) return null

//   return (
//     <>
//       <Head>
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
//         <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
//       </Head>
//       <Stack bg="gray.100" minH="100vh" spacing={0} fontFamily="Quicksand">
//         {/* <DrawerExample {...disclosure} handlePrint={handlePrint} /> */}

//         <Stack
//           spacing={0}
//           as="main"
//           // transform={isOpen ? `translateX(${theme.sizes.lg})` : "translateX(0)"}
//           // width={isOpen ? `calc(100% - ${theme.sizes.lg})` : "full"}
//           // transition="all 0.2s"
//           py={10}
//         >
//           <Box mx="auto" position="relative">
//             {/* <Box pb={4}>
//               <Alert status="info">
//                 <AlertIcon />
//                 Beta
//               </Alert>
//             </Box> */}
//             <Box boxShadow="base">
//               <InvoiceToPrint ref={componentRef} />
//             </Box>
//             <Box position="absolute" top={0} right={-16}>
//               <Box>
//                 <Button onClick={handlePrint}>
//                   <Icon as={FiPrinter} fontSize="2xl" />
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         </Stack>
//       </Stack>
//     </>
//   )
// }

// const InvoiceToPrint = React.forwardRef((props, ref) => {
//   const snap = useStore()
//   const { data } = useRemoteData()
//   console.log({ data })
//   // Set local data on mount
//   // React.useEffect(() => {
//   //   snap.setInvoiceLocalDataOnce()
//   // }, [])

//   // React.useEffect(() => {
//   //   snap.updateTotalAmount()
//   // }, [snap.invoiceItems])

//   return (
// <Stack spacing={2} bg="white" width="21cm" ref={ref}>
//   <Box mx={20} my={32}>
//         <Box>
//           <Stack isInline justifyContent="space-between">
//             <Box>
//               <EditableText onClickOutside={(value) => snap.updateInvoice(["invoiceTitle"], value)} defaultValue={dd.invoiceTitle}>
//                 <Text fontSize="xl" fontWeight="bold" whiteSpace="pre">
//                   {data.invoiceTitle}
//                 </Text>
//               </EditableText>
//             </Box>
//             <Stack fontSize="sm" spacing={1}>
//               <Stack isInline alignItems="center" spacing={1}>
//                 <Box>
//                   <EditableText onClickOutside={(value) => snap.updateInvoice(["no", "name"], value)} defaultValue={dd.no.name}>
//                     <Text>{snap.invoiceLocalData?.no?.name}</Text>
//                   </EditableText>
//                 </Box>
//                 <Box>
//                   <EditableText onClickOutside={(value) => snap.updateInvoice(["no", "value"], value)} defaultValue={dd.no.value}>
//                     <Text>{snap.invoiceLocalData?.no?.value}</Text>
//                   </EditableText>
//                 </Box>
//               </Stack>
//               <Stack isInline alignItems="center" spacing={1}>
//                 <Box>
//                   <EditableText onClickOutside={(value) => snap.updateInvoice(["date", "name"], value)} defaultValue={dd.date.name}>
//                     <Text>{snap.invoiceLocalData?.date?.name}</Text>
//                   </EditableText>
//                 </Box>
//                 <Box>
//                   <EditableText onClickOutside={(value) => snap.updateInvoice(["date", "value"], value)} defaultValue={dd.date.value}>
//                     <Text>{snap.invoiceLocalData?.date?.value}</Text>
//                   </EditableText>
//                 </Box>
//               </Stack>
//             </Stack>
//           </Stack>
//           <Stack isInline pt={16} spacing={16}>
//             <Stack flex={1}>
//               <Box>
//                 <EditableText onClickOutside={(value) => snap.updateInvoice(["seller", "name"], value)} defaultValue={dd.seller.name}>
//                   <Text fontSize="3xl">{snap.invoiceLocalData?.seller?.name}</Text>
//                 </EditableText>
//               </Box>
//               <Box>
//                 <EditableText onClickOutside={(value) => snap.updateInvoice(["seller", "value"], value)} defaultValue={dd.seller.value}>
//                   <Text fontSize="sm" whiteSpace="pre">
//                     {snap.invoiceLocalData?.seller?.value}
//                   </Text>
//                 </EditableText>
//               </Box>
//             </Stack>
//             <Stack flex={1}>
//               <Box>
//                 <EditableText onClickOutside={(value) => snap.updateInvoice(["buyer", "name"], value)} defaultValue={dd.buyer.name}>
//                   <Text fontSize="3xl">{snap.invoiceLocalData?.buyer?.name}</Text>
//                 </EditableText>
//               </Box>
//               <Box>
//                 <EditableText onClickOutside={(value) => snap.updateInvoice(["buyer", "value"], value)} defaultValue={dd.buyer.value}>
//                   <Text fontSize="sm" whiteSpace="pre">
//                     {snap.invoiceLocalData?.buyer?.value}
//                   </Text>
//                 </EditableText>
//               </Box>
//             </Stack>
//           </Stack>
//           <Stack pt={16}>
//             <Table>
//               <EditableText onClickOutside={(value) => snap.updateInvoice(["notes"], value)} defaultValue={dd.notes}>
//                 <TableCaption
//                   display={snap.isPrinting && dd.notes === snap.invoiceLocalData.notes ? "none" : "table-caption"}
//                   fontWeight="normal"
//                   textAlign="left"
//                   px={0}
//                   whiteSpace="pre"
//                 >
//                   {snap.invoiceLocalData.notes}
//                 </TableCaption>
//               </EditableText>

//               <Thead>
//                 <Tr px={0}>
//                   <EditableText
//                     onClickOutside={(value) => snap.updateInvoice(["table", "headerNames", "service"], value)}
//                     defaultValue={dd.table.headerNames.service}
//                   >
//                     <Th px={0}>{snap.invoiceLocalData?.table?.headerNames.service}</Th>
//                   </EditableText>
//                   <EditableText
//                     onClickOutside={(value) => snap.updateInvoice(["table", "headerNames", "units"], value)}
//                     defaultValue={dd.table.headerNames.units}
//                   >
//                     <Th textAlign="center">{snap.invoiceLocalData.table?.headerNames.units}</Th>
//                   </EditableText>
//                   <EditableText
//                     onClickOutside={(value) => snap.updateInvoice(["table", "headerNames", "amount"], value)}
//                     defaultValue={dd.table.headerNames.amount}
//                   >
//                     <Th textAlign="center">{snap.invoiceLocalData.table?.headerNames.amount}</Th>
//                   </EditableText>
//                   <EditableText
//                     onClickOutside={(value) => snap.updateInvoice(["table", "headerNames", "price"], value)}
//                     defaultValue={dd.table.headerNames.price}
//                   >
//                     <Th textAlign="center">{snap.invoiceLocalData.table?.headerNames.price}</Th>
//                   </EditableText>
//                   <EditableText
//                     onClickOutside={(value) => snap.updateInvoice(["table", "headerNames", "total"], value)}
//                     defaultValue={dd.table.headerNames.total}
//                   >
//                     <Th isNumeric textAlign="right" pr={0}>
//                       {snap.invoiceLocalData.table?.headerNames.total}
//                     </Th>
//                   </EditableText>
//                 </Tr>
//               </Thead>
//               <Tbody fontSize="sm">
//                 <InvoiceItemList />
//                 <InvoiceItemInput />
//               </Tbody>
//               <Tfoot px="0" fontFamily="inherit">
//                 <Tr px="0" color="gray.900" fontFamily="inherit">
//                   <Th></Th>
//                   <Th></Th>
//                   <Th></Th>
//                   <Th
//                     wordSpacing="0px"
//                     fontFamily="inherit"
//                     pt={10}
//                     color="gray.900"
//                     px="0"
//                     textTransform="none"
//                     fontSize="sm"
//                     fontWeight="normal"
//                   >
//                     Total amount
//                   </Th>
//                   <Th
//                     fontFamily="inherit"
//                     pt={10}
//                     color="gray.900"
//                     px="0"
//                     textTransform="none"
//                     fontSize="xl"
//                     fontWeight="semibold"
//                     isNumeric
//                   >
//                     {snap.totalAmount}
//                   </Th>
//                 </Tr>
//               </Tfoot>
//             </Table>
//           </Stack>
//         </Box>
//       </Box>
//     </Stack>
//   )
// })
// InvoiceToPrint.displayName = "InvoiceToPrint"

// // function TotalSum() {
// //   return (
// //     <Stack ml="auto">
// //       <Box>
// //         <Text>Total:</Text>
// //       </Box>
// //     </Stack>
// //   )
// // }

// function InvoiceItemList() {
//   const snap = useStore()
//   return (
//     <>
//       {snap.invoiceItems.map(({ id, service, units, amount, price, total }) => (
//         <Tr key={id} position="relative" px={0} overflowX="hidden">
//           <EditableText onClickOutside={(value) => snap.updateInvoiceItem({ id, prop: "service", value })} defaultValue="Service">
//             <Td px={0}>{service}</Td>
//           </EditableText>
//           <EditableText onClickOutside={(value) => snap.updateInvoiceItem({ id, prop: "units", value })} defaultValue="days">
//             <Td textAlign="center">{units}</Td>
//           </EditableText>
//           {/* <EditableText onClickOutside={console.log} defaultValue="0.00"> */}
//           <Td textAlign="center">{amount}</Td>
//           {/* </EditableText> */}
//           {/* <EditableText onClickOutside={console.log} defaultValue="0.00"> */}
//           <Td textAlign="center">{price}</Td>
//           {/* </EditableText> */}
//           <Td isNumeric textAlign="right" pr={0}>
//             {total}
//           </Td>
//           <Box display={snap.isPrinting ? "none" : "block"} position="absolute" left={-8} top={4}>
//             <Box>
//               <Button size="xs" variant="unstyled" onClick={() => snap.removeInvoiceItem(id)}>
//                 -
//               </Button>
//             </Box>
//           </Box>
//         </Tr>
//       ))}
//     </>
//   )
// }

// function InvoiceItemInput() {
//   const snap = useStore()
//   const [item, setItem] = React.useState(() => snap.defaultInvoiceItem)

//   React.useEffect(() => {
//     setItem(snap.defaultInvoiceItem)
//   }, [snap.defaultInvoiceItem])

//   const handleChange = ({ target }) => {
//     const { name, value } = target
//     setItem((prev) => ({ ...prev, [name]: value }))
//   }

//   const getTrimmedItem = React.useCallback(() => {
//     const trimmedItem = Object.entries(item).reduce((acc, [key, value]) => {
//       acc[key] = value.trim()
//       return acc
//     }, {})
//     return trimmedItem
//   }, [item])

//   return (
//     <Tr display={snap.isPrinting ? "none" : "table-row"} fontSize="sm">
//       <Td px={0}>
//         <Input
//           name="service"
//           defaultValue={snap.defaultInvoiceItem.service}
//           width="full"
//           py={0}
//           fontSize="sm"
//           variant="flushed"
//           placeholder="Service"
//           onChange={handleChange}
//         />
//       </Td>
//       <Td px={0}>
//         <Input
//           name="units"
//           defaultValue={snap.defaultInvoiceItem.units}
//           width="full"
//           textAlign="center"
//           fontSize="sm"
//           variant="flushed"
//           placeholder="Units"
//           onChange={handleChange}
//         />
//       </Td>
//       <Td px={0}>
//         <Input
//           type="number"
//           name="amount"
//           defaultValue={snap.defaultInvoiceItem.amount}
//           width="full"
//           textAlign="center"
//           fontSize="sm"
//           variant="flushed"
//           placeholder="Amount"
//           onChange={handleChange}
//         />
//       </Td>
//       <Td px={0}>
//         <Input
//           type="number"
//           name="price"
//           defaultValue={snap.defaultInvoiceItem.price}
//           width="full"
//           textAlign="center"
//           fontSize="sm"
//           variant="flushed"
//           placeholder="Price"
//           onChange={handleChange}
//         />
//       </Td>
//       <Td px={0}>
//         <Stack justifyContent="flex-end" isInline>
//           <Button
//             onClick={() => {
//               const trimmed = getTrimmedItem(item)
//               snap.addInvoiceItem(trimmed)
//             }}
//           >
//             +
//           </Button>
//         </Stack>
//       </Td>
//     </Tr>
//   )
// }

// function DrawerExample({ isOpen, onOpen, onClose, handlePrint }) {
//   const btnRef = React.useRef()
//   const snap = useStore()

//   return (
//     <>
//       <Box position="fixed" top={0} left={0} p={10} zIndex={999}>
//         <Button rounded="full" ref={btnRef} colorScheme="teal" onClick={onOpen}>
//           +
//         </Button>
//       </Box>
//       <Drawer
//         blockScrollOnMount={false}
//         transition="all 0.2s ease-out"
//         size="md"
//         isOpen={isOpen}
//         placement="left"
//         onClose={onClose}
//         finalFocusRef={btnRef}
//       >
//         {/* <DrawerOverlay /> */}
//         <DrawerContent boxShadow="base">
//           <DrawerCloseButton />
//           <DrawerHeader>Invoice data</DrawerHeader>

//           <DrawerBody>
//             <Stack>
//               <FormControl id="serial-no" isRequired>
//                 <FormLabel>Serial No.</FormLabel>
//                 <Input placeholder="AA.00002" />
//               </FormControl>
//               <FormControl id="invoice-date" isRequired>
//                 <FormLabel>Invoice date:</FormLabel>
//                 <Input placeholder="2020-04-30" />
//               </FormControl>
//               <FormControl id="seller" isRequired>
//                 <FormLabel>Seller</FormLabel>
//                 <Textarea />
//               </FormControl>
//               <FormControl id="buyer" isRequired>
//                 <FormLabel>Buyer</FormLabel>
//                 <Textarea />
//               </FormControl>

//               <Stack as="form" p={3} rounded="md" boxShadow="base">
//                 <Box>
//                   <FormControl id="service" isRequired>
//                     <FormLabel>Service</FormLabel>
//                     <Input />
//                   </FormControl>
//                 </Box>
//                 <Stack isInline>
//                   <Box>
//                     <FormControl id="units" isRequired>
//                       <FormLabel>Units</FormLabel>
//                       <Input />
//                     </FormControl>
//                   </Box>
//                   <Box>
//                     <FormControl id="amount" isRequired>
//                       <FormLabel>Amount</FormLabel>
//                       <Input />
//                     </FormControl>
//                   </Box>
//                   <Box>
//                     <FormControl id="price" isRequired>
//                       <FormLabel>Price</FormLabel>
//                       <Input />
//                     </FormControl>
//                   </Box>
//                   <Stack>
//                     <Box mt="auto">
//                       <Button type="submit">+</Button>
//                     </Box>
//                   </Stack>
//                 </Stack>
//               </Stack>
//             </Stack>
//           </DrawerBody>

//           <DrawerFooter>
//             <Stack isInline width="full">
//               <Button width="full" height={14} colorScheme="blue" fontSize="lg" onClick={handlePrint}>
//                 Download
//               </Button>
//             </Stack>
//           </DrawerFooter>
//         </DrawerContent>
//       </Drawer>
//     </>
//   )
// }

// type EditableTextProps = {
//   onClickOutside: (value: string) => void
//   defaultValue?: string
//   children: React.ReactNode
// }

// function EditableText({ onClickOutside, defaultValue, children }: EditableTextProps) {
//   const element = React.useRef<HTMLElement>(null)
//   // const [innerText, setText] = React.useState("")

//   const elements = React.useMemo(() => {
//     const elementsArray = React.Children.toArray(children)
//     if (elementsArray.length > 1) {
//       throw Error("Can't have more than one child")
//     }
//     return elementsArray
//   }, [children])

//   return React.cloneElement(elements[0] as React.ReactElement, {
//     contentEditable: true,
//     suppressContentEditableWarning: true,
//     ref: element,
//     // onInput: (e) => setText(e.target.innerText),
//     // onFocus: (e) => setText(e.target.innerText),
//     onBlur: (e) => {
//       const { innerText } = e.target
//       // console.log({ innerText })
//       innerText.trim().length > 0 ? onClickOutside(innerText.trim()) : onClickOutside(defaultValue || "")

//       // innerText.trim().length > 0 ? onClickOutside((+innerText.trim()).toFixed(2)) : onClickOutside(defaultValue || "")
//     },
//   })
// }
