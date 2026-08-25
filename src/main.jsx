import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { instalarEspiao } from "./espiao";
import "./index.css";

// Liga o "espião de rede" ANTES do app subir, para não perder nenhum pedido.
instalarEspiao();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
