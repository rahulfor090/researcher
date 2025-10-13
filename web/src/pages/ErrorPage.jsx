import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  return {
    status: state?.status || params.get('status') || 500,
    message: state?.message || params.get('message') || 'Something went wrong',
  };
}

export default function ErrorPage() {
  const navigate = useNavigate();
  const { status, message } = useQuery();

  const goHome = () => navigate('/');
  const retry = () => window.history.length > 1 ? navigate(-1) : window.location.reload();

  return (
    <div style={{ minHeight: '100vh' }} className="flex items-center justify-center bg-slate-50 text-slate-900">
      <div className="max-w-xl w-full mx-4 p-8 rounded-2xl shadow-lg bg-white border border-slate-200">
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text">
          {status}
        </h1>
        <p className="mt-2 text-lg text-slate-700">
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          <button onClick={goHome} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Go Home
          </button>
          <button onClick={retry} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100">
            Retry
          </button>
        </div>
        <p className="mt-4 text-xs text-slate-500">If this keeps happening, please contact support.</p>
      </div>
    </div>
  );
}
