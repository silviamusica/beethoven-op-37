import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Brain, GraduationCap, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, HelpCircle, Menu, X, PlayCircle, ChevronDown, Library, User, FileText, ZoomIn, ZoomOut } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurazione worker per PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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
    category: "Terminologia Tecnica",
    items: [
      { term: "TUTTI", definition: "Termine generico per indicare l'orchestra completa che suona insieme (vs SOLO). Nella teoria del concerto classico, meglio usare ESPOSIZIONE per le sezioni orchestrali formali." },
      { term: "SOLO", definition: "Sezione in cui il pianoforte è protagonista, accompagnato dall'orchestra. L'unica sezione di vero solo è la Cadenza." },
      { term: "Modulazione", definition: "Passaggio da una tonalità all'altra. Nel concerto, è essenziale per il virtuosismo: le figure difficili devono essere eseguibili in diverse tonalità (es. Do minore → Mib maggiore → Do maggiore)." },
      { term: "Tema primario", definition: "Il tema principale di un movimento. Nell'Op. 37, il tema primario è la scansione ascendente della triade di Do minore con ritmo puntato e carattere marziale." },
      { term: "Secondo tema", definition: "Tema contrastante, solitamente in tonalità relativa. Nell'Op. 37: profilo melodico ornato in Mib maggiore, dolce e carezzevole, esposto da clarinetto e violini." },
      { term: "Episodi di bravura", definition: "Passaggi virtuosistici con cascate di note, arpeggi, scale e trilli." },
      { term: "Ponte modulante", definition: "Passaggio che collega il primo tema al secondo tema, con funzione di modulazione. Può utilizzare materiale tematico esistente (come nell'Op. 37, dove il tema principale agisce come 'jolly')." },
      { term: "Triade", definition: "Accordo di tre note sovrapposte per terze. Il tema primario del primo movimento è basato sulla scansione (arpeggio) della triade di Do minore (Do-Mib-Sol)." },
      { term: "Arpeggio", definition: "Esecuzione delle note di un accordo una dopo l'altra invece che simultaneamente. Gli arpeggi sono fondamentali nel secondo movimento e negli episodi di bravura." },
      { term: "Trillo", definition: "Rapida alternanza tra due note adiacenti." },
      { term: "Punto coronato", definition: "Simbolo che indica di prolungare una nota a piacere. Nella preparazione della cadenza (fine SOLO 3, prima di batt. 417), segnala la sospensione armonica prima dell'improvvisazione solistica." }
    ]
  },
  {
    category: "Tonalità e Armonia",
    items: [
      { term: "Do Minore", definition: "La tonalità 'eroica' di Beethoven: tempesta, resistenza, eroismo. Collega l'Op. 37 alla Patetica, alla Quinta Sinfonia e all'Eroica. Per Beethoven rappresenta il dramma e la lotta." },
      { term: "Mi Maggiore", definition: "Tonalità del secondo movimento (Largo). Estremamente lontana dal Do minore - un salto cromatico audace che crea uno 'shock tonale'. Rappresenta un'oasi lirica e contemplativa." },
      { term: "Mib Maggiore", definition: "Tonalità relativa maggiore di Do minore. Usata per il secondo tema del primo movimento." },
      { term: "Do Maggiore", definition: "Tonalità parallela maggiore di Do minore. Il terzo movimento conclude in Do maggiore (non nella relativa Mi♭), compiendo il percorso beethoveniano 'dal buio alla luce' - dalla tragedia al trionfo." },
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
    isTable: true,
    hasModal: true,
    tableData: [
      { sezione: "ESPOSIZIONE (batt. 1-227)", sottosezione: "TUTTI 1 (batt. 1-111)", battute: "1-111", descrizione: "I Tema: esposto dagli archi in Do minore con carattere \"marziale\" e \"cadenzato\" (batt. 1-8).\n• I Tema (Periodo b): esposto dai fiati (batt. 9-16).\n• II Tema: carattere \"cantabile\" e \"ornato\" (batt. 50-74).\n• Coda (batt. 86-111)", rowSpan: 2 },
      { sezione: "", sottosezione: "SOLO 1 (batt. 112-227)", battute: "112-227", descrizione: "Ingresso del pianoforte: entra dopo 111 battute con tre potenti scale ascendenti (\"gesto di sfida\").\n• I Tema: riesposto dal pianoforte.\n• II Tema: (batt. 164-171).\n• Episodio di bravura: cascate di note veloci e un trillo finale complesso che sale di grado tre volte (batt. 219-225)." },
      { sezione: "SVILUPPO (batt. 227-309)", sottosezione: "TUTTI 2 (batt. 227-249)", battute: "227-249", descrizione: "Ingresso potente dell'orchestra in forte che segna l'avvio dello sviluppo.\n• Ripresa di un elemento melodico-ritmico della chiusura del Tutti 1, ora con funzione introduttiva.", rowSpan: 2 },
      { sezione: "", sottosezione: "SOLO 2 (batt. 250-309)", battute: "250-309", descrizione: "Il pianoforte apre nuovamente con tre scale ascendenti (in Re maggiore, dominante di Sol minore).\n• Elaborazione di elementi tematici in un dialogo serrato con l'orchestra.\n• Presenta anche il \"secondo tema nella parte dello sviluppo\" (batt. 284-287)." },
      { sezione: "RIPRESA (batt. 309-fine)", sottosezione: "TUTTI 3 (batt. 309-316)", battute: "309-316", descrizione: "L'orchestra riprende il I Tema in fortissimo, segnando l'avvio formale della Ripresa.", rowSpan: 2 },
      { sezione: "", sottosezione: "SOLO 3 (batt. 317-403)", battute: "317-403", descrizione: "Il pianoforte ricompone il percorso discorsivo: scomposizione del I Tema (batt. 317-339).\n• II Tema: riesposto (batt. 340-355).\n• Nuovo episodio di bravura (batt. 364-403)." },
      { sezione: "CODA", sottosezione: "TUTTI 4 (batt. 403-416)", battute: "403-416", descrizione: "Breve transizione orchestrale che riparte dalla testa del tema e si interrompe su un accordo sospeso (\"corona\"), invitando il solista alla cadenza.", rowSpan: 3 },
      { sezione: "", sottosezione: "CADENZA (batt. 416)", battute: "416", descrizione: "Momento di massima \"esibizione\" del solista, dove il pianoforte è completamente solo.\nIl resto della cadenza (batt. 417-443) disegna un arco ascendente di tensione." },
      { sezione: "", sottosezione: "TUTTI 5 (batt. 417-443)", battute: "417-443", descrizione: "Innovazione timbrica: il pianoforte continua a suonare accompagnato dai timpani, che scandiscono il ritmo marziale.\n• Crescendo finale e chiusura con scale ascendenti del pianoforte e accordi dell'orchestra." }
    ]
  },
  {
    id: 2,
    title: "II Movimento: Largo",
    key: "Mi maggiore",
    desc: "Movimento lirico e contemplativo. La tonalità di Mi maggiore crea un contrasto drammatico con il Do minore del primo movimento.",
    details: [
      "Carattere: intimo, meditativo, quasi una preghiera. Il pianoforte dialoga con i legni in un'atmosfera sospesa",
      "Innovazione tecnica: uso pionieristico del pedale di risonanza del pianoforte Érard nel secondo movimento",
      "Struttura: forma tripartita (A-B-A) con sezione centrale più agitata",
      "Orchestrazione: dialogo cameristico tra pianoforte e fagotti, oboi e archi",
      "Tonalità: Mi maggiore - scelta audace, una terza cromatica distante da Do minore"
    ]
  },
  {
    id: 3,
    title: "III Movimento: Rondò. Allegro",
    key: "Do minore → Do maggiore",
    desc: "Rondò brillante che conclude il concerto con energia e virtuosismo. Finale trionfale in Do maggiore.",
    details: [
      "Forma: rondò (A-B-A-C-A) con tema principale che alterna tra orchestra e solista",
      "Fugato: inserimento innovativo di un elaborato fugato sul tema principale - scelta audace per un concerto",
      "Virtuosismo: passaggi pianistici brillanti con arpeggi, scale e ottave",
      "Modulazione finale: da Do minore a Do maggiore (tonalità parallela) - il percorso beethoveniano dal buio alla luce",
      "Carattere: energico, quasi sfrenato, con elementi di danza e umorismo beethoveniano"
    ]
  }
];

const interpretersData = [
  // 🎹 VERSIONI STORICHE LEGGENDARIE (1933-1973)
  {
    name: "🎹 Artur Schnabel (Versione Storica Leggendaria)",
    bio: "Pianista austriaco (1882-1951), considerato uno dei più grandi interpreti beethoveniani",
    conductor: "Malcolm Sargent",
    orchestra: "London Philharmonic",
    year: "1933",
    description: "Schnabel è 'colui che ha inventato Beethoven moderno'. Non curarti dell'audio frusciante: il fraseggio e la comprensione della struttura sono insuperati. I suoi tempi nel primo movimento hanno fatto scuola.",
    style: "Storico, Profondo",
    rating: "⭐⭐⭐⭐ (Audio datato, interpretazione stellare)",
    link: "https://youtu.be/t8z_HiusIL0?si=OO0KRH7dtutylzhs"
  },
  {
    name: "Claudio Arrau",
    bio: "Pianista cileno (1903-1991), maestro del repertorio romantico e beethoveniano",
    conductor: "Otto Klemperer",
    orchestra: "Philharmonia Orchestra",
    year: "1957",
    description: "Due giganti beethoveniani si incontrano a Londra per ricreare l'arte pura. Tutto è perfettamente bilanciato: il virtuosismo è onnipresente ma sempre al servizio del significato, i pianissimi sono pura poesia. Arrau descriveva il rapporto con Klemperer come 'controverso', ma la loro collaborazione live del 1957 alla Royal Festival Hall compì il miracolo. Un incontro straordinario tra due leggendari eredi di scuole e tradizioni, con superba maestria.",
    style: "Monumentale, profondo, titanico",
    link: "https://youtu.be/iLzjlH9_a6M?si=Wk5cyeFfsx3880nA"
  },
  
  // ⚠️ IL CASO GOULD (1959)
  {
    name: "⚠️ Glenn Gould (Il Caso Gould - L'Alternativa)",
    bio: "Pianista canadese (1932-1982), celebre per le sue interpretazioni non convenzionali",
    conductor: "Leonard Bernstein",
    orchestra: "Columbia Symphony Orchestra",
    year: "1959",
    description: "Un Beethoven volutamente anti-romantico, asciutto, con tempi e articolazioni che sfidano la tradizione. Gould 'radiografa' la partitura. Controversa, geniale, unica.",
    style: "Eccentrico",
    rating: "⭐⭐⭐⭐ (Per chi cerca qualcosa di diverso)",
    link: "https://www.youtube.com/watch?v=vRSCAHDS12g"
  },

  {
    name: "🎹 Wilhelm Kempff (Versione Storica Leggendaria)",
    bio: "Pianista tedesco (1895-1991), uno dei massimi interpreti di Beethoven e Schubert",
    conductor: "Ferdinand Leitner",
    orchestra: "Berliner Philharmoniker",
    year: "1961",
    description: "L'opposto della Argerich. Non è una battaglia, ma pura poesia. Il tocco di Kempff è morbido, 'parlante'. Il secondo movimento (Largo) è di una bellezza spirituale assoluta. Ideale per il primo ascolto.",
    style: "Poetico, Classico",
    rating: "⭐⭐⭐⭐⭐ (Classico)",
    link: "https://www.youtube.com/watch?v=3aNkl7wdWyQ"
  },
  {
    name: "Artur Rubinstein",
    bio: "Pianista polacco-americano (1887-1982), leggenda del pianoforte del XX secolo",
    conductor: "Bernard Haitink",
    orchestra: "Concertgebouw Orchestra",
    year: "1973",
    description: "Eleganza e nobiltà romantiche. Rubinstein porta al Beethoven la sua straordinaria cantabilità e il suo tocco vellutato. L'approccio è meno 'eroico' e più lirico, con grande attenzione alle sfumature dinamiche e al colore sonoro. Haitink accompagna con sensibilità raffinata.",
    style: "Elegante, nobile, lirico",
    link: "https://youtu.be/44a2kZ72RzY?si=7dcdXf7FipvyYkQ1"
  },
  
  // INTERPRETAZIONI MODERNE (1979-2012)
  {
    name: "Arturo Benedetti Michelangeli",
    bio: "Pianista italiano (1920-1995), rinomato per la perfezione tecnica e il suono cristallino",
    conductor: "Carlo Maria Giulini",
    orchestra: "Wiener Symphoniker",
    year: "1979 (circa)",
    description: "Perfezione tecnica assoluta e controllo sovrumano. Michelangeli è un chirurgo del pianoforte: ogni nota è perfettamente calibrata, il suono è cristallino e luminoso. Giulini bilancia questa precisione con calore orchestrale. L'approccio è classico, elegante, quasi apollineo - un Beethoven 'purificato' da ogni eccesso romantico.",
    style: "Cristallino, perfezionista, apollineo",
    link: "https://youtu.be/rnXpoCoCBk0?si=bpaPZrPIzFczt5F_"
  },

  // 🎼 STRUMENTI D'EPOCA (Filologico - 1988-2000)
  {
    name: "🎼 Steven Lubin (Strumenti d'Epoca - Filologico)",
    bio: "Pianista e fortepianista americano, specialista della prassi esecutiva storica",
    conductor: "Christopher Hogwood",
    orchestra: "Academy of Ancient Music",
    year: "1988",
    description: "Fortepiano (copia Johann Fritz 1818 ca.). Fondamentale per capire il suono che Beethoven aveva nelle orecchie. L'orchestra è più leggera, il pianoforte più percussivo e secco, i bassi 'gracchiano' deliziosamente. Cambia la percezione del pezzo.",
    style: "Filologico",
    rating: "⭐⭐⭐⭐½",
    link: "https://www.youtube.com/watch?v=SiokgMpfyQw"
  },
  {
    name: "Krystian Zimerman",
    bio: "Pianista polacco, vincitore del Concorso Chopin 1975, noto per l'eccellenza tecnica",
    conductor: "Leonard Bernstein",
    orchestra: "Wiener Philharmoniker",
    year: "1989",
    description: "Registrazione live leggendaria dal Musikverein di Vienna. Zimerman unisce precisione tecnica cristallina a grande intensità emotiva. Bernstein dirige con energia travolgente e profondità interpretativa. Un incontro straordinario tra due giganti che crea una performance elettrizzante e profondamente musicale.",
    style: "Elettrizzante, preciso, emotivo",
    link: "https://youtu.be/TAhZkggFL2w?si=BR_EQis6QbeYVMhB"
  },
  {
    name: "🎼 Maria João Pires (Strumenti d'Epoca)",
    bio: "Pianista portoghese, celebre per la sua sensibilità interpretativa e il tocco raffinato",
    conductor: "Frans Brüggen",
    orchestra: "Orchestra of the Eighteenth Century",
    year: "2000 (circa)",
    description: "Esecuzione su strumento d'epoca che unisce la sensibilità poetica di Pires all'approccio filologico di Brüggen. Un equilibrio straordinario tra autenticità storica e profondità espressiva, dove il fortepiano rivela sfumature timbriche e dinamiche impossibili sul pianoforte moderno.",
    style: "Filologico, Poetico",
    rating: "⭐⭐⭐⭐⭐",
    link: "https://www.youtube.com/watch?v=hR95EK9fEKo"
  },

  // 🔥 LA REFERENZA MODERNA (2004-2005)
  {
    name: "🔥 Martha Argerich (La referenza moderna)",
    conductor: "Claudio Abbado",
    orchestra: "Mahler Chamber Orchestra",
    year: "2004 (Live a Ferrara)",
    description: "È l'equilibrio perfetto tra fuoco argentino e cantabilità italiana. Tempi serrati, dinamiche esplosive ma mai fuori controllo. La chimica tra Argerich e Abbado è leggendaria.",
    style: "Fuoco, Energia",
    rating: "⭐⭐⭐⭐⭐",
    link: "https://www.youtube.com/watch?v=AC4u-sBN3OI"
  },
  {
    name: "Alfred Brendel",
    bio: "Pianista austriaco (1931-), uno dei massimi interpreti beethoveniani del XX secolo",
    conductor: "Claudio Abbado",
    orchestra: "Lucerne Festival Orchestra",
    year: "2005",
    description: "Registrazione dal Lucerne Festival che cattura la maturità interpretativa di Brendel al culmine della sua carriera. La sua lettura è profondamente intellettuale ma mai fredda, con un equilibrio perfetto tra rigore formale e slancio espressivo. Abbado accompagna con la consueta sensibilità, creando un dialogo di altissimo livello musicale.",
    style: "Intellettuale, equilibrato, maturo",
    rating: "⭐⭐⭐⭐⭐",
    link: "https://www.youtube.com/watch?v=8LuqVBUZN_4"
  },

  {
    name: "Daniel Barenboim",
    bio: "Pianista e direttore argentino-israeliano, intellettuale musicale di fama mondiale",
    conductor: "Antonio Pappano / Zubin Mehta",
    orchestra: "Orchestra di Santa Cecilia (2007) / Israel Philharmonic (2012)",
    year: "2007, 2012",
    description: "Approccio completo e intellettualmente ricco. Barenboim ha inciso il concerto più volte, mostrando diverse sfaccettature. Combina virtuosismo brillante con profondità interpretativa. La sua lettura è flessibile, drammatica ma equilibrata, con grande attenzione alla struttura formale e al dialogo orchestra-solista.",
    style: "Completo, intellettuale, drammatico",
    link: "https://youtu.be/UXGy1bpEAUw?si=dYYxQ1hh4UYHBUFI"
  },
  {
    name: "Fazil Say",
    bio: "Pianista e compositore turco, noto per la sua creatività e il virtuosismo brillante",
    conductor: "Gianandrea Noseda",
    orchestra: "BBC Philharmonic",
    year: "2011",
    description: "Interpretazione moderna e vibrante. Say porta al Beethoven una freschezza sorprendente, unendo virtuosismo tecnico a profonda sensibilità musicale. La sua famosa cadenza per il primo movimento (composta nel 2001, a min. 12:51 del video) è un esempio straordinario di come si possa creare una pagina contemporanea restando fedele al linguaggio beethoveniano. Noseda accompagna con energia e precisione.",
    style: "Moderno, virtuoso, innovativo",
    link: "https://youtu.be/a0ixaGeQzME?si=FIa82djieyaktNdb",
    cadenzaLink: "https://youtu.be/a0ixaGeQzME?si=zVe756GAmgEMlKQy&t=767"
  },

  // 🎵 GIOVANI TALENTI CONTEMPORANEI (2019)
  {
    name: "🎵 Jan Lisiecki (Giovane Talento Contemporaneo)",
    bio: "Giovane pianista canadese di origine polacca, acclamato per la sua musicalità matura",
    conductor: "(Dirige dalla tastiera)",
    orchestra: "Academy of St Martin in the Fields",
    year: "2019",
    description: "Lisiecki dirige direttamente dalla tastiera. Suono cristallino, tecnica moderna impeccabile, approccio fresco e senza pesantezze retoriche.",
    style: "Fresco, Moderno",
    rating: "⭐⭐⭐⭐",
    link: "https://www.youtube.com/watch?v=MX5XENd0SeM"
  }
];

