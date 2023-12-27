import React from "react";
import { persistor, store } from "./store/store";
import { Root, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { Theme, ThemeProvider, createTheme } from "@mui/material";

const container: HTMLElement = document.getElementById("root")!;
const root: Root = createRoot(container);
const theme: Theme = createTheme({
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
