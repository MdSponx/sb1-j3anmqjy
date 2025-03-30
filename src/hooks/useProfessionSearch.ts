import { useState, useCallback, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { useDebounce } from './useDebounce';
import type { SearchResult } from '../types/profession';

export function useProfessionSearch() {
  const { db } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const searchProfessions = async () => {
      if (debouncedSearch.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const rolesRef = collection(db, 'departmentAndRole');
        const searchTerms = debouncedSearch.toLowerCase().split(' ');
        
        // Create queries for both Thai and English fields
        const queries = searchTerms.map(term => [
          query(rolesRef, where('department_th', '>=', term), where('department_th', '<=', term + '\uf8ff')),
          query(rolesRef, where('department_en', '>=', term), where('department_en', '<=', term + '\uf8ff')),
          query(rolesRef, where('role_th', '>=', term), where('role_th', '<=', term + '\uf8ff')),
          query(rolesRef, where('role_en', '>=', term), where('role_en', '<=', term + '\uf8ff'))
        ]).flat();

        // Execute all queries
        const snapshots = await Promise.all(queries.map(q => getDocs(q)));
        
        // Combine and deduplicate results
        const results = new Map();
        snapshots.forEach(snapshot => {
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            const key = `${data.department_en}-${data.role_en}`;
            
            if (!results.has(key)) {
              results.set(key, {
                department: {
                  name_th: data.department_th,
                  name_en: data.department_en
                },
                role: {
                  title_th: data.role_th,
                  title_en: data.role_en,
                  type: data.type || 'A'
                },
                matchScore: calculateMatchScore(
                  debouncedSearch,
                  data.department_th,
                  data.department_en,
                  data.role_th,
                  data.role_en
                )
              });
            }
          });
        });

        // Convert to array and sort by match score
        const sortedResults = Array.from(results.values())
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 20); // Limit to top 20 results

        setResults(sortedResults);
        setError(null);
      } catch (err) {
        console.error('Error searching professions:', err);
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    searchProfessions();
  }, [db, debouncedSearch]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
  }, []);

  return {
    query: searchQuery,
    results,
    loading,
    error,
    handleSearch,
    clearSearch
  };
}

function calculateMatchScore(
  query: string,
  departmentTh: string,
  departmentEn: string,
  roleTh: string,
  roleEn: string
): number {
  const searchTerms = query.toLowerCase().split(' ');
  let totalScore = 0;

  searchTerms.forEach(term => {
    // Department matches
    if (departmentTh.toLowerCase().includes(term)) totalScore += 10;
    if (departmentEn.toLowerCase().includes(term)) totalScore += 10;
    
    // Role matches (weighted higher)
    if (roleTh.toLowerCase().includes(term)) totalScore += 20;
    if (roleEn.toLowerCase().includes(term)) totalScore += 20;
    
    // Exact matches (highest weight)
    if (roleTh.toLowerCase() === term) totalScore += 30;
    if (roleEn.toLowerCase() === term) totalScore += 30;
    if (departmentTh.toLowerCase() === term) totalScore += 15;
    if (departmentEn.toLowerCase() === term) totalScore += 15;
  });

  return totalScore;
}