const quizData = [
  // 🔵 BASE - Domande di base su fatti e informazioni generali
  {
    question: "In quale anno avvenne la prima esecuzione assoluta?",
    options: ["1800", "1802", "1803", "1805"],
    correct: 2,
    difficulty: "base"
  },
  {
    question: "In quali anni Beethoven arrivò a Vienna (prima visita e stabilizzazione definitiva)?",
    options: [
      "1789 (prima volta) e 1792 (stabile)",
      "1792 (solo)",
      "1796 (solo)",
      "1800 (solo)"
    ],
    correct: 0,
    difficulty: "base"
  },
  {
    question: "Quale concerto di Mozart è il modello principale dell'Op. 37?",
    options: ["K. 466 in Re minore", "K. 467 in Do maggiore", "K. 491 in Do minore", "K. 537 'Coronation'"],
    correct: 2,
    difficulty: "base"
  },
  {
    question: "In quale tonalità finisce il terzo movimento?",
    options: ["Do minore", "Do maggiore", "Mi maggiore", "Mib maggiore"],
    correct: 1,
    difficulty: "base"
  },
  {
    question: "A chi fu dedicato il concerto?",
    options: ["Napoleone Bonaparte", "Principe Luigi Ferdinando di Prussia", "Arciduca Rodolfo", "Conte Waldstein"],
    correct: 1,
    difficulty: "base"
  },
  {
    question: "In quale teatro avvenne la prima esecuzione?",
    options: ["Theater an der Wien", "Burgtheater", "Kärntnertortheater", "Hofoper"],
    correct: 0,
    difficulty: "base"
  },
  {
    question: "In quale tonalità è il secondo movimento?",
    options: ["Do maggiore", "Mib maggiore", "Mi maggiore", "Lab maggiore"],
    correct: 2,
    difficulty: "base"
  },
  {
    question: "Quante cadenze sono scritte da Beethoven per il primo movimento?",
    options: ["Una sola", "Due", "Tre", "Nessuna"],
    correct: 2,
    difficulty: "base"
  },
  {
    question: "Quale editore pubblicò per primo il concerto?",
    options: ["Breitkopf & Härtel", "Bureau des Arts et d'Industrie", "Simrock", "Artaria"],
    correct: 1,
    difficulty: "base"
  },
  {
    question: "In che anno fu pubblicato il concerto?",
    options: ["1800", "1802", "1804", "1806"],
    correct: 2,
    difficulty: "base"
  },

  // 🟡 INTERMEDIO - Domande che richiedono comprensione concettuale
  {
    question: "Chi era il direttore durante la prima, che vide 'geroglifici egizi' invece della partitura?",
    options: ["Ferdinand Ries", "Ignaz von Seyfried", "Carl Czerny", "Joseph Haydn"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Come entra il pianoforte nel primo movimento?",
    options: ["Con il tema principale piano", "Con tre arpeggi delicati", "Con tre scale ascendenti fortissimo in doppie ottave", "Con un assolo lirico"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Qual è l'innovazione tecnica che Beethoven sfruttò nel secondo movimento?",
    options: ["Uso pionieristico del pedale di risonanza", "Invenzione del forte-piano", "Uso del pizzicato", "Introduzione del clarinetto basso"],
    correct: 0,
    difficulty: "intermedio"
  },
  {
    question: "Cosa scrisse Beethoven nel Testamento di Heiligenstadt?",
    options: ["La dedica del concerto", "La disperazione per la sordità", "Le istruzioni per l'esecuzione", "La cadenza del primo movimento"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale elemento inusuale compare nel terzo movimento?",
    options: ["Un valzer", "Un fugato elaborato", "Un corale", "Una marcia funebre"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale altro lavoro fu eseguito nella stessa serata della prima dell'Op. 37?",
    options: ["La Quinta Sinfonia", "La Seconda Sinfonia", "Il Fidelio", "La Nona Sinfonia"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Come cambia il ruolo del solista rispetto ai concerti mozartiani?",
    options: ["Diventa più virtuoso", "Si oppone all'orchestra invece di dialogare", "Suona più piano", "Ha meno importanza"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale strumento espone il secondo tema nel primo movimento?",
    options: ["Violini", "Clarinetto e violini", "Flauto", "Corno"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Chi ha registrato l'Op. 37 con Otto Klemperer nel 1957?",
    options: ["Michelangeli", "Kempff", "Arrau", "Barenboim"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Quale interprete è famoso per l'approccio 'cristallino e apollineo'?",
    options: ["Arrau", "Michelangeli", "Kempff", "Rubinstein"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Chi suonò con l'Orchestra della RAI di Torino nel 1962?",
    options: ["Arrau", "Michelangeli", "Kempff", "Barenboim"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Quale interprete usa un approccio 'intimista e cantabile'?",
    options: ["Arrau", "Michelangeli", "Kempff", "Barenboim"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Quanti flauti sono nell'organico orchestrale dell'Op. 37?",
    options: ["1", "2", "3", "4"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "In quale tonalità sono i clarinetti dell'Op. 37?",
    options: ["Do", "Sib", "La", "Mib"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale pianoforte possedette Beethoven dal 1803?",
    options: ["Walter", "Stein", "Érard", "Broadwood"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Cosa caratterizza il carattere del primo tema (P)?",
    options: ["Dolce e cantabile", "Marziale con ritmo puntato", "Virtuosistico", "Lirico"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Come finisce la cadenza del primo movimento?",
    options: ["Con forte orchestrale", "Con passaggio dolce e liquido", "Con un trillo fortissimo", "Con silenzio totale"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quando Napoleone entrò a Vienna?",
    options: ["1803", "1805", "1809", "1812"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Chi invitò Beethoven a Vienna nel 1792?",
    options: ["Haydn", "Mozart", "Conte Waldstein", "Principe Lichnowsky"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Qual è la forma del primo movimento?",
    options: ["Rondò", "Tema con variazioni", "Forma sonata con doppia esposizione", "Fuga"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Qual è il carattere principale del Do minore beethoveniano?",
    options: ["Pastorale e sereno", "Eroico e tempestoso", "Elegante e galante", "Sacro e mistico"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale opera precedente di Beethoven in Do minore è chiamata 'Patetica'?",
    options: ["Op. 1 n. 3", "Op. 10 n. 1", "Op. 13", "Op. 18 n. 4"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Che cosa caratterizza l'ingresso del solista nel primo movimento?",
    options: ["Un tema nuovo e dolce", "Tre scale ascendenti fortissimo", "Un arpeggio delicato", "Una citazione di Mozart"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quante battute dura circa l'esposizione orchestrale (ESPOSIZIONE 1)?",
    options: ["50 battute", "111 battute", "227 battute", "343 battute"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "La distanza tonale tra primo e secondo movimento (Do minore - Mi maggiore) è chiamata:",
    options: ["Terza maggiore", "Quinta giusta", "Terza cromatica", "Sesta maggiore"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Quale innovazione compare nella coda finale del primo movimento?",
    options: ["Una seconda cadenza", "Il piano continua durante il TUTTI", "Un assolo di timpani", "Una modulazione a Do maggiore"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Nel secondo movimento, quali strumenti dialogano principalmente con il pianoforte?",
    options: ["Violini e viole", "Flauti e oboi", "Fagotti e legni", "Trombe e corni"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "Il terzo movimento è in forma:",
    options: ["Sonata", "Rondò", "Tema con variazioni", "Minuetto"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Cosa disse Beethoven del concerto K. 491 di Mozart?",
    options: ["'È troppo semplice'", "'Non saremo mai in grado di fare qualcosa di simile'", "'Lo posso migliorare'", "'È il mio modello perfetto'"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "In quale documento Beethoven scrisse della sua disperazione per la sordità?",
    options: ["Lettera a Bettina Brentano", "Testamento di Heiligenstadt", "Diario personale", "Lettera all'Immortale Amata"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale altra grande opera Beethoven completò nello stesso anno del concerto (1802)?",
    options: ["Eroica", "Seconda Sinfonia", "Quinta Sinfonia", "Fidelio"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale periodo stilistico di Beethoven inizia con opere come l'Op. 37?",
    options: ["Periodo giovanile", "Periodo eroico", "Periodo tardo", "Periodo classico"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale caratteristica distingue il pianoforte Érard che Beethoven ricevette nel 1803?",
    options: ["Aveva 88 tasti", "Aveva quattro pedali", "Aveva il pedale di risonanza innovativo", "Era un clavicembalo modificato"],
    correct: 2,
    difficulty: "intermedio"
  },
  {
    question: "In che anno iniziò a manifestarsi la sordità di Beethoven?",
    options: ["1792", "1796-98", "1802", "1809"],
    correct: 1,
    difficulty: "intermedio"
  },
  {
    question: "Quale operazione permise il salvataggio delle parti orchestrali?",
    options: ["Copiatura a mano", "Stampa immediata", "Fotografia", "Microfilm"],
    correct: 0,
    difficulty: "intermedio",
    explanation: "Le parti orchestrali furono salvate grazie alla copiatura manuale effettuata dal copista di Beethoven prima della pubblicazione ufficiale della partitura completa."
  },
  {
    question: "Quale errore famoso di trillo è presente nella cadenza pubblicata nel 1806?",
    options: ["Trillo troppo lungo", "Trillo nella mano sbagliata", "Trillo sulla nota sbagliata", "Assenza di trillo"],
    correct: 1,
    difficulty: "intermedio",
    explanation: "Nella cadenza pubblicata nel 1806 c'è un errore celebre: il trillo è scritto nella mano sinistra invece che nella destra, rendendo il passaggio praticamente ineseguibile come scritto."
  },
  {
    question: "Quanti pedali aveva il pianoforte Érard del 1803?",
    options: ["Due", "Tre", "Quattro", "Cinque"],
    correct: 2,
    difficulty: "intermedio",
    explanation: "Il pianoforte Érard del 1803 aveva quattro pedali: sustain, una corda, moderatore e cembalo (quest'ultimo produceva un effetto simile al clavicembalo)."
  },

  // 🔴 AVANZATO - Domande di analisi teorica approfondita
  {
    question: "Quale relazione tonale crea lo 'shock' tra primo e secondo movimento?",
    options: [
      "Passaggio da tonica a dominante",
      "Salto cromatico di terza (Do minore → Mi maggiore)",
      "Modulazione al relativo maggiore",
      "Passaggio da maggiore a minore"
    ],
    correct: 1,
    difficulty: "avanzato",
    explanation: "Il passaggio da Do minore (I movimento) a Mi maggiore (II movimento) rappresenta un salto cromatico di terza, una scelta tonale audace per l'epoca che Beethoven usa per creare un effetto di 'shock' e contrasto luminoso dopo l'oscurità del primo movimento."
  },
  {
    question: "Cosa rappresenta il Esposizione 4 (R4) finale?",
    options: [
      "Una ripetizione identica del Esposizione 1",
      "Una deformazione della norma classica con risoluzione ambigua V7/iv invece di I",
      "L'eliminazione completa dell'orchestra",
      "Un passaggio al modo maggiore"
    ],
    correct: 1,
    difficulty: "avanzato",
    explanation: "R4 finale rappresenta una deformazione della norma classica: invece del tutti fortissimo in tonica (I), Beethoven scrive un trillo pianissimo su V7/iv (dominante della sottodominante), creando un'ambiguità tragica e una vittoria incompleta, con il pianoforte che continua solo sotto questo accordo sospeso."
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
    { id: 'fonti', label: 'Fonti', icon: Library },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-slate-800 text-slate-100 shadow-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex flex-wrap justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-3 font-bold text-lg sm:text-xl">
            <Music className="h-6 w-6 text-blue-400" />
            <div>
              <div className="text-slate-100">Beethoven Op. 37</div>
            </div>
          </div>

          <div className="hidden md:flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
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
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const FontiSection = () => {
  const [openSource, setOpenSource] = useState(1);
  const [activeTab, setActiveTab] = useState('primarie');
  const toggleSource = (id) => setOpenSource(openSource === id ? null : id);

  const fonti = [
    {
      id: 1,
      title: "Quaderni di Schizzi (Skizzenbücher)",
      content: (
        <ul className="space-y-3 text-slate-200">
          <li><strong>Concezione ed evoluzione:</strong> Fino al <strong>1798</strong> circa, Beethoven usava fogli sciolti o piccoli fascicoli raccolti in portafogli. Dal 1798 passò a quaderni rilegati, custoditi fino alla morte come memoria del proprio sviluppo artistico.</li>
          <li><strong>Tipologie:</strong>
            <ul className="mt-2 space-y-2 pl-5 list-disc">
              <li><strong>Quaderni da scrivania:</strong> formato grande, scrittura a inchiostro, usati a casa per elaborazioni sistematiche.</li>
              <li><strong>Quaderni tascabili:</strong> formato piccolo, scrittura a matita. Portati durante le passeggiate per fissare idee improvvise. Beethoven diceva: "Non oso uscire senza il mio stendardo".</li>
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Immagine di copertina */}
      <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <img
          src="/images/beethoven-sources.jpg"
          alt="Miscellanea Fischhof - Minuetto per orchestra in re minore"
          className="w-full h-64 object-cover rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-3 italic text-center">
          Miscellanea Fischhof: Minuetto per orchestra in re minore.<br/>
          <span className="text-slate-500">Schizzo autografo - trascrizione pianistica di Graziano Denini e orchestrazione di Albert Willem Holsbergen</span>
        </p>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 sm:p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl border border-slate-600/50">
        <h2 className="text-4xl font-bold mb-6 text-slate-200">Fonti documentarie</h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-600">
          <button
            onClick={() => setActiveTab('primarie')}
            className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
              activeTab === 'primarie'
                ? 'bg-slate-700 text-white border-b-2 border-blue-400'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            📜 Fonti Primarie
          </button>
          <button
            onClick={() => setActiveTab('bibliografia')}
            className={`px-6 py-3 font-semibold transition-all rounded-t-lg ${
              activeTab === 'bibliografia'
                ? 'bg-slate-700 text-white border-b-2 border-blue-400'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
            }`}
          >
            📚 Bibliografia
          </button>
        </div>

        {/* Tab Content - Fonti Primarie */}
        {activeTab === 'primarie' && (
          <div className="animate-fadeIn">
            <p className="text-lg text-slate-300 leading-relaxed">
              Questa tabella riassume i supporti principali utilizzati da Beethoven per l&apos;Op. 37 e, più in generale, per il processo compositivo. I dettagli completi sono disponibili nelle schede di approfondimento immediatamente sotto.
            </p>
            <div className="overflow-x-auto mt-6 sm:mt-8">
          <table className="min-w-full text-xs sm:text-sm md:text-base border border-slate-300 rounded-xl md:rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white uppercase tracking-wide text-xs sm:text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Tipologia</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Periodo</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Funzione primaria</th>
                <th className="px-4 py-3 text-left font-semibold border border-blue-700/30">Organizzazione</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900 text-slate-100 text-xs sm:text-sm">
              <tr className="odd:bg-slate-800">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-slate-200">Quaderni di Schizzi</td>
                <td className="px-4 py-3 border border-slate-700">Dal 1798 in poi</td>
                <td className="px-4 py-3 border border-slate-700">Composizione, sviluppo di idee, memoria artistica.</td>
                <td className="px-4 py-3 border border-slate-700">Rilegati (da tavolo o tascabili). Mix di idee per varie opere.</td>
              </tr>
              <tr className="odd:bg-slate-800">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-slate-200">Fogli Sciolti</td>
                <td className="px-4 py-3 border border-slate-700">Pre-1798 (e oltre)</td>
                <td className="px-4 py-3 border border-slate-700">Esercizi tecnici, esperimenti pianistici, partiture orchestrali abbozzate.</td>
                <td className="px-4 py-3 border border-slate-700">Sparsi, poi riuniti in miscellanee (es. Kafka) dai collezionisti.</td>
              </tr>
              <tr className="odd:bg-slate-800">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-slate-200">Quaderni di Conversazione</td>
                <td className="px-4 py-3 border border-slate-700">Dal 1818 in poi</td>
                <td className="px-4 py-3 border border-slate-700">Comunicazione quotidiana (causa sordità).</td>
                <td className="px-4 py-3 border border-slate-700">Dialoghi scritti dagli interlocutori.</td>
              </tr>
              <tr className="odd:bg-slate-800">
                <td className="px-4 py-3 border border-slate-700 font-semibold text-slate-200">Diario (Tagebuch)</td>
                <td className="px-4 py-3 border border-slate-700">1812-1818 (principalmente)</td>
                <td className="px-4 py-3 border border-slate-700">Riflessione spirituale e intellettuale.</td>
                <td className="px-4 py-3 border border-slate-700">Annotazioni personali, citazioni.</td>
              </tr>
            </tbody>
          </table>
            </div>

            <div className="bg-slate-800 p-8 mt-8 rounded-3xl shadow-2xl border border-slate-700">
              <h3 className="text-2xl font-semibold text-slate-100 mb-4">Approfondisci ogni supporto</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Le schede seguenti si aprono con un tocco e permettono di esplorare ruolo, contenuti e casi studio per ciascuna tipologia di documento.
              </p>
              <div className="space-y-4">
                {fonti.map(fonte => (
                  <div key={fonte.id} className="rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
                    <button
                      onClick={() => toggleSource(fonte.id)}
                      className={`w-full flex justify-between items-center px-5 py-4 text-left transition-all ${
                        openSource === fonte.id
                          ? 'bg-slate-700 text-white font-semibold'
                          : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
                      }`}
                    >
                      <span className="text-lg font-semibold">{fonte.title}</span>
                      <ChevronDown className={`w-5 h-5 transition-transform ${openSource === fonte.id ? 'rotate-180' : ''}`} />
                    </button>
                    {openSource === fonte.id && (
                      <div className="px-5 pb-5 pt-4 text-sm leading-relaxed bg-slate-900 text-slate-200 border-t border-slate-700">
                        {fonte.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content - Bibliografia */}
        {activeTab === 'bibliografia' && (
          <div className="animate-fadeIn">
            <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <h3 className="text-2xl font-semibold text-slate-100 mb-6">📚 Bibliografia</h3>
        
        <div className="space-y-6 text-sm text-slate-300">
          <div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">Studi Specifici e Analisi del Concerto Op. 37</h4>
            <ul className="space-y-2 pl-5">
              <li className="leading-relaxed">
                <strong>Küthen, Hans-Werner.</strong> <em>Ludwig van Beethoven: Klavierkonzert Nr. 3 in c</em>. Kassel-London-New York: Bärenreiter, 1987. 
                (Edizione critica con studio sulla datazione e composizione del concerto).
              </li>
              <li className="leading-relaxed">
                <strong>Osthoff, Wolfgang.</strong> <em>Ludwig van Beethoven: Klavierkonzert Nr. 3 c moll, op. 37</em>. München: Wilhelm Fink, 1965. 
                (Analisi stilistica e collocazione nel periodo eroico).
              </li>
              <li className="leading-relaxed">
                <strong>Pestelli, Giorgio.</strong> "I concerti per pianoforte e orchestra". In <em>Van Beethoven. Le sinfonie e i concerti per pianoforte</em>, 
                a cura di A. Bini e R. Grisley. Milano: Skira, 2001, pp. 313-328. 
                (Confronto con i concerti di Mozart e analisi delle caratteristiche stilistiche).
              </li>
              <li className="leading-relaxed">
                <strong>Plantinga, Leon.</strong> <em>Beethoven's Concertos: History, Style, Performance</em>. New York-London: W. W. Norton & Company, 1999, pp. 113-135. 
                (In particolare il Capitolo 6: "On the Origins of Piano Concerto no. 3 in C minor, Op. 37").
              </li>
              <li className="leading-relaxed">
                <strong>Scalfaro, Anna.</strong> "L'Allegro con brio del Concerto op. 37 di Ludwig van Beethoven: un modello di conversazione". 
                In <em>Musica Docta. Rivista digitale di Pedagogia e Didattica della musica</em>, VI, 2016, pp. 211-237. 
                (Analisi del primo movimento come dialogo e contesto storico del genere concerto).
              </li>
              <li className="leading-relaxed">
                <strong>Tovey, Donald Francis.</strong> <em>Essays in Musical Analysis</em>, III: <em>Concertos and Choral Works</em>. London: Oxford University Press, 1936, p. 73. 
                (Collocazione dell'Op. 37 nella fase eroica beethoveniana).
              </li>
              <li className="leading-relaxed">
                <strong>Yahşi, Fahrettin Eren.</strong> "Thematic Analysis of Op. 37 3. Piano Concerto by L. v. Beethoven: The Third Movement Consisting of the First Movement". 
                In <em>Arts and Design Studies</em>, Vol. 95, 2021, pp. 8-16.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">Teoria della Forma e del Concerto</h4>
            <ul className="space-y-2 pl-5">
              <li className="leading-relaxed">
                <strong>Hepokoski, James e Darcy, Warren.</strong> <em>Elements of Sonata Theory: Norms, Types, and Deformations in the Late-Eighteenth-Century Sonata</em>. 
                Oxford: Oxford University Press, 2006. (Fonte principale per la definizione di "Forma di Sonata per Concerto").
              </li>
              <li className="leading-relaxed">
                <strong>Keefe, Simon P. (a cura di).</strong> <em>The Cambridge Companion to the Concerto</em>. Cambridge: Cambridge University Press, 2005.
              </li>
              <li className="leading-relaxed">
                <strong>Caplin, William E.</strong> <em>Classical Form: A Theory of Formal Functions for the Instrumental Music of Haydn, Mozart, and Beethoven</em>. 
                Oxford: Oxford University Press, 1998.
              </li>
              <li className="leading-relaxed">
                <strong>Rosen, Charles.</strong> <em>Lo stile classico: Haydn, Mozart, Beethoven</em> (<em>The Classical Style</em>). Edizione italiana, 1986.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">Prassi Esecutiva, Improvvisazione e Strumenti</h4>
            <ul className="space-y-2 pl-5">
              <li className="leading-relaxed">
                <strong>Chiantore, Luca.</strong> <em>Beethoven al pianoforte: Improvvisazione, composizione e ricerca sonora negli esercizi tecnici</em>. 
                Milano: il Saggiatore, 2014. (Fondamentale per il rapporto tra improvvisazione e testo scritto, e per l'aneddoto di Seyfried sulle pagine vuote).
              </li>
              <li className="leading-relaxed">
                <strong>Czerny, Carl.</strong> <em>On the Proper Performance of All Beethoven's Works for the Piano</em>. Ed. Paul Badura-Skoda. 
                Vienna: Universal Edition, 1970, p. 13. (Testimonianza diretta su Beethoven che dichiara di intraprendere un nuovo percorso compositivo).
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">Biografie e Contesto Storico</h4>
            <ul className="space-y-2 pl-5">
              <li className="leading-relaxed">
                <strong>Solomon, Maynard.</strong> <em>Beethoven</em>. New York: Schirmer Books, 1977 (ed. riv. 1998).
              </li>
              <li className="leading-relaxed">
                <strong>Thayer, Alexander Wheelock.</strong> <em>Thayer's Life of Beethoven</em>. Rev. e ed. da Elliot Forbes. 
                Princeton: Princeton University Press, 1967.
              </li>
              <li className="leading-relaxed">
                <strong>Riezler, Walter.</strong> <em>Beethoven</em>. Traduzione italiana a cura di Piero Buscaroli. Milano: Rusconi, 1977.
              </li>
              <li className="leading-relaxed">
                <strong>Lenz, Wilhelm von.</strong> <em>Beethoven et ses trois styles</em>. Parigi: Lavinée, 1855 (ristampa moderna).
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-slate-200 mb-3">Fonti Epistolari e Documentarie</h4>
            <ul className="space-y-2 pl-5">
              <li className="leading-relaxed">
                <strong>Beethoven, Ludwig van.</strong> <em>Beethoven's Letters</em>. Ed. Emily Anderson. 3 voll. London: Macmillan, 1961 (o edizioni successive).
              </li>
              <li className="leading-relaxed">
                <strong>Beethoven, Ludwig van.</strong> <em>Epistolario</em>, I (1783-1807), a cura di Sieghard Brandenburg. Milano: Skira, 1999, pp. 150, 160, 166. 
                (Lettere agli editori Hoffmeister e Breitkopf &amp; Härtel in cui giudica l'Op. 37 superiore ai primi due concerti).
              </li>
              <li className="leading-relaxed">
                <em>Ludwig van Beethovens Konversationshefte</em> (Quaderni di Conversazione). Ed. Karl-Heinz Köhler, Grita Herre, et al.
                Leipzig: Deutscher Verlag für Musik. (Riferimenti sparsi nelle biografie citate).
              </li>
            </ul>
          </div>
        </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IntroduzioneSection = ({ setActiveTab, setGlossaryFocus }) => {
  const [openConcerto0, setOpenConcerto0] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (title, content) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };

  // Contenuto modale: Cronologia vita Beethoven
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

  const BeethovenLifeModal = () => (
    <div className="space-y-6">
      {/* Immagine Beethoven */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src="/images/beethoven-life-timeline.jpg" 
          alt="Ludwig van Beethoven - Cronologia della vita"
          className="w-full h-64 object-contain rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-2 italic text-center">Epitaffio e rappresentazione volto.</p>
      </div>

      <div className="space-y-2.5">
        {beethovenLifeTimeline.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:items-start p-3 rounded-lg bg-slate-700 border-l-2 border-blue-600 shadow-sm">
            <span className="font-semibold text-slate-200 text-sm w-28 shrink-0">{item.year}</span>
            <span className="text-slate-200 text-sm leading-relaxed">{item.event}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
          <User className="w-5 h-5 text-blue-400 mr-2" />
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
            lasciavano il pubblico letteralmente a bocca aperta: poteva improvvisare per ore su un tema dato,
            sviluppandolo in modi sempre diversi e sorprendenti. Questa abilità straordinaria spiega perché
            alla prima del 1803 poté suonare "quasi a memoria" - probabilmente improvvisò intere sezioni!
          </p>
        </div>
      </div>
    </div>
  );

  // Contenuto modale: Cronologia Concerto Op. 37
  const concertoTimeline = [
    { year: "1796-97", event: "Primi abbozzi tematici. Beethoven inizia a concepire il concerto." },
    { year: "1798", event: "La sordità si manifesta chiaramente. Beethoven si dedica maggiormente alla composizione." },
    { year: "1799-1800", event: "Primi abbozzi sistematici (secondo Küthen: composizione principale in questo periodo)." },
    { year: "1802", event: "Testamento di Heiligenstadt (ottobre). Secondo Plantinga: estate 1802 - lavoro intenso al concerto." },
    { year: "1803 (primi mesi)", event: "Completamento definitivo. Analisi paleografica del manoscritto mostra '1803', non '1800' (Plantinga)." },
    { year: "1803 (5 Aprile)", event: "Prima assoluta al Theater an der Wien. Beethoven solista, Seyfried direttore. Partitura incompleta - Beethoven suona 'a memoria'!" },
    { year: "1804", event: "Pubblicazione da Bureau des Arts et d'Industrie. Dedica al Principe Luigi Ferdinando di Prussia." }
  ];

  const ConcertoTimelineModal = () => (
    <div className="space-y-5">
      {/* Immagine concerto */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src="/images/op37-manuscript.jpg" 
          alt="Manoscritto del Concerto Op. 37"
          className="w-full h-80 object-cover object-top rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-2 italic text-center">Manoscritto autografo del Concerto in Do minore Op. 37.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-3">La controversia sulla datazione</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Per decenni, la datazione del Terzo Concerto è stata oggetto di dibattito tra i musicologi. 
          Due ipotesi principali si sono confrontate:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-300 mb-3 ml-2">
          <li>
            <strong>Ipotesi Küthen:</strong> composizione principale 1799-1800, destinata a un'accademia prevista 
            per aprile 1800 (mai realizzata).
          </li>
          <li>
            <strong>Ipotesi Plantinga:</strong> composizione principale estate 1802 - primi mesi 1803, in parallelo 
            alla crisi di Heiligenstadt.
          </li>
        </ul>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          La prova decisiva è arrivata dall'<strong>analisi paleografica del manoscritto autografo</strong>, che mostra 
          chiaramente la data <strong>"1803"</strong> e non "1800" come si credeva. Questo colloca la composizione nel 
          periodo più drammatico della vita di Beethoven: mentre scriveva il <em>Testamento di Heiligenstadt</em> (ottobre 1802), 
          dove contemplava il suicidio a causa della sordità progressiva, stava componendo uno dei suoi concerti più eroici 
          e combattivi.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Il concerto nasce quindi tra il <strong>1802 e i primi mesi del 1803</strong>, periodo della transizione dal primo 
          stile al periodo eroico. È l'opera che segna il <strong>passaggio definitivo da Mozart a Beethoven</strong>.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-3">Cronologia della genesi</h3>
        <div className="space-y-2.5">
          {concertoTimeline.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-start p-3 rounded-lg bg-slate-700 border-l-2 border-blue-600 shadow-sm">
              <span className="font-semibold text-slate-200 text-sm w-32 shrink-0">{item.year}</span>
              <span className="text-slate-200 text-sm leading-relaxed">{item.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Contenuto modale: Pianoforti di Beethoven
  const pianofortiTimeline = [
    { 
      model: "Späth / Stein (Johann Andreas Stein)", 
      location: "Ratisbona / Augusta (Germania)",
      features: "Meccanica tedesca/viennese (Prellmechanik). Azione leggera, martelletti coperti (novità di Stein dal 1783).",
      period: "Bonn (anni 1780) / Augusta (1787)",
      notes: "A Bonn, Beethoven suonava strumenti Stein di proprietà della contessa Hatzfeldt. Nel 1787 visitò il laboratorio di Stein ad Augusta. È possibile che il conte Waldstein gliene abbia regalato uno a Bonn."
    },
    {
      model: "Anton Walter",
      location: "Vienna",
      features: "Meccanica viennese. Leggero, tocco reattivo, smorzatori a ginocchiera (spesso divisi per bassi/acuti). Estensione tipica di 5 ottave (FF-f3).",
      period: "Vienna (fine anni 1790 - primi 1800)",
      notes: "Beethoven possedeva un Walter, ma desiderava che fosse modificato (es. aggiunta di una corda). Czerny riferisce che il tocco di Mozart (legato ai Walter) non era adatto ai nuovi fortepiano che Beethoven prediligeva."
    },
    {
      model: "Sébastien Érard (N. 133)",
      location: "Parigi",
      features: "5 ottave e mezza (FF-c4). Meccanica 'inglese' (più pesante). 4 pedali (liuto, smorzatori, celeste/buff, una corda). Corde triple.",
      period: "Vienna (Ricevuto nel 1803)",
      notes: "Un dono della ditta Érard legato alla pubblicazione della Sonata Patetica a Parigi. L'estensione extra (fino al Do4) influenzò la Sonata Waldstein (Op. 53) e l'Appassionata (Op. 57). Beethoven trovava la meccanica troppo pesante e nel 1810 lo definì 'inutile' per i danni subiti."
    },
    {
      model: "Streicher (Nannette e Andreas)",
      location: "Vienna",
      features: "Meccanica viennese perfezionata. Beethoven cercava uno strumento che potesse 'cantare' e sostenere il suono.",
      period: "Vienna (Vari periodi)",
      notes: "Beethoven ebbe un rapporto di amicizia e consulenza vitalizia con i coniugi Streicher. Usò e possedette vari loro strumenti. Nel 1796 prese in prestito uno Streicher per un concerto a Presburgo e lo vendette lì invece di restituirlo."
    },
    {
      model: "Thomas Broadwood",
      location: "Londra",
      features: "6 ottave (CC-c4). Suono robusto e potente, meccanica inglese pesante. Tripla cordatura. Nomi dei donatori (Kalkbrenner, Moscheles) firmati sulla tavola armonica.",
      period: "Mödling / Vienna (1818 - 1827)",
      notes: "Un regalo della ditta Broadwood. Arrivò a Vienna dopo un lungo viaggio. Beethoven, ormai sordo, lo 'martellava' così forte da rompere le corde e danneggiarlo. È lo strumento associato alle ultime sonate (es. Hammerklavier Op. 106)."
    },
    {
      model: "Conrad Graf",
      location: "Vienna",
      features: "Estensione estesa (fino al Fa4 o 6 ottave e mezza). Quadrupla cordatura nei trebles per aumentare il volume.",
      period: "Vienna (c. 1825 - 1827)",
      notes: "Prestato a Beethoven per i suoi ultimi anni. Per aiutarlo a sentire, fu costruita una cassa di risonanza (o cupola) in legno speciale per convogliare il suono. Si trovava nella Schwarzspanierhaus insieme al Broadwood."
    }
  ];

  const PianofortiModal = () => (
    <div className="space-y-6">
      {/* Immagine pianoforte */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src="/images/fortepiano-evolution.jpg" 
          alt="Evoluzione del pianoforte"
          className="w-full h-80 object-cover rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-2 italic text-center">Famiglia Mozart. Johann Nepomuk della Croce.</p>
      </div>

      {/* Introduzione */}
      <div>
        <h3 className="text-xl font-bold text-slate-100 mb-4">L'EVOLUZIONE DELLO STRUMENTO E DEL COMPOSITORE</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          La carriera di Beethoven (1770-1827) coincide con un momento rivoluzionario nella storia del pianoforte: la <strong>trasformazione dal fortepiano classico al pianoforte romantico moderno</strong>. In soli quarant'anni, lo strumento passò da 5 ottave (FF-f³) a oltre 6 ottave e mezza, da corde doppie a quadruple, da meccaniche leggere a azioni pesanti e potenti.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Beethoven non fu solo testimone di questa evoluzione: <strong>la influenzò attivamente</strong> e <strong>ne fu influenzato profondamente</strong>. Ogni nuovo strumento che riceveva o acquistava apriva nuove possibilità compositive. L'estensione del pianoforte Érard (1803) gli permise di scrivere la Waldstein e l'Appassionata; la potenza del <Tooltip text="Il pianoforte Broadwood 1818 era un dono inglese dal suono potente, fondamentale per le ultime opere di Beethoven">
            <span className="text-blue-300 underline decoration-dotted cursor-help">Broadwood (1818)</span>
          </Tooltip> accompagnò la nascita della monumentale Hammerklavier.
        </p>
      </div>

      {/* Tre scuole di costruzione */}
      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">TRE SCUOLE DI COSTRUZIONE</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Nel periodo di Beethoven esistevano <strong>tre scuole principali</strong> di costruzione pianistica:
        </p>
        <ol className="text-sm text-slate-300 space-y-2 ml-4">
          <li><strong>1. Scuola viennese</strong> (Walter, Streicher, Graf): meccanica leggera "Prellmechanik", tocco rapido e brillante, suono cristallino ma delicato</li>
          <li><strong>2. Scuola inglese</strong> (Broadwood): meccanica pesante, suono robusto e cantabile, maggiore resistenza</li>
          <li><strong>3. Scuola francese</strong> (Érard): innovazioni meccaniche (doppio scappamento), estensione ampliata, 4 pedali</li>
        </ol>
        <p className="text-sm text-slate-300 leading-relaxed mt-3">
          Beethoven <strong>sperimentò tutte e tre</strong>, cercando sempre lo strumento ideale che potesse "cantare" e sostenere il suono come desiderava.
        </p>
      </div>

      {/* La sordità */}
        <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
          <h3 className="text-lg font-semibold text-slate-100 mb-3">LA SORDITÀ E IL RAPPORTO CON LO STRUMENTO</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Intorno al 1798 la sordità progressiva cambiò radicalmente il rapporto di Beethoven con il pianoforte. Negli ultimi anni, completamente sordo, <strong>"martellava" i tasti con tale violenza da rompere corde e danneggiare gli strumenti</strong>. Per il pianoforte Graf fu costruita una speciale cassa di risonanza in legno per convogliare il suono e permettergli di percepire le vibrazioni.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Paradossalmente, la perdita dell'udito <strong>liberò Beethoven dai limiti fisici dello strumento</strong>: componeva non più per quello che poteva sentire, ma per quello che immaginava. Le ultime sonate richiedono dinamiche, estensioni e sonorità che superavano le possibilità dei pianoforti dell'epoca.
        </p>
        <div className="mb-4 flex flex-col gap-4 md:flex-row">
          <div className="md:w-1/2 rounded-lg border border-slate-600 overflow-hidden">
            <img
              src="/images/beethoven-forte-pedal-horns.jpg"
              alt="Strumenti e cornetti usati da Beethoven per captare il suono"
              className="w-full h-auto"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-center gap-3">
            <p className="text-sm text-slate-300 leading-relaxed">
              Questi strumenti amplificavano il suono per Beethoven mentre la sordità avanzava: le cornette acustiche di Johann Nepomuk Maelzel (c.1813) funzionavano come protesi che avvicinava all’orecchio, mentre i cunei e i coni di rame venivano appoggiati al pianoforte o tra i denti per trasferire vibrazioni al cranio e al torace.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              In assenza di udito, quelle vibrazioni corporee rimasero l’unico modo per "sentire" la musica e continuare a suonare e comporre.
            </p>
          </div>
        </div>
      
      </div>

      {/* Tabella cronologica */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">CRONISTORIA DEI PIANOFORTI DI BEETHOVEN</h3>
        <table className="w-full text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-700 text-slate-100">
              <th className="border border-slate-600 p-2 text-left">Modello / Costruttore</th>
              <th className="border border-slate-600 p-2 text-left">Fabbricato a</th>
              <th className="border border-slate-600 p-2 text-left">Posseduto / Usato</th>
              <th className="border border-slate-600 p-2 text-left">Caratteristiche</th>
              <th className="border border-slate-600 p-2 text-left">Storia e Note</th>
            </tr>
          </thead>
          <tbody>
            {pianofortiTimeline.map((piano, idx) => (
              <tr key={idx}>
                <td className="border border-slate-600 p-2"><strong>{piano.model}</strong></td>
                <td className="border border-slate-600 p-2">{piano.location}</td>
                <td className="border border-slate-600 p-2"><strong>{piano.period}</strong></td>
                <td className="border border-slate-600 p-2">{piano.features}</td>
                <td className="border border-slate-600 p-2">{piano.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 italic mt-4">
          <strong>Nota:</strong> Molti di questi strumenti sopravvivono ancora oggi e sono conservati in musei (Beethoven-Haus Bonn, Kunsthistorisches Museum Vienna). Il Broadwood si trova alla National Trust (Inghilterra), l'Érard al Kunsthistorisches Museum di Vienna.
        </p>
      </div>
    </div>
  );

  // Contenuto modale: Lettere sui Concerti
  const LettereConcertiModal = () => (
    <div className="space-y-6">
      {/* Immagine lettere */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src="/images/beethoven-letters-manuscripts.jpg" 
          alt="Lettere e manoscritti di Beethoven"
          className="w-full h-64 object-cover rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-2 italic text-center">Corrispondenza di Beethoven con gli editori.</p>
      </div>

      <p className="text-sm text-slate-300 leading-relaxed">
        Le lettere di Beethoven agli editori e agli amici rivelano il suo atteggiamento critico verso i propri lavori e
        il contesto in cui i concerti furono composti e pubblicati.
      </p>

      {/* Triplo Concerto */}
      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Sul "Triplo Concerto" (Op. 56)</h3>
        <p className="text-sm text-slate-300 mb-3 italic">
          Nella lettera a Breitkopf & Härtel del 26 agosto 1804, Beethoven offre un gruppo
          di opere (tra cui la Sinfonia Eroica e l'oratorio Cristo sul Monte degli Ulivi) e sottolinea la novità della
          combinazione strumentale del Triplo Concerto per incentivarne la pubblicazione.
        </p>
        <div className="bg-slate-900/50 p-3 rounded border-l-4 border-blue-500 mb-2">
          <p className="text-xs text-slate-400 mb-1">A Breitkopf & Härtel, 26 agosto 1804:</p>
          <p className="text-sm text-slate-200 leading-relaxed">
            «Le dirò in breve quello che posso darLe: il mio Oratorio, una nuova grande Sinfonia, un "Concertante"
            per violino, violoncello, pianoforte e orchestra; tre sonate per piano. [...] Riguardo agli altri
            lavori non ho altro da aggiungere, benché un "Concertante" con questi tre strumenti sia qualcosa di nuovo».
          </p>
        </div>
        <p className="text-sm text-slate-300 italic">
          <strong>Nota:</strong> il Triplo Concerto non ebbe grande successo né all'epoca né oggi. Beethoven stesso
          sembrava consapevole della sua natura sperimentale più che del suo valore assoluto.
        </p>
      </div>

      {/* Quarto Concerto */}
      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Sul Quarto Concerto (Op. 58)</h3>
        <p className="text-sm text-slate-300 mb-3 italic">
          <strong>Contesto:</strong> Ferdinand Ries racconta che Beethoven gli portò lo spartito del concerto appena
          completato, pretendendo che lo eseguisse in pubblico con soli cinque giorni di preavviso. Ries rifiutò per la
          brevità del tempo, scatenando l'ira di Beethoven, che si rivolse al pianista Friedrich Stein. Stein accettò,
          ma non riuscendo a padroneggiare il concerto in tempo, finì per suonare invece il Terzo Concerto (Op. 37).
        </p>
        <div className="bg-slate-900/50 p-3 rounded border-l-4 border-blue-500 mb-2">
          <p className="text-xs text-slate-400 mb-1">Testimonianza riportata da Ferdinand Ries:</p>
          <p className="text-sm text-slate-200 leading-relaxed">
            «Un giorno B. mi portò il 4° concerto, dicendo: "Sabato prossimo lo suonerete a teatro". Rimanevano
            cinque giorni. Per mia sfortuna, risposi che restava troppo poco tempo per imparare a suonare bene il
            concerto. B., fâché [arrabbiato], andò a trovare subito il giovane pianista Stein...».
          </p>
        </div>
        <p className="text-sm text-slate-300 italic">
          <strong>Epilogo:</strong> Stein, incapace di preparare il concerto in tempo, finì per eseguire il Terzo
          Concerto (Op. 37) anziché il Quarto. Beethoven stesso eseguì la prima pubblica del Quarto Concerto solo
          il <strong>22 dicembre 1808</strong> all'Akademie al Theater an der Wien, in un concerto maratona che
          includeva anche la Quinta e la Sesta Sinfonia, la Fantasia Corale Op. 80 e brani della Messa in Do maggiore
          Op. 86.
        </p>
      </div>

      {/* Quinto Concerto */}
      <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Sul Quinto Concerto "Imperatore" (Op. 73)</h3>
        <p className="text-sm text-slate-300 mb-3 italic">
          <strong>Contesto:</strong> questo concerto fu composto nel 1809, l'anno dell'invasione napoleonica. Durante
          il bombardamento e l'occupazione di Vienna (12 maggio - novembre 1809), Beethoven si rifugiò nella casa del
          fratello Caspar Carl; le lettere e gli appunti di questo periodo riflettono la profonda angoscia per le
          condizioni esterne, descrivendo la sua vita come una «morte» rispetto all'immortalità artistica a cui aspirava.
        </p>
        <div className="bg-slate-900/50 p-3 rounded border-l-4 border-amber-500">
          <div className="mb-3">
            <p className="text-sm text-slate-200 leading-relaxed mb-2">
              <strong>Contesto storico e carattere:</strong> l'opera appartiene all'anno dell'invasione, 1809.
              Il musicologo Alfred Einstein (1880-1952, cugino di Albert Einstein) affermò che per i suoi ritmi, i
              motivi di vittoria e le melodie energiche, questo concerto è «l'apoteosi del concetto militare» nella
              musica di Beethoven, un'opera che non solo soddisfaceva ma superava le aspettative di un pubblico in
              attesa di uno stile marziale.
            </p>
            <p className="text-sm text-slate-200 leading-relaxed mb-2">
              <strong>Dedicatario:</strong> fu pubblicato nel febbraio 1811 con una dedica all'Arciduca Rodolfo, il
              protettore più importante di Beethoven, al quale il compositore fu legato da profonda gratitudine per
              tutta la vita. In una lettera successiva all'Arciduca Rodolfo (riferita alla Missa Solemnis Op. 123,
              composta 1819-1823 e anch'essa dedicata a lui), Beethoven scrisse:
            </p>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              «Nulla è più sublime che avvicinarsi alla divinità più degli altri mortali, e mediante quel contatto
              diffondere i raggi della divinità tra il genere umano».
            </p>
            <p className="text-sm text-slate-300 leading-relaxed mt-2">
              Queste parole rivelano l'importanza spirituale che Beethoven attribuiva al rapporto con il suo allievo
              e mecenate.
            </p>
          </div>
          <div className="bg-slate-800 p-3 rounded">
            <p className="text-xs text-slate-400 mb-1">Nota nel catalogo di Lenz:</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              Wilhelm von Lenz descrisse l'opera con questa celebre definizione: «L'orgoglio del pianoforte
              in quanto strumento da concerto».
            </p>
          </div>
        </div>
      </div>
    </div>
  );


  // Modale Cadenze
  const CadenzeModal = () => (
    <div className="space-y-4 text-sm text-slate-300">
      <p className="text-base text-slate-200">
        Nel <strong>1809</strong>, sei anni dopo la prima esecuzione, Beethoven scrisse tre cadenze per il primo movimento dell'Op. 37, 
        catalogate come <strong>WoO 58</strong> (Werke ohne Opuszahl - opere senza numero d'opus).
      </p>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Le tre versioni</h4>
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-slate-100">WoO 58 n. 1 - Breve e classica</p>
            <p className="text-xs text-slate-400">70 battute → Stile più contenuto, vicino all'estetica del 1803</p>
          </div>
          <div>
            <p className="font-semibold text-slate-100">WoO 58 n. 2 - Moderata</p>
            <p className="text-xs text-slate-400">90 battute → Equilibrio tra concisione e sviluppo tematico</p>
          </div>
          <div>
            <p className="font-semibold text-slate-100">WoO 58 n. 3 - Espansa</p>
            <p className="text-xs text-slate-400">130 battute → Quasi un secondo sviluppo, la più virtuosistica</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-orange-500">
        <h4 className="text-base font-semibold text-slate-200 mb-2">Il problema stilistico</h4>
        <p className="mb-3">
          Come osserva <strong>Luca Chiantore</strong>, queste cadenze presentano una <em>"incoerenza stilistica lampante"</em>: 
          nel 1809 Beethoven è nel <strong>periodo medio maturo</strong>, ben oltre lo stile del 1803. 
          Le cadenze riflettono il linguaggio armonico e pianistico della <em>Sonata Waldstein</em> Op. 53 o dell'<em>Appassionata</em> Op. 57, 
          risultando più avanzate del concerto stesso.
        </p>
        <p className="text-xs italic text-slate-400">
          Questo dimostra che Beethoven non considerava la cadenza come parte immutabile del concerto, 
          ma come spazio di libertà espressiva legato al momento dell'esecuzione.
        </p>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Altre cadenze celebri</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ChevronRight className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
            <span>
              <strong>Fazil Say (2001)</strong> → Linguaggio contemporaneo con cluster e ritmi irregolari, 
              ma profondamente radicato nel materiale tematico beethoveniano. 
              <a 
                href="https://youtu.be/a0ixaGeQzME?si=vG4tYv1rpwhCFHk0&t=772" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-slate-200 underline ml-1"
              >
                Ascolta al min. 12:51
              </a>
            </span>
          </li>
          <li className="flex items-start">
            <ChevronRight className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Johann Nepomuk Hummel</strong> → Contemporanea di Beethoven, stile virtuosistico brillante</span>
          </li>
          <li className="flex items-start">
            <ChevronRight className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Clara Schumann</strong> → Cadenza romantica del XIX secolo, espressività lirica</span>
          </li>
        </ul>
      </div>

      <div className="mt-3 p-3 bg-blue-900/20 rounded text-xs text-slate-200 border-l-2 border-blue-500">
        💡 <strong>Curiosità:</strong> Clara Schumann fu tra le prime donne a eseguire questo concerto in pubblico (1840), 
        sfidando le convenzioni dell'epoca che scoraggiavano le donne dall'eseguire opere così impegnative.
      </div>

      <p className="text-xs text-slate-400 italic pt-3 border-t border-slate-700">
        La tradizione di scrivere cadenze personali per i concerti di Beethoven è viva ancora oggi, 
        dimostrando come questi capolavori continuino a ispirare creatività e dialogo tra epoche.
      </p>
    </div>
  );

  const ContestoGeopoliticoModal = () => (
    <div className="space-y-5">
      {/* Immagine contesto storico */}
      <div className="mb-4 rounded-lg overflow-hidden">
        <img 
          src="/images/napoleonic-wars-vienna.jpg" 
          alt="Vienna durante le guerre napoleoniche"
          className="w-full h-64 object-cover rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-2 italic text-center">Guerra napoleonica. La cattura dei ponti sul Danubio (13/11/1805). Autore sconosciuto.</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Le guerre napoleoniche (1792-1815)</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          L'Europa è sconvolta dalle <strong>guerre napoleoniche</strong>. La <strong>Rivoluzione francese</strong> (1789) 
          aveva rovesciato l'ordine monarchico, proclamando libertà, uguaglianza e fraternità. <strong>Napoleone Bonaparte</strong> emerge 
          come generale nel 1796 e diventa primo console nel 1799, poi imperatore nel 1804.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Beethoven inizialmente ammira Napoleone come simbolo degli ideali repubblicani, ma si disillude quando questi si 
          autoincoronerà imperatore. Nel <strong>1809</strong>, Napoleone conquista Vienna (12 maggio), causando devastazione 
          e carestia; il periodo rivoluzionario influenza profondamente lo stile di Beethoven: uno "stile grandioso" 
          post-rivoluzionario francese si fonde con la tradizione classica viennese.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">Vienna: la capitale musicale d'Europa</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Quando Beethoven arriva nel novembre 1792, <strong>Vienna</strong> è la capitale musicale indiscussa d'Europa: 
          nella città viveva <strong>Haydn</strong> ed era stata la casa di <strong>Mozart</strong>. L'imperatore{' '}
          <Tooltip text="Francesco II d'Asburgo (1768-1835): ultimo imperatore del Sacro Romano Impero (1792-1806), primo imperatore d'Austria come Francesco I (1804-1835). Violinista dilettante, incarnava il gusto musicale della corte viennese.">
            <span className="text-blue-300 underline decoration-dotted cursor-help">Francesco II</span>
          </Tooltip>{' '}
          suonava il violino, e l'aristocrazia viennese considerava un dovere e un onore finanziare musicisti e concerti.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          Il sistema del <strong>mecenatismo</strong> permetteva ai compositori di vivere grazie al sostegno economico della nobiltà, 
          che garantiva stipendi, commissioni di opere e ospitalità nei propri palazzi.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">I mecenati di Beethoven</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-100">
                <th className="border border-slate-600 p-2 text-left">Nome</th>
                <th className="border border-slate-600 p-2 text-left">Date</th>
                <th className="border border-slate-600 p-2 text-left">Ruolo</th>
                <th className="border border-slate-600 p-2 text-left">Sostegno economico</th>
                <th className="border border-slate-600 p-2 text-left">Opere dedicate (selezione)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">Principe Karl Alois von Lichnowsky</td>
                <td className="border border-slate-600 p-2">1761-1814</td>
                <td className="border border-slate-600 p-2">Primo grande mecenate</td>
                <td className="border border-slate-600 p-2">600 fiorini annui</td>
                <td className="border border-slate-600 p-2">Sonata Patetica Op. 13, Concerto n. 2 Op. 19, Trii Op. 1</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">Arciduca Rodolfo d'Austria</td>
                <td className="border border-slate-600 p-2">1788-1831</td>
                <td className="border border-slate-600 p-2">Allievo, fratello dell'imperatore</td>
                <td className="border border-slate-600 p-2">Rendita vitalizia (dal 1809)</td>
                <td className="border border-slate-600 p-2">Concerti n. 4 e 5, Sonata Arciduca Op. 97, Les Adieux Op. 81a, Hammerklavier Op. 106, Missa Solemnis Op. 123</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">Principe Franz Joseph von Lobkowitz</td>
                <td className="border border-slate-600 p-2">1772-1816</td>
                <td className="border border-slate-600 p-2">Possedeva orchestra privata</td>
                <td className="border border-slate-600 p-2">Contributo rendita 1809</td>
                <td className="border border-slate-600 p-2">Sinfonia Eroica Op. 55, Triplo Concerto Op. 56, Quartetti Op. 18</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">Conte Andrey Razumovsky</td>
                <td className="border border-slate-600 p-2">1752-1836</td>
                <td className="border border-slate-600 p-2">Ambasciatore russo</td>
                <td className="border border-slate-600 p-2">Finanziamento quartetto privato</td>
                <td className="border border-slate-600 p-2">Quartetti Razumovsky Op. 59</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">Barone Gottfried van Swieten</td>
                <td className="border border-slate-600 p-2">1733-1803</td>
                <td className="border border-slate-600 p-2">Diplomatico, mecenate</td>
                <td className="border border-slate-600 p-2">Concerti privati domenicali</td>
                <td className="border border-slate-600 p-2">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-2">La rendita garantita del 1809</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Nel 1809, tre mecenati (Arciduca Rodolfo, Lobkowitz e il Principe Ferdinand Kinsky) garantirono a Beethoven una{' '}
          <strong>rendita vitalizia di 4.000 fiorini annui</strong> per impedirgli di lasciare Vienna e accettare l'offerta del 
          re di Westfalia. Questa sicurezza economica permise a Beethoven di comporre senza pressioni finanziarie.
        </p>
        <div className="bg-slate-800/50 p-3 rounded text-xs text-slate-300 space-y-1">
          <p><strong>Note:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Solo davanti all'Arciduca Rodolfo, Beethoven toglieva il cappello in segno di rispetto</li>
            <li>Il rapporto con Lichnowsky si ruppe nel 1806 per una lite violenta</li>
            <li>Il palazzo di Razumovsky bruciò nel 1814 e causò la rovina economica del conte</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      <Modal 
        isOpen={modalContent !== null} 
        onClose={closeModal}
        title={modalContent?.title || ''}
      >
        {modalContent?.content}
      </Modal>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-slate-100 p-8 rounded-2xl shadow-2xl border border-slate-600">
        <h2 className="text-3xl font-bold mb-6 text-blue-300">Concerto per pianoforte n. 3 in Do minore, Op. 37</h2>

        {/* Immagine hero principale */}
        <div className="mb-6 rounded-lg overflow-hidden shadow-2xl">
          <img 
            src="/images/beethoven-portrait-hero.jpg" 
            alt="Ritratto di Ludwig van Beethoven"
            className="w-full h-96 object-cover"
          />
          <p className="text-xs text-slate-400 mt-2 italic text-center">Ritratto di Beethoven. Joseph Willibrord Mähler (1804-5).</p>
        </div>

        <div className="mb-5">
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Il Concerto per pianoforte n. 3 in Do minore, Op. 37 rappresenta l'inizio dei concerti maturi di Beethoven: iniziato nel 1799, fu completato all'inizio del 1803.
          </p>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            La prima esecuzione avvenne il 5 aprile 1803 al Theater an der Wien in un'<Tooltip text="Concerto pubblico dove i compositori presentavano le proprie opere"><span className="text-blue-300 underline decoration-dotted cursor-help">Akademie</span></Tooltip>. Il programma era sovraccarico: Beethoven eseguì nuovamente la Sinfonia n. 1, presentò per la prima volta la Sinfonia n. 2, il Concerto n. 3 e l'oratorio <Tooltip text="Composizione sacra per voci e orchestra"><span className="text-blue-300 underline decoration-dotted cursor-help">Cristo sul Monte degli Ulivi</span></Tooltip>. <Tooltip text="Allievo e biografo di Beethoven, raccontò l'eccessiva durata dell'Akademie"><span className="text-blue-300 underline decoration-dotted cursor-help">Ferdinand Ries</span></Tooltip> scrisse: «Il concerto è iniziato alle sei, ma è durato così tanto che un paio di brani non sono stati eseguiti».
          </p>
          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            Dei cinque concerti per pianoforte scritti da Beethoven, Mozart ne compose venticinque; il compositore considerava i primi due inferiori all'op. 37. Quest'ultimo segna il passaggio dallo stile classico di Mozart allo stile eroico, caratterizzato da maggiore drammaticità ed espressività.
          </p>
        </div>

        {/* Informazioni essenziali inline */}
        <div className="grid md:grid-cols-2 gap-4 mb-5 text-sm bg-slate-900/50 p-4 rounded-lg">
          <div className="space-y-1.5">
            <p><strong>Compositore:</strong> Ludwig van Beethoven (1770-1827)</p>
            <p><strong>Composizione:</strong> 1800-1803</p>
            <p><strong>Prima esecuzione:</strong> 5 aprile 1803, Theater an der Wien</p>
          </div>
          <div className="space-y-1.5">
            <p>
              <strong>Dedicato a:</strong>{' '}
              <Tooltip text="Principe prussiano e pianista virtuosistico, nipote di Federico il Grande, caduto eroicamente nella battaglia di Saalfeld (1806) contro Napoleone. Appassionato di musica e ammiratore di Beethoven.">
                <span className="text-blue-400 underline decoration-dotted cursor-help">
                  Principe Luigi Ferdinando di Prussia
                </span>
              </Tooltip>
            </p>
            <p><strong>Tonalità:</strong> Do minore → Do maggiore (finale)</p>
            <p><strong>Movimenti:</strong> Allegro con brio • Largo • Rondò</p>
          </div>
        </div>

        {/* Tabella I 5 Concerti in Prospettiva */}
        <div className="overflow-x-auto">
          <h4 className="text-base font-semibold text-slate-200 mb-3">I 5 Concerti in prospettiva</h4>
          <table className="w-full text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-700 text-slate-100">
                <th className="border border-slate-600 p-2 text-left">N.</th>
                <th className="border border-slate-600 p-2 text-left">Op.</th>
                <th className="border border-slate-600 p-2 text-left">Anno</th>
                <th className="border border-slate-600 p-2 text-left">Periodo</th>
                <th className="border border-slate-600 p-2 text-left">Tonalità</th>
                <th className="border border-slate-600 p-2 text-left">Carattere</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">2</td>
                <td className="border border-slate-600 p-2">19</td>
                <td className="border border-slate-600 p-2">1795</td>
                <td className="border border-slate-600 p-2 text-slate-400">Giovanile</td>
                <td className="border border-slate-600 p-2">Si♭ maggiore</td>
                <td className="border border-slate-600 p-2">Giovanile brillante</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">1</td>
                <td className="border border-slate-600 p-2">15</td>
                <td className="border border-slate-600 p-2">1800</td>
                <td className="border border-slate-600 p-2 text-slate-400">Giovanile</td>
                <td className="border border-slate-600 p-2">Do maggiore</td>
                <td className="border border-slate-600 p-2">Classico mozartiano</td>
              </tr>
              <tr className="bg-blue-900/30">
                <td className="border border-slate-600 p-2 font-bold text-slate-200">3</td>
                <td className="border border-slate-600 p-2 font-bold text-slate-200">37</td>
                <td className="border border-slate-600 p-2 font-bold text-slate-200">1803</td>
                <td className="border border-slate-600 p-2 font-bold text-orange-400">Eroico</td>
                <td className="border border-slate-600 p-2 font-bold text-slate-200">Do minore</td>
                <td className="border border-slate-600 p-2 font-bold text-slate-200">Transizione drammatica</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">4</td>
                <td className="border border-slate-600 p-2">58</td>
                <td className="border border-slate-600 p-2">1806</td>
                <td className="border border-slate-600 p-2 text-orange-400">Eroico</td>
                <td className="border border-slate-600 p-2">Sol maggiore</td>
                <td className="border border-slate-600 p-2">Poetico rivoluzionario</td>
              </tr>
              <tr>
                <td className="border border-slate-600 p-2 font-semibold">5</td>
                <td className="border border-slate-600 p-2">73</td>
                <td className="border border-slate-600 p-2">1810</td>
                <td className="border border-slate-600 p-2 text-orange-400">Eroico</td>
                <td className="border border-slate-600 p-2">Mi♭ maggiore</td>
                <td className="border border-slate-600 p-2">Monumentale imperiale</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700">
          {/* Immagine Theater an der Wien */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src="/images/theater-an-der-wien-1803.jpg" 
              alt="Theater an der Wien nel 1803"
              className="w-full h-72 object-cover rounded-lg"
            />
            <p className="text-xs text-slate-400 mt-2 italic text-center">Theater an der Wien, Vienna - Incisione d'epoca.</p>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-600 shadow-lg mb-4">
            <p className="text-sm text-slate-300 mb-2">
              Tra il 1800 e il 1801, Beethoven negozia con gli editori per vendere i suoi primi concerti: 
              ha bisogno di guadagnare, ma è consapevole che queste opere non rappresentano più il suo attuale 
              livello di eccellenza. I primi due furono da lui giudicati lavori giovanili ormai superati dal Terzo Concerto (Op. 37).
            </p>
            <p className="text-sm text-slate-400 mb-2">A Franz Anton Hoffmeister (editore a Lipsia), circa 15 dicembre 1800 o 15 gennaio 1801:</p>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              «Terzo, un concerto per pianoforte [l'Op. 19] che in verità non spaccio per uno dei
              miei migliori, così come un altro [l'Op. 15] che uscirà qui da Mollo (per informazione ai recensori
              di Lipsia), perché i migliori li tengo ancora per me, finché non farò io stesso un viaggio; tuttavia
              non dovrebbe essere una vergogna per voi stamparlo».
            </p>
          </div>
          <button
            onClick={() => openModal('Lettere di Beethoven sui Concerti', <LettereConcertiModal />)}
            className="text-sm text-blue-400 hover:text-slate-200 font-semibold hover:underline"
          >
            → Leggi le lettere di Beethoven sui suoi concerti
          </button>
        </div>
      </div>

      {/* Cards compatte narrative con pulsanti Approfondisci */}
        <div className="grid md:grid-cols-2 gap-4">
        {/* Card 1: Contesto storico */}
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 hover:border-blue-500 transition-all min-h-[420px] flex flex-col">
          {/* Immagine card */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src="/images/vienna-1800-cityscape.jpg" 
              alt="Vienna nel 1800"
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-xs text-slate-400 mt-1 italic text-center">Vienna alla fine del XVIII secolo.</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
            Contesto storico
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Vienna 1792: Beethoven era già stato in città nel 1789 per studiare con Mozart, ma dovette tornare rapidamente a Bonn per seguire la madre ammalata. Tornato nel 1792, trovò una capitale musicale dominata da Haydn e ancora segnata dalla memoria di Mozart, scomparso solo l'anno prima.
            Le guerre napoleoniche (1792-1815) sconvolgono l'Europa.
          </p>
          <button
            onClick={() => openModal('Contesto Geopolitico', <ContestoGeopoliticoModal />)}
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
          >
            Approfondisci 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Cronologia vita Beethoven */}
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 hover:border-blue-500 transition-all min-h-[420px] flex flex-col">
          {/* Immagine card */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src="/images/beethoven-working-portrait.jpg" 
              alt="Beethoven al lavoro"
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-xs text-slate-400 mt-1 italic text-center">Ritratto di Beethoven. Joseph Karl Stieler (1820).</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <User className="w-5 h-5 text-blue-400 mr-2" />
            Vita di Beethoven
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            1770-1827: nato a Bonn, protetto da <Tooltip text="Il conte Ferdinand von Waldstein fu il primo grande mecenate di Beethoven, gli offrì borse di studio e lo sostenne nei viaggi a Vienna">Waldstein</Tooltip> e formato da Haydn prima dell'incontro con Mozart; la crisi di Heiligenstadt (1802) segnò l'inizio del suo periodo eroico. Stabilizzatosi a Vienna, affrontò la sordità crescente mentre componeva sinfonie, concerti e sonate che lo consacrarono come genio immortale.
          </p>
          <button
            onClick={() => openModal('Cronologia: Vita di Ludwig van Beethoven', <BeethovenLifeModal />)}
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
          >
            Approfondisci 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 3: Cronologia Concerto */}
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 hover:border-blue-500 transition-all min-h-[420px] flex flex-col">
          {/* Immagine card */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src="/images/beethoven-manuscript-op37.jpg" 
              alt="Manoscritto del Concerto Op. 37"
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-xs text-slate-400 mt-1 italic text-center">Manoscritto autografo del Concerto Op. 37.</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <Music className="w-5 h-5 text-blue-400 mr-2" />
            Genesi del Concerto
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            1796-1803: abbozzi, Testamento di Heiligenstadt e prima esecuzione al Theater an der Wien con partitura incompleta; il ritorno definitivo a Vienna nel 1792 consolidò la sua vocazione eroica, lettere agli editori e correzioni successive intrecciarono un percorso travagliato fino all'edizione definitiva del 1803.
          </p>
          <button
            onClick={() => openModal('Cronologia: Concerto n. 3 in Do minore, Op. 37', <ConcertoTimelineModal />)}
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
          >
            Approfondisci 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 4: Pianoforti */}
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border border-slate-700 hover:border-blue-500 transition-all min-h-[420px] flex flex-col">
          {/* Immagine card */}
          <div className="mb-4 rounded-lg overflow-hidden">
            <img 
              src="/images/erard-fortepiano-1803.jpg" 
              alt="Fortepiano Érard del 1803"
              className="w-full h-48 object-cover rounded"
            />
            <p className="text-xs text-slate-400 mt-1 italic text-center">Fortepiano Érard, inizi XIX secolo.</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-100 mb-3 flex items-center">
            <Music className="w-5 h-5 text-blue-400 mr-2" />
            I pianoforti di Beethoven
          </h3>
          <p className="text-sm text-slate-300 mb-4">
            Stein, Graf ed Érard guidarono l'evoluzione degli strumenti di Beethoven. L'Érard del 1803 con i suoi quattro pedali ampliò le possibilità dinamiche e timbriche, aiutando il compositore a scrivere le opere del periodo eroico.
          </p>
          <button
            onClick={() => openModal('I Pianoforti di Beethoven', <PianofortiModal />)}
            className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
          >
            Approfondisci 
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Link rapidi */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">🔗 Esplora l'app</h3>
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
            className="text-xs px-3 py-1.5 bg-slate-700 border border-blue-700 text-blue-400 rounded hover:bg-slate-600 transition-colors font-medium"
          >
            → Mettiti alla prova
          </button>
          <button
            onClick={() => setActiveTab('fonti')}
            className="text-xs px-3 py-1.5 bg-slate-800 border border-blue-600 text-blue-400 rounded hover:bg-slate-700/50 transition-colors font-medium"
          >
            → Fonti documentarie
          </button>
        </div>
      </div>

      {/* Curiosità: Concerto 0 - Espandibile */}
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
        <button
          onClick={() => setOpenConcerto0(!openConcerto0)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openConcerto0
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">📖 Curiosità: il "Concerto 0" (WoO. 4)</h3>
              <span className="text-sm opacity-90">1784 - Beethoven a 14 anni</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openConcerto0 ? 'rotate-180' : ''}`} />
        </button>
        {openConcerto0 && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-4 text-sm text-slate-300">
              <p className="text-base text-slate-200">
                Il <strong>Concerto per pianoforte in Mib maggiore, WoO. 4</strong>, è una delle prime opere di Beethoven, 
                scritta nel <strong>1784</strong> quando aveva solo <strong>14 anni</strong>. Oggi sopravvive solo la parte per pianoforte solista, 
                sebbene nel manoscritto vi siano alcune indicazioni per i passaggi orchestrali.
              </p>

              <div className="bg-slate-900/50 p-4 rounded-lg border-l-2 border-blue-500">
                <p className="text-sm">
                  Il concerto è talvolta indicato come <strong className="text-slate-200">Concerto per pianoforte n. 0</strong>, 
                  poiché precedeva tutti gli altri concerti per pianoforte di Beethoven; <strong>viene eseguito raramente</strong>. 
                  I pianisti Howard Shelley, Ronald Brautigam e Philippos Tsalachouris, così come il musicologo e compositore svizzero 
                  Willy Hess, hanno ciascuno la propria ricostruzione del concerto.
                </p>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg">
                <h4 className="text-base font-semibold text-slate-100 mb-3">Struttura</h4>
                <p className="mb-3">L'opera è suddivisa in tre movimenti:</p>
                <ol className="space-y-1.5 list-decimal list-inside">
                  <li><strong>Allegro moderato</strong></li>
                  <li><strong>Larghetto</strong></li>
                  <li><strong>Rondò - Allegretto</strong></li>
                </ol>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border-l-2 border-blue-500">
                <p className="text-sm text-slate-200">
                  <strong>Nota storica:</strong> Beethoven molto probabilmente compose questo concerto nel 1784, quando era ancora a Bonn. 
                  In questo periodo, Mozart non aveva ancora composto le sue Sinfonie n. 39, 40 e 41.  
                
                </p>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-700 flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3 rounded-lg overflow-hidden border border-slate-600">
                  <img
                    src="/images/beethoven-young-contested.jpg"
                    alt="Ritratto contestato del giovane Beethoven"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 space-y-2 text-sm text-slate-300">
                  <p className="text-sm text-slate-400 uppercase tracking-wide">Ritratto contestato del tredicenne Beethoven</p>
                  <p>
                    Anonimo pittore di Bonn, olio su tela intorno al 1783: il museo definisce l’opera come il primo ritratto autentico di Beethoven, raffigurando un tredicenne già attivo come organista, strumentista e compositore per la corte di Bonn.
                  </p>
                  <p>
                    La Beethoven-Haus contesta tale identificazione, sostenendo che l’immagine ritrae un giovane sconosciuto dipinto all’inizio dell’Ottocento, ma la leggenda del bambino prodigio continua a circondare il quadro.
                  </p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Lo sapevi che... <br/>Per anni Beethoven credette di essere nato nel 1772 perché il padre Johann van Beethoven aveva modificato la sua data di nascita per presentarlo al pubblico come bambino prodigio e guadagnare attenzione dai mecenati.
                  </p>
                  <p className="text-sm text-slate-500">
                    Tecnica: olio su tela · Datazione: c. 1783
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border border-blue-500/30 mt-4">
                <h4 className="text-base font-semibold text-slate-100 mb-2 flex items-center">
                  <span className="mr-2">🎵</span>
                  Ascolta l'esecuzione
                </h4>
                <p className="text-sm text-slate-300 mb-3">
                  Berlin Chamber Orchestra diretta da Peter Gülke, con Eva Ander al pianoforte
                </p>
                <a
                  href="http://youtube.com/watch?v=0c5dWB2gFLY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  Ascolta su YouTube
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente PDF Score Viewer con scroll continuo
const PdfScoreViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [pdfError, setPdfError] = useState(false);

  // Percorso del PDF
  const pdfUrl = '/spartito-primo-movimento.pdf';

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPdfError(false);
  }

  function onDocumentLoadError(error) {
    console.error('Errore caricamento PDF:', error);
    setPdfError(true);
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="mt-8 pt-6 border-t border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-slate-100 flex items-center">
          <FileText className="w-5 h-5 text-blue-400 mr-2" />
          Spartito del Primo Movimento
        </h4>
      </div>

      {pdfError ? (
        <div className="bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 mb-2">
            File PDF non trovato. Aggiungi il file <code className="bg-slate-700 px-2 py-1 rounded text-blue-400">spartito-primo-movimento.pdf</code> nella cartella <code className="bg-slate-700 px-2 py-1 rounded text-blue-400">public/</code>
          </p>
          <p className="text-slate-400 text-sm">
            Il file deve essere nella cartella <code className="bg-slate-700 px-1 rounded">beethoven-app/public/</code>
          </p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          {/* Controlli */}
          <div className="bg-slate-700 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-slate-200 text-sm font-medium">
              {numPages ? `${numPages} pagine` : 'Caricamento...'}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Riduci zoom"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-slate-200 text-sm font-medium px-2">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Aumenta zoom"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Visualizzatore PDF con scroll continuo */}
          <div className="bg-slate-900 p-4 max-h-200 overflow-y-auto">
            <div className="flex flex-col items-center gap-6">
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="text-slate-400 text-center py-12">
                    <FileText className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                    Caricamento spartito...
                  </div>
                }
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="shadow-lg mb-4">
                    <Page
                      pageNumber={index + 1}
                      scale={scale}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Modal
const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/70 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-600">
          <div className="sticky top-0 z-10 bg-slate-700 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-3xl font-bold leading-none transition-colors"
            >
              ×
            </button>
          </div>
          <div className="p-6 text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Tooltip
const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);
  
  const handleInteraction = (e) => {
    if (isTouchDevice) {
      e.preventDefault();
      setIsVisible(!isVisible);
    }
  };
  
  return (
    <span className="relative inline-block group">
      <span 
        onClick={handleInteraction}
        onMouseEnter={() => !isTouchDevice && setIsVisible(true)}
        onMouseLeave={() => !isTouchDevice && setIsVisible(false)}
      >
        {children}
      </span>
      {isVisible && (
        <span className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-3 bg-slate-950 text-slate-100 text-sm rounded-lg shadow-2xl max-w-[90vw] sm:max-w-sm z-50 border-2 border-slate-700 pointer-events-none">
          {text}
          {isTouchDevice && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
              className="absolute top-1 right-2 text-slate-400 hover:text-slate-200 text-lg font-bold pointer-events-auto"
            >
              ×
            </button>
          )}
        </span>
      )}
      {isVisible && isTouchDevice && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsVisible(false)}
        />
      )}
    </span>
  );
};

const AnalysisSection = ({ setActiveTab, setGlossaryFocus }) => {
  const [openMovement, setOpenMovement] = useState(1);
  const [modalContent, setModalContent] = useState(null);
  
  const toggleMovement = (id, event) => {
    const isOpening = openMovement !== id;
    setOpenMovement(openMovement === id ? null : id);
    if (isOpening && event && event.currentTarget) {
      setTimeout(() => {
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };
  
  const openModal = (title, content) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };
  
  const AnalisiPrimoMovimentoModal = () => (
    <div className="space-y-4 text-sm text-slate-300">
      <p className="text-base text-slate-200">
        Il primo movimento è il più complesso, strutturato secondo la <strong>Forma di Sonata per Concerto</strong>.
      </p>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Esposizione 1 (Orchestra)</h4>
        <div className="space-y-2">
          <p>
            Il movimento apre con un <strong>tema "marziale" e scarno</strong>, esposto <em>piano</em> dagli archi all'unisono 
            (Do-Mib-Sol...). Questo tema definisce il carattere "eroico" e severo.
          </p>
          <p>
            Dopo una transizione che collassa in minore, appare il <strong>Secondo Tema in Mib maggiore</strong> — 
            una <strong>modulazione insolita</strong> per un Esposizione 1, che normalmente resta in tonica. 
            Questa "finta" mozartiana crea <strong>instabilità già nella prima esposizione</strong>. 
            Il tema è più lirico e cantabile, affidato a violini e clarinetti.
          </p>
          <p>
            Il Esposizione si chiude con una sezione cadenzale forte che crea grande aspettativa per l'ingresso del solista.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Solo 1 (Esposizione del pianoforte)</h4>
        <div className="space-y-2">
          <p>
            <strong className="text-slate-200">L'Entrata:</strong> il pianoforte entra con <strong>tre potenti scale ascendenti</strong> 
            in <em>fortissimo</em> (do-do-do), un gesto di "sfida" che afferma la sua autorità di protagonista. Non è un'entrata dolce 
            o preparatoria, ma un'<strong>affermazione di potenza</strong>.
          </p>
          <p>
            Il solista riprende poi il tema principale ma lo elabora immediatamente, dimostrando che il "composto" (l'individuo) 
            non è semplicemente subordinato alla "massa" (l'orchestra).
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-base font-semibold text-slate-200 mb-3">Sviluppo e Ripresa</h4>
        <p>
          Lo sviluppo elabora i temi con grande <strong>tensione drammatica</strong>. Nella ripresa, c'è un momento essenziale 
          dopo la Cadenza (il momento di improvvisazione solistica).
        </p>
      </div>

      <div className="bg-slate-900 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-base font-semibold text-slate-200 mb-3">La Coda (innovazione fondamentale)</h4>
        <div className="space-y-2">
          <p>
            Tradizionalmente, dopo la cadenza, l'orchestra chiudeva il movimento da sola. Qui, invece, <strong>Beethoven fa rientrare 
            il pianoforte</strong>.
          </p>
          <p>
            Il <strong>trillo finale della cadenza</strong> non risolve in un <em>tutti</em> trionfale, ma viene "soffocato" 
            (choked back) in un <em>pianissimo</em> misterioso. Il pianoforte continua a suonare <strong>arpeggi vibranti</strong> mentre 
            i timpani scandiscono il ritmo del tema principale, creando un effetto di <strong>tensione e mistero</strong> prima dell'esplosione finale.
          </p>
          <p className="text-slate-100 font-semibold">
            Questo estende il ruolo del solista fino all'ultimissima battuta, anticipando le soluzioni del Quarto e Quinto concerto.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Sezione Hero con immagine principale */}
      <div className="mb-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Analisi Musicale</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
              Un viaggio attraverso la struttura formale del Concerto n. 3. 
              Scopri l'architettura sonora, i temi, le modulazioni e le innovazioni 
              che rendono questo capolavoro un punto di svolta nella storia della musica.
            </p>
            <ul className="space-y-2 text-blue-200 text-sm list-none">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">→</span>
                <p className="flex-1 leading-relaxed">
                  3 movimenti: Allegro con brio • Largo • Rondò. Allegro
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">→</span>
                <p className="flex-1 leading-relaxed">
                  Forma di sonata per concerto con doppia esposizione e cadenza solista
                </p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">→</span>
                <p className="flex-1 leading-relaxed">
                  Tonalità principale: Do minore (relativa minore di Mi♭ maggiore)
                </p>
              </li>
            </ul>
            <button
              onClick={() => setActiveTab('glossary')}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
            >
              Approfondisci
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="relative h-80 md:h-auto min-h-80">
            <img 
              src="/images/beethoven-analysis.jpg" 
              alt="Frontespizio della prima edizione del Concerto n. 3"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <p className="absolute bottom-4 left-4 text-xs text-slate-400 italic bg-slate-900/60 px-3 py-1 rounded">
              Frontespizio della prima edizione del concerto
            </p>
          </div>
        </div>
      </div>

      {/* Organico orchestrale con visual migliorato */}
      <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
        <h3 className="text-2xl font-bold text-slate-100 mb-6 flex items-center">
          <Music className="w-6 h-6 mr-3 text-blue-400" />
          Organico Orchestrale
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
              Legni
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                2 Flauti
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                2 Oboi
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                2 Clarinetti in Sib
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                2 Fagotti
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
              Ottoni
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-amber-400 mr-2">•</span>
                2 Corni in Mib, Mi e Do
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-2">•</span>
                2 Trombe in Do
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Percussioni
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                Timpani
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 p-5 rounded-lg border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <h4 className="text-base font-semibold text-slate-200 mb-3 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Archi
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Violini I e II
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Viole
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Violoncelli
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                Contrabbassi
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-5 border border-blue-700/30">
          <div className="flex items-start">
            <Music className="w-5 h-5 text-blue-400 mr-3 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-slate-200 mb-1">Solista</h4>
              <p className="text-sm text-slate-300">Pianoforte</p>
            </div>
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
              <div className="p-6 pt-24 bg-slate-900">
                <p className="text-base text-slate-200 mb-4 pb-4 border-b border-slate-700">{mov.desc}</p>
                
                {mov.isTable ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="border border-slate-600 p-3 text-left text-slate-200 font-semibold">Sezione</th>
                          <th className="border border-slate-600 p-3 text-left text-slate-200 font-semibold">Sottosezione</th>
                          <th className="border border-slate-600 p-3 text-left text-slate-200 font-semibold">Battute</th>
                          <th className="border border-slate-600 p-3 text-left text-slate-200 font-semibold">Descrizione</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mov.tableData.map((row, idx) => (
                          <tr key={idx} className="bg-slate-800/50">
                            {row.sezione && (
                              <td className="border border-slate-600 p-3 font-semibold text-slate-100 align-top" rowSpan={row.rowSpan || 1}>
                                {row.sezione}
                              </td>
                            )}
                            <td className="border border-slate-600 p-3 text-slate-300 align-top">
                              <strong>{row.sottosezione}</strong>
                            </td>
                            <td className="border border-slate-600 p-3 text-slate-300 align-top whitespace-nowrap">
                              {row.battute}
                            </td>
                            <td className="border border-slate-600 p-3 text-slate-300 whitespace-pre-line">
                              {row.descrizione}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {mov.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-slate-300">
                        <ChevronRight className="w-4 h-4 text-blue-400 mr-2 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {mov.hasModal && (
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => openModal('Analisi Dettagliata del Primo Movimento', <AnalisiPrimoMovimentoModal />)}
                      className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center group"
                    >
                      Approfondisci
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
                
                {/* PDF Viewer per lo spartito - solo per il primo movimento */}
                {mov.id === 1 && <PdfScoreViewer />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analisi Dettagliata movimenti - ORA NEI MODALI */}
      
      {/* Modal generico */}
      {modalContent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={closeModal}>
          <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl border border-slate-600 my-8" onClick={(e) => e.stopPropagation()}>
            <div className="bg-slate-700 p-4 rounded-t-lg flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white">{modalContent.title}</h2>
              <button onClick={closeModal} className="text-white hover:text-slate-300 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
              {modalContent.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InterpretersSection = () => {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category, event) => {
    const isOpening = openCategory !== category;
    setOpenCategory(openCategory === category ? null : category);
    if (isOpening && event && event.currentTarget) {
      setTimeout(() => {
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Suddivisione interpreti per categoria
  const historicalInterpreters = interpretersData.filter(int => 
    ['1933', '1957', '1959', '1961', '1973', '1979 (circa)'].includes(int.year)
  );
  
  const fortepianoInterpreters = interpretersData.filter(int => 
    ['1988', '2000 (circa)'].includes(int.year)
  );
  
  const contemporaryInterpreters = interpretersData.filter(int => 
    ['1989', '2004 (Live a Ferrara)', '2005', '2007, 2012', '2011', '2019'].includes(int.year)
  );

  const renderInterpreterCard = (interpreter, idx) => (
    <div key={idx} className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
      <div className="bg-slate-700 p-5">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{interpreter.name}</h3>
            {interpreter.bio && (
              <p className="text-slate-300 text-xs italic mb-2">{interpreter.bio}</p>
            )}
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
        <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
          <span className="inline-block bg-slate-800/50 text-slate-200 px-3 py-1 rounded-full text-xs font-medium">
            Stile: {interpreter.style}
          </span>
          {interpreter.link && (
            <a
              href={interpreter.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              Ascolta su YouTube
            </a>
          )}
        </div>
        {interpreter.rating && (
          <div className="mb-3 text-yellow-400 text-sm font-semibold">
            {interpreter.rating}
          </div>
        )}
        <p className="text-slate-300 text-sm leading-relaxed">
          {interpreter.cadenzaLink ? (
            <>
              {interpreter.description.split('a min. 12:51 del video')[0]}
              <a 
                href={interpreter.cadenzaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-slate-200 underline font-semibold"
              >
                a min. 12:51 del video
              </a>
              {interpreter.description.split('a min. 12:51 del video')[1]}
            </>
          ) : (
            interpreter.description
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Header con immagine */}
      <div className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">Interpretazioni del Concerto</h2>
            <p className="text-slate-300 leading-relaxed">
              Un viaggio attraverso le grandi registrazioni che hanno segnato la storia dell'interpretazione, 
              dalle leggendarie incisioni storiche alle esecuzioni filologiche su fortepiano, 
              fino alle performance contemporanee di riferimento.
            </p>
          </div>
          <div className="relative h-80 md:h-auto min-h-80">
            <img 
              src="/images/interpreters-hero.jpg" 
              alt="Grandi interpreti del Concerto n. 3"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <p className="absolute bottom-4 left-4 text-xs text-slate-400 italic bg-slate-900/60 px-3 py-1 rounded">
              Krystian Zimerman con i Wiener Philharmoniker
            </p>
          </div>
        </div>
      </div>

      {/* Interpretazioni Storiche */}
      <div className="mb-6 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        <button
          onClick={(e) => toggleCategory('historical', e)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-900/30 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Interpretazioni Storiche (1933-1979)</h3>
              <p className="text-slate-400 text-sm">Le registrazioni leggendarie del XX secolo</p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${openCategory === 'historical' ? 'rotate-180' : ''}`} />
        </button>
        
        {openCategory === 'historical' && (
          <div className="p-6 pt-0 bg-slate-900">
            <div className="grid gap-6 mt-6">
              {historicalInterpreters.map((interpreter, idx) => renderInterpreterCard(interpreter, idx))}
            </div>
          </div>
        )}
      </div>

      {/* Interpretazioni con Fortepiano */}
      <div className="mb-6 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        <button
          onClick={(e) => toggleCategory('fortepiano', e)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Interpretazioni con Fortepiano (1988-2000)</h3>
              <p className="text-slate-400 text-sm">Approccio filologico su strumenti d'epoca</p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${openCategory === 'fortepiano' ? 'rotate-180' : ''}`} />
        </button>
        
        {openCategory === 'fortepiano' && (
          <div className="p-6 pt-0 bg-slate-900">
            <div className="grid gap-6 mt-6">
              {fortepianoInterpreters.map((interpreter, idx) => renderInterpreterCard(interpreter, idx))}
            </div>
          </div>
        )}
      </div>

      {/* Interpretazioni Contemporanee */}
      <div className="mb-6 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
        <button
          onClick={(e) => toggleCategory('contemporary', e)}
          className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Interpretazioni Contemporanee (1989-2019)</h3>
              <p className="text-slate-400 text-sm">Le registrazioni moderne di riferimento</p>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform ${openCategory === 'contemporary' ? 'rotate-180' : ''}`} />
        </button>
        
        {openCategory === 'contemporary' && (
          <div className="p-6 pt-0 bg-slate-900">
            <div className="grid gap-6 mt-6">
              {contemporaryInterpreters.map((interpreter, idx) => renderInterpreterCard(interpreter, idx))}
            </div>
          </div>
        )}
      </div>

    {/* Tabella Riepilogo */}
    <div className="mt-10 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
      <div className="bg-slate-700 p-5">
        <h3 className="text-xl font-semibold text-white">📊 Riepilogo Rapido</h3>
      </div>
      <div className="p-5 bg-slate-900 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-800 text-slate-200 uppercase tracking-wide text-xs">
            <tr>
              <th className="border border-slate-700 px-3 py-2 text-left font-semibold">Interprete</th>
              <th className="border border-slate-700 px-3 py-2 text-left font-semibold">Direttore</th>
              <th className="border border-slate-700 px-3 py-2 text-left font-semibold">Anno</th>
              <th className="border border-slate-700 px-3 py-2 text-left font-semibold">Stile</th>
              <th className="border border-slate-700 px-3 py-2 text-center font-semibold">Link</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Schnabel</strong></td>
              <td className="border border-slate-700 px-3 py-2">Sargent</td>
              <td className="border border-slate-700 px-3 py-2">1933</td>
              <td className="border border-slate-700 px-3 py-2">Storico, Profondo</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/t8z_HiusIL0?si=OO0KRH7dtutylzhs" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Arrau</strong></td>
              <td className="border border-slate-700 px-3 py-2">Klemperer</td>
              <td className="border border-slate-700 px-3 py-2">1957</td>
              <td className="border border-slate-700 px-3 py-2">Monumentale</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/iLzjlH9_a6M?si=Wk5cyeFfsx3880nA" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Gould</strong></td>
              <td className="border border-slate-700 px-3 py-2">Bernstein</td>
              <td className="border border-slate-700 px-3 py-2">1959</td>
              <td className="border border-slate-700 px-3 py-2">Eccentrico</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=vRSCAHDS12g" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Kempff</strong></td>
              <td className="border border-slate-700 px-3 py-2">Leitner</td>
              <td className="border border-slate-700 px-3 py-2">1961</td>
              <td className="border border-slate-700 px-3 py-2">Poetico, Classico</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=3aNkl7wdWyQ" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Rubinstein</strong></td>
              <td className="border border-slate-700 px-3 py-2">Haitink</td>
              <td className="border border-slate-700 px-3 py-2">1973</td>
              <td className="border border-slate-700 px-3 py-2">Nobile</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/44a2kZ72RzY?si=7dcdXf7FipvyYkQ1" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Michelangeli</strong></td>
              <td className="border border-slate-700 px-3 py-2">Giulini</td>
              <td className="border border-slate-700 px-3 py-2">1979</td>
              <td className="border border-slate-700 px-3 py-2">Cristallino</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/rnXpoCoCBk0?si=bpaPZrPIzFczt5F_" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Lubin</strong></td>
              <td className="border border-slate-700 px-3 py-2">Hogwood</td>
              <td className="border border-slate-700 px-3 py-2">1988</td>
              <td className="border border-slate-700 px-3 py-2">Filologico</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=SiokgMpfyQw" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Zimerman</strong></td>
              <td className="border border-slate-700 px-3 py-2">Bernstein</td>
              <td className="border border-slate-700 px-3 py-2">1989</td>
              <td className="border border-slate-700 px-3 py-2">Virtuosistico</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/TAhZkggFL2w?si=BR_EQis6QbeYVMhB" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Pires</strong></td>
              <td className="border border-slate-700 px-3 py-2">Brüggen</td>
              <td className="border border-slate-700 px-3 py-2">2000</td>
              <td className="border border-slate-700 px-3 py-2">Filologico, Poetico</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=hR95EK9fEKo" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Argerich</strong></td>
              <td className="border border-slate-700 px-3 py-2">Abbado</td>
              <td className="border border-slate-700 px-3 py-2">2004</td>
              <td className="border border-slate-700 px-3 py-2">Focoso</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=AC4u-sBN3OI" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Brendel</strong></td>
              <td className="border border-slate-700 px-3 py-2">Abbado</td>
              <td className="border border-slate-700 px-3 py-2">2005</td>
              <td className="border border-slate-700 px-3 py-2">Intellettuale</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=8LuqVBUZN_4" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Barenboim</strong></td>
              <td className="border border-slate-700 px-3 py-2">Pappano/Mehta</td>
              <td className="border border-slate-700 px-3 py-2">2007</td>
              <td className="border border-slate-700 px-3 py-2">Profondo</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/UXGy1bpEAUw?si=dYYxQ1hh4UYHBUFI" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Say</strong></td>
              <td className="border border-slate-700 px-3 py-2">Noseda</td>
              <td className="border border-slate-700 px-3 py-2">2011</td>
              <td className="border border-slate-700 px-3 py-2">Creativo</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://youtu.be/a0ixaGeQzME?si=FIa82djieyaktNdb" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/50 transition-colors">
              <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Lisiecki</strong></td>
              <td className="border border-slate-700 px-3 py-2">(Dir. piano)</td>
              <td className="border border-slate-700 px-3 py-2">2019</td>
              <td className="border border-slate-700 px-3 py-2">Fresco</td>
              <td className="border border-slate-700 px-3 py-2 text-center">
                <a href="https://www.youtube.com/watch?v=MX5XENd0SeM" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Link</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

const GlossarySection = ({ focusCategory, onFocusConsumed }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const [openConcertoHistory, setOpenConcertoHistory] = useState(false);
  const [openRondoForm, setOpenRondoForm] = useState(false);
  const [openSonataForm, setOpenSonataForm] = useState(false);
  const [openCadenzaForm, setOpenCadenzaForm] = useState(false);
  const [openFugatoForm, setOpenFugatoForm] = useState(false);
  const [openPersonaggi, setOpenPersonaggi] = useState(false);

  useEffect(() => {
    if (!focusCategory) return;
    const targetIdx = glossaryData.findIndex((cat) => cat.category === focusCategory);
    if (targetIdx >= 0) {
      setOpenCategory(targetIdx);
    }
    // scroll the category into view centered vertically
    if (targetIdx >= 0) {
      setTimeout(() => {
        const el = document.querySelector(`[data-gloss-cat=\"${targetIdx}\"]`);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    }
    // Open only the subpanel relevant to the requested focusCategory.
    // Previously both Sonata and Rondò were opened unconditionally which
    // caused links to always expand the Rondò panel.
    if (focusCategory === 'Rondò' || /rondo|rondò/i.test(focusCategory)) {
      setOpenRondoForm(true);
    } else if (/sonata|sonata/i.test(focusCategory) || focusCategory === 'Forma Sonata' || focusCategory === 'Forma Sonata per Concerto') {
      setOpenSonataForm(true);
    } else if (focusCategory === 'Cadenza' || /cadenza/i.test(focusCategory)) {
      setOpenCadenzaForm(true);
    } else if (focusCategory === 'Fugato' || /fugato/i.test(focusCategory)) {
      setOpenFugatoForm(true);
    } else {
      // default: do not force-open specific form panels (e.g., for 'Tonalità e Armonia')
    }
    if (onFocusConsumed) {
      onFocusConsumed();
    }
  }, [focusCategory, onFocusConsumed]);

  const toggleCategory = (category, event) => {
    const isOpening = openCategory !== category;
    setOpenCategory(openCategory === category ? null : category);
    if (isOpening && event && event.currentTarget) {
      setTimeout(() => {
        event.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Glossario Musicale</h2>
        <p className="text-slate-300">Scopri i termini tecnici del Concerto Op. 37</p>
      </div>

      {/* Immagine di copertina */}
      <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
        <img
          src="/images/beethoven-conducting-orchestra.jpg"
          alt="Beethoven dirige un'orchestra nonostante la sordità"
          className="w-full h-64 object-contain rounded-lg"
        />
        <p className="text-xs text-slate-400 mt-3 italic text-center">
          Ludwig van Beethoven dirige un'orchestra nonostante la sordità.<br/>
          <span className="text-slate-500">Scuola francese, XIX secolo - da "Le leggende dell'arte: Musicisti" (Parigi, ca. 1890)</span>
        </p>
      </div>

      {/* Banner Sezione Forme Musicali */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-5 rounded-lg border-2 border-blue-600/50">
        <h3 className="text-xl font-bold text-blue-100 flex items-center gap-3 mb-2">
          <Music className="w-6 h-6" />
          🎼 Forme e Strutture Musicali
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Teoria musicale del Concerto: dalla storia del genere alle forme classiche (Sonata e Rondò),
          fino alle tecniche compositive come la Cadenza e il Fugato utilizzate da Beethoven nell'Op. 37.
        </p>
      </div>

      {/* Approfondimento: Storia del Concerto */}
      <div className="mb-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-blue-500/50">
        <button
          onClick={() => setOpenConcertoHistory(!openConcertoHistory)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openConcertoHistory
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-orange-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">📖 Che cos'è il Concerto? Storia ed evoluzione del genere</h3>
              <span className="text-sm opacity-90">Dal Barocco al Novecento</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openConcertoHistory ? 'rotate-180' : ''}`} />
        </button>
        {openConcertoHistory && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-5 text-sm text-slate-300">
              {/* Etimologia */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-orange-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Etimologia e concetto</h4>
                <p className="mb-3">
                  Il termine <strong>"Concerto"</strong> possiede un'etimologia doppia e apparentemente contraddittoria:
                </p>
                <ul className="space-y-2 list-disc list-inside text-xs">
                  <li>Dal latino <em>concertare</em> = <strong>combattere, gareggiare</strong></li>
                  <li>Dall'italiano <em>concertare</em> = <strong>accordarsi, agire insieme</strong></li>
                </ul>
                <p className="mt-3 text-slate-200">
                  Il concerto è basato sulla <strong>relazione tra due entità</strong>: un solista (o piccolo gruppo) 
                  e un ensemble più ampio (orchestra). Questa relazione si è evoluta attraverso tre fasi:
                </p>
              </div>

              {/* Tre Fasi */}
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-slate-800 p-3 rounded border-l-2 border-blue-500">
                  <h5 className="font-semibold text-slate-200 text-xs mb-1">1. Polarità (Barocco)</h5>
                  <p className="text-xs">Netta distinzione tra Solo e Tutti</p>
                </div>
                <div className="bg-slate-800 p-3 rounded border-l-2 border-blue-500">
                  <h5 className="font-semibold text-slate-200 text-xs mb-1">2. Reciprocità (Classico)</h5>
                  <p className="text-xs">Dialogo drammatico paritario</p>
                </div>
                <div className="bg-slate-800 p-3 rounded border-l-2 border-orange-500">
                  <h5 className="font-semibold text-slate-200 text-xs mb-1">3. Diffusività (Romantico)</h5>
                  <p className="text-xs">Fusione sinfonica o lotta eroica</p>
                </div>
              </div>

              {/* Tabella Storica */}
              <div className="overflow-x-auto">
                <h4 className="text-base font-semibold text-slate-100 mb-3">Cronologia dello sviluppo</h4>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-700 text-slate-100">
                      <th className="border border-slate-600 p-2 text-left">Periodo</th>
                      <th className="border border-slate-600 p-2 text-left">Tipologia</th>
                      <th className="border border-slate-600 p-2 text-left">Compositori chiave</th>
                      <th className="border border-slate-600 p-2 text-left">Note evolutive</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300">
                    <tr>
                      <td className="border border-slate-600 p-2 font-semibold">Tardo XVI-XVII</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Concerto Ecclesiastico/Vocale</strong><br/>
                        Unione di voci e strumenti
                      </td>
                      <td className="border border-slate-600 p-2">A. & G. Gabrieli (1587)<br/>Viadana, Schütz</td>
                      <td className="border border-slate-600 p-2 text-xs">"Concerto" = eseguire insieme, contesto sacro</td>
                    </tr>
                    <tr className="bg-slate-800/50">
                      <td className="border border-slate-600 p-2 font-semibold">Fine XVII (Barocco)</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Concerto Strumentale</strong><br/>
                        • Concerto Grosso<br/>
                        • Concerto Solistico
                      </td>
                      <td className="border border-slate-600 p-2">
                        <strong>Torelli</strong> (Op. 5, 1692)<br/>
                        <strong>Corelli</strong> (Op. 6)
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">Torelli inventa la distinzione Solo/Tutti</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-600 p-2 font-semibold">Primo XVIII (Alto Barocco)</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Forma Esposizione</strong><br/>
                        3 movimenti (V-L-V)<br/>
                        Esposizione orchestrale + episodi solistici
                      </td>
                      <td className="border border-slate-600 p-2">
                        <strong>Vivaldi</strong> (codifica la forma)<br/>
                        <strong>J.S. Bach</strong> (Brandeburghesi)
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">Bach integra solo e tutti, riduce polarità</td>
                    </tr>
                    <tr className="bg-slate-700/30">
                      <td className="border border-slate-600 p-2 font-semibold text-slate-200">Tardo XVIII (Classico)</td>
                      <td className="border border-slate-600 p-2">
                        <strong className="text-slate-200">Concerto Classico</strong><br/>
                        <strong>Forma di Sonata</strong><br/>
                        Doppia Esposizione:<br/>
                        1. Esposizione 1 (orchestra)<br/>
                        2. Solo 1 (modulante)
                      </td>
                      <td className="border border-slate-600 p-2 text-slate-200">
                        <strong>Mozart</strong> (K. 466, K. 491)<br/>
                        J.C. Bach<br/>
                        <strong>Beethoven</strong> (Op. 15, 19, 37)
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">Il solista diventa interlocutore drammatico paritario</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-600 p-2 font-semibold">Primo XIX (Transizione)</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Concerto "Eroico" e Sinfonico</strong><br/>
                        Espansione monumentale<br/>
                        Solista come eroe
                      </td>
                      <td className="border border-slate-600 p-2">
                        <strong>Beethoven</strong> (Op. 37, 58, 73)<br/>
                        Weber, Spohr
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">
                        Beethoven: solista entra prima (n.4, n.5)<br/>
                        Cadenza scritta (elimina improvvisazione)
                      </td>
                    </tr>
                    <tr className="bg-slate-800/50">
                      <td className="border border-slate-600 p-2 font-semibold">XIX (Romantico)</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Virtuosismo</strong><br/>
                        Abolizione Doppia Esposizione<br/>
                        Eliminazione Tutti iniziale
                      </td>
                      <td className="border border-slate-600 p-2">
                        <strong>Mendelssohn</strong> (1844)<br/>
                        <strong>Liszt</strong> (cicli)<br/>
                        Schumann, Brahms
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">
                        Mendelssohn elimina Esposizione 1<br/>
                        Concerto in 1 movimento (Liszt)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-600 p-2 font-semibold">XX (Moderno)</td>
                      <td className="border border-slate-600 p-2">
                        <strong>Diversificazione</strong><br/>
                        Neoclassicismo<br/>
                        Sperimentazione
                      </td>
                      <td className="border border-slate-600 p-2">
                        <strong>Stravinsky</strong><br/>
                        Bartók, Ravel, Schoenberg
                      </td>
                      <td className="border border-slate-600 p-2 text-xs">Ritorno a modelli barocchi o trattamenti cameristici</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Analisi Evolutiva */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-slate-100">Analisi dello sviluppo</h4>
                
                <div className="bg-slate-800/50 p-3 rounded">
                  <h5 className="font-semibold text-slate-200 text-sm mb-2">1. Barocco: polarità e esposizione</h5>
                  <p className="text-xs">
                    In Vivaldi e Torelli, il concerto si basa sull'<strong>architettura</strong>. L'orchestra stabilisce 
                    la tonalità con un <strong>Esposizione</strong> ricorrente. Il solista suona episodi virtuosistici 
                    modulanti tra i ritornelli. Forma additiva, alternanza netta.
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded">
                  <h5 className="font-semibold text-slate-200 text-sm mb-2">2. Classico: forma-Sonata e Doppia Esposizione</h5>
                  <p className="text-xs mb-2">
                    Mozart e Beethoven assorbono la <strong>Forma-Sonata</strong>.
                  </p>
                  <ul className="space-y-1 text-xs list-disc list-inside ml-2">
                    <li>L'orchestra apre con quasi-esposizione completa (Esposizione 1), ma resta in tonica</li>
                    <li>Il solista ri-espone (Solo 1), modulando alla tonalità secondaria</li>
                    <li>Mozart trasforma la polarità barocca in <strong>dialogo paritario</strong></li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-3 rounded">
                  <h5 className="font-semibold text-slate-200 text-sm mb-2">3. Romantico: abolizione del esposizione</h5>
                  <p className="text-xs mb-2">
                    Mendelssohn e Liszt considerano il lungo Tutti iniziale "arcaico e ridondante":
                  </p>
                  <ul className="space-y-1 text-xs list-disc list-inside ml-2">
                    <li>Il concerto inizia subito con il solista</li>
                    <li>Fine della doppia esposizione</li>
                    <li><strong>Biforcazione:</strong> concerto virtuosistico (Paganini) vs sinfonico (Brahms)</li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 p-3 rounded border-l-2 border-blue-500">
                  <h5 className="font-semibold text-slate-200 text-sm mb-2">🎭 Il Concerto come metafora sociale</h5>
                  <p className="text-xs mb-2">
                    Il concerto rappresenta l'individuo (solista) contro o insieme alla società (orchestra):
                  </p>
                  <ul className="space-y-1 text-xs ml-2">
                    <li>• <strong>Mozart:</strong> dialogo ideale e cooperazione</li>
                    <li>• <strong>Beethoven:</strong> l'eroe che si afferma e guida (scale imperiose, Op. 37)</li>
                    <li>• <strong>Romanticismo:</strong> il virtuoso soprannaturale domina la massa (Paganini)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approfondimento: la Forma Rondò */}
      <div className="mb-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-blue-500/50">
        <button
          onClick={() => setOpenRondoForm(!openRondoForm)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openRondoForm
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">🎵 La Forma Rondò</h3>
              <span className="text-sm opacity-90">Struttura e utilizzo nei concerti classici</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openRondoForm ? 'rotate-180' : ''}`} />
        </button>
        {openRondoForm && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-5 text-sm text-slate-300">
              
              {/* Struttura Generale */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Struttura generale del Rondò</h4>
                <p className="mb-3">
                  La forma rondò è una delle strutture fondamentali della musica strumentale classica, utilizzata prevalentemente 
                  nei <strong>movimenti finali</strong> (e talvolta nei movimenti lenti) di sonate, sinfonie e concerti.
                </p>
                <p className="mb-3">
                  Il principio di base è l'<strong>alternanza regolare</strong> tra un tema principale, detto <strong>refrain</strong> 
                  (o esposizione), e sezioni contrastanti dette <strong>couplets</strong> (o episodi). Il refrain viene esposto 
                  nella tonalità d'impianto e ritorna più volte, mentre gli episodi sono solitamente in tonalità diverse e 
                  offrono materiale contrastante.
                </p>
                
                <div className="bg-slate-900/50 p-3 rounded mt-3">
                  <h5 className="text-sm font-semibold text-slate-200 mb-2">Due categorie principali:</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">1.</span>
                      <div>
                        <strong className="text-slate-200">Rondò a cinque parti (ABACA):</strong> Il refrain (A) si alterna con 
                        due episodi (B e C). Il primo episodio (B) funge da complesso tematico secondario, mentre il secondo (C) 
                        può assumere caratteristiche di sviluppo.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-2 font-bold">2.</span>
                      <div>
                        <strong className="text-slate-200">Sonata-Rondò:</strong> È la forma più complessa e frequente 
                        nei finali veloci classici, specialmente in Mozart e Beethoven. Fonde la struttura del rondò con la 
                        logica della forma sonata.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sonata-Rondò Dettagliato */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">La forma Sonata-Rondò</h4>
                <p className="mb-3">
                  La forma sonata-rondò (classificata nella teoria analitica moderna) 
                  integra l'alternanza tematica del rondò con la tripartizione della sonata (Esposizione, Sviluppo, Ripresa).
                </p>
                
                <div className="bg-slate-900/50 p-3 rounded">
                  <h5 className="text-sm font-semibold text-slate-200 mb-2">Struttura ABACABA:</h5>
                  <div className="space-y-3 text-xs">
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-semibold text-slate-200">Esposizione (A-B)</p>
                      <p>Il primo refrain (A) funge da tema principale. Segue una transizione e il primo episodio (B), 
                      che agisce come gruppo tematico secondario in tonalità subordinata (dominante).</p>
                    </div>
                    <div className="border-l-2 border-orange-500 pl-3">
                      <p className="font-semibold text-slate-200">Sviluppo o Episodio Centrale (C)</p>
                      <p>Il secondo episodio funge da sezione di sviluppo o introduce un nuovo "tema interno" in tonalità 
                      contrastante (sottodominante, sottomediante o modo minore).</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-3">
                      <p className="font-semibold text-slate-200">Ripresa (A-B)</p>
                      <p>Il refrain (A) ritorna, seguito dalla ripresa del primo episodio (B), che viene trasposto 
                      nella tonalità d'impianto (tonica), risolvendo la tensione tonale.</p>
                    </div>
                    <div className="border-l-2 border-amber-500 pl-3">
                      <p className="font-semibold text-slate-200">Coda</p>
                      <p>Spesso segue l'ultimo ritorno del refrain.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rondò nei Concerti (Mozart) */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-amber-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Il Rondò nei Concerti Classici (Mozart)</h4>
                <p className="mb-3">
                  Nel concerto classico, il rondò è la <strong>scelta quasi invariabile per il movimento finale</strong>. 
                  Mozart, in particolare, prediligeva la forma sonata-rondò per i suoi finali, trattandola con grande libertà e inventiva.
                </p>
                
                <div className="bg-slate-900/50 p-3 rounded">
                  <h5 className="text-sm font-semibold text-amber-200 mb-2">Caratteristiche specifiche:</h5>
                  <ul className="space-y-2 text-xs ml-4">
                    <li className="flex items-start">
                      <ChevronRight className="w-3 h-3 text-amber-400 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Carattere del tema:</strong> Il refrain (P) ha spesso carattere "popolare", orecchiabile 
                      e giocoso, talvolta in stile "contredanse"</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-3 h-3 text-amber-400 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Interazione Solo-Tutti:</strong> Il solista espone il refrain, poi ripreso o completato 
                      dall'orchestra. Mozart espande il refrain iniziale trasformandolo in un esposizione orchestrale</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-3 h-3 text-amber-400 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Nuovi temi (sujet libre):</strong> Mozart introduce spesso un "nuovo tema" da parte del 
                      solista all'inizio della transizione, subito dopo il primo esposizione orchestrale</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="w-3 h-3 text-amber-400 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Episodi centrali:</strong> Cambiamenti drastici di carattere (elementi "alla turca", 
                      sezioni in minore)</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rondò in Beethoven */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-red-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Il Rondò in Beethoven</h4>
                <p className="mb-3">
                  Beethoven ereditò i modelli di Haydn e Mozart ma <strong>espanse notevolmente le dimensioni e l'ambizione</strong> 
                  della forma rondò, rendendola spesso più "sinfonica" e drammatica.
                </p>
                
                <div className="bg-slate-900/50 p-3 rounded">
                  <h5 className="text-sm font-semibold text-red-200 mb-2">Elementi distintivi:</h5>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-800/50 p-2 rounded">
                      <p className="font-semibold text-slate-200 mb-1">1. Scherzi sulla struttura</p>
                      <p>Beethoven gioca con le aspettative. Esempio: nella <em>Sonata op. 10 n. 3</em>, introduce un ritorno 
                      del refrain in tonalità "sbagliata" prima di correggerla ("falsa ripresa").</p>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <p className="font-semibold text-slate-200 mb-1">2. Espansione della Coda</p>
                      <p>La coda diventa una sezione di grande peso strutturale, con ulteriore sviluppo dei temi e un'ultima 
                      apparizione del refrain principale. Nella <em>Sonata op. 26</em>, la coda è molto estesa.</p>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <p className="font-semibold text-slate-200 mb-1">3. Integrazione tematica</p>
                      <p>Nei concerti (es. <strong>Concerto per pianoforte n. 3</strong>), integra elementi di virtuosismo 
                      solistico con sviluppo tematico rigoroso, usando la forma sonata-rondò.</p>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <p className="font-semibold text-slate-200 mb-1">4. Spostamento del baricentro</p>
                      <p>Nelle opere tarde, Beethoven (e poi Brahms) sposta il peso espressivo verso il finale, rendendo 
                      il rondò conclusivo non più solo un brano leggero di congedo, ma il <strong>culmine drammatico </strong> 
                      dell'intero ciclo.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 p-3 rounded mt-3 border-l-2 border-red-500">
                  <p className="text-xs">
                    <strong className="text-red-200">Sintesi:</strong> Mentre nel classicismo il rondò era apprezzato per 
                    la sua simmetria e carattere brillante, con Beethoven (e nei concerti maturi di Mozart) la forma divenne 
                    un veicolo per <strong>complesse elaborazioni motiviche e drammatiche</strong>, fondendosi sempre più con 
                    la logica dialettica della forma sonata (Sonata-Rondò).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approfondimento: La Forma Sonata */}
      <div className="mb-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-blue-500/50">
        <button
          onClick={() => setOpenSonataForm(!openSonataForm)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openSonataForm
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">🎼 La Forma Sonata</h3>
              <span className="text-sm opacity-90">Schema del primo movimento (Esposizione-Sviluppo-Ripresa)</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openSonataForm ? 'rotate-180' : ''}`} />
        </button>
        {openSonataForm && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-5 text-sm text-slate-300">
              
              {/* Definizione */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Definizione</h4>
                <p className="mb-3">
                  La <strong>forma sonata</strong> (o forma del primo movimento) è lo schema costruttivo utilizzato prevalentemente 
                  nel primo tempo di sonate, sinfonie e quartetti del periodo classico.
                </p>
                <p className="mb-3">
                  Non va confusa con il <strong>genere sonata</strong>, che indica l'intera opera composta da più movimenti 
                  (solitamente tre o quattro).
                </p>
                <div className="bg-slate-900/50 p-3 rounded mt-3">
                  <p className="text-xs">
                    La struttura si articola in <strong>tre macro-sezioni principali</strong>, che rappresentano un percorso 
                    narrativo di presentazione, conflitto e risoluzione.
                  </p>
                </div>
              </div>

              {/* Le Tre Sezioni */}
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Le tre sezioni principali</h4>
                
                <div className="space-y-3">
                  <div className="bg-slate-900/50 p-3 rounded border-l-2 border-blue-500">
                    <p className="text-sm font-semibold text-slate-200 mb-2">1. Esposizione</p>
                    <p className="text-xs">
                      Ha il compito di <strong>presentare i materiali tematici</strong> e stabilire il <strong>conflitto tonale</strong> 
                      tra la tonalità d'impianto e una tonalità subordinata. Secondo la <em>Sonata Theory</em>, l'obiettivo è 
                      raggiungere la "Chiusura Essenziale dell'Esposizione" (EEC), ovvero la prima cadenza autentica perfetta 
                      soddisfacente nella nuova tonalità.
                    </p>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded border-l-2 border-orange-500">
                    <p className="text-sm font-semibold text-slate-200 mb-2">2. Sviluppo</p>
                    <p className="text-xs">
                      È la sezione dell'<strong>instabilità e dell'elaborazione motivica</strong>. I temi vengono frammentati 
                      e trasformati attraverso modulazioni armoniche. Spesso contiene un "Core" (nucleo) di massima instabilità 
                      preceduto da un "Pre-Core".
                    </p>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded border-l-2 border-blue-500">
                    <p className="text-sm font-semibold text-slate-200 mb-2">3. Ripresa (Recapitolazione)</p>
                    <p className="text-xs">
                      Risolve la <strong>tensione tonale accumulata</strong>. Il materiale dell'esposizione viene riproposto, 
                      ma il Secondo Tema (S) viene ora eseguito nella tonalità d'impianto (Tonica), eliminando il conflitto iniziale.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 p-3 rounded border-l-2 border-blue-500">
                <p className="text-xs">
                  <strong className="text-slate-200">Nota teorica:</strong> Il Concerto per pianoforte n. 3 di Beethoven 
                  utilizza la <strong>Forma di Sonata per Concerto</strong>, una variante che prevede la doppia esposizione 
                  (prima l'orchestra, poi il solista) e l'integrazione della cadenza virtuosistica prima della coda finale.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approfondimento: La Cadenza */}
      <div className="mb-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-blue-500/50">
        <button
          onClick={() => setOpenCadenzaForm(!openCadenzaForm)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openCadenzaForm
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">🎹 La Cadenza</h3>
              <span className="text-sm opacity-90">Improvvisazione virtuosistica del solista</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openCadenzaForm ? 'rotate-180' : ''}`} />
        </button>
        {openCadenzaForm && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-5 text-sm text-slate-300">
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Definizione e funzione</h4>
                <p className="mb-3">
                  La <strong>cadenza</strong> è una sezione virtuosistica per il solista, tradizionalmente improvvisata, 
                  che si colloca tipicamente alla fine del primo movimento, poco prima della coda orchestrale finale.
                </p>
                <p className="mb-3">
                  Nel Concerto n. 3, Beethoven scrisse la propria cadenza (inizialmente improvvisata nelle prime esecuzioni). 
                  È un'area 'protetta' in cui il solista può mostrare il proprio virtuosismo tecnico ed espressivo, 
                  elaborando i temi principali del movimento.
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-amber-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Caratteristiche</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>L'orchestra si ferma su un <strong>punto coronato</strong> (accordo di dominante sospeso)</li>
                  <li>Il solista improvvisa liberamente, senza accompagnamento</li>
                  <li>Elabora i temi principali del movimento con passaggi virtuosistici</li>
                  <li>Conclude con un trillo sulla dominante, segnalando il ritorno dell'orchestra</li>
                </ul>
              </div>

              <div className="bg-blue-900/20 p-3 rounded border-l-2 border-blue-500">
                <p className="text-xs">
                  <strong className="text-slate-200">Nota storica:</strong> Beethoven fu tra i primi compositori a scrivere 
                  le proprie cadenze, invece di lasciarle all'improvvisazione del solista. Questa scelta riflette il desiderio 
                  di controllo totale sulla forma e il contenuto drammatico del concerto.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approfondimento: Il Fugato */}
      <div className="mb-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-blue-500/50">
        <button
          onClick={() => setOpenFugatoForm(!openFugatoForm)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openFugatoForm
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Music className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">🎼 Il Fugato</h3>
              <span className="text-sm opacity-90">Tecnica contrappuntistica imitativa</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openFugatoForm ? 'rotate-180' : ''}`} />
        </button>
        {openFugatoForm && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-5 text-sm text-slate-300">
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-blue-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Definizione</h4>
                <p className="mb-3">
                  Il <strong>fugato</strong> è un passaggio musicale scritto in stile contrappuntistico, dove un tema 
                  viene <strong>imitato tra le voci</strong> diverse, come in una fuga, ma senza seguire rigorosamente 
                  tutte le regole formali della fuga vera e propria.
                </p>
                <p className="mb-3">
                  Nel terzo movimento dell'Op. 37, Beethoven inserisce un elaborato fugato sul tema principale del rondò - 
                  una scelta audace e innovativa che unisce la brillantezza del finale concertistico con la profondità 
                  del contrappunto bachiano.
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border-l-2 border-amber-500">
                <h4 className="text-base font-semibold text-slate-200 mb-3">Caratteristiche nel terzo movimento</h4>
                <ul className="space-y-2 list-disc list-inside text-sm">
                  <li>Il tema principale viene trattato in <strong>imitazione stretta</strong></li>
                  <li>Le voci entrano successivamente, creando una texture densa e complessa</li>
                  <li>Dimostra la padronanza di Beethoven sia dello stile galante che del contrappunto severo</li>
                  <li>Crea un contrasto drammatico con le sezioni più leggere e virtuosistiche</li>
                </ul>
              </div>

              <div className="bg-blue-900/20 p-3 rounded border-l-2 border-blue-500">
                <p className="text-xs">
                  <strong className="text-slate-200">Nota stilistica:</strong> L'uso del fugato in un finale di concerto 
                  è raro nel periodo classico. Beethoven dimostra qui la sua ambizione di elevare il concerto oltre il puro 
                  intrattenimento virtuosistico, fondendo brillantezza e profondità intellettuale.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Banner Sezione Termini */}
      <div className="my-8 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 p-5 rounded-lg border-2 border-emerald-600/50">
        <h3 className="text-xl font-bold text-emerald-100 flex items-center gap-3 mb-2">
          <Library className="w-6 h-6" />
          📚 Terminologia Musicale
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Dizionario rapido dei termini tecnici, tonalità e armonie utilizzati nell'analisi del Concerto Op. 37.
        </p>
      </div>

      <div className="space-y-4">
        {glossaryData.map((category, catIdx) => (
          <div key={catIdx} data-gloss-cat={catIdx} className="ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-emerald-500/50">
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
              <div className="p-6 pt-24 bg-slate-900">
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

      {/* Banner Sezione Personaggi */}
      <div className="my-8 bg-gradient-to-r from-amber-900/40 to-orange-900/40 p-5 rounded-lg border-2 border-amber-600/50">
        <h3 className="text-xl font-bold text-amber-100 flex items-center gap-3 mb-2">
          <User className="w-6 h-6" />
          👥 Contesto Storico
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Personaggi storici, mecenati e interpreti legati al Concerto Op. 37 di Beethoven.
        </p>
      </div>

      {/* Approfondimento: Personaggi Storici e Interpreti */}
      <div className="mt-6 ml-4 md:ml-8 bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700 border-l-4 border-l-amber-500/50">
        <button
          onClick={() => setOpenPersonaggi(!openPersonaggi)}
          className={`w-full p-5 flex justify-between items-center transition-all ${
            openPersonaggi
              ? 'sticky top-20 z-10 bg-slate-700 text-white'
              : 'bg-slate-800 text-slate-100 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h3 className="text-lg font-semibold">👥 Indice Analitico dei Personaggi</h3>
              <span className="text-sm opacity-90">Regnanti, mecenati e interpreti</span>
            </div>
          </div>
          <ChevronDown className={`w-6 h-6 transition-transform ${openPersonaggi ? 'rotate-180' : ''}`} />
        </button>
        {openPersonaggi && (
          <div className="p-6 pt-24 bg-slate-900">
            <div className="space-y-6 text-sm text-slate-300">
              
              {/* TABELLA REGNANTI */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl border border-slate-600/50">
                <h4 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                  <span className="text-3xl mr-3">👑</span>
                  REGNANTI E MECENATI (DA BACH A BEETHOVEN)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white uppercase tracking-wide">
                      <tr>
                        <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Sovrano / Nobile</th>
                        <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Periodo Regno/Vita</th>
                        <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Luogo</th>
                        <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Musicisti Protetti</th>
                        <th className="border border-slate-600 px-3 py-2 text-left font-semibold">Note e Relazioni</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-300">
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Federico II "il Grande"</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1740–1786</td>
                        <td className="border border-slate-700 px-3 py-2">Prussia (Berlino)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>J.S. Bach</strong>, C.P.E. Bach</td>
                        <td className="border border-slate-700 px-3 py-2">Re flautista e compositore. Ospitò Bach nel 1747 (da cui nacque l'<em>Offerta Musicale</em>). Zio di Federico Guglielmo II.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Federico Guglielmo II</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1786–1797</td>
                        <td className="border border-slate-700 px-3 py-2">Prussia (Berlino)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Mozart</strong>, <strong>Beethoven</strong>, Boccherini</td>
                        <td className="border border-slate-700 px-3 py-2">Nipote di Federico II. Violoncellista dilettante. Mozart gli dedicò i <em>Quartetti Prussiani</em>, Beethoven le <em>Sonate per violoncello Op. 5</em>.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Luigi Ferdinando di Prussia</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1772–1806</td>
                        <td className="border border-slate-700 px-3 py-2">Prussia</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Beethoven</strong> (Dedicatario Op. 37)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Cugino</strong> di Federico Guglielmo II e nipote di Federico II. Pianista virtuoso e compositore, morì in battaglia.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Giuseppe II d'Asburgo</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1765–1790</td>
                        <td className="border border-slate-700 px-3 py-2">Austria (Vienna)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Mozart</strong></td>
                        <td className="border border-slate-700 px-3 py-2">Figlio di Maria Teresa. "Despota illuminato". Assunse Mozart come <em>Kammermusicus</em>, ma preferiva spesso Salieri.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Francesco II (poi I)</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1792–1835</td>
                        <td className="border border-slate-700 px-3 py-2">Austria (Vienna)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Beethoven</strong>, Schubert</td>
                        <td className="border border-slate-700 px-3 py-2">Ultimo imperatore del Sacro Romano Impero. Regnava durante tutta la carriera viennese di Beethoven. Suonava il violino.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Arciduca Rodolfo</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1788–1831</td>
                        <td className="border border-slate-700 px-3 py-2">Austria (Vienna)</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Beethoven</strong></td>
                        <td className="border border-slate-700 px-3 py-2">Fratello minore di Francesco II. Allievo e massimo mecenate di Beethoven (dedicatario di <em>Missa Solemnis</em>, Conc. <em>Imperatore</em>).</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Principe Esterházy</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1762–1790 (Nicola I)</td>
                        <td className="border border-slate-700 px-3 py-2">Ungheria/Austria</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Haydn</strong></td>
                        <td className="border border-slate-700 px-3 py-2">La famiglia Esterházy tenne Haydn a servizio per decenni, permettendogli di sviluppare lo stile classico.</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50 transition-colors">
                        <td className="border border-slate-700 px-3 py-2"><strong className="text-slate-100">Gottfried van Swieten</strong></td>
                        <td className="border border-slate-700 px-3 py-2">1733–1803</td>
                        <td className="border border-slate-700 px-3 py-2">Vienna</td>
                        <td className="border border-slate-700 px-3 py-2"><strong>Mozart</strong>, <strong>Haydn</strong>, <strong>Beethoven</strong></td>
                        <td className="border border-slate-700 px-3 py-2">Diplomatico (non regnante). Introdusse la musica di Bach e Händel a Vienna. Fondamentale per la formazione di Beethoven.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PERSONAGGI STORICI - EPOCA DI BEETHOVEN */}
              <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-amber-500">
                <h4 className="text-xl font-bold text-slate-200 mb-5 flex items-center">
                  <span className="text-3xl mr-3">📜</span>
                  PERSONAGGI STORICI (L'EPOCA DI BEETHOVEN)
                </h4>
                <p className="text-xs text-slate-400 mb-5 italic">Figure che hanno vissuto durante la vita di Beethoven o nel XIX secolo.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* B */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">BRAUN, Peter von (1758-1819)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> barone, banchiere e impresario teatrale austriaco</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> direttore dei teatri imperiali di Vienna (1794-1806)</li>
                      <li><strong className="text-slate-200">Importanza:</strong> nel 1802 negò a Beethoven l'uso del teatro per il suo concerto, ritardando di un anno la prima dell'Op. 37</li>
                      <li><strong className="text-slate-200">Note:</strong> descritto come "stupido e rozzo" dalla famiglia Beethoven, nel 1803 accolse il compositore al Theater an der Wien.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">BREITKOPF & HÄRTEL</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi erano:</strong> casa editrice musicale tedesca fondata a Lipsia (1719)</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> principali editori delle sue opere</li>
                      <li><strong className="text-slate-200">Importanza:</strong> Karl van Beethoven gestiva la corrispondenza con loro; pubblicarono molte opere incluso l'oratorio <em>Cristo sul Monte degli Ulivi</em></li>
                      <li><strong className="text-slate-200">Note:</strong> esistono ancora oggi, la più antica casa editrice musicale al mondo.</li>
                    </ul>
                  </div>

                  {/* C */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">CZERNY, Carl (1791-1857)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista, compositore e pedagogo austriaco</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> allievo diretto (dal 1800)</li>
                      <li><strong className="text-slate-200">Importanza:</strong> diede la prima viennese del Quinto Concerto "Imperatore"; testimone oculare dello stile esecutivo beethoveniano</li>
                      <li><strong className="text-slate-200">Note:</strong> maestro di Liszt e autore di celebri studi tecnici.</li>
                    </ul>
                  </div>

                  {/* F */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">FRANCESCO II D'ASBURGO (1768-1835)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> imperatore del Sacro Romano Impero (fino al 1806), poi Imperatore d'Austria</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> sovrano durante la carriera viennese del compositore</li>
                      <li><strong className="text-slate-200">Importanza:</strong> la stabilità (e poi la crisi bellica) del suo regno influenzò l'economia e la vita musicale viennese</li>
                      <li><strong className="text-slate-200">Note:</strong> fratello dell'Arciduca Rodolfo.</li>
                    </ul>
                  </div>

                  {/* H */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">HAYDN, Joseph (1732-1809)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> compositore austriaco, padre della sinfonia</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> maestro a Vienna (1792-1794)</li>
                      <li><strong className="text-slate-200">Importanza:</strong> insegnò composizione a Beethoven, pur con un rapporto conflittuale</li>
                      <li><strong className="text-slate-200">Note:</strong> chiamava Beethoven "il Gran Mogol".</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">HUMMEL, Johann Nepomuk (1778-1837)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista e compositore austriaco</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> rivale amichevole e collega</li>
                      <li><strong className="text-slate-200">Importanza:</strong> scrisse una cadenza alternativa per l'Op. 37; il suo stile era più decorativo rispetto a quello drammatico di Beethoven</li>
                      <li><strong className="text-slate-200">Note:</strong> presente al letto di morte di Beethoven.</li>
                    </ul>
                  </div>

                  {/* L */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">LICHNOWSKY, Karl Alois von (1761-1814)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> principe della Slesia, mecenate</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> primo grande protettore viennese, lo ospitò in casa</li>
                      <li><strong className="text-slate-200">Importanza:</strong> gli garantì una rendita annuale; dedicatario della <em>Patetica</em></li>
                      <li><strong className="text-slate-200">Note:</strong> Beethoven ruppe i rapporti con lui nel 1806 dopo una furiosa lite.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">LOBKOWITZ, Franz Joseph Maximilian von (1772-1816)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> principe boemo e mecenate</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> finanziatore e amico</li>
                      <li><strong className="text-slate-200">Importanza:</strong> nel suo palazzo avvennero le prime prove dell'Eroica; dedicatario dei Quartetti Op. 18</li>
                      <li><strong className="text-slate-200">Note:</strong> finì in rovina per le enormi spese musicali.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">LUIGI FERDINANDO DI PRUSSIA (1772-1806)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> principe prussiano, pianista e compositore</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> <strong>dedicatario del Terzo Concerto Op. 37</strong></li>
                      <li><strong className="text-slate-200">Importanza:</strong> Beethoven lo stimava molto come pianista ("suona non come un re, ma come un artista"); morì eroicamente in battaglia contro i francesi</li>
                      <li><strong className="text-slate-200">Note:</strong> nipote di Federico il Grande.</li>
                    </ul>
                  </div>

                  {/* M */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">MOZART, Wolfgang Amadeus (1756-1791)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> compositore austriaco</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> modello assoluto</li>
                      <li><strong className="text-slate-200">Importanza per Op. 37:</strong> il Concerto in Do minore K. 491 di Mozart è l'ispirazione diretta per l'Op. 37 di Beethoven</li>
                      <li><strong className="text-slate-200">Note:</strong> Beethoven disse ascoltando il K. 491: "Non riusciremo mai a fare nulla di simile".</li>
                    </ul>
                  </div>

                  {/* N */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">NAPOLEONE BONAPARTE (1769-1821)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> generale e imperatore dei francesi</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> idolo giovanile poi ripudiato</li>
                      <li><strong className="text-slate-200">Importanza:</strong> la sua figura eroica influenzò lo stile del "periodo di mezzo" (Eroica, Concerto n. 5)</li>
                      <li><strong className="text-slate-200">Note:</strong> le sue truppe occuparono Vienna nel 1805 e 1809.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">NEEFE, Christian Gottlob (1748-1798)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> compositore e organista</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> primo vero maestro a Bonn</li>
                      <li><strong className="text-slate-200">Importanza:</strong> gli fece conoscere <em>Il Clavicembalo ben temperato</em> di Bach</li>
                      <li><strong className="text-slate-200">Note:</strong> scrisse la prima recensione lodando il giovane Ludwig.</li>
                    </ul>
                  </div>

                  {/* O */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">ODESCALCHI, Barbara (Principessa Babette) (1754-1802)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> principessa e mecenate</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> dedicataria del Concerto n. 1 Op. 15.</li>
                    </ul>
                  </div>

                  {/* R */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">RAZUMOVSKY, Andrey Kirillovich (1752-1836)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> ambasciatore russo a Vienna</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> mecenate</li>
                      <li><strong className="text-slate-200">Importanza:</strong> committente dei tre quartetti Op. 59 ("Razumovsky").</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">RIES, Ferdinand (1784-1838)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista e compositore, allievo di Beethoven</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> amico intimo e biografo</li>
                      <li><strong className="text-slate-200">Importanza:</strong> testimone oculare della prima dell'Op. 37; raccontò i dettagli sulla stesura incompleta della parte solistica.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">RODOLFO D'AUSTRIA, Arciduca (1788-1831)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> arciduca e cardinale</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> allievo di pianoforte e principale mecenate</li>
                      <li><strong className="text-slate-200">Importanza:</strong> garantì a Beethoven la rendita vitalizia per non farlo partire da Vienna.</li>
                    </ul>
                  </div>

                  {/* S */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SCHIKANEDER, Emanuel (1751-1812)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> impresario teatrale e librettista (Flauto Magico)</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> gestore del Theater an der Wien</li>
                      <li><strong className="text-slate-200">Importanza:</strong> ospitò Beethoven nel teatro durante la composizione dell'Op. 37.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SCHUMANN, Clara (1819-1896)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista e compositrice tedesca (nata dopo la morte di Beethoven)</li>
                      <li><strong className="text-slate-200">Importanza:</strong> fondamentale per la diffusione del concerto nell'Ottocento; scrisse una cadenza celebre per il primo movimento</li>
                      <li><strong className="text-slate-200">Note:</strong> moglie di Robert Schumann.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SEYFRIED, Ignaz von (1776-1841)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> voltapagine alla prima dell'Op. 37</li>
                      <li><strong className="text-slate-200">Importanza:</strong> tramandò l'aneddoto dei "geroglifici egizi" (pagine vuote) sullo spartito del pianoforte.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">STREICHER, Nannette e Andreas</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi erano:</strong> costruttori di pianoforti viennesi</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> amici intimi</li>
                      <li><strong className="text-slate-200">Importanza:</strong> fornivano a Beethoven strumenti robusti adatti al suo stile violento.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SWIETEN, Gottfried van (1733-1803)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> barone e mecenate</li>
                      <li><strong className="text-slate-200">Relazione con Beethoven:</strong> mentore intellettuale</li>
                      <li><strong className="text-slate-200">Importanza:</strong> introdusse Beethoven alla musica antica (Bach e Händel).</li>
                    </ul>
                  </div>

                  {/* V */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">VAN BEETHOVEN, Johann (1740-1792)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> padre di Ludwig</li>
                      <li><strong className="text-slate-200">Note:</strong> tenore alcolista, cercò di sfruttare il figlio come prodigio.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">VAN BEETHOVEN, Karl (Carl) (1774-1815)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> fratello minore di Ludwig</li>
                      <li><strong className="text-slate-200">Importanza:</strong> gestiva la corrispondenza commerciale (es. con Breitkopf & Härtel).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">VAN BEETHOVEN, Karl (nipote) (1806-1858)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> nipote di Ludwig</li>
                      <li><strong className="text-slate-200">Importanza:</strong> causa della lunga battaglia legale per la custodia che tormentò gli ultimi anni del compositore.</li>
                    </ul>
                  </div>

                  {/* W */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">WALDSTEIN, Ferdinand Ernst Gabriel von (1762-1823)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> conte e primo mecenate a Bonn</li>
                      <li><strong className="text-slate-200">Importanza:</strong> finanziò il viaggio a Vienna augurando a Beethoven di ricevere "lo spirito di Mozart dalle mani di Haydn".</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* INTERPRETI MODERNI */}
              <div className="bg-slate-800/50 p-6 rounded-lg border-l-4 border-blue-500">
                <h4 className="text-xl font-bold text-slate-200 mb-5 flex items-center">
                  <span className="text-3xl mr-3">🎹</span>
                  INTERPRETI E FIGURE MODERNE (XX-XXI SECOLO)
                </h4>
                <p className="text-xs text-slate-400 mb-5 italic">Direttori e pianisti delle registrazioni discografiche.</p>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* A */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">ABBADO, Claudio (1933-2014)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra italiano</li>
                      <li><strong className="text-slate-200">Importanza:</strong> registrò l'Op. 37 con Martha Argerich (2004), versione di riferimento moderna.</li>
                    </ul>
                  </div>

                  {/* B */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">BÖHM, Karl (1894-1981)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra austriaco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> diresse Maurizio Pollini nell'Op. 37 (1979); simbolo della tradizione classica viennese.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">BRENDEL, Alfred (1931-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista austriaco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> interprete intellettuale e analitico, riferimento per studenti (registrazione con Rattle, 1998).</li>
                    </ul>
                  </div>

                  {/* D */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">DUDAMEL, Gustavo (1981-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> direttore d'orchestra venezuelano</li>
                      <li><strong className="text-slate-200">Importanza:</strong> noto per l'energia ritmica, ha diretto Yuja Wang nel Concerto n. 3.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">DUTOIT, Charles (1936-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> direttore d'orchestra svizzero</li>
                      <li><strong className="text-slate-200">Importanza:</strong> accompagnò la giovane Martha Argerich nella registrazione del 1982.</li>
                    </ul>
                  </div>

                  {/* F */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">FISCHER, Edwin (1886-1960)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista e direttore svizzero</li>
                      <li><strong className="text-slate-200">Importanza:</strong> pioniere del recupero filologico dello spirito beethoveniano; registrazione storica con Furtwängler (1951).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">FURTWÄNGLER, Wilhelm (1886-1954)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra tedesco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> massimo esponente dell'interpretazione "titanica" e soggettiva del romanticismo tedesco.</li>
                    </ul>
                  </div>

                  {/* G */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">GOULD, Glenn (1932-1982)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista canadese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> interprete eccentrico e geniale, offrì una lettura dell'Op. 37 (1959) asciutta e anti-romantica.</li>
                    </ul>
                  </div>

                  {/* H */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">HOGWOOD, Christopher (1941-2014)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore e clavicembalista inglese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> pioniere delle esecuzioni su strumenti originali (registrazione con Steven Lubin, 1988).</li>
                    </ul>
                  </div>

                  {/* K */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">KEMPFF, Wilhelm (1895-1991)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista tedesco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> la sua registrazione del 1961 è considerata ideale per il primo ascolto grazie alla chiarezza poetica.</li>
                    </ul>
                  </div>

                  {/* L */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">LEITNER, Ferdinand (1912-1996)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra tedesco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> accompagnatore affidabile e classico nella celebre integrale con Kempff.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">LISIECKI, Jan (1995-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista canadese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> talento contemporaneo, ha inciso per Deutsche Grammophon dirigendo dalla tastiera (con Academy of St Martin in the Fields).</li>
                    </ul>
                  </div>

                  {/* M */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">MUTI, Riccardo (1941-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> direttore d'orchestra italiano</li>
                      <li><strong className="text-slate-200">Importanza:</strong> ha diretto Sokolov in una rara e preziosa registrazione live del concerto.</li>
                    </ul>
                  </div>

                  {/* P */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">POLLINI, Maurizio (1942-2024)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista italiano</li>
                      <li><strong className="text-slate-200">Importanza:</strong> celebre per il rigore strutturale e la perfezione tecnica nelle opere di Beethoven.</li>
                    </ul>
                  </div>

                  {/* R */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">RATTLE, Simon (1955-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> direttore d'orchestra inglese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> ha collaborato con Brendel per un ciclo beethoveniano moderno e bilanciato.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">RICHTER, Sviatoslav (1915-1997)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista sovietico</li>
                      <li><strong className="text-slate-200">Importanza:</strong> leggenda del pianoforte, noto per la potenza e la profondità quasi mistica delle esecuzioni.</li>
                    </ul>
                  </div>

                  {/* S */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SANDERLING, Kurt (1912-2011)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra tedesco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> ponte tra la cultura musicale tedesca e quella russa (diresse sia Richter che Uchida).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SARGENT, Malcolm (1895-1967)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> direttore d'orchestra inglese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> diresse la prima registrazione completa storica con Schnabel (anni '30).</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SAY, Fazil (1970-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista e compositore turco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> ha scritto una cadenza moderna e controversa per il Terzo Concerto.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SCHNABEL, Artur (1882-1951)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi era:</strong> pianista austriaco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> il primo a registrare l'integrale delle sonate; considerato "l'uomo che ha inventato Beethoven" per il XX secolo.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">SOKOLOV, Grigory (1950-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista russo</li>
                      <li><strong className="text-slate-200">Importanza:</strong> artista di culto, le sue interpretazioni sono eventi rari di enorme profondità filosofica.</li>
                    </ul>
                  </div>

                  {/* U */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">UCHIDA, Mitsuko (1948-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista anglo-giapponese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> porta in Beethoven una chiarezza e un'eleganza tipicamente mozartiane.</li>
                    </ul>
                  </div>

                  {/* W */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">WANG, Yuja (1987-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista cinese</li>
                      <li><strong className="text-slate-200">Importanza:</strong> superstar odierna, unisce tecnica infallibile a una presenza scenica magnetica.</li>
                    </ul>
                  </div>

                  {/* Z */}
                  <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <h5 className="font-bold text-slate-100 mb-2">ZIMERMAN, Krystian (1956-)</h5>
                    <ul className="space-y-1 text-xs">
                      <li><strong className="text-slate-200">Chi è:</strong> pianista polacco</li>
                      <li><strong className="text-slate-200">Importanza:</strong> noto per il perfezionismo maniacale; la sua versione con Bernstein è carica di tensione drammatica.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
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
            <div className="bg-blue-100 p-4 rounded-full mb-6">
              <CheckCircle className="w-16 h-16 text-blue-600" />
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
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const startQuiz = (difficulty) => {
    const filtered = quizData.filter(q => q.difficulty === difficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setSelectedDifficulty(difficulty);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (optionIndex === shuffledQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    const filtered = quizData.filter(q => q.difficulty === selectedDifficulty);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const changeDifficulty = () => {
    setSelectedDifficulty(null);
    setShuffledQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty) {
      case 'base':
        return <span className="text-xs px-2 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700 font-semibold">🔵 BASE</span>;
      case 'intermedio':
        return <span className="text-xs px-2 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700 font-semibold">🟡 INTERMEDIO</span>;
      case 'avanzato':
        return <span className="text-xs px-2 py-1 rounded-full bg-red-900/50 text-red-300 border border-red-700 font-semibold">🔴 AVANZATO</span>;
      default:
        return null;
    }
  };

  // Schermata di selezione difficoltà
  if (!selectedDifficulty) {
    const baseCount = quizData.filter(q => q.difficulty === 'base').length;
    const intermedioCount = quizData.filter(q => q.difficulty === 'intermedio').length;
    const avanzatoCount = quizData.filter(q => q.difficulty === 'avanzato').length;

    return (
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-3">Scegli il livello di difficoltà</h2>
          <p className="text-slate-400">Seleziona il livello più adatto alla tua preparazione</p>
        </div>

        {/* Immagine di copertina */}
        <div className="mb-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <img
            src="/images/beethoven-quiz-portrait.png"
            alt="Ludwig van Beethoven - Ritratto per il quiz"
            className="w-full h-64 object-contain rounded-lg"
          />
          <p className="text-xs text-slate-400 mt-3 italic text-center">
            Testa la tua conoscenza sul Concerto per pianoforte n. 3 in Do minore, Op. 37
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* BASE */}
          <button
            onClick={() => startQuiz('base')}
            className="bg-slate-800 border-2 border-blue-700 rounded-lg p-8 hover:bg-slate-700 hover:border-blue-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🟢</span>
              <span className="text-sm text-slate-400">{baseCount} domande</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-300 mb-3">BASE</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Domande sui fatti principali: date, luoghi, tonalità, dedica, storia della composizione.
            </p>
            <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inizia →</span>
            </div>
          </button>

          {/* INTERMEDIO */}
          <button
            onClick={() => startQuiz('intermedio')}
            className="bg-slate-800 border-2 border-yellow-700 rounded-lg p-8 hover:bg-slate-700 hover:border-yellow-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🟡</span>
              <span className="text-sm text-slate-400">{intermedioCount} domande</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-300 mb-3">INTERMEDIO</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Domande su tecnica pianistica, interpreti, stile, organico orchestrale, elementi musicali.
            </p>
            <div className="flex items-center text-yellow-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inizia →</span>
            </div>
          </button>

          {/* AVANZATO */}
          <button
            onClick={() => startQuiz('avanzato')}
            className="bg-slate-800 border-2 border-red-700 rounded-lg p-8 hover:bg-slate-700 hover:border-red-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-4xl">🔴</span>
              <span className="text-sm text-slate-400">{avanzatoCount} domande</span>
            </div>
            <h3 className="text-2xl font-bold text-red-300 mb-3">AVANZATO</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Analisi teorica approfondita con terminologia Hepokoski-Darcy, strategie tonali, deformazioni.
            </p>
            <div className="flex items-center text-red-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              <span>Inizia →</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Aspetta che le domande siano caricate
  if (shuffledQuestions.length === 0) {
    return <div className="text-center p-8">Caricamento...</div>;
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg shadow p-8 text-center animate-fadeIn border border-slate-700">
        <div className="bg-slate-700 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-12 h-12 text-slate-200" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Quiz Completato!</h2>
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <p className="text-lg text-slate-300 mb-2">Il tuo punteggio:</p>
          <p className="text-5xl font-bold text-blue-400">{score}<span className="text-2xl text-slate-500"> / {shuffledQuestions.length}</span></p>
        </div>

        <div className="mb-8 p-5 rounded-lg bg-slate-900">
          {score === shuffledQuestions.length ? (
            <p className="text-blue-600 font-semibold text-lg">🎉 Eccezionale! Sei pronto per l'esame.</p>
          ) : score >= shuffledQuestions.length / 2 ? (
            <p className="text-blue-400 font-semibold text-lg">👍 Buon lavoro! Ripassa l'analisi per perfezionarti.</p>
          ) : (
            <p className="text-orange-600 font-semibold text-lg">📚 Consiglio: Rileggi la sezione "Analisi" e riprova.</p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="flex items-center justify-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-all shadow font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Ricomincia</span>
          </button>
          <button
            onClick={changeDifficulty}
            className="flex items-center justify-center space-x-2 bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-500 transition-all shadow font-semibold"
          >
            <span>Cambia Livello</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <div className="bg-slate-800 rounded-lg shadow overflow-hidden border border-slate-700">
        <div className="bg-slate-700 p-5">
          <div className="flex justify-between items-center text-white mb-3">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-sm">Domanda {currentQuestion + 1} / {shuffledQuestions.length}</span>
              {getDifficultyBadge(currentQ.difficulty)}
            </div>
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
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
              if (selectedOption === null) {
                btnClass += "border-slate-700 hover:border-blue-500 hover:bg-slate-700/50";
              } else if (index === currentQ.correct) {
                btnClass += "border-blue-500 bg-blue-900/50 text-blue-300";
              } else if (index === selectedOption) {
                btnClass += "border-red-500 bg-red-900/50 text-slate-200";
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
                    {selectedOption !== null && index === currentQ.correct && (
                      <CheckCircle className="ml-auto w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mostra spiegazione se presente e se la risposta è stata data */}
          {selectedOption !== null && currentQ.explanation && (
            <div className="mt-6 p-4 bg-slate-900 border border-slate-600 rounded-lg">
              <div className="flex items-start space-x-2">
                <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-400 mb-1">Approfondimento:</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Pulsante Avanti - appare quando viene data una risposta */}
          {selectedOption !== null && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center space-x-2 shadow-lg"
              >
                <span>{currentQuestion < shuffledQuestions.length - 1 ? 'Prossima Domanda' : 'Vedi Risultato'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---

const App = () => {
  const [activeTab, setActiveTab] = useState('introduzione');
  const [glossaryFocus, setGlossaryFocus] = useState(null);
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
          {activeTab === 'introduzione' && (
            <IntroduzioneSection setActiveTab={setActiveTab} setGlossaryFocus={setGlossaryFocus} />
          )}
          {activeTab === 'fonti' && <FontiSection />}
          {activeTab === 'analysis' && (
            <AnalysisSection setActiveTab={setActiveTab} setGlossaryFocus={setGlossaryFocus} />
          )}
          {activeTab === 'interpreters' && <InterpretersSection />}
          {activeTab === 'glossary' && (
            <GlossarySection focusCategory={glossaryFocus} onFocusConsumed={() => setGlossaryFocus(null)} />
          )}
          {activeTab === 'flashcards' && <FlashcardsSection />}
          {activeTab === 'quiz' && <QuizSection />}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
