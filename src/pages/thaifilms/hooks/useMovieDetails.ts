import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';

interface Director {
  name: string;
  name_en?: string;
  photo?: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  status: string;
}

interface MovieDetails {
  id: string;
  title: string;
  titleEng: string;
  director: string;
  rating: string;
  box_office: string;
  cast: string;
  genre: string;
  length: number;
  poster: string;
  production_house: string;
  release_date: string;
  studio: string;
  subgenre: string;
  synopsis: string;
  trailer_url: string;
  year_be: number;
  year_ce: number;
}

export function useMovieDetails(movieId: string) {
  const { db } = useFirebase();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError(new Error('No movie ID provided'));
        setLoading(false);
        return;
      }

      try {
        // Fetch movie data
        const movieDoc = await getDoc(doc(db, 'movies', movieId));
        if (!movieDoc.exists()) {
          throw new Error('Movie not found');
        }

        const data = movieDoc.data();
        if (!data) {
          throw new Error('Movie data is empty');
        }

        // Validate and transform movie data
        const movieData: MovieDetails = {
          id: movieDoc.id,
          title: data.Movie || '',
          titleEng: data.movieEng || '',
          director: data.Director || '',
          rating: data.Rating || data.rating || '',
          box_office: data.box_office || '',
          cast: data.cast || '',
          genre: data.genre || '',
          length: typeof data.length === 'string' ? parseInt(data.length) || 0 : data.length || 0,
          poster: data.poster || '',
          production_house: data.production_house || '',
          release_date: data.release_date || '',
          studio: data.studio || '',
          subgenre: data.subgenre || '',
          synopsis: data.synopsis || '',
          trailer_url: data.trailer || '',
          year_be: typeof data.year_be === 'string' ? parseInt(data.year_be) : data.year_be || 0,
          year_ce: typeof data.year_ce === 'string' ? parseInt(data.year_ce) : data.year_ce || 0
        };

        if (isMounted) {
          setMovie(movieData);
        }

        // Fetch director data if available
        if (data.Director) {
          const directorNames = data.Director.split(',')
            .map((name: string) => name.trim())
            .filter(Boolean);

          const directorsData: Director[] = [];
          
          for (const directorName of directorNames) {
            if (!isMounted) break;

            try {
              // First try to find in users collection
              const usersQuery = query(
                collection(db, 'users'),
                where('fullname_th', '==', directorName),
                where('occupation', '==', 'director'),
                where('verification_status', '==', 'approved')
              );
              const usersSnapshot = await getDocs(usersQuery);
              
              if (!usersSnapshot.empty) {
                const userData = usersSnapshot.docs[0].data();
                directorsData.push({
                  name: userData.fullname_th,
                  name_en: userData.fullname_en,
                  photo: userData.profile_image_url
                });
                continue;
              }

              // If not found in users, try directors collection
              const directorsQuery = query(
                collection(db, 'directors'),
                where('Director', '==', directorName)
              );
              const directorsSnapshot = await getDocs(directorsQuery);
              
              if (!directorsSnapshot.empty) {
                const directorData = directorsSnapshot.docs[0].data();
                directorsData.push({
                  name: directorData.Director,
                  name_en: directorData.Director_EN
                });
              } else {
                // If not found in either collection, just add the name
                directorsData.push({ name: directorName });
              }
            } catch (directorErr) {
              console.error(`Error fetching director data for ${directorName}:`, directorErr);
              // Don't throw, just add the name
              directorsData.push({ name: directorName });
            }
          }

          if (isMounted) {
            setDirectors(directorsData);
          }
        }

        // Fetch crew data
        try {
          const creditsQuery = query(
            collection(db, 'movie_credits'),
            where('movieId', '==', movieId),
            where('status', '==', 'approved')
          );

          const creditsSnapshot = await getDocs(creditsQuery);
          const crewData: CrewMember[] = [];

          for (const creditDoc of creditsSnapshot.docs) {
            if (!isMounted) break;

            const creditData = creditDoc.data();
            if (!creditData.userId) continue;

            try {
              const userDoc = await getDoc(doc(db, 'users', creditData.userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                crewData.push({
                  id: creditDoc.id,
                  name: userData.fullname_th || '',
                  role: creditData.role_th || '',
                  photo: userData.profile_image_url,
                  status: creditData.status
                });
              }
            } catch (userErr) {
              console.error(`Error fetching user data for credit ${creditDoc.id}:`, userErr);
            }
          }

          if (isMounted) {
            setCrew(crewData);
          }
        } catch (crewErr) {
          console.error('Error fetching crew data:', crewErr);
          if (isMounted) {
            setCrew([]);
          }
        }

        if (isMounted) {
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch movie details'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [db, movieId]);

  return { movie, directors, crew, loading, error };
}