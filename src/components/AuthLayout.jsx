const AuthLayout = ({ children, title }) => {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    );
  };
  
  export default AuthLayout;
  