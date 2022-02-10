import Loading from "./Loading"

export default function LoadingPage() {
  return (
    <div className="grid h-screen grid-cols-3 grid-rows-3 place-items-center">
      <div className="col-start-2 row-start-2 ">
        <Loading size={2} />
      </div>
    </div>
  )
}
