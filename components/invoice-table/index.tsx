/* eslint-disable import/prefer-default-export */
import React, { useReducer } from 'react'

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
import { ReactRenderer } from '@tiptap/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Editable } from '../editable'

const printNone = {
  '@media print': {
    display: 'none',
  },
}

const data = {
  title: 'Invoice',
  invoiceNo: 'Invoice',
  issueDate: '12/12/2022',
  dueDate: '12/12/2022',
  reference: 'O/12-234',
  sellerName: 'MB Kast Production',
  sellerDetails: `305830693\nMokyklos g. 13, Verstaminu k., Lazdiju raj., LT-67412\nhello@kastproductions.com`,
  buyerName: 'Brand On Demand',
  buyerDetails: `40203267663\n Jelgava, Peldu iela 7, LV-3002`,
  notes: '',
  table: {
    head: ['item', 'quantity', 'price €', 'discount %', 'tax %', 'total €'],
    body: [
      [
        { label: 'item', value: 'Food' },
        { label: 'quantity', value: '4' },
        { label: 'price', value: '32.00' },
        { label: 'discount', value: '10' },
        { label: 'tax', value: '21' },
        { label: 'total', value: '128.00' },
      ],
      [
        { label: 'item', value: 'Food' },
        { label: 'quantity', value: '4' },
        { label: 'price', value: '32.00' },
        { label: 'discount', value: '10' },
        { label: 'tax', value: '21' },
        { label: 'total', value: '128.00' },
      ],
    ],
    footer: {
      subtotal: '256.00',
      discountTotal: '25.60',
      taxTotal: '53.76',
      total: '284.16',
    },
  },
}

function getSubtotal({ body }) {
  return body
    .reduce((acc, next) => {
      const rowTotal = +next[next.length - 1].value
      acc += rowTotal
      return acc
    }, 0)
    .toFixed(2)
}

function getDiscountTotal({ body }) {
  return body
    .reduce((acc, next) => {
      const rowTotal = +next[next.length - 1].value
      const discount = +next.find(({ label }) => label === 'discount').value
      const num = rowTotal * (discount / 100)
      acc += num
      return acc
    }, 0)
    .toFixed(2)
}

function getTaxTotal({ body }) {
  return body
    .reduce((acc, next) => {
      const rowTotal = +next[next.length - 1].value
      const discount = +next.find(({ label }) => label === 'tax').value
      const num = rowTotal * (discount / 100)
      acc += num
      return acc
    }, 0)
    .toFixed(2)
}

function getTotal(copy) {
  const { taxTotal, discountTotal, subtotal } = copy.footer
  return (+subtotal - +discountTotal + +taxTotal).toFixed(2)
}

