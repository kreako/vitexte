import { Outlet } from "react-router"

export default function MainLayout() {
  return (
    <div className="flex flex-row">
      <Outlet />
    </div>
  )
}
