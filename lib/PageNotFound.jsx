import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-lg mb-6">Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
      Back to home
    </Link>
  </main>
);

export default PageNotFound;
