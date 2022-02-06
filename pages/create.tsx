/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Stack,
  Text,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Input,
  Image,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import Head from 'next/head'
import React, { useReducer } from 'react'
import { useReactToPrint } from 'react-to-print'
// import { proxy, useSnapshot, subscribe } from "valtio"
// import { FiPrinter } from "react-icons/fi"
// import { getFingerprint } from "../utils/fingerprint"
// import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query"
// import { addInvoiceItem, subscribeOnDataChange } from "../utils/firebase"
// import { FiCheck } from "react-icons/fi"
import dynamic from 'next/dynamic'
import { useRouter } from 'next/dist/client/router'
import Script from 'next/script'

const Editor = dynamic(() => import('../components/editor'), { ssr: false })

export default function Create() {
  const componentRef = React.useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = React.useState(false)
  const [isRetina, setIsRetina] = React.useState(false)
  const [showEditableFields, setShowEditableFields] = React.useState(false)
  const [fontFamily, setFontFamily] = React.useState('monospace')

  // const [key, rerender] = React.useReducer((state, action = 1) => state + action, 0)

  const router = useRouter()
  const print = useReactToPrint({
    content: () => componentRef.current,
    // fonts: [{ family: "Montserrat", source: "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"}],
    // onBeforeGetContent: () => {
    //   setIsPrinting(false)
    // },
    // onBeforePrint: () => {
    //   setIsPrinting(true)
    // },
    onAfterPrint: () => {
      setIsPrinting(false)
      // router.push("/")
    },
  })

  // React.useEffect(() => {
  //   setIsRetina(window.devicePixelRatio > 1)
  // }, [])

  const onPrint = () => {
    setIsPrinting(true)
    setShowEditableFields(false)
    print && print()
  }

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Stack
        isInline
        py={16}
        bg="gray.100"
        minH="100vh"
        color="gray.900"
        width="full"
      >
        <Box mx="auto">
          <Stack isInline spacing={16}>
            <Box>
              <Box
                boxShadow="base"
                mx="auto"
                width="210mm"
                minH="297mm"
                // width={isRetina ? "calc(210mm * 1.38)" : "210mm"}
                bg="white"
                // minH={isRetina ? "calc(297mm * 1.38)" : "297mm"}
                position="relative"
              >
                <InvoiceToPrint
                  fontFamily={fontFamily}
                  ref={componentRef}
                  isPrinting={isPrinting}
                  showEditableFields={showEditableFields}
                />
                <Box
                  position="absolute"
                  // top={isRetina ? "calc(297mm * 1.38)" : "297mm"}
                  top="297mm"
                  left={0}
                  width="full"
                  height="1px"
                  borderBottom="1px dashed"
                  borderColor="gray.400"
                />
              </Box>
            </Box>
            <Stack>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="fields" mb="0">
                  Show editable fields
                </FormLabel>
                <Switch
                  id="fields"
                  isChecked={showEditableFields}
                  onChange={() => setShowEditableFields(!showEditableFields)}
                />
              </FormControl>
              <Stack isInline alignItems="center">
                <Text>Font:</Text>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option value="Roboto">Roboto</option>
                  <option value="system-ui">system-ui</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="monospace">monospace</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
              </Stack>
              <Stack isInline>
                <Button onClick={() => router.push('/')}>Home</Button>
                <Button onClick={onPrint}>Print</Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </>
  )
}

const sampleInvoiceInput = {
  seller: {
    sellerName: `<h2>“HELLO WORLD”</h2>`,
    sellerHeader: ``,
    sellerDetails: `
      <p>Address: hello st. 66, World</p>
      <p>Tel: +12345678</p>
      <p>Code: 123</p>
      <p>Email: hello@helloworld.com</p>
      <p>Website: https://helloworld.com</p>
    `,
    issuedOnName: '',
    issuedOn: `<p>${new Date().toLocaleDateString('en-US')}</p>`,
    invoiceName: '<h2><strong>INVOICE</strong></h2>',
    dueToName: '<p><strong>DUE TO:</strong></p>',
    dueTo: '<p>09-11-2021</p>',
    invoiceNoName: '<p><strong>SINVOICE NO.:</strong></p>',
    invoiceNo: '<p>00001</p>',
  },
  buyer: {
    buyerHeader: `<p style="text-align: right">Client</p>`,
    buyerName: `
    <p style="text-align: right"><strong>“Hello Client”</strong></p>
    `,
    buyerDetails: `
      <p style="text-align: right">Address: Hello address 67, World</p>
      <p style="text-align: right">Code: 321</p>
    `,
  },
  table: [
    [
      { type: 'Service', name: 'Service', value: 'Service', enabled: true },
      { type: 'Units', name: 'Units', value: 'Units', enabled: true },
      { type: 'Amount', name: 'Amount', value: 'Amount', enabled: true },
      { type: 'Price', name: 'Price', value: 'Price, EUR', enabled: true },
      { type: 'Total', name: 'Total', value: 'Total, EUR', enabled: true },
    ],
    [
      { type: 'Service', value: 'Web development' },
      { type: 'Units', value: 'hours' },
      { type: 'Amount', value: '5' },
      { type: 'Price', value: '100.00' },
      { type: 'Total', value: '500.00' },
    ],
  ],
  tax: { name: 'VAT', percent: '10' },
  taxTotal: '0',
  total: '0',
  notes: `
    <p><strong>NOTES</strong></p>
    <p>Bank address: Hello 16, World</p><p>Bank name: HHH</p><p>Receiver: “Hello World”</p><p>IBAN: LT1234567890</p><p>SWIFT/BIC: WWWXXX</p><p>Country: Lithuania</p>
  `,
}

