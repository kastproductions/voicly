/* eslint-disable import/prefer-default-export */
import React from 'react'

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
  Checkbox,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { proxy, useSnapshot } from 'valtio'
import { proxyWithComputed } from 'valtio/utils'
import { ReactRenderer } from '@tiptap/react'
import { Editable } from '../editable'

const printNone = {
  '@media print': {
    display: 'none',
  },
}

const avoidPrintBreak = {
  '@media print': {
    display: 'block',
    'break-inside': 'avoid',
  },
}

const headers = {
  0: { id: 0, label: 'nr', value: 'NR', isDisabled: false },
  1: { id: 1, label: 'item', value: 'ITEM', isDisabled: false },
  2: { id: 2, label: 'units', value: 'UNITS', isDisabled: false },
  3: { id: 3, label: 'quantity', value: 'QUANTITY', isDisabled: false },
  4: { id: 4, label: 'price', value: 'PRICE €', isDisabled: false },
  5: { id: 5, label: 'discount', value: 'DISCOUNT %', isDisabled: false },
  6: { id: 6, label: 'tax', value: 'TAX %', isDisabled: false },
  7: { id: 7, label: 'total', value: 'TOTAL €', isDisabled: false },
}

const sampleItem = {
  0: { id: 0, label: 'nr', value: '' },
  1: { id: 1, label: 'item', value: 'Food' },
  2: { id: 2, label: 'units', value: 'Vnt.' },
  3: { id: 3, label: 'quantity', value: '4' },
  4: { id: 4, label: 'price', value: '32.00' },
  5: { id: 5, label: 'discount', value: '10' },
  6: { id: 6, label: 'tax', value: '21' },
  7: { id: 7, label: 'total', value: '128.00' },
}

const copy = JSON.parse(JSON.stringify(sampleItem))

const UNEDITABLE = [0, 7]
const EDITABLE = [1, 3, 4, 5, 6]

const data = {
  // title: 'Invoice',
  // invoiceNo: 'Invoice',
  // issueDate: '12/12/2022',
  // dueDate: '12/12/2022',
  // reference: 'O/12-234',
  // sellerName: 'MB Kast Production',
  // sellerDetails: `305830693\nMokyklos g. 13, Verstaminu k., Lazdiju raj., LT-67412\nhello@kastproductions.com`,
  // buyerName: 'Brand On Demand',
  // buyerDetails: `40203267663\n Jelgava, Peldu iela 7, LV-3002`,
  // notes: '',
  table: {
    head: headers,
    body: [sampleItem, copy],
  },
}

function isValidNumber(number) {
  return typeof number === 'number' && !Number.isNaN(number)
}

const state = proxyWithComputed(
  {
    render: 0,
    table: data.table,
    rerender: () => {
      state.render += 1
    },
    onHeadNameChange: ({ id, innerText }) => {
      if (!innerText.trim()) return state.rerender()
      state.table.head[id].value = innerText
    },
    onInputChange: ({ id, innerText }) => {
      if (!innerText.trim()) return state.rerender()
      const [rowIndex, cellIndex] = id.split('-')
      // [quantity, price, discount, tax]
      if (['3', '4', '5', '6'].includes(cellIndex)) {
        const number = +innerText
        if (isValidNumber(number)) {
          state.table.body[rowIndex][cellIndex].value = number
          const price = +state.table.body[rowIndex][4].value
          const quantity = +state.table.body[rowIndex][3].value
          state.table.body[rowIndex][7].value = (quantity * price).toFixed(2)
        } else {
          return state.rerender()
        }
      } else {
        state.table.body[rowIndex][cellIndex].value = innerText
      }
    },
    addRow: () => {
      const lastItem = state.table.body[state.table.body.length - 1]
      const fullCopy = JSON.parse(JSON.stringify(lastItem))
      state.table.body.push(fullCopy)
    },
    removeRow: (rowIndex) => {
      if (state.table.body.length === 1) return
      state.table.body.splice(rowIndex, 1)
    },
    onColumnsChange: (columns) => {
      state.table.head = Object.entries(state.table.head).reduce(
        (acc, [key, next]) => {
          if (columns.includes(next.label)) {
            acc[key] = { ...next, isDisabled: false }
          } else {
            acc[key] = { ...next, isDisabled: true }
          }
          return acc
        },
        {}
      ) as typeof state.table.head
    },
  },
  {
    // updateRowTotal: (snap) => {
    //   state.table.body = state.table.body.reduce((acc, next) => {
    //     const quantity = +next[3].value
    //     const price = +next[4].value
    //     const rowTotal = (quantity * price).toFixed(2)
    //     next[7].value = rowTotal
    //     acc.push(next)
    //     return acc
    //   }, [])
    // },
    subtotal: (snap) => {
      return snap.table.body
        .reduce((acc, next) => {
          const rowTotal = +next[7].value
          acc += rowTotal
          return acc
        }, 0)
        .toFixed(2)
    },
    discountTotal: (snap) => {
      const isDisabled = snap.table.head[5].isDisabled
      if (isDisabled) return 0
      return snap.table.body
        .reduce((acc, next) => {
          const rowTotal = +next[7].value
          const discount = +next[5].value
          const num = rowTotal * (discount / 100)
          acc += num
          return acc
        }, 0)
        .toFixed(2)
    },
    taxTotal: (snap) => {
      const isDisabled = snap.table.head[6].isDisabled
      if (isDisabled) return 0
      return snap.table.body
        .reduce((acc, next) => {
          const rowTotal = +next[7].value
          const tax = +next[6].value
          const num = rowTotal * (tax / 100)
          acc += num
          return acc
        }, 0)
        .toFixed(2)
    },
    total: (snap) => {
      // @ts-ignore
      const { taxTotal, discountTotal, subtotal } = snap
      return (+subtotal - +discountTotal + +taxTotal).toFixed(2)
    },
  }
)

