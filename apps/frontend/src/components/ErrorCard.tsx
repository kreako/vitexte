import { ReactNode } from "react"

type ErrorCardProp = {
  children: ReactNode
}

export default function ErrorCard(props: ErrorCardProp) {
  return (
    <div className="mt-6 mb-4 flex flex-col items-center text-red-600">
      <div className="font-bold tracking-wide">Oh non !</div>
      <div>{props.children}</div>
    </div>
  )
}
