import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Brain, GraduationCap, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, HelpCircle, Menu, X, PlayCircle, ChevronDown, Library, User } from 'lucide-react';

// Error Boundary per debug
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi loggare l'errore qui se vuoi
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: '#b91c1c', background: '#fff', fontSize: 20 }}>
          <h1>Qualcosa è andato storto.</h1>
          <p>Ricarica la pagina o contatta l&apos;autore se il problema persiste.</p>
          {this.state.error && (
            <pre style={{ marginTop: 20, whiteSpace: 'pre-wrap' }}>{this.state.error.message}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const glossaryData = [
  {
    category: "Forme Musicali",
    items: [
      { term: "Forma Sonata", definition: "Struttura musicale in tre sezioni principali: Esposizione (presentazione dei temi), Sviluppo (elaborazione dei temi) e Ripresa (ritorno dei temi). Nel concerto classico si alterna tra TUTTI (orchestra) e SOLO (solista + orchestra)." },
      { term: "Rondò", definition: "Forma musicale basata sull'alternanza di un tema principale (ritornello) con episodi contrastanti. Schema tipico: A-B-A-C-A. Nel concerto, il tema principale si scambia velocemente tra Solo e Tutti in un rapido 'botta e risposta'." },
      { term: "Cadenza", definition: "Sezione virtuosistica per il solista, tradizionalmente improvvisata. Nel Concerto n.3, Beethoven scrisse la propria cadenza (inizialmente improvvisata). È un'area 'protetta' per mostrare il virtuosismo del solista." },
      { term: "Fugato", definition: "Passaggio in stile contrappuntistico dove il tema viene imitato tra le voci. Nel terzo movimento dell'Op. 37, Beethoven inserisce un elaborato fugato sul tema principale - scelta audace e innovativa." },
      { term: "Doppia Esposizione", definition: "Nel primo movimento del concerto classico: prima l'orchestra presenta i temi (TUTTI 1), poi il solista li riespone con l'orchestra (SOLO 1), spesso con variazioni e abbellimenti." }
    ]
  },
  {
    category: "Terminologia Tecnica",
    items: [
      { term: "TUTTI", definition: "Sezione in cui suona SOLO l'orchestra, senza il solista. Nel primo movimento: TUTTI 1 (esposizione orchestrale), TUTTI 2-4 (sviluppo e ripresa), TUTTI 5 (coda innovativa dove il piano continua a suonare)." },
      { term: "SOLO", definition: "Sezione in cui il pianoforte è protagonista, accompagnato dall'orchestra. L'unica sezione di vero solo è la Cadenza." },
      { term: "Modulazione", definition: "Passaggio da una tonalità all'altra. Nel concerto, è cruciale per il virtuosismo: le figure difficili devono essere eseguibili in diverse tonalità (es. Do minore → Mi♭ maggiore → Do maggiore)." },
      { term: "Tema Primario (P)", definition: "Il tema principale di un movimento. Nell'Op. 37, il tema primario è la scansione ascendente della triade di Do minore con ritmo puntato e carattere marziale." },
      { term: "Secondo Tema (S)", definition: "Tema contrastante, solitamente in tonalità relativa. Nell'Op. 37: profilo melodico ornato in Mi♭ maggiore, dolce e carezzevole, esposto da clarinetto e violini." },
      { term: "Episodi di Bravura", definition: "Passaggi virtuosistici con cascate di note, arpeggi, scale e trilli. Nel primo movimento (batt. 199-226), il trillo finale rappresenta il culmine agognato." },
      { term: "Transizione (TR)", definition: "Passaggio che collega il primo tema al secondo tema, con funzione di modulazione. Nella teoria Hepokoski-Darcy, la transizione può utilizzare materiale tematico esistente (come nell'Op. 37, dove il tema P agisce come 'jolly')." },
      { term: "Elemento Z", definition: "Materiale di chiusura alla fine dell'esposizione orchestrale (batt. 86-111). Ha carattere ritmico e percussivo, preparando l'entrata drammatica del solista." },
      { term: "Triade", definition: "Accordo di tre note sovrapposte per terze. Il tema primario del primo movimento è basato sulla scansione (arpeggio) della triade di Do minore (Do-Mi♭-Sol)." },
      { term: "Arpeggio", definition: "Esecuzione delle note di un accordo una dopo l'altra invece che simultaneamente. Gli arpeggi sono fondamentali nel secondo movimento e negli episodi di bravura." },
      { term: "Trillo", definition: "Rapida alternanza tra due note adiacenti. Il trillo finale dell'episodio di bravura (batt. 226) rappresenta il culmine virtuosistico dell'esposizione." },
      { term: "Punto Coronato", definition: "Simbolo che indica di prolungare una nota a piacere. Nella preparazione della cadenza (batt. 388-403), segnala la sospensione armonica prima dell'improvvisazione solistica." },
      { term: "Rotation (Rotazione)", definition: "Concetto di ripetizione ciclica dei materiali tematici in diverse sezioni del movimento, tipico dell'analisi dei concerti secondo Hepokoski-Darcy." }
    ]
  },
  {
    category: "Tonalità e Armonia",
    items: [
      { term: "Do Minore", definition: "La tonalità 'eroica' di Beethoven: tempesta, resistenza, eroismo. Collega l'Op. 37 alla Patetica, alla Quinta Sinfonia e all'Eroica. Per Beethoven rappresenta il dramma e la lotta." },
      { term: "Mi Maggiore", definition: "Tonalità del secondo movimento (Largo). Estremamente lontana dal Do minore - un salto cromatico audace che crea uno 'shock tonale'. Rappresenta un'oasi lirica e contemplativa." },
      { term: "Mi♭ Maggiore", definition: "Tonalità relativa maggiore di Do minore. Usata per il secondo tema del primo movimento e per la coda trionfale del terzo movimento (vittoria della luce sul dramma)." },
      { term: "Terza Cromatica", definition: "Intervallo tra Do minore e Mi maggiore - una distanza tonale molto remota che rende il secondo movimento un contrasto drammatico e sorprendente." }
    ]
  }
];

const movementsData = [
  {
    id: 1,
    title: "I Movimento: Allegro con brio",
    key: "Do minore",
    desc: "Forma sonata con doppia esposizione. Il primo movimento è drammatico ed eroico.",
    details: [
      "TUTTI 1 (batt. 1-111): Esposizione orchestrale con tema primario marziale (P), secondo tema lirico (S) e materiale conclusivo (Z)",
      "SOLO 1 (batt. 112-343): Ingresso drammatico del pianoforte con tre scale ascendenti fortissimo. Episodi di bravura virtuosistici",
      "SVILUPPO (batt. 244-343): Elaborazione dei temi con modulazioni audaci e contrasti dinamici",
      "CADENZA (batt. 388-403): Area virtuosistica per il solista, inizialmente improvvisata da Beethoven",
      "TUTTI 5 - Coda (batt. 404-502): Innovazione: il pianoforte continua a suonare dopo l'ingresso dell'orchestra"
    ]
  },
  {
    id: 2,
    title: "II Movimento: Largo",
    key: "Mi maggiore",
    desc: "Movimento lirico e contemplativo. La tonalità di Mi maggiore crea un contrasto drammatico con il Do minore del primo movimento.",
    details: [
      "Carattere: Intimo, meditativo, quasi una preghiera. Il pianoforte dialoga con i legni in un'atmosfera sospesa",
      "Innovazione tecnica: Uso pionieristico del pedale di risonanza (damper pedal) del pianoforte Érard",
      "Struttura: Forma tripartita (A-B-A) con sezione centrale più agitata",
      "Orchestrazione: Dialogo cameristico tra pianoforte e fagotti, oboi e archi",
      "Tonalità: Mi maggiore - scelta audace, una terza cromatica distante da Do minore"
    ]
  },
  {
    id: 3,
    title: "III Movimento: Rondo. Allegro",
    key: "Do minore → Mi♭ maggiore",
    desc: "Rondò brillante che conclude il concerto con energia e virtuosismo. Finale trionfale in Mi♭ maggiore.",
    details: [
      "Forma: Rondò (A-B-A-C-A) con tema principale che alterna tra orchestra e solista",
      "Fugato: Inserimento innovativo di un elaborato fugato sul tema principale - scelta audace per un concerto",
      "Virtuosismo: Passaggi pianistici brillanti con arpeggi, scale e ottave",
      "Modulazione finale: Da Do minore a Mi♭ maggiore per una conclusione luminosa e trionfale",
      "Carattere: Energico, quasi sfrenato, con elementi di danza e umorismo beethoveniano"
    ]
  }
];

const interpretersData = [
  {
    name: "Claudio Arrau",
    conductor: "Otto Klemperer",
    orchestra: "Philharmonia Orchestra",
    year: "1957",
    description: "Registrazione storica leggendaria. Arrau porta profondità filosofica e intensità drammatica. Il suo tocco è monumentale, quasi scultoreo. Klemperer dirige con tempi ampi e maestosi, creando un'architettura sonora imponente. Questa interpretazione è considerata un punto di riferimento per l'approccio 'titanico' al concerto.",
    style: "Monumentale, profondo, titanico"
  },
  {
    name: "Arturo Benedetti Michelangeli",
    conductor: "Carlo Maria Giulini",
    orchestra: "Wiener Symphoniker",
    year: "1979 (circa)",
    description: "Perfezione tecnica assoluta e controllo sovrumano. Michelangeli è un chirurgo del pianoforte: ogni nota è perfettamente calibrata, il suono è cristallino e luminoso. Giulini bilancia questa precisione con calore orchestrale. L'approccio è classico, elegante, quasi apollineo - un Beethoven 'purificato' da ogni eccesso romantico.",
    style: "Cristallino, perfezionista, apollineo"
  },
  {
    name: "Wilhelm Kempff",
    conductor: "Paul van Kempen",
    orchestra: "Orchestra Sinfonica della RAI di Torino",
    year: "1962",
    description: "Interpretazione intimista e cantabile. Kempff privilegia la linea melodica e il fraseggio naturale. Il suo Beethoven è umano, diretto, spontaneo - quasi improvvisato. Evita la monumentalità per cercare il dialogo cameristico e l'espressività lirica. Tocco morbido e legato, approccio 'vocale' al pianoforte.",
    style: "Intimista, cantabile, spontaneo"
  },
  {
    name: "Daniel Barenboim",
    conductor: "Antonio Pappano / Zubin Mehta",
    orchestra: "Orchestra di Santa Cecilia (2007) / Israel Philharmonic (2012)",
    year: "2007, 2012",
    description: "Approccio completo e intellettualmente ricco. Barenboim ha inciso il concerto più volte, mostrando diverse sfaccettature. Combina virtuosismo brillante con profondità interpretativa. La sua lettura è flessibile, drammatica ma equilibrata, con grande attenzione alla struttura formale e al dialogo orchestra-solista.",
    style: "Completo, intellettuale, drammatico"
  },
  {
    name: "Artur Rubinstein",
    conductor: "Bernard Haitink",
    orchestra: "Concertgebouw Orchestra",
    year: "1973",
    description: "Eleganza e nobiltà romantiche. Rubinstein porta al Beethoven la sua straordinaria cantabilità e il suo tocco vellutato. L'approccio è meno 'eroico' e più lirico, con grande attenzione alle sfumature dinamiche e al colore sonoro. Haitink accompagna con sensibilità raffinata.",
    style: "Elegante, nobile, lirico"
  }
];

const quizData = [
  {
    question: "In quale anno avvenne la prima esecuzione assoluta?",
    options: ["1800", "1802", "1803", "1805"],
    correct: 2
  },
  {
    question: "Chi era il direttore durante la prima, che vide 'geroglifici egizi' invece della partitura?",
    options: ["Ferdinand Ries", "Ignaz von Seyfried", "Carl Czerny", "Joseph Haydn"],
    correct: 1
  },
  {
    question: "Quando arrivò Beethoven a Vienna?",
    options: ["1789", "1792", "1796", "1800"],
    correct: 1
  },
  {
    question: "Quale concerto di Mozart è il modello principale dell'Op. 37?",
    options: ["K. 466 in Re minore", "K. 467 in Do maggiore", "K. 491 in Do minore", "K. 537 'Coronation'"],
    correct: 2
  },
  {
    question: "Come entra il pianoforte nel primo movimento?",
    options: ["Con il tema principale piano", "Con tre arpeggi delicati", "Con tre scale ascendenti fortissimo in doppie ottave", "Con un assolo lirico"],
    correct: 2
  },
  {
    question: "In quale tonalità finisce il terzo movimento?",
    options: ["Do minore", "Do maggiore", "Mi maggiore", "Mi♭ maggiore"],
    correct: 3
  },
  {
    question: "Qual è l'innovazione tecnica che Beethoven sfruttò nel secondo movimento?",
    options: ["Uso pionieristico del pedale di risonanza", "Invenzione del forte-piano", "Uso del pizzicato", "Introduzione del clarinetto basso"],
    correct: 0
  },
  {
    question: "Cosa scrisse Beethoven nel Testamento di Heiligenstadt?",
    options: ["La dedica del concerto", "La disperazione per la sordità", "Le istruzioni per l'esecuzione", "La cadenza del primo movimento"],
    correct: 1
  },
  {
    question: "Quale elemento inusuale compare nel terzo movimento?",
    options: ["Un valzer", "Un fugato elaborato", "Un corale", "Una marcia funebre"],
    correct: 1
  },
  {
    question: "Quale altro lavoro fu eseguito nella stessa serata della prima dell'Op. 37?",
    options: ["La Quinta Sinfonia", "La Seconda Sinfonia", "Il Fidelio", "La Nona Sinfonia"],
    correct: 1
  },
  {
    question: "Come cambia il ruolo del solista rispetto ai concerti mozartiani?",
    options: ["Diventa più virtuoso", "Si oppone all'orchestra invece di dialogare", "Suona più piano", "Ha meno importanza"],
    correct: 1
  },
  {
    question: "Quale strumento espone il secondo tema nel primo movimento?",
    options: ["Violini", "Clarinetto e violini", "Flauto", "Corno"],
    correct: 1
  },
  {
    question: "Chi ha registrato l'Op. 37 con Otto Klemperer nel 1957?",
    options: ["Michelangeli", "Kempff", "Arrau", "Barenboim"],
    correct: 2
  },
  {
    question: "Quale interprete è famoso per l'approccio 'cristallino e apollineo'?",
    options: ["Arrau", "Michelangeli", "Kempff", "Rubinstein"],
    correct: 1
  },
  {
    question: "Chi suonò con l'Orchestra della RAI di Torino nel 1962?",
    options: ["Arrau", "Michelangeli", "Kempff", "Barenboim"],
    correct: 2
  },
  {
    question: "Quale interprete usa un approccio 'intimista e cantabile'?",
    options: ["Arrau", "Michelangeli", "Kempff", "Barenboim"],
    correct: 2
  },
  {
    question: "Quanti flauti sono nell'organico orchestrale dell'Op. 37?",
    options: ["1", "2", "3", "4"],
    correct: 1
  },
  {
    question: "In quale tonalità sono i clarinetti dell'Op. 37?",
    options: ["Do", "Si♭", "La", "Mi♭"],
    correct: 1
  },
  {
    question: "Quale pianoforte possedette Beethoven dal 1803?",
    options: ["Walter", "Stein", "Érard", "Broadwood"],
    correct: 2
  },
  {
    question: "Cosa caratterizza il carattere del primo tema (P)?",
    options: ["Dolce e cantabile", "Marziale con ritmo puntato", "Virtuosistico", "Lirico"],
    correct: 1
  },
  {
    question: "Come finisce la cadenza del primo movimento?",
    options: ["Con forte orchestrale", "Con passaggio dolce e liquido", "Con un trillo fortissimo", "Con silenzio totale"],
    correct: 1
  },
  {
    question: "Quando Napoleone entrò a Vienna?",
    options: ["1803", "1805", "1809", "1812"],
    correct: 2
  },
  {
    question: "Chi invitò Beethoven a Vienna nel 1792?",
    options: ["Haydn", "Mozart", "Conte Waldstein", "Principe Lichnowsky"],
    correct: 2
  },
  {
    question: "In quale tonalità è il secondo movimento?",
    options: ["Do maggiore", "Mi♭ maggiore", "Mi maggiore", "La♭ maggiore"],
    correct: 2
  },
  {
    question: "Qual è la forma del primo movimento?",
    options: ["Rondò", "Tema con variazioni", "Forma sonata con doppia esposizione", "Fuga"],
    correct: 2
  },
  {
    question: "A chi fu dedicato il concerto?",
    options: ["Napoleone Bonaparte", "Principe Luigi Ferdinando di Prussia", "Arciduca Rodolfo", "Conte Waldstein"],
    correct: 1
  },
  {
    question: "In quale teatro avvenne la prima esecuzione?",
    options: ["Theater an der Wien", "Burgtheater", "Kärntnertortheater", "Hofoper"],
    correct: 0
  },
  {
    question: "Quale editore pubblicò per primo il concerto?",
    options: ["Breitkopf & Härtel", "Bureau des Arts et d'Industrie", "Simrock", "Artaria"],
    correct: 1
  },
  {
    question: "In che anno fu pubblicato il concerto?",
    options: ["1800", "1802", "1804", "1806"],
    correct: 2
  },
  {
    question: "Qual è il carattere principale del Do minore beethoveniano?",
    options: ["Pastorale e sereno", "Eroico e tempestoso", "Elegante e galante", "Sacro e mistico"],
    correct: 1
  },
  {
    question: "Quale opera precedente di Beethoven in Do minore è chiamata 'Patetica'?",
    options: ["Op. 1 n. 3", "Op. 10 n. 1", "Op. 13", "Op. 18 n. 4"],
    correct: 2
  },
  {
    question: "Che cosa caratterizza l'ingresso del solista nel primo movimento?",
    options: ["Un tema nuovo e dolce", "Tre scale ascendenti fortissimo", "Un arpeggio delicato", "Una citazione di Mozart"],
    correct: 1
  },
  {
    question: "Quante battute dura circa l'esposizione orchestrale (TUTTI 1)?",
    options: ["50 battute", "111 battute", "227 battute", "343 battute"],
    correct: 1
  },
  {
    question: "La distanza tonale tra primo e secondo movimento (Do minore - Mi maggiore) è chiamata:",
    options: ["Terza maggiore", "Quinta giusta", "Terza cromatica", "Sesta maggiore"],
    correct: 2
  },
  {
    question: "Quale innovazione compare nella coda finale del primo movimento?",
    options: ["Una seconda cadenza", "Il piano continua durante il TUTTI", "Un assolo di timpani", "Una modulazione a Do maggiore"],
    correct: 1
  },
  {
    question: "Nel secondo movimento, quali strumenti dialogano principalmente con il pianoforte?",
    options: ["Violini e viole", "Flauti e oboi", "Fagotti e legni", "Trombe e corni"],
    correct: 2
  },
  {
    question: "Il terzo movimento è in forma:",
    options: ["Sonata", "Rondò", "Tema con variazioni", "Minuetto"],
    correct: 1
  },
  {
    question: "Cosa disse Beethoven del concerto K. 491 di Mozart?",
    options: ["'È troppo semplice'", "'Non saremo mai in grado di fare qualcosa di simile'", "'Lo posso migliorare'", "'È il mio modello perfetto'"],
    correct: 1
  },
  {
    question: "In quale documento Beethoven scrisse della sua disperazione per la sordità?",
    options: ["Lettera a Bettina Brentano", "Testamento di Heiligenstadt", "Diario personale", "Lettera all'Immortale Amata"],
    correct: 1
  },
  {
    question: "Quale altra grande opera Beethoven completò nello stesso anno del concerto (1802)?",
    options: ["Eroica", "Seconda Sinfonia", "Quinta Sinfonia", "Fidelio"],
    correct: 1
  },
  {
    question: "Quale periodo stilistico di Beethoven inizia con opere come l'Op. 37?",
    options: ["Periodo giovanile", "Periodo eroico", "Periodo tardo", "Periodo classico"],
    correct: 1
  },
  {
    question: "Quale caratteristica distingue il pianoforte Érard che Beethoven ricevette nel 1803?",
    options: ["Aveva 88 tasti", "Aveva quattro pedali", "Aveva il pedale di risonanza innovativo", "Era un clavicembalo modificato"],
    correct: 2
  },
  {
    question: "In che anno iniziò a manifestarsi la sordità di Beethoven?",
    options: ["1792", "1796-98", "1802", "1809"],
    correct: 1
  }
];

// --- COMPONENTI ---

const Navigation = ({ activeTab, setActiveTab, isMobile, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const tabs = [
    { id: 'introduzione', label: 'Introduzione', icon: BookOpen },
    { id: 'analysis', label: 'Analisi', icon: Music },
    { id: 'interpreters', label: 'Interpreti', icon: PlayCircle },
    { id: 'glossary', label: 'Glossario', icon: Library },
    { id: 'quiz', label: 'Quiz', icon: GraduationCap },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-slate-800 text-slate-100 shadow-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 font-bold text-xl">
            <Music className="h-6 w-6 text-blue-400" />
            <div>
              <div className="text-blue-900">Beethoven Op. 37</div>
            </div>
          </div>

          <div className="hidden md:flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-blue-400 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobile && isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700">
            <div className="pt-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    activeTab === tab.id
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};


const IntroduzioneSection = ({ setActiveTab }) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Panoramica introduttiva */}
      <div className="bg-slate-800 text-slate-100 p-6 rounded-lg shadow-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4">Concerto per pianoforte n. 3 in Do minore, Op. 37</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-1.5">
            <p><strong>Compositore:</strong> Ludwig van Beethoven (1770-1827)</p>
            <p><strong>Composizione:</strong> 1800-1803</p>
            <p><strong>Prima esecuzione:</strong> 5 aprile 1803, Theater an der Wien</p>
          </div>
          <div className="space-y-1.5">
            <p><strong>Dedicato a:</strong> Principe Luigi Ferdinando di Prussia</p>
            <p><strong>Tonalità:</strong> Do minore → Mi♭ maggiore (finale)</p>
            <p><strong>Movimenti:</strong> Allegro con brio • Largo • Rondo: Allegro</p>
          </div>
        </div>
      </div>

      {/* Link rapidi */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">🔗 Esplora</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('analysis')}
            className="text-xs px-3 py-1.5 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Analisi movimenti
          </button>
          <button
            onClick={() => setActiveTab('glossary')}
            className="text-xs px-3 py-1.5 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Glossario termini
          </button>
          <button
            onClick={() => setActiveTab('interpreters')}
            className="text-xs px-3 py-1.5 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Interpretazioni storiche
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className="text-xs px-3 py-1.5 bg-slate-700 border border-emerald-700 text-emerald-400 rounded hover:bg-slate-600 transition-colors font-medium"
          >
            → Mettiti alla prova
          </button>
        </div>
      </div>

      {/* Cards principali */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
            Contesto storico
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong className="text-slate-100">Vienna 1792:</strong> Beethoven arriva nella capitale musicale d'Europa, 
              dove aveva vissuto{' '}
              <Tooltip text="Joseph Haydn (1732-1809), 'Padre della sinfonia', maestro di Beethoven">
                <span className="text-blue-300 font-semibold cursor-help border-b border-blue-500 border-dotted">Haydn</span>
              </Tooltip>{' '}
              e il geniale{' '}
              <Tooltip text="Wolfgang Amadeus Mozart (1756-1791), morto appena un anno prima">
                <span className="text-blue-300 font-semibold cursor-help border-b border-blue-500 border-dotted">Mozart</span>
              </Tooltip>.
            </p>
            <p>
              <strong className="text-slate-100">Le guerre napoleoniche:</strong> L'Europa è sconvolta dai conflitti (1792-1815). 
              Beethoven ammira inizialmente Napoleone come simbolo di libertà, ma si disilluderà quando questi si proclamerà imperatore.
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <User className="w-5 h-5 text-orange-400 mr-2" />
            La crisi personale
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong className="text-slate-100">Il dramma della sordità:</strong> Dal 1796-98 Beethoven inizia a perdere l'udito. 
              Questo concerto nasce nel cuore della crisi, quasi contemporaneamente al{' '}
              <Tooltip text="Ottobre 1802: lettera ai fratelli in cui Beethoven contempla il suicidio ma sceglie di vivere per l'arte">
                <span className="text-orange-300 font-semibold cursor-help border-b border-orange-500 border-dotted">Testamento di Heiligenstadt</span>
              </Tooltip>.
            </p>
            <p className="italic text-slate-300 border-l-2 border-orange-500 pl-3">
              "Mi sembrava impossibile lasciare il mondo prima di aver compiuto tutto ciò a cui mi sentivo destinato."
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <Music className="w-5 h-5 text-purple-400 mr-2" />
            L'eredità di Mozart
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              Il modello è il{' '}
              <button
                onClick={() => setActiveTab('glossary')}
                className="text-purple-700 font-semibold hover:underline"
              >
                Concerto K. 491 in Do minore
              </button>{' '}
              di Mozart. Beethoven però trasforma il genere: il pianoforte non dialoga più armoniosamente, 
              ma si <em>oppone</em> all'orchestra in un confronto drammatico.
            </p>
            <p className="italic text-slate-200">
              "Cramer! Non potremo mai fare nulla di simile!" 
              <span className="text-xs text-slate-500 block mt-1">— Beethoven dopo aver ascoltato il K. 491</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <PlayCircle className="w-5 h-5 text-emerald-400 mr-2" />
            La prima esecuzione
          </h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              <strong className="text-slate-100">5 aprile 1803:</strong> Beethoven suona al Theater an der Wien. 
              Il direttore Ignaz von Seyfried raccontò di aver visto "solo geroglifici egizi" sulla partitura: 
              Beethoven suonò gran parte <strong>a memoria</strong>, probabilmente improvvisando intere sezioni!
            </p>
            <p>
              Nella stessa serata furono eseguiti anche la <em>Seconda Sinfonia</em> e l'oratorio <em>Cristo sul Monte degli Ulivi</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Innovazioni */}
      <div className="bg-slate-800 p-5 rounded-lg border border-emerald-800">
        <h3 className="text-lg font-semibold text-emerald-300 mb-4">🎹 Innovazioni chiave</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-300">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Il pianoforte entra con <strong>tre scale fortissimo</strong> (non più dolce)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Uso pionieristico del{' '}
                <Tooltip text="Pedale che prolunga il suono, creando effetti di risonanza misteriosi">
                  <span className="font-semibold cursor-help border-b border-emerald-500 border-dotted">pedale di risonanza</span>
                </Tooltip>
              </span>
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>La cadenza è <strong>scritta</strong> (non più improvvisata)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span>Finale da Do minore a Mi♭ maggiore (dalla tragedia al trionfo)</span>
            </li>
          </ul>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700">
          <button
            onClick={() => setActiveTab('analysis')}
            className="text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:underline"
          >
            → Scopri l'analisi dettagliata dei tre movimenti
          </button>
        </div>
      </div>

      {/* Il Do minore eroico */}
      <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">🎼 Il "Do minore eroico"</h3>
        <p className="text-sm text-slate-300 mb-3">
          Per Beethoven, il <strong>Do minore</strong> è la tonalità della tempesta, del dramma e dell'eroismo. 
          Questo concerto è il ponte tra il classicismo mozartiano e il{' '}
          <Tooltip text="1803-1814: periodo delle grandi sinfonie (Eroica, Quinta, Sesta) e del Fidelio">
            <span className="text-blue-300 font-semibold cursor-help border-b border-blue-500 border-dotted">periodo eroico</span>
          </Tooltip>.
        </p>
        <div className="bg-slate-700 p-3 rounded text-xs text-slate-300">
          <strong>Altre opere in Do minore:</strong> Sonata Patetica Op. 13, Quinta Sinfonia Op. 67, 
          Quartetto Op. 18 n. 4, Sonata per violino Op. 30 n. 2.
        </div>
      </div>
    </div>
  );
};

// Componente Tooltip
const Tooltip = ({ text, children }) => (
  <span className="relative inline-block group">
    {children}
    <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-950 text-slate-100 text-xs rounded-lg shadow-xl w-64 z-20 pointer-events-none border border-slate-700">
      {text}
    </span>
  </span>
);

  const toggleSection = (id) => setOpenSection(openSection === id ? null : id);
  const toggleSourceAccordion = (id) => setOpenSourceAccordion(openSourceAccordion === id ? null : id);

  const beethovenLifeTimeline = [
    { year: "1770", event: "Nascita a Bonn (16 dicembre), Germania. Famiglia di musicisti di corte." },
    { year: "1787", event: "Primo viaggio a Vienna. Forse incontra Mozart. Ritorna a Bonn per la morte della madre." },
    { year: "1792", event: "Trasferimento definitivo a Vienna. Inizia gli studi con Haydn." },
    { year: "1795", event: "Primo concerto pubblico a Vienna. Pubblica le prime opere." },
    { year: "1796-98", event: "Prime manifestazioni della sordità. Inizia il declino dell'udito." },
    { year: "1800", event: "Prima Sinfonia. Affermazione come compositore oltre che come pianista." },
    { year: "1802", event: "Testamento di Heiligenstadt. Crisi esistenziale profonda." },
    { year: "1803-1814", event: "Periodo Eroico: Terza Sinfonia (Eroica), Quinta, Sesta (Pastorale), Fidelio." },
    { year: "1815-1820", event: "Sordità quasi totale. Uso dei 'quaderni di conversazione'." },
    { year: "1824", event: "Nona Sinfonia. Trionfo assoluto nonostante la sordità completa." },
    { year: "1827", event: "Morte a Vienna (26 marzo). Funerale con 20.000 persone." }
  ];

  const concertoTimeline = [
    { year: "1796-97", event: "Primi abbozzi tematici. Beethoven inizia a concepire il concerto." },
    { year: "1798", event: "La sordità si manifesta chiaramente. Beethoven si dedica maggiormente alla composizione." },
    { year: "1799", event: "Primi abbozzi sistematici del Concerto n. 3 in Do minore." },
    { year: "1800", event: "Lavoro intenso al concerto. Manoscritto autografo datato '1800'." },
    { year: "1802", event: "Completamento definitivo. Scritto in parallelo al Testamento di Heiligenstadt (ottobre)." },
    { year: "1803 (5 Aprile)", event: "Prima assoluta al Theater an der Wien. Beethoven solista, Seyfried direttore. Partitura incompleta - Beethoven suona 'a memoria'!" },
    { year: "1804", event: "Pubblicazione da Bureau des Arts et d'Industrie. Dedica al Principe Luigi Ferdinando di Prussia." }
  ];

  const fontiDocumentarie = [
    {
      id: 1,
      title: "Quaderni di Schizzi (Skizzenbücher)",
      content: (
        <ul className="space-y-3 text-slate-200">
          <li><strong>Concezione ed evoluzione:</strong> Fino al <strong>1798</strong> circa, Beethoven usava fogli sciolti o piccoli fascicoli raccolti in portafogli. Dal 1798 passò a quaderni rilegati, custoditi fino alla morte come memoria del proprio sviluppo artistico.</li>
          <li><strong>Tipologie:</strong>
            <ul className="mt-2 space-y-2 pl-5 list-disc">
              <li><strong>Quaderni da scrivania:</strong> formato grande, scrittura a inchiostro, usati a casa per elaborazioni sistematiche.</li>
              <li><strong>Quaderni tascabili:</strong> formato piccolo, scrittura a matita. Portati durante le passeggiate per fissare idee improvvise. Beethoven diceva: «Non oso uscire senza il mio stendardo».</li>
            </ul>
          </li>
          <li><strong>Organizzazione interna:</strong>
            <ul className="mt-2 space-y-2 pl-5 list-disc">
              <li><strong>Concept sketches:</strong> idee iniziali per definire il carattere di un&apos;opera.</li>
              <li><strong>Continuity drafts:</strong> bozze lunghe su un singolo rigo per l&apos;andamento complessivo.</li>
              <li><strong>Varianti:</strong> alternative per brevi passaggi.</li>
              <li><strong>Piani di movimento:</strong> sinossi per opere in più movimenti.</li>
            </ul>
          </li>
        </ul>
      )
    },
    {
      id: 2,
      title: "Fogli Sciolti e Miscellanee (Kafka, Fischhof)",
      content: (
        <ul className="space-y-3 text-slate-200">
          <li><strong>Concezione:</strong> prima del 1798 o parallelamente ai quaderni, Beethoven usava fogli singoli per scopi specifici.</li>
          <li><strong>Funzione:</strong> area privilegiata per <strong>sperimentazione tecnica e pianistica</strong>.</li>
          <li><strong>Contenuto:</strong> ricerche di Luca Chiantore mostrano esercizi tecnici (<em>Klavierübungen</em>): formule ripetitive, modulazioni, diteggiature nuove, suoni sperimentali.</li>
          <li><strong>Partiture orchestrali:</strong> per opere sinfoniche abbozzava partiture su più righi, cosa difficile nei quaderni di schizzi.</li>
        </ul>
      )
    },
    {
      id: 3,
      title: "Quaderni di Conversazione (Konversationshefte)",
      content: (
        <ul className="space-y-3 text-slate-200">
          <li><strong>Uso:</strong> introdotti verso il <strong>1818</strong> quando la sordità era grave. Gli interlocutori scrivevano domande/riposte, Beethoven rispondeva a voce.</li>
          <li><strong>Contenuto:</strong> circa 400 quaderni con dialoghi su musica, politica, vita quotidiana. Fonti biografiche primarie, sebbene Schindler ne abbia alterati alcuni.</li>
        </ul>
      )
    },
    {
      id: 4,
      title: "Diari (Tagebuch) e \"Concetti\" (Konzept)",
      content: (
        <ul className="space-y-3 text-slate-200">
          <li><strong>Tagebuch:</strong> diario (1812-1818) per introspezione, preghiere, citazioni filosofiche, riflessioni personali.</li>
          <li><strong>Concetto:</strong> stadio intermedio tra schizzo e partitura finale. Partitura quasi completa ma non definitiva, da ripulire prima della copia per l&apos;editore.</li>
        </ul>
      )
    }
  ];

  const ContestoContent = () => (
    <div className="space-y-8">
      {/* Contesto Geopolitico */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl border border-slate-600/50">
        <h2 className="text-4xl font-bold mb-6 text-amber-400">Il contesto geopolitico e culturale</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-amber-300 mb-3">Vienna: la capitale musicale d'Europa</h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              Quando Beethoven arriva nel novembre 1792, <strong>Vienna</strong> è la capitale musicale indiscussa d'Europa.
              La città aveva ospitato{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">Haydn</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                  Joseph Haydn (1732-1809): "Padre della sinfonia", maestro di Beethoven a Vienna dal 1792
                </span>
              </span>,{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">Gluck</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                  Christoph Willibald Gluck (1714-1787): Compositore di opere, riformatore del melodramma
                </span>
              </span> e{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">Mozart</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                  Wolfgang Amadeus Mozart (1756-1791): Genio del classicismo, morto appena un anno prima dell'arrivo di Beethoven
                </span>
              </span>.
              L'imperatore{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">Francesco II</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                  Francesco II d'Asburgo (1768-1835): Ultimo imperatore del Sacro Romano Impero, primo imperatore d'Austria, violinista dilettante
                </span>
              </span>{' '}
              suonava il violino, e la nobiltà finanziava generosamente musicisti e concerti.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-amber-300 mb-3">Le guerre napoleoniche (1792-1815)</h3>
            <p className="text-lg text-slate-300 leading-relaxed mb-3">
              L'Europa è sconvolta dalle{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">guerre napoleoniche</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-72 z-10">
                  1792-1815: conflitti tra la Francia rivoluzionaria/napoleonica e le coalizioni europee. Napoleone conquisterà Vienna nel 1805 e nel 1809
                </span>
              </span>.
              La <strong>Rivoluzione francese</strong> (1789) aveva rovesciato l'ordine monarchico, proclamando libertà, uguaglianza e fraternità.
              Napoleone Bonaparte emerge come generale nel 1796 e diventa primo console nel 1799, poi imperatore nel 1804.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed">
              Beethoven inizialmente ammira Napoleone come simbolo degli ideali repubblicani, ma si disilluderà quando questi si autoincoronerà imperatore.
              Nel <strong>1809</strong>, Napoleone conquisterà Vienna (12 maggio), causando devastazione e carestia.
              Il periodo rivoluzionario influenza profondamente lo stile di Beethoven: uno "stile grandioso" post-rivoluzionario francese si fonde con la tradizione classica viennese.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-amber-300 mb-3">La crisi personale di Beethoven</h3>
            <p className="text-lg text-slate-300 leading-relaxed">
              Mentre l'Europa è in guerra, Beethoven combatte la sua battaglia personale: la <strong>sordità progressiva</strong> (iniziata 1796-98).
              Il concerto n. 3 è composto nel cuore di questa crisi esistenziale, quasi in parallelo al drammatico{' '}
              <span className="relative inline-block group cursor-help">
                <span className="text-amber-400 font-semibold border-b border-amber-400 border-dotted">Testamento di Heiligenstadt</span>
                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-72 z-10">
                  Ottobre 1802: lettera ai fratelli in cui Beethoven contempla il suicidio ma sceglie di vivere per l'arte. Documento straziante della sua disperazione
                </span>
              </span>{' '}
              (1802). È il ponte tra classicismo mozartiano e romanticismo eroico.
            </p>
            <div className="mt-5 bg-slate-900/60 border border-amber-400/40 rounded-2xl p-5 text-slate-100 shadow-inner">
              <h4 className="text-xl font-semibold text-amber-300 mb-1">Testamento di Heiligenstadt</h4>
              <p className="text-sm text-amber-200/70 mb-4">Beethoven ai fratelli, autunno 1802</p>
              <ul className="space-y-3 text-sm md:text-base">
                <li>
                  <em className="block border-l-2 border-amber-400 pl-4 italic">
                    "O uomini, che mi considerate duro, misantropo o asociale, quanto profondamente vi ingannate!"
                  </em>
                </li>
                <li>
                  <em className="block border-l-2 border-amber-400 pl-4 italic">
                    "Solo l'arte mi ha trattenuto. Mi sembrava impossibile lasciare il mondo prima di aver compiuto tutto ciò a cui mi sentivo destinato."
                  </em>
                </li>
                <li>
                  <em className="block border-l-2 border-amber-400 pl-4 italic">
                    "Rassegnati alle mie infermità e perdonami se ti crei dolore, tu creatura così fedele."
                  </em>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cronologia Vita di Beethoven */}
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
        <button
          onClick={() => setOpenBeethovenTimeline(!openBeethovenTimeline)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openBeethovenTimeline
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Cronologia: vita di Ludwig van Beethoven</h3>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openBeethovenTimeline ? 'rotate-180' : ''}`} />
        </button>
        {openBeethovenTimeline && (
          <div className="p-6 pt-8 bg-slate-900">
            <div className="space-y-2.5">
              {beethovenLifeTimeline.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start p-3 rounded-lg bg-slate-800 border-l-2 border-blue-600 shadow-sm">
                  <span className="font-semibold text-blue-300 text-sm w-28 shrink-0">{item.year}</span>
                  <span className="text-slate-200 text-sm leading-relaxed">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cronologia Solo Concerto n.3 */}
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
        <button
          onClick={() => setOpenConcertoTimeline(!openConcertoTimeline)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openConcertoTimeline
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Cronologia: concerto n. 3 in Do minore, op. 37</h3>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openConcertoTimeline ? 'rotate-180' : ''}`} />
        </button>
        {openConcertoTimeline && (
          <div className="p-6 pt-8 bg-slate-900">
            <div className="space-y-2.5">
              {concertoTimeline.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start p-3 rounded-lg bg-slate-800 border-l-2 border-blue-600 shadow-sm">
                  <span className="font-semibold text-blue-300 text-sm w-32 shrink-0">{item.year}</span>
                  <span className="text-slate-200 text-sm leading-relaxed">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Carattere di Beethoven */}
      <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
        <h3 className="text-xl font-semibold text-slate-100 mb-5 flex items-center">
          <Music className="w-5 h-5 text-blue-400 mr-2" />
          Il carattere di Beethoven
        </h3>
        <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-100">Aspetto fisico:</strong> basso e tarchiato, fronte alta e spaziosa,
            capelli neri e ricci che gli cadevano disordinati sulle spalle. Il suo aspetto variava enormemente:
            talvolta trasandato, talvolta elegante e ben vestito. I contemporanei lo descrivevano come un vulcano umano.
          </p>
          <p>
            <strong className="text-slate-100">Temperamento:</strong> passionale, impulsivo, irascibile ma anche
            profondamente sentimentale. Poteva passare dalla collera più violenta alla tenerezza più commovente.
            La sua personalità era così intensa che intimoriva anche i nobili che lo proteggevano.
          </p>
          <p>
            <strong className="text-slate-100">L'improvvisatore leggendario:</strong> Beethoven era considerato
            il <em>più grande improvvisatore dell'epoca</em>. Durante i concerti pubblici, le sue improvvisazioni
            lasciavano il pubblico letteralmente a bocca aperta. Poteva improvvisare per ore su un tema dato,
            sviluppandolo in modi sempre diversi e sorprendenti. Questa abilità straordinaria spiega perché
            alla prima del 1803 poté suonare "quasi a memoria" - probabilmente improvvisò intere sezioni!
          </p>
          <p>
            <strong className="text-slate-100">Il dramma della sordità:</strong> la perdita progressiva dell'udito
            (iniziata nel 1796-98) fu una tragedia per un musicista. Nel Testamento di Heiligenstadt (1802)
            Beethoven confessò di aver contemplato il suicidio, ma scelse di vivere per l'arte:
            <em className="block my-2 pl-4 border-l-2 border-slate-400 text-slate-100">
              "Mi sembrava impossibile lasciare il mondo prima di aver compiuto tutto ciò a cui mi sentivo destinato."
            </em>
            La sordità lo spinse a concentrarsi sulla composizione anziché sull'esecuzione come pianista virtuoso.
          </p>
        </div>
      </div>

      {/* Aneddoti e Approfondimenti */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-4 border-slate-6000">
          <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
            <div className="bg-amber-100 p-2 rounded-lg mr-3">
              <HelpCircle className="w-6 h-6 text-amber-600" />
            </div>
            L'aneddoto delle pagine bianche
          </h3>
          <p className="text-slate-200 leading-relaxed">
            Durante la prima del 5 aprile 1803, il direttore{' '}
            <span className="relative inline-block group cursor-help">
              <span className="text-amber-700 font-semibold border-b border-amber-600 border-dotted">Ignaz von Seyfried</span>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                Ignaz von Seyfried (1776-1841): Direttore d'orchestra e compositore, testimone della prima esecuzione
              </span>
            </span>{' '}
            raccontò:
            <em className="block my-3 pl-4 border-l-2 border-amber-300 text-amber-900">"Vidi quasi nient'altro che pagine vuote... solo qualche geroglifico egizio."</em>
            Beethoven suonò la parte solistica quasi interamente <strong>a memoria</strong> perché non aveva
            completato la scrittura! Continuò a modificare il concerto fino alla consegna all'editore.
            Nella stessa serata furono eseguiti anche la Seconda Sinfonia e l'oratorio <em>Cristo sul Monte degli Ulivi</em>.
          </p>
        </div>
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border-l-4 border-slate-6000">
          <h3 className="text-2xl font-bold text-slate-100 mb-4 flex items-center">
            <div className="bg-amber-100 p-2 rounded-lg mr-3">
              <PlayCircle className="w-6 h-6 text-amber-600" />
            </div>
            Il "C minor mood" e l'eredità di Mozart
          </h3>
          <p className="text-slate-200 leading-relaxed">
            Per Beethoven, il <strong>Do minore</strong> è la tonalità della tempesta e dell'eroismo.
            Collega quest'opera alla <em>Patetica</em> e alla <em>Quinta sinfonia</em>.
            Il modello principale è il{' '}
            <span className="relative inline-block group cursor-help">
              <span className="text-amber-700 font-semibold border-b border-amber-600 border-dotted">concerto K. 491</span>
              <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg shadow-lg w-64 z-10">
                Concerto n. 24 in Do minore K. 491 di Mozart (1786): capolavoro del concerto classico, modello per l'op. 37
              </span>
            </span>{' '}
            di Mozart. Beethoven stesso ammise dopo un'esecuzione:
            <em className="block my-3 pl-4 border-l-2 border-amber-300 text-amber-900">"Cramer! Non potremo mai fare nulla di simile!"</em>
            Ma trasforma il concerto da "salotto" in dramma sinfonico,
            con il pianoforte che si oppone all'orchestra anziché dialogare armoniosamente.
          </p>
        </div>
      </div>
    </div>
  );

  const PremesseContent = () => (
    <div className="space-y-8">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-300">
        <h3 className="text-3xl font-semibold text-blue-900 mb-4">La tonalità di Do minore: riferimenti esterni e interni</h3>
        <p className="text-slate-200 mb-6 leading-relaxed">
          Riconoscere le fonti ispiratrici dell&apos;Op. 37 significa guardare sia ai modelli esterni sia ai precedenti interni della produzione beethoveniana.
        </p>
        <div className="space-y-6 text-slate-200">
          <div>
            <h4 className="text-xl font-semibold text-blue-800 mb-3">1. Il riferimento principale: Mozart e il K. 491</h4>
            <p>
              Il modello più significativo per il Terzo Concerto è il Concerto per pianoforte n. 24 in Do minore, K. 491 di Wolfgang Amadeus Mozart.
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Ammirazione di Beethoven:</strong> ascoltando il K. 491 all&apos;Augarten nel 1799 con Johann Baptist Cramer, esclamò «Cramer! Cramer! Non saremo mai in grado di fare qualcosa di simile!».</li>
              <li><strong>Punti di contatto:</strong> entrambi i concerti condividono la stessa tonalità e un ricco dialogo tra archi e fiati nei ritornelli orchestrali.</li>
              <li><strong>Differenze sostanziali:</strong> Beethoven rompe l&apos;integrazione mozartiana tra solista e orchestra: il pianoforte entra con atteggiamento di sfida, appropriandosi dei temi orchestrali. Donald Tovey nota anche come Beethoven, a differenza di Mozart, tenda a esporre tutto il materiale tematico prima dell&apos;ingresso solistico.</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-blue-800 mb-3">2. Precedenti opere di Beethoven in Do minore</h4>
            <p>
              Tra il 1795 e il 1802 Beethoven aveva già elaborato un linguaggio drammatico in Do minore che prepara l&apos;Op. 37.
            </p>
            <ul className="mt-3 space-y-2 list-disc pl-5">
              <li><strong>Trio per pianoforte op. 1 n. 3</strong> (1795): amplia il dramma tonale con contrasti dinamici marcati.</li>
              <li><strong>Sonata per pianoforte op. 10 n. 1</strong> (1798): esplora ulteriormente il carattere tempestoso e concentrato della tonalità.</li>
              <li><strong>Trio per archi op. 9 n. 3</strong> (1798): conciso ed energico, considerato dallo stesso Beethoven fra i lavori più riusciti dell&apos;epoca.</li>
              <li><strong>Sonata per pianoforte op. 13 "Patetica"</strong> (1798-99): condivide con il concerto la tonalità cupa e l&apos;energia dinamica, inaugurando l&apos;uso strutturale di un&apos;introduzione lenta.</li>
              <li><strong>Quartetto per archi op. 18 n. 4</strong> (1799-1800): altro esempio di scrittura serrata in Do minore.</li>
              <li><strong>Sonata per violino e pianoforte op. 30 n. 2</strong> (1802): amplia la tavolozza timbrica e anticipa il pathos eroico dello stile maturo.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const FontiContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl border border-slate-600/50">
        <h2 className="text-4xl font-bold mb-6 text-amber-400">Fonti documentarie</h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          Questa tabella riassume i supporti principali utilizzati da Beethoven per l&apos;Op. 37 e, più in generale, per il processo compositivo. I dettagli completi sono disponibili nelle schede di approfondimento immediatamente sotto.
        </p>
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full text-sm md:text-base border border-slate-300 rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Tipologia</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Periodo</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Funzione primaria</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Organizzazione</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 text-slate-100">
              <tr className="odd:bg-white">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-blue-900">Quaderni di Schizzi</td>
                <td className="px-4 py-3 border border-slate-700">Dal 1798 in poi</td>
                <td className="px-4 py-3 border border-slate-700">Composizione, sviluppo di idee, memoria artistica.</td>
                <td className="px-4 py-3 border border-slate-700">Rilegati (da tavolo o tascabili). Mix di idee per varie opere.</td>
              </tr>
              <tr className="odd:bg-white">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-blue-900">Fogli Sciolti</td>
                <td className="px-4 py-3 border border-slate-700">Pre-1798 (e oltre)</td>
                <td className="px-4 py-3 border border-slate-700">Esercizi tecnici, esperimenti pianistici, partiture orchestrali abbozzate.</td>
                <td className="px-4 py-3 border border-slate-700">Sparsi, poi riuniti in miscellanee (es. Kafka) dai collezionisti.</td>
              </tr>
              <tr className="odd:bg-white">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-blue-900">Quaderni di Conversazione</td>
                <td className="px-4 py-3 border border-slate-700">Dal 1818 in poi</td>
                <td className="px-4 py-3 border border-slate-700">Comunicazione quotidiana (causa sordità).</td>
                <td className="px-4 py-3 border border-slate-700">Dialoghi scritti dagli interlocutori.</td>
              </tr>
              <tr className="odd:bg-white">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-blue-900">Diario (Tagebuch)</td>
                <td className="px-4 py-3 border border-slate-700">1812-1818 (principalmente)</td>
                <td className="px-4 py-3 border border-slate-700">Riflessione spirituale e intellettuale.</td>
                <td className="px-4 py-3 border border-slate-700">Annotazioni personali, citazioni.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-100 p-8 rounded-3xl shadow-2xl border border-slate-300">
        <h3 className="text-2xl font-semibold text-blue-900 mb-4">Approfondisci ogni supporto</h3>
        <p className="text-slate-200 leading-relaxed mb-6">
          Le schede seguenti si aprono con un tocco e permettono di esplorare ruolo, contenuti e casi studio per ciascuna tipologia di documento.
        </p>
        <div className="space-y-4">
          {fontiDocumentarie.map(fonte => (
            <div key={fonte.id} className="rounded-2xl border border-slate-300 overflow-hidden shadow-lg">
              <button
                onClick={() => toggleSourceAccordion(fonte.id)}
                className={`w-full flex justify-between items-center px-5 py-4 text-left transition-all ${
                  openSourceAccordion === fonte.id
                    ? 'bg-slate-700 text-white font-semibold'
                    : 'bg-slate-600 text-white hover:bg-slate-9000'
                }`}
              >
                <span className="text-lg font-semibold">{fonte.title}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${openSourceAccordion === fonte.id ? 'rotate-180' : ''}`} />
              </button>
              {openSourceAccordion === fonte.id && (
                <div className="px-5 pb-5 pt-4 text-sm leading-relaxed bg-slate-800 text-slate-200 border-t border-slate-700">
                  {fonte.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

const AnalysisSection = () => {
  const [openMovement, setOpenMovement] = useState(1);
  
  const toggleMovement = (id) => setOpenMovement(openMovement === id ? null : id);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-800/50 border-l-4 border-blue-600 p-5 rounded-lg">
        <p className="text-slate-200"><strong>Nota tecnica:</strong> L'analisi usa la teoria <em>Hepokoski-Darcy</em> (es. R1-P = Ritornello 1, Tema Primario).</p>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow border border-slate-700">
        <h3 className="text-xl font-semibold text-slate-100 mb-5 flex items-center">
          <Music className="w-5 h-5 text-blue-400 mr-2" />
          Organico Orchestrale
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-200 mb-2">Legni</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              <li>• 2 Flauti</li>
              <li>• 2 Oboi</li>
              <li>• 2 Clarinetti in Si♭</li>
              <li>• 2 Fagotti</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-200 mb-2">Ottoni e Percussioni</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              <li>• 2 Corni in Mi♭, Mi e Do</li>
              <li>• 2 Trombe in Do</li>
              <li>• Timpani</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-200 mb-2">Archi</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              <li>• Violini I e II</li>
              <li>• Viole</li>
              <li>• Violoncelli</li>
              <li>• Contrabbassi</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-slate-200 mb-2">Solista</h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              <li>• Pianoforte</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Accordion per i tre movimenti */}
      <div className="space-y-4">
        {movementsData.map((mov) => (
          <div key={mov.id} className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
            <button
              onClick={() => toggleMovement(mov.id)}
              className={`w-full p-5 flex justify-between items-center transition-all ${
                openMovement === mov.id
                  ? 'sticky top-20 z-10 bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">{mov.title}</h3>
                  <span className="text-sm opacity-90">{mov.key}</span>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 transition-transform ${openMovement === mov.id ? 'rotate-180' : ''}`} />
            </button>
            {openMovement === mov.id && (
              <div className="p-6 pt-8 bg-slate-900">
                <p className="text-base text-slate-200 mb-4 pb-4 border-b border-slate-700">{mov.desc}</p>
                <ul className="space-y-2.5">
                  {mov.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-300">
                      <ChevronRight className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const InterpretersSection = () => (
  <div className="max-w-4xl mx-auto animate-fadeIn">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-2">Interpreti Storici</h2>
      <p className="text-slate-300">Le grandi registrazioni che hanno segnato la storia dell'interpretazione</p>
    </div>

    <div className="grid gap-6">
      {interpretersData.map((interpreter, idx) => (
        <div key={idx} className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
          <div className="bg-slate-700 p-5">
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{interpreter.name}</h3>
                <p className="text-white/90 text-sm flex items-center">
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  {interpreter.conductor}
                </p>
                <p className="text-white/80 text-xs mt-0.5">{interpreter.orchestra}</p>
              </div>
              <div className="bg-slate-800 text-blue-400 px-3 py-1 rounded-full font-semibold text-sm">
                {interpreter.year}
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-900">
            <div className="mb-3">
              <span className="inline-block bg-slate-800/50 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                Stile: {interpreter.style}
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {interpreter.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GlossarySection = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Glossario Musicale</h2>
        <p className="text-slate-300">Scopri i termini tecnici del Concerto Op. 37</p>
      </div>

      <div className="space-y-4">
        {glossaryData.map((category, catIdx) => (
          <div key={catIdx} className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
            <button
              onClick={() => toggleCategory(catIdx)}
              className={`w-full p-5 flex justify-between items-center transition-all ${
                openCategory === catIdx
                  ? 'sticky top-20 z-10 bg-slate-700 text-white'
                  : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Library className="w-5 h-5" />
                <h3 className="text-lg font-semibold">{category.category}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  openCategory === catIdx 
                    ? 'bg-slate-950 text-blue-400' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {category.items.length}
                </span>
              </div>
              <ChevronDown
                className={`w-6 h-6 transition-transform ${
                  openCategory === catIdx ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategory === catIdx && (
              <div className="p-6 pt-8 bg-slate-900">
                <div className="space-y-3">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-4 rounded-lg bg-slate-800 border-l-2 border-blue-600 shadow-sm"
                    >
                      <h4 className="text-base font-semibold text-slate-100 mb-2 flex items-center">
                        <ChevronRight className="w-4 h-4 text-blue-400 mr-2" />
                        {item.term}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed pl-6">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashcardsSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCard((prev) => (prev + 1) % flashcardsData.length), 300);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentCard((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length), 300);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fadeIn">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-slate-100 mb-3">Memorizzazione Attiva</h2>
        <p className="text-slate-300 text-lg">Clicca sulla carta per rivelare la risposta</p>
      </div>

      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative h-96 w-full cursor-pointer group"
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full duration-500"
          style={{
            transition: 'transform 0.6s',
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-10 flex flex-col justify-center items-center shadow-2xl border-2 border-slate-600/50"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="bg-amber-500/20 p-4 rounded-full mb-6">
              <HelpCircle className="w-16 h-16 text-amber-400" />
            </div>
            <p className="text-2xl font-semibold text-center text-white leading-relaxed">
              {flashcardsData[currentCard].q}
            </p>
            <span className="absolute bottom-6 text-amber-400 text-sm font-mono bg-slate-800/50 px-4 py-2 rounded-full">
              Carta {currentCard + 1} / {flashcardsData.length}
            </span>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-3xl p-10 flex flex-col justify-center items-center shadow-2xl border-4 border-slate-6000"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <p className="text-xl text-center text-slate-100 leading-relaxed font-medium">
              {flashcardsData[currentCard].a}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center space-x-6 mt-10">
        <button onClick={prevCard} className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-110 shadow-lg">
          <ChevronLeft className="w-7 h-7" />
        </button>
        <button onClick={() => setIsFlipped(!isFlipped)} className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg transition-all hover:scale-105 shadow-xl">
          Gira Carta
        </button>
        <button onClick={nextCard} className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-all hover:scale-110 shadow-lg">
          <ChevronRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

const QuizSection = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Randomizza le domande all'inizio
  useState(() => {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (optionIndex === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const restartQuiz = () => {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  // Aspetta che le domande siano caricate
  if (shuffledQuestions.length === 0) {
    return <div className="text-center p-8">Caricamento...</div>;
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow p-8 text-center animate-fadeIn border border-slate-700">
        <div className="bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-12 h-12 text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Quiz Completato!</h2>
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <p className="text-lg text-slate-300 mb-2">Il tuo punteggio:</p>
          <p className="text-5xl font-bold text-blue-400">{score}<span className="text-2xl text-slate-500"> / {shuffledQuestions.length}</span></p>
        </div>

        <div className="mb-8 p-5 rounded-lg bg-slate-900">
          {score === shuffledQuestions.length ? (
            <p className="text-green-600 font-semibold text-lg">🎉 Eccezionale! Sei pronto per l'esame.</p>
          ) : score >= shuffledQuestions.length / 2 ? (
            <p className="text-blue-400 font-semibold text-lg">👍 Buon lavoro! Ripassa l'analisi per perfezionarti.</p>
          ) : (
            <p className="text-orange-600 font-semibold text-lg">📚 Consiglio: Rileggi la sezione "Analisi" e riprova.</p>
          )}
        </div>

        <button
          onClick={restartQuiz}
          className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg mx-auto hover:bg-slate-600 transition-all shadow font-semibold"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Ricomincia Quiz</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
        <div className="bg-slate-700 p-5">
          <div className="flex justify-between items-center text-white mb-3">
            <span className="font-semibold text-sm">Domanda {currentQuestion + 1} / {shuffledQuestions.length}</span>
            <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">Punteggio: <span className="font-bold">{score}</span></span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-slate-100 mb-6 leading-relaxed">
            {shuffledQuestions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {shuffledQuestions[currentQuestion].options.map((option, index) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              if (selectedOption === null) {
                btnClass += "border-slate-700 hover:border-blue-500 hover:bg-slate-700/50";
              } else if (index === shuffledQuestions[currentQuestion].correct) {
                btnClass += "border-green-500 bg-green-900/50 text-green-300";
              } else if (index === selectedOption) {
                btnClass += "border-red-500 bg-red-900/50 text-red-300";
              } else {
                btnClass += "border-slate-700 text-slate-500 opacity-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => !selectedOption && handleAnswer(index)}
                  disabled={selectedOption !== null}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-slate-600 text-slate-100 flex items-center justify-center mr-3 text-sm font-semibold shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="font-medium text-base text-slate-100">{option}</span>
                    {selectedOption !== null && index === shuffledQuestions[currentQuestion].correct && (
                      <CheckCircle className="ml-auto w-6 h-6 text-green-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---

const App = () => {
  const [activeTab, setActiveTab] = useState('introduzione');
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 font-sans text-slate-100">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={isMobile}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="max-w-5xl mx-auto px-4 py-12 pb-16">
          {activeTab === 'introduzione' && <IntroduzioneSection setActiveTab={setActiveTab} />}
          {activeTab === 'analysis' && <AnalysisSection />}
          {activeTab === 'interpreters' && <InterpretersSection />}
          {activeTab === 'glossary' && <GlossarySection />}
          {activeTab === 'flashcards' && <FlashcardsSection />}
          {activeTab === 'quiz' && <QuizSection />}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;