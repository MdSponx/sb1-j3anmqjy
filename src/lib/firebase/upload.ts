import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './services';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

interface UploadOptions {
  userId: string;
  file: File;
  type: 'profile_image' | 'id_card_image' | 'payment_slip';
  onProgress?: (progress: number) => void;
}

export async function uploadFile({ userId, file, type, onProgress }: UploadOptions): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPG and PNG images are allowed');
  }

  try {
    // Create storage reference with timestamp to avoid name conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `users/${userId}/${type}/${filename}`);
    
    // Start upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error('Failed to upload file. Please try again.'));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(new Error('Failed to get download URL. Please try again.'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}