const InvoiceToPrint = React.forwardRef(
  ({ isPrinting, fontFamily, showEditableFields }: any, ref) => {
    const [state, setstate] = React.useState(() => sampleInvoiceInput)

    const { onSelectFile, selectedFile, preview } = useImageUpload()

    const {
      sellerName,
      sellerDetails,
      issuedOnName,
      issuedOn,
      dueToName,
      dueTo,
      invoiceNoName,
      invoiceNo,
      invoiceName,
    } = state.seller
    const { buyerHeader, buyerName, buyerDetails } = state.buyer
    const { notes } = state

    const [picture, setPicture] = React.useState('')

    // @ts-ignore
    const onChangePicture = (e) => {
      setPicture(URL.createObjectURL(e.target.files[0]))
    }

    return (
      //  @ts-ignore
      <Box
        fontFamily={fontFamily}
        // @ts-ignore
        ref={ref}
        height="full"
        width="full"
        p="1cm"
        pl="2.5cm"
        pt="2cm"
        color="gray.900"
        id="invoice-container"
        position="relative"
      >
        <Stack isInline>
          <Box flex={0.7} bg={showEditableFields ? 'blue.50' : 'transparent'}>
            <Editor content={sellerName} />
            <Editor content={sellerDetails} />
          </Box>
          <Stack
            justifyContent="center"
            alignItems="center"
            flex={0.3}
            border={isPrinting || picture ? 'none' : '1px dashed'}
            maxH={32}
            borderColor="gray.300"
            bg={showEditableFields ? 'blue.50' : 'transparent'}
          >
            <Box
              as="label"
              htmlFor="upload-logo"
              cursor="pointer"
              width="full"
              height="full"
            >
              {!isPrinting && !picture && (
                <input
                  name="logo"
                  id="upload-logo"
                  type="file"
                  onChange={onChangePicture}
                />
              )}
              {picture && (
                <Image
                  maxW={64}
                  maxH={32}
                  position="absolute"
                  top="2cm"
                  right="1cm"
                  src={picture}
                />
              )}
            </Box>
          </Stack>
        </Stack>
        <Stack isInline spacing={6} pt={20}>
          <Box flex={1} bg={showEditableFields ? 'blue.50' : 'transparent'}>
            <Editor content={issuedOn} />
            <Editor content={invoiceName} />
            <Stack isInline alignItems="center" spacing={0}>
              <Editor content={invoiceNoName} />
              <Box px={1} />
              <Editor content={invoiceNo} />
            </Stack>
            <Stack isInline alignItems="center" spacing={0}>
              <Editor content={dueToName} />
              <Box px={1} />
              <Editor content={dueTo} />
            </Stack>
          </Box>
          <Box flex={1} bg={showEditableFields ? 'blue.50' : 'transparent'}>
            <Editor content={buyerHeader} />
            <Editor content={buyerName} />
            <Editor content={buyerDetails} />
          </Box>
        </Stack>
        <Stack py={20}>
          <InvoiceItemList
            isPrinting={isPrinting}
            state={state}
            setstate={setstate}
            showEditableFields={showEditableFields}
          />
        </Stack>
        <Box bg={showEditableFields ? 'blue.50' : 'transparent'}>
          <Editor content={notes} />
        </Box>
      </Box>
    )
  }
)

InvoiceToPrint.displayName = 'InvoiceToPrint'

