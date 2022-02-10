import { FallbackProps } from "react-error-boundary"
import RawError from "./RawError"
import { useLocation } from "react-router-dom"
import { useUpdateEffect } from "usehooks-ts"
import { AuthenticationError } from "../api/utils"

type LoginProps = {
  onSuccess: () => void
}

function LoginOn401(props: LoginProps) {
  return <div> Login needed but no auth </div>
}

function ErrorResetOnURLChange({ resetErrorBoundary }: Pick<FallbackProps, "resetErrorBoundary">) {
  const location = useLocation()
  useUpdateEffect(() => {
    // reset error on url change
    // useful for login form with link to lost-password or signup or ...
    resetErrorBoundary()
  }, [location.key])
  return <></>
}

export default function MainErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof AuthenticationError) {
    return (
      <div className="mx-2 flex flex-col items-center pt-4">
        <div className="font-bold text-sky-600">Connectez-vous pour accéder à cette page !</div>
        <LoginOn401 onSuccess={resetErrorBoundary} />
        <ErrorResetOnURLChange resetErrorBoundary={resetErrorBoundary} />
      </div>
    )
  } else {
    // default ugly one
    return (
      <div role="alert">
        <RawError error={error} />
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }
}
