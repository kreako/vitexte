import { AuthenticationError } from "./api/utils"

export default function registerErrorHandlers() {
  const onUnhandledError = (ev: ErrorEvent) => {
    if (process.env.NODE_ENV === "development") {
      if (ev.error instanceof AuthenticationError) {
        // prevent "uncaught error" logs in console
        ev.preventDefault()
      }
    }
  }
  window.addEventListener("error", onUnhandledError)
}
