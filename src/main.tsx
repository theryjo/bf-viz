import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'

const themeSettings = {
  config: {
    initialColorMode: 'dark',
  },
}
const theme = extendTheme({ themeSettings })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
