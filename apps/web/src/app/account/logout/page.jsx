import useAuth from "@/utils/useAuth";

function LogoutPage() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl border border-purple-100">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <span className="text-3xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign Out</h1>
          <p className="text-gray-600 text-sm">We'll miss you!</p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3.5 text-base font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default LogoutPage;
