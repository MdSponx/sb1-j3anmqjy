import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, query, getDocs, updateDoc } from 'firebase/firestore';

export async function migratePosters() {
  const db = getFirestore();
  const storage = getStorage();
  
  try {
    const moviesRef = collection(db, 'movies');
    const snapshot = await getDocs(query(moviesRef));
    
    let migratedCount = 0;
    let errorCount = 0;
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.poster && data.poster.startsWith('data:image')) {
        try {
          // Create a reference to the storage location
          const storageRef = ref(storage, `posters/${doc.id}.jpg`);
          
          // Upload the base64 image
          await uploadString(storageRef, data.poster, 'data_url');
          
          // Get the download URL
          const url = await getDownloadURL(storageRef);
          
          // Update the document with the new URL
          await updateDoc(doc.ref, {
            poster: url
          });
          
          console.log(`Successfully migrated: ${doc.id}`);
          migratedCount++;
        } catch (err) {
          console.error(`Error migrating ${doc.id}:`, err);
          errorCount++;
        }
      }
    }
    
    console.log(`Migration complete. Successfully migrated: ${migratedCount}, Errors: ${errorCount}`);
    return { success: true, migratedCount, errorCount };
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  }
}