import Link from 'next/link';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="text-secondary">The page you are looking for does not exist.</p>
      <Link href="/" className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-hover">
        Back to home
      </Link>
    </div>
  );
}

export default NotFound;
