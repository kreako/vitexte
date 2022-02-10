import Home from "~icons/ic/round-home"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="pt-4">
      <div className="flex w-full flex-col items-center rounded-md bg-sky-900 px-4 py-4 text-sky-100">
        <div className="text-5xl font-black uppercase tracking-wider">Oh non !</div>
        <div className="mt-8 text-lg font-bold">Je ne trouve pas cette page !</div>
      </div>
      <Link to="/" className="mx-2 mt-20 flex flex-col items-center text-lg text-sky-900 md:mt-32">
        <div>Je vous propose de retourner à l&apos;accueil...</div>
        <Home className="mt-4 text-sky-600 md:mt-8" width="4em" height="4em" />
        <div className="">Par ici !</div>
      </Link>
    </div>
  )
}
