/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Stack,
  Text,
  Button,
  Box,
  useDisclosure,
  Tooltip,
  SimpleGrid,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
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
      width="210mm"
      minH="297mm"
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

  const printPage = async () => {
    const st = [...document.head.getElementsByTagName('STYLE')]
    const styleTags = st.reduce((acc, next) => {
      acc += next.outerHTML
      return acc
    }, '')
    try {
      const response = await axios.post(
        `${window.origin}/api/pdf`,
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
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `${Date.now()}.pdf`
      link.click()
    } catch (e) {
      console.log(e)
    }
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

      <Stack
        isInline
        spacing={0}
        width="full"
        height="100vh"
        overflowY="auto"
        overflowX="hidden"
        bg="gray.100"
      >
        <Sidebar isOpen={isOpen} />
        <Box width="full">
          <TopBar printPage={printPage} onToggle={onToggle} />
          <HStack p={4} bg="gray.100">
            <InvoiceContainer ref={invoiceRef}>
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
