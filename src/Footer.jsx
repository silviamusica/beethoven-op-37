import React from 'react';

export default function Footer({ setActiveTab }) {
  const scrollToTop = () => {
    const main = document.querySelector('main');
    const doScroll = () => {
      try {
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (e) {
        try { if (main) main.scrollTop = 0; } catch (e) {}
        try { window.scrollTo(0, 0); } catch (e) {}
      }
    };
    // call immediately and schedule a couple of retries to override other scroll actions
    doScroll();
    setTimeout(doScroll, 120);
    setTimeout(doScroll, 400);
  };

  const goto = (tab) => {
    setActiveTab(tab);
    // allow the view to update then ensure top is enforced
    setTimeout(scrollToTop, 20);
  };

  return (
    <footer className="mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center text-sm text-slate-300">
        <div className="mb-6 w-full flex justify-center">
          <div className="flex items-center gap-8 justify-center">
            <img src="/Logo%20vlr.png" alt="Logo vlr" className="h-16 w-auto" />
            <img src="/Logo%20Sip.png" alt="Logo Sip" className="h-16 w-auto" />
          </div>
        </div>
        <div className="w-full">
          <hr className="border-t border-slate-700/60 my-4" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center w-full mt-2">
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
