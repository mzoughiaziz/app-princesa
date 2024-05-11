import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { useAuth } from "~/lib/firebase";

export const SignInButton = () => {
  const handleClick = () => {
    const provider = new GoogleAuthProvider();
    const auth = useAuth();
    // @see https://firebase.google.com/docs/auth/web/google-signin
    auth.languageCode = "ja";

    signInWithRedirect(auth, provider);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        type="button"
        className="btn btn-primary normal-case min-w-60 m-2"
      >
        Entrar com Google
      </button>
      {/* <button
        onClick={handleClick}
        type="button"
        className="btn btn-primary normal-case min-w-60 m-2"
      >
        Entrar
      </button> */}
   </div>
  );
};
