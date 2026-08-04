import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./context/ThemeProvider";
import App from "./App";
import "./index.css";
import 'leaflet/dist/leaflet.css';
import "./utils/fixLeafletIcon";
import { store } from "./redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
       <ThemeProvider>
    <App />
  </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);