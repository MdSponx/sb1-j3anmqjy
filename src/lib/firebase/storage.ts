import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { storage } from './services';
import { db } from './services';
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB - matches rule limit
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;

function createUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  return `${timestamp}_${randomString}.${extension}`;
}

// For user files
export async function uploadUserFile(
  userId: string,
  file: File,
  type: 'profile_image' | 'cover_image' | 'id_card_image' | 'payment_slip',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must not exceed 10MB. Please choose a smaller file.');
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPG and PNG images are allowed. Please select a valid image file.');
  }

  try {
    // Create storage reference with timestamp to avoid name conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${type}/${userId}/${filename}`);
    
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
          let errorMessage = 'Failed to upload file. Please try again.';
          
          if (error.code === 'storage/unauthorized') {
            errorMessage = 'You do not have permission to upload this file.';
          } else if (error.code === 'storage/canceled') {
            errorMessage = 'Upload was canceled. Please try again.';
          } else if (error.code === 'storage/retry-limit-exceeded') {
            errorMessage = 'Poor network connection. Please check your internet and try again.';
          }
          
          reject(new Error(errorMessage));
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

async function verifyAdminAccess(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error('User document not found');
      return false;
    }
    
    const userData = userSnap.data();
    return userData?.web_role === 'admin' || userData?.web_role === 'editor';
  } catch (error) {
    console.error('Error verifying admin access:', error);
    return false;
  }
}

export async function uploadEventFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Check authentication
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    // Verify admin/editor role
    const hasAccess = await verifyAdminAccess(user.uid);
    if (!hasAccess) {
      throw new Error('You must have admin or editor privileges to upload files');
    }

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must not exceed 10MB');
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
      throw new Error('Only JPG, PNG, GIF and WebP images are allowed');
    }

    // Create unique filename
    const filename = createUniqueFilename(file.name);
    
    // Create storage reference in root events folder
    const storageRef = ref(storage, `events/${filename}`);
    
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
          console.error('Upload error:', {
            code: error.code,
            message: error.message,
            serverResponse: error.serverResponse
          });
          
          switch (error.code) {
            case 'storage/unauthorized':
              reject(new Error('Permission denied. Please verify your admin access.'));
              break;
            case 'storage/canceled':
              reject(new Error('Upload was canceled'));
              break;
            case 'storage/retry-limit-exceeded':
              reject(new Error('Poor network connection. Please try again'));
              break;
            default:
              reject(new Error(`Upload failed: ${error.message}`));
          }
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(new Error('Failed to get download URL'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload preparation error:', error);
    throw error;
  }
}