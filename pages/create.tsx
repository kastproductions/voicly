/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Stack, Text, Button, Box, Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react"
import { nanoid } from "nanoid"
import Head from "next/head"
import React, { useReducer } from "react"
import { useReactToPrint } from "react-to-print"
// import { proxy, useSnapshot, subscribe } from "valtio"
// import { FiPrinter } from "react-icons/fi"
// import { getFingerprint } from "../utils/fingerprint"
// import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query"
// import { addInvoiceItem, subscribeOnDataChange } from "../utils/firebase"
import { FiCheck } from "react-icons/fi"
import dynamic from "next/dynamic"
import { useRouter } from "next/dist/client/router"
const Editor = dynamic(() => import("../components/editor"), { ssr: false })

export default function Create() {
  const [isPrinting, setIsPrinting] = React.useState(false)
  const router = useRouter()
  const componentRef = React.useRef<HTMLDivElement>(null)
  const onPrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setIsPrinting(true)
    },
    onAfterPrint: () => {
      setIsPrinting(false)
      router.push("/")
    },
  })
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      <Box py={16} fontFamily="Inter, sans-serif" bg="gray.100" minH="100vh">
        <Button onClick={() => router.push("/")}>Home</Button>
        <Button onClick={onPrint}>Print</Button>

        <Box boxShadow="base" mx="auto" width="210mm" bg="white" minH="297mm" position="relative">
          <InvoiceToPrint ref={componentRef} isPrinting={isPrinting} />
          <Box position="absolute" top="297mm" left={0} width="full" height="1px" borderBottom="1px dashed" borderColor="gray.400"></Box>
        </Box>
      </Box>
    </>
  )
}

const InvoiceToPrint = React.forwardRef(({ isPrinting }: any, ref) => {
  return (
    //   @ts-ignore
    <Box ref={ref} height="full" width="full" p="1cm" pl="2.5cm" pt="2cm">
      <Stack isInline>
        <Box flex={0.7}>
          <Editor
            content={`
                <h2>MB “KAST PRODUCTIONS”</h2><p>Adresas: Lazdijų r. Mokyklos g. 13.</p><p>Tel: +37063692435</p><p>Įmonės kodas: 39101260856</p><p>hello@kastproductions.com </p><p>https://kastproductions.com</p>
            `}
          />
        </Box>
        <Stack justifyContent="center" alignItems="center" flex={0.3} border="1px dashed" borderColor="gray.300">
          <Text fontWeight="bold" color="gray.300">
            LOGO
          </Text>
        </Stack>
      </Stack>
      <Stack isInline spacing={6} pt={20}>
        <Box flex={1}>
          <Editor
            content={`
            <p>09-11-2021</p><h2><strong>SĄSKAITA FAKTŪRA</strong></h2><p></p><p><strong>SERIJOS NR.:</strong> 00004<br><strong>APMOKETI IKI: </strong>09-11-2021</p>
                `}
          />
        </Box>
        <Box flex={1}>
          <Editor
            content={`
            <p style="text-align: right">Pirkėjo rekvizitai:</p><p style="text-align: right"><strong>UAB “Baltijos technologijų institutas”</strong></p><p style="text-align: right">Adreasas: V.Berbomo g. 10, Klaipėda</p><p style="text-align: right">Įmonės kodas: 304166570</p>
              `}
          />
        </Box>
      </Stack>
      <Stack py={20}>
        <InvoiceItemList isPrinting={isPrinting} />
      </Stack>
      <Box>
        <Editor
          content={`
          <p><strong>Papildoma informacija</strong></p><p>Atsiskaitymas bankiniu pavedimu.</p><p>Sąskaitą išrašė: Karolis Stulgys</p><p></p><p>Banko adresas: Pilaitės pr. 16, Vilnius, LT-04352,</p><p>Banko pavadinimas: Paysera LT, UAB</p><p>Gavėjas: MB “Kast productions”</p><p>IBAN: LT503500010014583277</p><p>SWIFT/BIC: EVIULT2VXXX</p><p>Šalis: Lietuva</p>
            `}
        />
      </Box>
    </Box>
  )
})

InvoiceToPrint.displayName = "InvoiceToPrint"

