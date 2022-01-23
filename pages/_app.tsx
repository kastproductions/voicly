import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { ReactQueryDevtools } from "react-query/devtools"
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "react-query"
import theme from "../styles/theme"
import "../styles/editor.scss"

const queryClient = new QueryClient()

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