function useState() {
  return useSnapshot(state)
}

export function InvoiceTable() {
  const snap = useState()
  const { table } = snap
  console.log({ table })

  return (
    <Stack spacing={4} width="full">
      <Table variant="simple" width="full" fontSize="xs" key={snap.render}>
        <TableHead />
        <TableBody />
      </Table>
      <TableFooter />
    </Stack>
  )
}

function TableHead() {
  const snap = useState()
  return (
    <Thead>
      <Tr>
        <Th px={0} position="absolute" border="none" w={10} ml="-45px" />
        {Object.values(snap.table.head).map((th, thIndex) => {
          if (th.isDisabled) return null
          const isLast = thIndex === Object.values(snap.table.head).length - 1
          const isFirst = thIndex === 0
          const textAlign = isLast ? 'right' : isFirst ? 'left' : 'center'
          return (
            <Editable key={th.id} onBlur={snap.onHeadNameChange}>
              <Th
                id={String(th.id)}
                fontSize="xs"
                px={1}
                textAlign={textAlign}
                textTransform="none"
              >
                {th.value}
              </Th>
            </Editable>
          )
        })}
      </Tr>
    </Thead>
  )
}

function TableBody() {
  const snap = useState()
  return (
    <Tbody>
      {Object.values(snap.table.body).map((tr, trIndex) => {
        return (
          <Tr key={trIndex}>
            <Td px={0} position="absolute" ml="-45px" border="none" w={10}>
              <Button
                rounded="full"
                size="xs"
                onClick={() => snap.removeRow(trIndex)}
              >
                -
              </Button>
            </Td>
            {Object.values(tr).map(({ label, value }, tdIndex) => {
              if (snap.table.head[tdIndex].isDisabled) return null
              const id = `${trIndex}-${tdIndex}`
              const isNotEditable = UNEDITABLE.includes(tdIndex)
              const isLast = tdIndex === 7
              const isFirst = tdIndex === 0
              const textAlign = isLast ? 'right' : isFirst ? 'left' : 'center'

              return (
                <Editable
                  key={id}
                  onBlur={snap.onInputChange}
                  isDisabled={isNotEditable}
                >
                  <Td data-label={label} id={id} px={1} textAlign={textAlign}>
                    {value || trIndex + 1}
                  </Td>
                </Editable>
              )
            })}
          </Tr>
        )
      })}
    </Tbody>
  )
}

function TableFooter() {
  const snap = useState()

  const isDiscountDisabled = Object.values(snap.table.head).some(
    ({ id, isDisabled }) => id === 3 && isDisabled
  )
  const isTaxDisabled = Object.values(snap.table.head).some(
    ({ id, isDisabled }) => id === 4 && isDisabled
  )

  return (
    <Stack isInline>
      <Stack isInline width="full">
        <Stack isInline width="full" sx={printNone}>
          <Box>
            <Button size="xs" onClick={snap.addRow} rounded="sm">
              Add new row
            </Button>
          </Box>
          <Box>
            <EditColumns />
          </Box>
        </Stack>
      </Stack>
      <Box>
        <Box width="full">
          <Stack fontSize="sm">
            <RowItem name="Subtotal:">{snap.subtotal}</RowItem>
            <RowItem name="Discount:">{snap.discountTotal}</RowItem>
            <RowItem name="Tax:">{snap.taxTotal}</RowItem>
            <RowItem name="Total:">{snap.total}</RowItem>
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

function RowItem({ name, children }) {
  return (
    <HStack justifyContent="space-between" spacing={8}>
      <Text display="block" sx={avoidPrintBreak}>
        {name}
      </Text>
      <Text display="block" textAlign="right" sx={avoidPrintBreak}>
        {children}
      </Text>
    </HStack>
  )
}

function EditColumns() {
  const snap = useState()

  const columns = Object.values(snap.table.head).filter(
    ({ label }) => !['item', 'price', 'total'].includes(label)
  )

  const enabled = Object.values(snap.table.head)
    .filter(({ isDisabled }) => !isDisabled)
    .map(({ label }) => label)

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        // variant="link"
        size="xs"
        width="full"
        rightIcon={<ChevronDownIcon />}
        rounded="sm"
      >
        Edit Columns
      </MenuButton>

      <MenuList width="140px" fontSize="xs" rounded="sm">
        <MenuOptionGroup
          width="140px"
          type="checkbox"
          defaultValue={enabled}
          onChange={snap.onColumnsChange}
        >
          {columns.map(({ id, value, label }) => (
            <MenuItemOption key={id} value={label}>
              {value}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
