/**
 * The narrative spine.
 *
 * These six states are the structural foundation: they are what the server
 * renders, what a screen reader reads, what a crawler indexes, and what a
 * visitor sees when motion is reduced or Canvas is unavailable. The cinematic
 * camera flight is an enhancement layered over exactly this content — there is
 * no second copy of the story anywhere.
 *
 * Copy deliberately *demonstrates* here; the later Workflow and HumanControl
 * sections explain the same ideas in different words.
 */

export type NarrativeState = {
  /** Stable id used for anchors and CSS targeting. */
  id: string;
  /** Story-needle step number, or null for the closing summary. */
  step: string | null;
  /** Story-needle label. */
  needle: string;
  /** Transient, unnumbered annotation shown only during this state. */
  transient?: string;
  /**
   * Decision chain. Steps marked `human` are the ones Atreides never performs.
   */
  chain?: ReadonlyArray<{ label: string; human: boolean }>;
  eyebrow?: string;
  heading: string;
  body: string;
  /** Scroll range this state occupies in the cinematic sequence. */
  from: number;
  to: number;
  /** Scroll position used to render this state's still frame. */
  still: number;
  /** Whether the needle's leader line attaches to the prioritised zone. */
  attaches: boolean;
};

export const NARRATIVE: NarrativeState[] = [
  {
    id: "venue",
    step: "01",
    needle: "Venue erfassen",
    eyebrow: "AI Venue Intelligence",
    heading: "Risiken erkennen, bevor Situationen eskalieren.",
    body: "Atreides verwandelt bestehende Kameradaten in ein priorisiertes Lagebild für menschlich geführte Security-Teams.",
    from: 0,
    to: 0.24,
    still: 0.02,
    attaches: false,
  },
  {
    id: "dynamik",
    step: "02",
    needle: "Dynamik erkennen",
    transient: "Auffällige Dynamik",
    heading: "Zwischen hunderten Bewegungen fällt eine Fläche auf.",
    body: "Nicht einzelne Personen verändern das Bild, sondern der Raum um sie herum: Umstehende weichen aus, die Dichte verschiebt sich, eine Fläche wird ungewöhnlich.",
    from: 0.24,
    to: 0.4,
    still: 0.33,
    // The transient marker carries the spatial pointing in this state.
    attaches: false,
  },
  {
    id: "zone",
    step: "03",
    needle: "Zone priorisieren",
    heading: "Aus dem Raum wird eine Struktur.",
    body: "Bewegung wird zu Aktivität je Zone. Bewertet werden Flächen, nicht Menschen — hervorgehoben wird die Zone, deren Veränderung eine Prüfung rechtfertigt.",
    from: 0.4,
    to: 0.56,
    still: 0.5,
    attaches: true,
  },
  {
    id: "kontext",
    step: "04",
    needle: "Kontext bereitstellen",
    heading: "Ein Hinweis mit Kontext, keine Anweisung.",
    body: "Zone, Verlauf und Priorität laufen an einer Stelle zusammen. Der Hinweis endet mit einem Prüfauftrag — nicht mit einer Maßnahme.",
    from: 0.56,
    to: 0.82,
    still: 0.76,
    attaches: true,
  },
  {
    id: "pruefen",
    step: "05",
    needle: "Menschlich prüfen",
    heading: "Atreides trifft keine Sicherheitsentscheidungen.",
    body: "Die Plattform priorisiert Situationen und liefert Kontext. Die finale Bewertung und jede Maßnahme bleiben beim verantwortlichen Security-Team.",
    chain: [
      { label: "Signal", human: false },
      { label: "Hinweis", human: false },
      { label: "Menschliche Prüfung", human: true },
      { label: "Entscheidung", human: true },
    ],
    from: 0.82,
    to: 0.93,
    still: 0.88,
    attaches: false,
  },
  {
    id: "uebersicht",
    step: null,
    needle: "01–05 abgeschlossen",
    heading: "Aus vorhandenen Kameras wird operative Übersicht.",
    body: "Erfasste Bereiche, interpretierte Aktivität, priorisierte Zone, bereitgestellter Kontext — und am Ende eine Entscheidung, die ein Mensch trifft.",
    from: 0.93,
    to: 1.0001,
    still: 0.98,
    attaches: false,
  },
];

/** Index of the narrative state active at scroll progress `p`. */
export function stateIndexAt(p: number): number {
  for (let i = 0; i < NARRATIVE.length; i++) {
    if (p < NARRATIVE[i].to) return i;
  }
  return NARRATIVE.length - 1;
}

/** Total scroll length of the sequence, in viewport heights. */
export const TRACK_VH = { desktop: 700, mobile: 520 };
