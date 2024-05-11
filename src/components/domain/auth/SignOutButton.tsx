import { useAuth } from "~/lib/firebase";

type Props = {};

export const SignOutButton = (props: Props) => {
  const handleClick = () => {
    const auth = useAuth();
    auth.signOut();
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="btn normal-case bg-neutral-200 text-zinc-900 hover:text-zinc-300"
    >
      Sair
    </button>
  );
};
