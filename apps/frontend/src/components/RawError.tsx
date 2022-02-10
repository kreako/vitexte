import ErrorCard from "./ErrorCard"

type RawErrorProps = {
  error: Error
}

export default function RawError(props: RawErrorProps) {
  return (
    <ErrorCard>
      <div className="text-center"> Il y a eu une erreur :</div>
      <div className="mt-2 font-mono">{props.error.message}</div>
    </ErrorCard>
  )
}
