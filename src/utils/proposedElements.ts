import type { ProposedElement, QA } from '../types';

export const generateProposedElements = (qa: QA, qaIndex: number): ProposedElement[] => {
  const baseElements: ProposedElement[] = [
    {
      type: 'question',
      nodeType: 'question',
      id: `q_${qa.id}`,
      label: `Q${qaIndex + 1}`,
      content: qa.question
    },
    {
      type: 'answer',
      nodeType: 'answer',
      id: `a_${qa.id}`,
      label: `A${qaIndex + 1}`,
      content: qa.answer
    },
    {
      type: 'edge',
      from: `q_${qa.id}`,
      to: `a_${qa.id}`,
      label: 'has_answer'
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
          parent: 'herr_wagner',
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
          parent: 'herr_wagner',
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
          parent: 'herr_wagner',
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
          parent: 'herr_wagner',
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

    case 5: // Q6 - Umweltbedingungen
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Störquelle',
          label: 'Störquelle',
          parent: 'herr_wagner',
          id: 'stoerquelle'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'gabelstapler_ladestation',
          label: 'Gabelstapler-Ladestation'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'frequenzumrichter_fu200',
          label: 'Frequenzumrichter FU-200'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'netzfilter_nf',
          label: 'Netzfilter NF-THD-40'
        },
        {
          type: 'edge',
          from: 'gabelstapler_ladestation',
          to: 'stoerquelle',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'frequenzumrichter_fu200',
          to: 'komponente',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'frequenzumrichter_fu200',
          to: 'gabelstapler_ladestation',
          label: 'gestört_durch',
          attributes: { typ: 'Netzoberwellen', zeitfenster: 'Di+Do 14-16' }
        },
        {
          type: 'edge',
          from: 'frequenzumrichter_fu200',
          to: 'netzfilter_nf',
          label: 'entstörbar_mit',
          attributes: { kosten: '1200€', wirksamkeit: '100%' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'stoerquelle',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'netzfilter_nf',
          label: 'is_relevant_for'
        }
      ];

    case 6: // Q7 - Wartungsstrategie
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Wartungsstrategie',
          label: 'Wartungsstrategie',
          parent: 'herr_wagner',
          id: 'wartungsstrategie'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'oelwechsel_matrix',
          label: 'Ölwechsel-Matrix'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'oelcheck',
          label: 'OELCHECK Brannenburg'
        },
        {
          type: 'edge',
          from: 'oelwechsel_matrix',
          to: 'wartungsstrategie',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'oelwechsel_matrix',
          to: 'oelcheck',
          label: 'validiert_durch',
          attributes: { methode: 'Ölanalyse', roi: '1:15' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'oelwechsel_matrix',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'wartungsstrategie',
          label: 'is_relevant_for'
        }
      ];

    case 7: // Q8 - Ersatzteil-Management
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Ersatzteilqualität',
          label: 'Ersatzteilqualität',
          parent: 'herr_wagner',
          id: 'ersatzteilqualitaet'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'kugellager_6205',
          label: 'Kugellager 6205-2RS'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'wagner_liste',
          label: 'Wagner schwarze Liste'
        },
        {
          type: 'edge',
          from: 'kugellager_6205',
          to: 'ersatzteilqualitaet',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'kugellager_6205',
          to: 'wagner_liste',
          label: 'dokumentiert_in',
          attributes: { bewertung: 'durchgefallen', lebensdauer: '3 Monate' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'ersatzteilqualitaet',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'wagner_liste',
          label: 'is_relevant_for'
        }
      ];

    case 8: // Q9 - Kundenwissen
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Kundenbesonderheit',
          label: 'Kundenbesonderheit',
          parent: 'herr_wagner',
          id: 'kundenbesonderheit'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'audi_ingolstadt',
          label: 'Audi Ingolstadt'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'halle4_vibration',
          label: 'Halle 4 Vibration'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'dr_weber',
          label: 'Dr. Weber (Werksleiter)'
        },
        {
          type: 'edge',
          from: 'audi_ingolstadt',
          to: 'kunde',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'halle4_vibration',
          to: 'kundenbesonderheit',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'audi_ingolstadt',
          to: 'halle4_vibration',
          label: 'hat_besonderheit',
          attributes: { lösung: 'Dämpfungsplatten' }
        },
        {
          type: 'edge',
          from: 'audi_ingolstadt',
          to: 'dr_weber',
          label: 'hat_ansprechpartner',
          attributes: { position: 'Werksleiter' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'audi_ingolstadt',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'kundenbesonderheit',
          label: 'is_relevant_for'
        }
      ];

    case 9: // Q10 - Notfall-Hacks
      return [
        ...baseElements,
        {
          type: 'class',
          nodeType: 'class',
          name: 'Notfallmaßnahme',
          label: 'Notfallmaßnahme',
          parent: 'herr_wagner',
          id: 'notfallmassnahme'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'notfall_ueberbrueckung',
          label: 'Notfall-Überbrückung'
        },
        {
          type: 'instance',
          nodeType: 'instance',
          id: 'wachmann',
          label: 'Wachmann'
        },
        {
          type: 'edge',
          from: 'notfall_ueberbrueckung',
          to: 'notfallmassnahme',
          label: 'instance_of'
        },
        {
          type: 'edge',
          from: 'notfall_ueberbrueckung',
          to: 'wachmann',
          label: 'sicherheitshinweis',
          attributes: { grund: 'Not-Aus überbrückt', dokumentation: 'zwingend' }
        },
        {
          type: 'edge',
          from: `q_${qa.id}`,
          to: 'notfallmassnahme',
          label: 'is_relevant_for'
        },
        {
          type: 'edge',
          from: `a_${qa.id}`,
          to: 'notfall_ueberbrueckung',
          label: 'is_relevant_for'
        }
      ];

    default:
      return baseElements;
  }
};