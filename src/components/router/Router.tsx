import { Dialog } from '@headlessui/react';
import { lazy, Suspense, useState, useRef } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignOutButton } from '../domain/auth/SignOutButton';
import { Link } from 'react-router-dom';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const MainPageScreen = lazy(() => import('~/components/screens/MainPage'));
const PrivateRoute = lazy(() => import('~/components/router/ProtectedRoute')); 


function Layout() {
  const { state } = useAuthState();
  const [isOpen, setIsOpen] = useState(true);
  const completeButtonRef = useRef(null);

  return (
    <div>
      <nav className="p-4 flex text-white items-center justify-between bg-slate-800">
        <p className="text-3xl">Produtos <span className="text-amber-300">Princesa Jóias</span></p>
      </nav>
      <Outlet />
    </div>
  );
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
const [isAuth, setIsAuth] = useState(false);

  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <IndexScreen setIsAuth={setIsAuth} />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
        {
          path: '/produtos',
          element: <PrivateRoute isAuth={isAuth} />, 
          children: [
            {
              index: true,
              element: <MainPageScreen  setIsAuth={setIsAuth}  />,
            },
          ],
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};
