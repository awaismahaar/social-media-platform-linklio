import React from 'react'
import { createTheme, ThemeProvider } from "flowbite-react";

const customTheme = createTheme({
  button: {
    color: {
      primary: "bg-red-500 hover:bg-red-600",
      secondary: "bg-blue-500 hover:bg-blue-600",
    },
    size: {
      lg: "px-6 py-3 text-lg",
    },
  },
});

const FlowbiteReactThemeProvider = ({ children }) => {
    return (
        <ThemeProvider theme={customTheme}>
            {children}
        </ThemeProvider>
    )
}

export default FlowbiteReactThemeProvider