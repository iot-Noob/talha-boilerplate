import { lazy } from "react"
import { Navigate } from "react-router-dom"

const Login = lazy(() => import("../../pages/Login/index"))
const Signup = lazy(() => import("../../pages/Signup/index"))
const NotFound = lazy(() => import("../../pages/NotFound/index"))
const Prs = lazy(() => import("../ProtectedRoute/Slice"))

export const routeSlice = [
  {
    path: "/",
    component: () => Navigate({ to: "/login" }),
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/signup",
    component: Signup,
  },
  {
    path: "/talha/*",
    component: Prs,
  },
  {
    path: "*",
    component: NotFound,
  }
]
