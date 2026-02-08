import { lazy } from "react"
import { hocComponent } from "../../HOCS/AuthHOC"

const MainRoute = lazy(() => import("../../pages/MainPage/index"))
const ProtectedMainRoute = hocComponent(MainRoute)

export const routeSlice = [
  {
    path: "dashboard",
    component: ProtectedMainRoute,
  }
]
