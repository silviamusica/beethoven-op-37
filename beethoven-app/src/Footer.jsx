import React from 'react';

const safeScrollTo = (target, options = { top: 0, behavior: 'smooth' }) => {
  if (!target) return;
  if (typeof target.scrollTo === 'function') {
    target.scrollTo(options);
  } else if ('scrollTop' in target && typeof options.top === 'number') {
    target.scrollTop = options.top;
  }
};

export default function Footer({ setActiveTab }) {
  const scrollToTop = () => {
    const main = document.querySelector('main');
    const doScroll = () => {
      safeScrollTo(main);
      safeScrollTo(window);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
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
        <div className="mb-6 w-full flex flex-col items-center gap-4">
          <div className="flex items-center gap-8 justify-center">
            <a href="https://www.vitolore.com" target="_blank" rel="noopener noreferrer" title="Vitolore - www.vitolore.com" className="transform transition-transform hover:scale-110">
              <img src="/Logo%20vlr.png" alt="Vitolore logo" title="Vitolore" className="h-16 w-auto" />
            </a>
            <a href="https://www.sognandoilpiano.it" target="_blank" rel="noopener noreferrer" title="Sognando il Piano - www.sognandoilpiano.it" className="transform transition-transform hover:scale-110">
              <img src="/Logo%20Sip.png" alt="Sognando il Piano logo" title="Sognando il Piano" className="h-16 w-auto" />
            </a>
          </div>
          <img
            src="/images/Beethoven_Signature.png"
            alt="Firma di Ludwig van Beethoven"
            className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity mt-6"
            style={{ filter: 'invert(1)' }}
          />
          <hr className="w-32 border-t border-slate-700/60" />
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
      </div>
    </footer>
  );
}
