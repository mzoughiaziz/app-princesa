import { Dialog } from '@headlessui/react';
import { useRef, useState } from 'react';
import { useAuthState, useSignIn } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import {  useNavigate } from 'react-router-dom';
import { Head } from '~/components/shared/Head';

function Index({setIsAuth}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (email === 'elias@princesa.com' && password === 'princesa123') {
     setIsAuth(true)
     navigate('/produtos');
    } else {
      setErrorMessage('Email ou senha errada');
    }
  };

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
            {/* <div className="mt-4 grid gap-2">
              {state.state === 'UNKNOWN' ? null : state.state === 'SIGNED_OUT' ? <SignInButton /> : <Navigate replace to="/produtos" />}
            </div> */}
            <div className="signin-container pt-4">
              <form onSubmit={handleSubmit}>
                <div className="px-3 grid">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    className="my-2 text-slate-800 border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="px-3 grid">
                  <label htmlFor="password">Senha</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    className="my-2 text-slate-800 border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {errorMessage && <p className="error-message text-red-500">{errorMessage}</p>}
                <button 
                  type="submit" 
                  className="m-4 border border-slate-300 p-3 rounded-lg transition-opacity bg-slate-700 hover:bg-opacity-50 text-slate-50">
                    Entrar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