function InvoiceItemList({
  isPrinting,
  state,
  setstate,
  showEditableFields,
}: any) {
  React.useEffect(() => {
    let total: number = state.table
      // @ts-ignore
      .reduce((acc, row, index) => {
        if (index === 0) {
          return acc
        }
        // @ts-ignore
        const rowsTotal = row.find(({ type }) => type === 'Total').value
        const newtotal = +rowsTotal + acc
        return newtotal as number
      }, 0)

    if (typeof state.tax.percent === 'undefined') {
      setstate({ ...state, total: total.toFixed(2) })
      rerender()
      return
    }

    let taxTotal = total * (+state.tax.percent / 100)
    // @ts-ignore
    total = (total + taxTotal).toFixed(2)
    // @ts-ignore
    taxTotal = taxTotal.toFixed(2)
    setstate({ ...state, total, taxTotal })
    rerender()
  }, [state.table, state.tax.percent, setstate, state])

  const handlePercentageChange = (percent: string) => {
    if (percent === '') {
      setstate({
        ...state,
        tax: { ...state.tax, percent: undefined },
        taxTotal: undefined,
      })
      return
    }
    if (Number.isNaN(+percent)) {
      setstate({ ...state, tax: { ...state.tax, percent: '21' } })
      return
    }
    setstate({ ...state, tax: { ...state.tax, percent } })
  }

  const [key, rerender] = React.useReducer(
    (state, action = 1) => state + action,
    0
  )

  const handleChange = ({ index, rowIndex, type, value }: any) => {
    const newState = { ...state }
    // This is header
    if (rowIndex === 0) {
      newState.table[rowIndex][index].value = value
      setstate(newState)
      rerender()
      return
    }
    // Change numbers only if it's valid number
    if (type === 'Price' || type === 'Amount') {
      if (!Number.isNaN(+value)) {
        newState.table[rowIndex][index].value = value
      }
    } else {
      newState.table[rowIndex][index].value = value
    }

    const indexOfPrice = newState.table[rowIndex].findIndex(
      ({ type }: any) => type === 'Price'
    )
    const indexOfAmount = newState.table[rowIndex].findIndex(
      ({ type }: any) => type === 'Amount'
    )
    const indexOfTotal = newState.table[rowIndex].findIndex(
      ({ type }: any) => type === 'Total'
    )

    newState.table[rowIndex][indexOfTotal].value = (
      +newState.table[rowIndex][indexOfPrice].value *
      +newState.table[rowIndex][indexOfAmount].value
    ).toFixed(2)
    setstate({ ...newState, table: [...newState.table] })
    rerender()
  }

  //   const stringifiedJSON = JSON.stringify(state)
  //   console.log({ stringifiedJSON })
  //   const parsedJSON = JSON.parse(stringifiedJSON)
  //   console.log({ parsedJSON })

  const addRowItem = () => {
    const lastItem = state.table[state.table.length - 1]
    const item = JSON.parse(JSON.stringify(lastItem))
    const newState = { ...state, table: [...state.table, item] }
    setstate(newState)
    rerender()
  }

  return (
    <Stack>
      <Table key={key} color="gray.900" variant="simple">
        <Thead>
          <Tr>
            {/* @ts-ignore */}
            {state.table[0].map(({ value, type }, index) => {
              const isFirst = index === 0
              const isLast = state.table[0].length - 1 === index
              return (
                <Th
                  border="none"
                  textTransform="none"
                  letterSpacing="normal"
                  fontSize="xs"
                  color="gray.900"
                  textAlign={isFirst ? 'left' : isLast ? 'end' : 'center'}
                  pl={isFirst ? 0 : 2}
                  pr={isLast ? 0 : 2}
                  key={index}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(el) => {
                    handleChange({
                      index,
                      rowIndex: 0,
                      type,
                      value: el.currentTarget.innerText,
                    })
                  }}
                  bg={showEditableFields ? 'blue.50' : 'transparent'}
                >
                  {value}
                </Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {/* @ts-ignore */}
          {state.table.map((row, rowIndex) => {
            if (!rowIndex) return
            return (
              <Tr key={rowIndex} px={2} border="none">
                {/* @ts-ignore */}
                {row.map(({ value, type }, index) => {
                  const isFirst = index === 0
                  const isLast = state.table[0].length - 1 === index
                  return (
                    <Td
                      border="none"
                      // borderTop="1px solid"
                      // borderColor="gray.900"
                      pl={isFirst ? 0 : 2}
                      pr={isLast ? 0 : 2}
                      key={index}
                      textAlign={isFirst ? 'left' : isLast ? 'end' : 'center'}
                      contentEditable={!isLast}
                      suppressContentEditableWarning={!isLast}
                      onBlur={(el) => {
                        handleChange({
                          index,
                          rowIndex,
                          type,
                          value: el.currentTarget.innerText,
                        })
                      }}
                      bg={showEditableFields ? 'blue.50' : 'transparent'}
                    >
                      {value}
                    </Td>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Stack isInline justifyContent="space-between">
        <Box>
          <Box display={isPrinting ? 'none' : 'block'}>
            <Button
              variant="unstyled"
              fontWeight="black"
              fontSize="xs"
              onClick={addRowItem}
            >
              + ADD ITEM
            </Button>
          </Box>
          {/* <Box display={isPrinting ? "none" : "block"}>
            <Button variant="unstyled" fontWeight="black" fontSize="xs" onClick={addRowItem}>
              + ADD TAX
            </Button>
          </Box> */}
        </Box>
        <Stack pt={4} alignItems="end">
          <Stack isInline>
            <Stack isInline bg={showEditableFields ? 'blue.50' : 'transparent'}>
              <Editor content={state.tax.name} />
              <Stack isInline spacing={0}>
                <Text
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(el) => {
                    handlePercentageChange(el.currentTarget.innerText)
                  }}
                >
                  {state.tax.percent}
                </Text>
                <Editor content="%:" />
              </Stack>
            </Stack>
            <Text>{state.tax.percent && state.taxTotal}</Text>
          </Stack>
          <Stack isInline>
            <Box bg={showEditableFields ? 'blue.50' : 'transparent'}>
              <Editor content="<h2><strong>Total:<h2></strong>" />
            </Box>
            <Box bg={showEditableFields ? 'blue.50' : 'transparent'}>
              <Editor
                key={key}
                content={`<h2><strong>${state.total}<h2></strong>`}
              />
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

function useImageUpload() {
  const [selectedFile, setSelectedFile] = React.useState()
  const [preview, setPreview] = React.useState()

  // create a preview as a side effect, whenever selected file is changed
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)

    // @ts-ignore
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  // @ts-ignore
  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0])
  }

  return {
    onSelectFile,
    selectedFile,
    preview,
  }
}

// {
//   seller: {
//     sellerName: `<h2>MB “KAST PRODUCTIONS”</h2>`,
//     sellerHeader: ``,
//     sellerDetails: `
//       <p>Adresas: Lazdijų r. Mokyklos g. 13.</p>
//       <p>Tel: +37063692435</p>
//       <p>Įmonės kodas: 39101260856</p>
//       <p>hello@kastproductions.com </p>
//       <p>https://kastproductions.com</p>
//     `,
//     issuedOnName: "",
//     issuedOn: "<p>09-11-2021</p>",
//     invoiceName: "<h2><strong>SĄSKAITA FAKTŪRA</strong></h2>",
//     dueToName: "<p><strong>APMOKETI IKI:</strong></p>",
//     dueTo: "<p>09-11-2021</p>",
//     invoiceNoName: "<p><strong>SERIJOS NR.:</strong></p>",
//     invoiceNo: "<p>00004</p>",
//   },
//   buyer: {
//     buyerHeader: `<p style="text-align: right">Pirkėjo rekvizitai:</p>`,
//     buyerName: `
//     <p style="text-align: right"><strong>UAB “Baltijos technologijų institutas”</strong></p>
//     `,
//     buyerDetails: `
//       <p style="text-align: right">Adreasas: V.Berbomo g. 10, Klaipėda</p>
//       <p style="text-align: right">Įmonės kodas: 304166570</p>
//     `,
//   },
//   table: [
//     [
//       { type: "Service", name: "Service", value: "Prekės ar paslaugos pavadinimas", enabled: true },
//       { type: "Units", name: "Units", value: "Mato vnt.", enabled: true },
//       { type: "Amount", name: "Amount", value: "Kiekis", enabled: true },
//       { type: "Price", name: "Price", value: "Kaina, EUR", enabled: true },
//       { type: "Total", name: "Total", value: "Suma, EUR", enabled: true },
//     ],
//     [
//       { type: "Service", value: "Web programavimas" },
//       { type: "Units", value: "valandos" },
//       { type: "Amount", value: "5" },
//       { type: "Price", value: "100.00" },
//       { type: "Total", value: "500.00" },
//     ],
//   ],
//   tax: { name: "PVM", percent: "21" },
//   taxTotal: "0",
//   total: "0",
//   notes: `
//     <p><strong>Papildoma informacija</strong></p>
//     <p>Atsiskaitymas bankiniu pavedimu.</p><p>Sąskaitą išrašė: Karolis Stulgys</p><p>Banko adresas: Pilaitės pr. 16, Vilnius, LT-04352,</p><p>Banko pavadinimas: Paysera LT, UAB</p><p>Gavėjas: MB “Kast productions”</p><p>IBAN: LT503500010014583277</p><p>SWIFT/BIC: EVIULT2VXXX</p><p>Šalis: Lietuva</p>
//   `,
// }
