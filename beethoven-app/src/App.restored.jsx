import React, { useState, useEffect } from 'react';
import { BookOpen, Music, Brain, GraduationCap, ChevronRight, ChevronLeft, RotateCcw, CheckCircle, HelpCircle, Menu, X, PlayCircle, ChevronDown, Library } from 'lucide-react';

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
      { term: "Secondo Tema (S)", definition: "Tema contrastante, solitamente in tonalità relativa. Nell'Op. 37: profilo melodico ornato in Mi♭ maggiore, dolce e carezvole, esposto da clarinetto e violini." },
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
    conductor: "Paul van Kempe",
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
  },
  {
    name: "Yevgeny Sudbin",
    conductor: "Osmo Vänskä",
    orchestra: "Tapiola Sinfonietta",
    year: "2010 (circa)",
    description: "Visione moderna e filologicamente informata. Sudbin utilizza un approccio storicamente consapevole ma con virtuosismo contemporaneo. Tempi energici, articolazione chiara, uso attento del pedale. La Tapiola Sinfonietta offre un suono cameristico trasparente. Registrazione nitida che rivela dettagli spesso nascosti.",
    style: "Moderno, filologico, trasparente"
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
    question: "Qual è l'innovazione nella coda del primo movimento (TUTTI 5)?",
    options: ["Il pianoforte suona da solo", "L'orchestra fa un crescendo", "Il pianoforte continua dopo l'ingresso dell'orchestra", "Ci sono tre cadenze"],
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
  }
];

// (Rest of backup file truncated in this created copy for brevity)

export default App;
