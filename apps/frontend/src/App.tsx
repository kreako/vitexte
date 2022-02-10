import React from "react"
import { ErrorBoundary } from "react-error-boundary"
import { QueryClient, QueryClientProvider, QueryErrorResetBoundary } from "react-query"
import { HashRouter, Routes, Route } from "react-router-dom"
import LoadingPage from "./components/LoadingPage"
import MainErrorFallback from "./components/MainErrorFallback"
import MainLayout from "./layout/MainLayout"

const queryClient = new QueryClient()

const Home = React.lazy(() => import("./pages/Home"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={MainErrorFallback} onReset={reset}>
              <React.Suspense fallback={<LoadingPage />}>
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </React.Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </HashRouter>
    </QueryClientProvider>
  )
}
