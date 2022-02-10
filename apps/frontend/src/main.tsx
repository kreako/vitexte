import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import registerErrorHandlers from "./error"

registerErrorHandlers()

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)
