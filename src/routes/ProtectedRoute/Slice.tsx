import { lazy } from 'react'
const ProtectedRoute = lazy(() => import("./index"))
function PRS() {
  return (
    <>
      <ProtectedRoute />
    </>
  )
}

export default PRS