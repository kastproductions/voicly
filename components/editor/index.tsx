import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
// import "./styles.scss"
import TextAlign from "@tiptap/extension-text-align"
import { Button as BaseButton, Box, Icon, Stack } from "@chakra-ui/react"
import Head from "next/head"
import { FiAlignCenter, FiAlignLeft, FiAlignRight } from "react-icons/fi"

function Button({ active, ...rest }: any) {
  return (
    <BaseButton
      rounded="none"
      variant="unstyled"
      bg={active ? "gray.900" : "gray.100"}
      color={active ? "white" : "gray.900"}
      _hover={{}}
      {...rest}
      fontSize="sm"
      height={6}
    />
  )
}

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null
  }

  return (
    <Stack isInline spacing={0} mb={1} border="1px solid" alignItems="center">
      <Button onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} fontSize="sm" _hover={{}}>
        P
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })}>
        p
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
        h1
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        h2
      </Button>
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        h3
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
        <Icon as={FiAlignLeft} />
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
        <Icon as={FiAlignCenter} />
      </Button>
      <Button onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
        <Icon as={FiAlignRight} />
      </Button>
      {/* <Button onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} fontWeight="bold">
        B
      </Button>
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} fontStyle="italic">
        I
      </Button> */}
    </Stack>
  )
}

export default function Editor({ content }: any) {
  const editor = useEditor({
    content,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
  })
  console.log(editor?.getHTML())

  return <EditorContent editor={editor} />
}

{
  /* <Box
role="group"
position="relative"
>
  <Box
    position="absolute"
    top={0}
    left={0}
    transform="translateY(-90%)"
    opacity={0}
    _groupHover={{ transform: "translateY(-100%)", opacity: 1 }}
    transition="all 0.2s ease-in-out"
  >
    <MenuBar editor={editor} />
  </Box>
  <EditorContent editor={editor} />
</Box> */
}
