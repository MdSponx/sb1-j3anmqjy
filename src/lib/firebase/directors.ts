import { Firestore, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import type { Director, DirectorData } from '../../types/director';
import { getLatestWorkYear } from './membership';

export async function searchDirectorByName(db: Firestore, name: string): Promise<{
  director: Director | null;
  directorData: DirectorData | null;
}> {
  try {
    const directorsRef = collection(db, 'directors');
    const q = query(
      directorsRef,
      where('Director', '>=', name),
      where('Director', '<=', name + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return { director: null, directorData: null };

    const doc = querySnapshot.docs[0];
    const data = doc.data() as DirectorData;
    
    const moviesList = data.Movies
      ? data.Movies.split('•')
          .filter((movie: string) => movie.trim())
          .map((movie: string) => movie.trim())
      : [];

    const director: Director = {
      id: doc.id,
      name: data.Director,
      movies: moviesList,
      totalWorks: data['Total Work'] || moviesList.length,
      latestWorkYear: getLatestWorkYear(data)
    };

    return { director, directorData: data };
  } catch (err) {
    console.error('Error searching director:', err);
    return { director: null, directorData: null };
  }
}