import React from 'react';

export default function Footer({ setActiveTab }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700 mt-8">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-300">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('introduzione')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Introduzione
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Analisi movimenti
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Glossario
          </button>
          <button
            onClick={() => setActiveTab('interpreters')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Interpretazioni
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className="text-sm px-3 py-2 bg-slate-700 border border-blue-700 text-blue-400 rounded hover:bg-slate-600 transition-colors font-medium"
          >
            → Mettiti alla prova
          </button>
          <button
            onClick={() => setActiveTab('fonti')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Fonti
          </button>
        </div>
      </div>
    </footer>
  );
}