function InvoiceItemList({ isPrinting }: any) {
  const [state, setstate] = React.useState({
    table: [
      [
        { type: "Service", name: "Service", value: "Prekės ar paslaugos pavadinimas", enabled: true },
        { type: "Units", name: "Units", value: "Mato vnt.", enabled: true },
        { type: "Amount", name: "Amount", value: "Kiekis", enabled: true },
        { type: "Price", name: "Price", value: "Kaina, EUR", enabled: true },
        { type: "Total", name: "Total", value: "Suma, EUR", enabled: true },
      ],
      [
        { type: "Service", value: "Web programavimas" },
        { type: "Units", value: "dienos" },
        { type: "Amount", value: "5" },
        { type: "Price", value: "100.00" },
        { type: "Total", value: "500.00" },
      ],
    ],
    total: "",
  })

  React.useEffect(() => {
    const total = state.table
      .reduce((acc, row, index) => {
        if (index === 0) {
          return acc
        }
        // @ts-ignore
        const rowsTotal = row.find(({ type }) => type === "Total").value
        const newtotal = +rowsTotal + acc
        return newtotal
      }, 0)
      .toFixed(2)
    if (total !== state.total) {
      setstate({ ...state, total })
    }
  }, [state])

  const [key, rerender] = React.useReducer((state, action = 1) => state + action, 0)

  const handleChange = ({ index, rowIndex, type, value }: any) => {
    // console.log({ index, rowIndex, type, value })
    const newState = { ...state }
    // This is header
    if (rowIndex === 0) {
      newState.table[rowIndex][index].value = value
      setstate(newState)
      rerender()
      return
    } else {
      // Change numbers only if it's valid number
      if (type === "Price" || type === "Amount") {
        if (!Number.isNaN(+value)) {
          newState.table[rowIndex][index].value = value
        }
      } else {
        newState.table[rowIndex][index].value = value
      }
    }
    const indexOfPrice = newState.table[rowIndex].findIndex(({ type }) => type === "Price")
    const indexOfAmount = newState.table[rowIndex].findIndex(({ type }) => type === "Amount")
    const indexOfTotal = newState.table[rowIndex].findIndex(({ type }) => type === "Total")

    newState.table[rowIndex][indexOfTotal].value = (
      +newState.table[rowIndex][indexOfPrice].value * +newState.table[rowIndex][indexOfAmount].value
    ).toFixed(2)
    setstate(newState)
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

  console.log({ state })

  return (
    <Stack>
      <Table key={key}>
        <Thead>
          <Tr>
            {state.table[0].map(({ value, type }, index) => {
              const isFirst = index === 0
              const isLast = state.table[0].length - 1 === index
              return (
                <Th
                  fontSize="xs"
                  color="gray.900"
                  textAlign={isFirst ? "left" : isLast ? "end" : "center"}
                  pl={isFirst ? 0 : 2}
                  pr={isLast ? 0 : 2}
                  key={index}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(el) => {
                    handleChange({ index, rowIndex: 0, type, value: el.currentTarget.innerText })
                  }}
                >
                  {value}
                </Th>
              )
            })}
          </Tr>
        </Thead>
        <Tbody>
          {state.table.map((row, rowIndex) => {
            if (!rowIndex) return
            return (
              <Tr key={rowIndex} px={2}>
                {row.map(({ value, type }, index) => {
                  const isFirst = index === 0
                  const isLast = state.table[0].length - 1 === index
                  return (
                    <Td
                      pl={isFirst ? 0 : 2}
                      pr={isLast ? 0 : 2}
                      key={index}
                      textAlign={isFirst ? "left" : isLast ? "end" : "center"}
                      contentEditable={!isLast}
                      suppressContentEditableWarning={!isLast}
                      onBlur={(el) => {
                        handleChange({ index, rowIndex, type, value: el.currentTarget.innerText })
                      }}
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
          <Button display={isPrinting ? "none" : "block"} variant="unstyled" fontWeight="black" fontSize="xs" onClick={addRowItem}>
            + ADD ITEM
          </Button>
        </Box>
        <Box pt={10}>
          <Stack isInline>
            <Box>
              <Editor content="Viso:" />
            </Box>
            <Text>{state.total}</Text>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}
