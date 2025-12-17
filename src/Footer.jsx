import React from 'react';

export default function Footer({ setActiveTab }) {
  const scrollToTop = () => {
    const main = document.querySelector('main');
    if (main) {
      try {
        main.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        main.scrollTop = 0;
      }
    } else {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }
  };

  const goto = (tab) => {
    setActiveTab(tab);
    setTimeout(scrollToTop, 60);
  };

  return (
    <footer className="border-t border-slate-700 mt-8">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-300">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => goto('introduzione')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Introduzione
          </button>
          <button
            onClick={() => goto('analysis')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Analisi
          </button>
          <button
            onClick={() => goto('interpreters')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Interpreti
          </button>
          <button
            onClick={() => goto('glossary')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Glossario
          </button>
          <button
            onClick={() => goto('quiz')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Quiz
          </button>
          <button
            onClick={() => goto('fonti')}
            className="text-sm px-3 py-2 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            Fonti
          </button>
        </div>
      </div>
    </footer>
  );
}
