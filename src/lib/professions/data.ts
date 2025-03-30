import { Profession, Department, ProfessionState } from '../../types/profession';

const STORAGE_KEY = 'tfda_professions';
const CURRENT_VERSION = '1.0.0';

// CSV data transformed into array of objects
const professionData: Profession[] = [
  { type: 'A', department_th: 'พัฒนาบท', department_en: 'Script Development', role_th: 'คนเขียนบท', role_en: 'Screenwriter' },
  { type: 'A', department_th: 'พัฒนาบท', department_en: 'Script Development', role_th: 'ที่ปรึกษาการเขียน', role_en: 'Writing Consultant' },
  { type: 'A', department_th: 'พัฒนาบท', department_en: 'Script Development', role_th: 'ผู้วาดสตอรี่บอร์ด', role_en: 'Storyboard Artist' },
  // ... rest of CSV data converted to objects
];

export function initializeProfessionData(): ProfessionState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as ProfessionState;
      if (data.version === CURRENT_VERSION) {
        return data;
      }
    }

    // Group by department and transform data
    const departments: Department[] = professionData.reduce((acc, curr) => {
      const existingDept = acc.find(
        d => d.name_en === curr.department_en && d.name_th === curr.department_th
      );

      if (existingDept) {
        existingDept.roles.push({
          title_th: curr.role_th,
          title_en: curr.role_en,
          type: curr.type
        });
      } else {
        acc.push({
          name_th: curr.department_th,
          name_en: curr.department_en,
          roles: [{
            title_th: curr.role_th,
            title_en: curr.role_en,
            type: curr.type
          }]
        });
      }

      return acc;
    }, [] as Department[]);

    const state: ProfessionState = {
      initialized: true,
      version: CURRENT_VERSION,
      departments,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  } catch (error) {
    console.error('Error initializing profession data:', error);
    return {
      initialized: false,
      version: CURRENT_VERSION,
      departments: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

export function searchProfessions(
  query: string,
  departments: Department[]
): SearchResult[] {
  if (!query || query.length < 2) return [];

  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  departments.forEach(dept => {
    dept.roles.forEach(role => {
      const matchScore = calculateMatchScore(
        lowerQuery,
        dept.name_th,
        dept.name_en,
        role.title_th,
        role.title_en
      );

      if (matchScore > 0) {
        results.push({
          department: dept,
          role,
          matchScore
        });
      }
    });
  });

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
}

function calculateMatchScore(
  query: string,
  deptTh: string,
  deptEn: string,
  roleTh: string,
  roleEn: string
): number {
  let score = 0;
  const fields = [
    { text: deptTh.toLowerCase(), weight: 1 },
    { text: deptEn.toLowerCase(), weight: 1 },
    { text: roleTh.toLowerCase(), weight: 2 },
    { text: roleEn.toLowerCase(), weight: 2 }
  ];

  fields.forEach(({ text, weight }) => {
    if (text === query) score += 100 * weight;
    else if (text.startsWith(query)) score += 50 * weight;
    else if (text.includes(query)) score += 25 * weight;
  });

  return score;
}