import type { ProposedElement } from '../types';

// Function to generate new entities from updated Q&A text
export const generateReExtractedElements = (
  updatedQA: { question: string; answer: string },
  qaIndex: number,
  qaId: string
): ProposedElement[] => {
  const baseElements: ProposedElement[] = [
    {
      type: 'question',
      nodeType: 'question',
      id: `q_${qaId}`,
      label: `Q${qaIndex + 1}`,
      content: updatedQA.question
    },
    {
      type: 'answer',
      nodeType: 'answer',
      id: `a_${qaId}`,
      label: `A${qaIndex + 1}`,
      content: updatedQA.answer
    },
    {
      type: 'edge',
      from: `q_${qaId}`,
      to: `a_${qaId}`,
      label: 'has_answer'
    }
  ];

  // Example of dynamic entity extraction based on text content
  const entities: ProposedElement[] = [];
  
  // Extract phone numbers
  const phoneRegex = /\b\d{3,4}[-.\s]?\d{6,7}\b/g;
  const phones = updatedQA.answer.match(phoneRegex);
  
  // Extract error codes (F followed by numbers)
  const errorRegex = /\bF\d{2,3}\b/g;
  const errors = [...updatedQA.question.matchAll(errorRegex), ...updatedQA.answer.matchAll(errorRegex)];
  
  // Extract company names (common patterns)
  const companies = [];
  if (updatedQA.answer.includes('BMW')) companies.push('BMW');
  if (updatedQA.answer.includes('Bosch')) companies.push('Bosch');
  if (updatedQA.answer.includes('Hydrotech')) companies.push('Hydrotech');
  if (updatedQA.answer.includes('Daimler')) companies.push('Daimler');
  if (updatedQA.answer.includes('Audi')) companies.push('Audi');
  
  // Extract component names (Teil, Kondensator, etc.)
  const componentRegex = /\b(Kondensator|Schütz|Teil|Sensor|Ventil|Filter)\s+[A-Z0-9]+\b/gi;
  const components = [...updatedQA.answer.matchAll(componentRegex)];
  
  // Add extracted entities based on what was found
  if (errors.length > 0) {
    errors.forEach((error, idx) => {
      entities.push({
        type: 'instance',
        nodeType: 'instance',
        id: `fehler_${error[0].toLowerCase()}`,
        label: error[0],
        attributes: {
          typ: updatedQA.question.includes('Überhitzung') ? 'Überhitzungsfehler' : 'Fehler',
          seite: qaIndex === 0 ? '156' : qaIndex === 1 ? '203' : '0'
        }
      });
    });
  }
  
  if (companies.length > 0) {
    companies.forEach(company => {
      entities.push({
        type: 'instance',
        nodeType: 'instance',
        id: company.toLowerCase().replace(/\s+/g, '_'),
        label: company,
        attributes: {
          typ: 'Kunde',
          standort: company.includes('München') ? 'München' : '',
          seite: qaIndex === 0 ? '156' : '0'
        }
      });
    });
  }
  
  if (phones && phones.length > 0) {
    // Find person name near phone number
    const nameMatch = updatedQA.answer.match(/(?:Herr|Hr\.|Meister|Dr\.)\s+([A-Z][a-zäöü]+)/);
    if (nameMatch) {
      entities.push({
        type: 'instance',
        nodeType: 'instance',
        id: `kontakt_${nameMatch[1].toLowerCase()}`,
        label: nameMatch[0],
        attributes: {
          telefon: phones[0],
          rolle: 'Ansprechpartner',
          seite: qaIndex === 0 ? '156' : '0'
        }
      });
    }
  }
  
  if (components.length > 0) {
    components.forEach(comp => {
      const [, type, id] = comp;
      entities.push({
        type: 'instance',
        nodeType: 'instance',
        id: `komponente_${id.toLowerCase()}`,
        label: comp[0],
        attributes: {
          typ: type,
          seite: qaIndex === 0 ? '156' : '0'
        }
      });
    });
  }
  
  // Add edges for extracted entities
  entities.forEach(entity => {
    if (entity.id?.includes('fehler_')) {
      baseElements.push({
        type: 'edge',
        from: `q_${qaId}`,
        to: entity.id,
        label: 'is_relevant_for'
      });
    }
    if (entity.id?.includes('kontakt_') || entity.id?.includes('komponente_')) {
      baseElements.push({
        type: 'edge',
        from: `a_${qaId}`,
        to: entity.id,
        label: 'is_relevant_for'
      });
    }
  });
  
  return [...baseElements, ...entities];
};