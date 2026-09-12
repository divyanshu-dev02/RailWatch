import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-6">
      <h1 className="text-7xl font-bold text-indigo-500">404</h1>
      <p className="mt-4 text-gray-400 text-lg">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
