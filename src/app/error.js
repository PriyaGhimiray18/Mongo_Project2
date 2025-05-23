'use client';

export default function Error({ error, reset }) {
  return (
    <div className="container my-5 text-center">
      <h1>Something went wrong!</h1>
      <p>{error?.message || 'An error occurred'}</p>
      <button onClick={reset} className="btn btn-primary">
        Try again
      </button>
    </div>
  );
} 