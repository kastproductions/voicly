/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import React from 'react'
import { Box, Tooltip } from '@chakra-ui/react'

type EditableProps = {
  label?: string
  isDisabled?: boolean
  children: React.ReactNode
  onBlur?: ({
    id,
    innerText,
    label,
  }: {
    id: string
    innerText: string
    label?: string
  }) => void
}

export function Editable(props: EditableProps) {
  const { label = '', isDisabled = false, children, onBlur } = props

  const handleBlur = ({ target }) => {
    const { innerText, id } = target
    const label = target.attributes['data-label']?.value
    if (onBlur) onBlur({ id, innerText, label })
  }
  return (
    <Tooltip label={label} placement="top-start">
      <EditableElement onBlur={handleBlur} isDisabled={isDisabled}>
        {children}
      </EditableElement>
    </Tooltip>
  )
}

const EditableElement = (props) => {
  const { children, isDisabled, onBlur } = props

  // const onMouseUp = () => {
  //   if(onChange) onChange(element.current)
  // }
  // React.useEffect(() => {
  //   if(onChange) onChange(element.current)
  // }, [])

  return React.cloneElement(children, {
    onBlur,
    minW: 4,
    whiteSpace: 'pre-line',
    contentEditable: !isDisabled,
    suppressContentEditableWarning: true,
    _hover: {
      shadow: isDisabled ? 'none' : 'outline',
    },
  })
}
