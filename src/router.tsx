import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { AppLayout } from './layouts/AppLayout';

const CVEditor = lazy(() => import('./pages/CVEditor'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const JDMatch = lazy(() => import('./pages/JDMatch'));
const JobTracker = lazy(() => import('./pages/JobTracker'));
const CoverLetter = lazy(() => import('./pages/CoverLetter'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><CVEditor /></Suspense> },
      { path: 'analysis', element: <Suspense fallback={<PageLoader />}><AIAnalysis /></Suspense> },
      { path: 'match', element: <Suspense fallback={<PageLoader />}><JDMatch /></Suspense> },
      { path: 'jobs', element: <Suspense fallback={<PageLoader />}><JobTracker /></Suspense> },
      { path: 'cover-letter', element: <Suspense fallback={<PageLoader />}><CoverLetter /></Suspense> },
      { path: 'pricing', element: <Suspense fallback={<PageLoader />}><Pricing /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<PageLoader />}><Settings /></Suspense> },
    ],
  },
]);

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AppRouter() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}