export function InvoiceTable() {
  const [tableState, setTableState] = React.useState(data.table)
  const [hoveredIndex, setHoveredIndex] = React.useState()
  const [count, rerender] = React.useReducer((s, a = 1) => s + a, 0)

  const handleChange = ({ id, innerText, label }) => {
    const [rowIndex, cellIndex] = id.split('-')
    const copy = JSON.parse(JSON.stringify(tableState)) as typeof tableState
    if (typeof cellIndex === 'undefined') {
      copy.head[rowIndex] = innerText
      return setTableState(copy)
    }
    if (cellIndex === '0') {
      copy.body[rowIndex][cellIndex].value = innerText
      return setTableState(copy)
    }
    let value: string | number = +innerText
    if (Number.isNaN(value) || typeof value !== 'number') return rerender()
    if (label === 'price') {
      value = value.toFixed(2)
    }
    copy.body[rowIndex][cellIndex].value = `${value}`
    const qty = +copy.body[rowIndex][1].value
    const price = +copy.body[rowIndex][2].value
    const rowTotal = (qty * price).toFixed(2)
    copy.body[rowIndex][copy.head.length - 1].value = rowTotal
    setTableState(copy)
  }

  const handleRemoveRow = (rowIndex) => {
    if (tableState.body.length === 1) return
    const copy = { ...tableState }
    copy.body = copy.body.filter((_, index) => index !== rowIndex)
    setTableState(copy)
  }

  const addNewRow = () => {
    const lastItem = tableState.body[tableState.body.length - 1]
    setTableState({
      ...tableState,
      body: [...tableState.body, [...lastItem]],
    })
  }

  React.useEffect(() => {
    const copy = { ...tableState }
    const subtotal = getSubtotal(copy)
    const discountTotal = getDiscountTotal(copy)
    const taxTotal = getTaxTotal(copy)
    copy.footer.subtotal = subtotal
    copy.footer.discountTotal = discountTotal
    copy.footer.taxTotal = taxTotal
    const total = getTotal(copy)
    copy.footer.total = total
    setTableState(copy)
  }, [tableState.body])

  return (
    <Stack spacing={4} width="full">
      <Table variant="simple" width="full" fontSize="xs">
        <Thead onMouseOver={() => setHoveredIndex(undefined)}>
          <Tr>
            <Th px={0} position="absolute" border="none" w={10} ml="-45px" />
            {tableState.head.map((th, thIndex) => {
              const isNumeric = thIndex === tableState.head.length - 1
              const textAlign = thIndex !== 0 ? 'center' : 'left'
              const id = `${thIndex}`
              return (
                <Editable key={id} onBlur={handleChange}>
                  <Th
                    id={id}
                    fontSize="xs"
                    px={1}
                    textAlign={textAlign}
                    isNumeric={isNumeric}
                  >
                    {th}
                  </Th>
                </Editable>
              )
            })}
          </Tr>
        </Thead>
        <Tbody key={count}>
          {tableState.body.map((tr, trIndex) => {
            const id = trIndex
            return (
              <Tr key={id} onMouseOver={() => setHoveredIndex(trIndex)}>
                <Td px={0} position="absolute" ml="-45px" border="none" w={10}>
                  <Box
                    onClick={() => handleRemoveRow(trIndex)}
                    visibility={hoveredIndex === trIndex ? 'visible' : 'hidden'}
                  >
                    <Button rounded="full" size="xs">
                      -
                    </Button>
                  </Box>
                </Td>
                {tr.map(({ label, value }, tdIndex) => {
                  const id = `${trIndex}-${tdIndex}`
                  const isNumeric = tdIndex === tableState.head.length - 1
                  const textAlign = tdIndex !== 0 ? 'center' : 'left'
                  return (
                    <Editable
                      key={id}
                      onBlur={handleChange}
                      isDisabled={isNumeric}
                    >
                      <Td
                        data-label={label}
                        id={id}
                        px={1}
                        textAlign={textAlign}
                        isNumeric={isNumeric}
                      >
                        {value}
                      </Td>
                    </Editable>
                  )
                })}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
      <Stack isInline onMouseOver={() => setHoveredIndex(undefined)}>
        <Stack isInline width="full">
          <Stack isInline width="full" sx={printNone}>
            <Box>
              <Button size="xs" onClick={addNewRow}>
                Add new row
              </Button>
            </Box>
            <Box>
              <EditColumns />
            </Box>
          </Stack>
        </Stack>
        <Stack isInline width="full" justifyContent="flex-end">
          <SimpleGrid columns={2} spacingX={8} spacingY={2} fontSize="sm">
            <Text>Subtotal:</Text>
            <Text textAlign="right">{tableState.footer.subtotal}</Text>
            <Text>Discount:</Text>
            <Text textAlign="right">{tableState.footer.discountTotal}</Text>
            <Text>Tax:</Text>
            <Text textAlign="right">{tableState.footer.taxTotal}</Text>
            <Text>Total:</Text>
            <Text textAlign="right">{tableState.footer.total}</Text>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Stack>
  )
}

function EditColumns() {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        // variant="link"
        size="xs"
        width="full"
        rightIcon={<ChevronDownIcon />}
      >
        Edit Columns
      </MenuButton>

      <MenuList minWidth="240px" rounded="none" fontSize="sm">
        <MenuOptionGroup
          type="checkbox"
          defaultValue={['Quantity', 'Discount']}
        >
          <MenuItemOption value="item">Item</MenuItemOption>
          <MenuItemOption value="Quantity">Quantity</MenuItemOption>
          <MenuItemOption value="Price">Price</MenuItemOption>
          <MenuItemOption value="Discount">Discount</MenuItemOption>
          <MenuItemOption value="Tax">Tax</MenuItemOption>
          <MenuItemOption value="Total">Total</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
