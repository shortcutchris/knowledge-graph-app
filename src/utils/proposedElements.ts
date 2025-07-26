import type { ProposedElement, QA } from '../types';

export const generateProposedElements = (qa: QA, qaIndex: number): ProposedElement[] => {
  const baseElements: ProposedElement[] = [
    {
      type: 'question',
      nodeType: 'question',
      id: `q_${qa.id}`,
      label: 'Q',
      content: qa.question
    },
    {
      type: 'answer',
      nodeType: 'answer',
      id: `a_${qa.id}`,
      label: 'A',
      content: qa.answer
    }
  ];

  switch(qaIndex) {
    case 0: // Q1 - Component failure
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Komponente',
          label: 'Komponente',
          parent: 'entity',
          id: 'komponente'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'x500',
          label: 'Anlage X500'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'bmw_muenchen',
          label: 'BMW München'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'fehler_f42',
          label: 'Fehler F42'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'kondensator_c3',
          label: 'Kondensator C3'
        },
        {
          type: 'edge',
          from: 'x500',
          to: 'anlage',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'bmw_muenchen',
          to: 'kunde',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'fehler_f42',
          to: 'fehler',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'kondensator_c3',
          to: 'komponente',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'x500',
          to: 'fehler_f42',
          label: 'hat_typischen_fehler',
          attributes: { häufigkeit: 'oft', lebensdauer: '8-10 Jahre' }
        },
        {
          type: 'edge',
          from: 'fehler_f42',
          to: 'kondensator_c3',
          label: 'hat_lösung',
          attributes: { ersatzteil: '4711' }
        },
        {
          type: 'edge',
          from: 'bmw_muenchen',
          to: 'x500',
          label: 'betreibt_anlage'
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'x500',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'fehler_f42',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'kondensator_c3',
          label: 'is_relevant_for'
        }
      ];

    case 1: // Q2 - Firmware
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Firmware',
          label: 'Firmware',
          parent: 'entity',
          id: 'firmware'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'bosch',
          label: 'Bosch'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'firmware_2_3',
          label: 'Firmware v2.3'
        },
        {
          type: 'edge',
          from: 'bosch',
          to: 'kunde',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'firmware_2_3',
          to: 'firmware',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'bosch',
          to: 'firmware_2_3',
          label: 'benötigt_firmware',
          attributes: { version: '2.3', grund: 'SPS-Kompatibilität' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'bosch',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'firmware_2_3',
          label: 'is_relevant_for'
        }
      ];

    case 2: // Q3 - BMW Verbund
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Wartungshinweis',
          label: 'Wartungshinweis',
          parent: 'entity',
          id: 'wartungshinweis'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'bmw_werk2',
          label: 'BMW Werk 2'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'meister_huber',
          label: 'Meister Huber'
        },
        {
          type: 'edge',
          from: 'bmw_werk2',
          to: 'kunde',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'bmw_werk2',
          to: 'wartungshinweis',
          label: 'hat_konfiguration',
          attributes: { typ: 'Verbund', kritisch: 'ja' }
        },
        {
          type: 'edge',
          from: 'bmw_werk2',
          to: 'meister_huber',
          label: 'hat_ansprechpartner',
          attributes: { tel: '0171-2345678' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'bmw_werk2',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'wartungshinweis',
          label: 'is_relevant_for'
        }
      ];

    case 3: // Q4 - Incompatibilities
      return [
        ...baseElements,
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'schuetz_k4',
          label: 'Schütz K4 (8834)'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'x300',
          label: 'Anlage X300'
        },
        {
          type: 'edge',
          from: 'schuetz_k4',
          to: 'komponente',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'x300',
          to: 'anlage',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'schuetz_k4',
          to: 'x300',
          label: 'ist_inkompatibel',
          attributes: { grund: 'Befestigungslöcher', baujahr_grenze: '2018' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'schuetz_k4',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'x300',
          label: 'is_relevant_for'
        }
      ];

    case 4: // Q5 - Environmental factors
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Umgebungsfaktor',
          label: 'Umgebungsfaktor',
          parent: 'entity',
          id: 'umgebungsfaktor'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'daimler_stuttgart',
          label: 'Daimler Stuttgart'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'staubproblem',
          label: 'Staubbelastung'
        },
        {
          type: 'edge',
          from: 'daimler_stuttgart',
          to: 'kunde',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'staubproblem',
          to: 'umgebungsfaktor',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'daimler_stuttgart',
          to: 'staubproblem',
          label: 'hat_umgebungsproblem',
          attributes: { quelle: 'Lackiererei', wartung: 'Filter monatlich' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'daimler_stuttgart',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'staubproblem',
          label: 'is_relevant_for'
        }
      ];

    default:
      return baseElements;
  }
};