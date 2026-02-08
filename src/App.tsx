import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { lazy, Suspense } from 'react';

const HomeRoutesSlicer = lazy(() => import('./routes/HomeRoute/index'))

function App() {
  return (
    <>
      <Suspense fallback={<div>Main loading</div>}>
        <HomeRoutesSlicer />
      </Suspense>
    </>
  )
}

export default App;
