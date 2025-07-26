export interface Node {
  id: string;
  label: string;
  type?: string;
  nodeType?: string;
  parent?: string;
  isNew?: boolean;
  isProposed?: boolean;
  content?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Link {
  source: string | Node;
  target: string | Node;
  type: string;
  id?: string;
  attributes?: Record<string, string>;
  isProposed?: boolean;
}

export interface ProposedElement {
  type: string;
  nodeType?: string;
  id?: string;
  label?: string;
  content?: string;
  name?: string;
  parent?: string;
  from?: string;
  to?: string;
  attributes?: Record<string, string>;
}

export interface QA {
  id: string;
  question: string;
  answer: string;
  entities: Entity[];
  predicates: Predicate[];
  newClassProposal?: ClassProposal | null;
  metadata?: QAMetadata;
}

export interface QAMetadata {
  datum?: string;
  kategorie?: string;
  schwierigkeit?: 'niedrig' | 'mittel' | 'hoch' | 'kritisch' | 'sozial';
  kostenersparnis?: string;
  zeitersparnis?: string;
  betroffene_kunden?: string[];
  workaround?: boolean;
  wirtschaftlicher_effekt?: string;
  dokumentation?: string;
  priorität?: string;
  compliance_relevant?: boolean;
  skalierbar?: boolean;
  detektivarbeit?: boolean;
  ähnliche_fälle?: string[];
  erfahrungsbasis?: string;
  kosteneinsparung?: string;
  geldersparnis?: string;
  soft_skills?: boolean;
  wichtigkeit?: string;
  rechtliche_grauzone?: boolean;
  nur_temporär?: boolean;
}

export interface Entity {
  text: string;
  type: string;
  mapTo: string | null;
  isNew: boolean;
}

export interface Predicate {
  text: string;
  attributes?: Record<string, string>;
  isNew: boolean;
}

export interface ClassProposal {
  name: string;
  parent: string;
  properties: string[];
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  content: string;
}

export interface GraphDimensions {
  width: number;
  height: number;
}