import { useState, useCallback, useEffect, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { Director, DirectorData, SearchState } from '../types/director';

export function useDirectorSearch() {
  const { db } = useFirebase();
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    results: null,
    isSearching: false,
    error: null
  });
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce search query with 800ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchState.query);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchState.query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchState(prev => ({
        ...prev,
        results: [],
        isSearching: false,
        error: null
      }));
      return;
    }

    const performSearch = async () => {
      // Cancel previous search if it's still in progress
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setSearchState(prev => ({
        ...prev,
        isSearching: true,
        error: null
      }));

      try {
        const directorsRef = collection(db, 'directors');
        const q = query(
          directorsRef,
          where('Director', '>=', debouncedQuery),
          where('Director', '<=', debouncedQuery + '\uf8ff')
        );

        // Check if search was aborted
        if (abortController.signal.aborted) return;

        const querySnapshot = await getDocs(q);
        const directors: Director[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as DirectorData;
          const moviesList = data.Movies
            ? data.Movies.split('•')
                .filter(movie => movie.trim())
                .map(movie => movie.trim())
            : [];
          
          return {
            id: doc.id,
            name: data.Director,
            movies: moviesList,
            totalWorks: data['Total Work'] || moviesList.length
          };
        });

        if (!abortController.signal.aborted) {
          setSearchState(prev => ({
            ...prev,
            results: directors,
            isSearching: false
          }));
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          setSearchState(prev => ({
            ...prev,
            results: [],
            isSearching: false,
            error: error as Error
          }));
        }
      }
    };

    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery, db]);

  const searchDirectors = useCallback((searchQuery: string) => {
    setSearchState(prev => ({
      ...prev,
      query: searchQuery
    }));
  }, []);

  const clearSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSearchState({
      query: '',
      results: [],
      isSearching: false,
      error: null
    });
  }, []);

  return {
    searchState,
    searchDirectors,
    clearSearch
  };
}