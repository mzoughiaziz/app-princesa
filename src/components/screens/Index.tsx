import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { Navigate } from 'react-router-dom';
import { Head } from '~/components/shared/Head';

function Index() {
  const { state } = useAuthState();
  const [isOpen, setIsOpen] = useState(true);
  const completeButtonRef = useRef(null);

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen">
        <div className="text-center hero-content">
          <div>
            <h1 className="text-3xl font-bold">
              Bemvindo à <span className='text-4xl text-slate-400'>Princesa Jóias</span>
            </h1>
            <p className="mt-4 text-lg">
              Acesse o painel para gerenciar a lista de produtos.
            </p>
            <div className="mt-4 grid gap-2">
              {state.state === 'UNKNOWN' ? null : state.state === 'SIGNED_OUT' ? <SignInButton /> : <Navigate replace to="/produtos" />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
