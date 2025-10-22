import { API_BASE_URL } from './supabase/client';

// Auto-initialize storage on first upload attempt
let storageInitialized = false;
let storageInitializing = false;

export async function ensureStorageInitialized(): Promise<boolean> {
  // Already initialized
  if (storageInitialized) {
    return true;
  }

  // Already initializing
  if (storageInitializing) {
    // Wait for the ongoing initialization
    let attempts = 0;
    while (storageInitializing && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    return storageInitialized;
  }

  storageInitializing = true;

  try {
    console.log('🔧 Checking storage status...');
    
    // Check if storage exists
    const statusResponse = await fetch(`${API_BASE_URL}/api/admin/storage-status`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (statusResponse.ok) {
      const status = await statusResponse.json();
      
      if (status.exists) {
        console.log('✅ Storage bucket already exists');
        storageInitialized = true;
        storageInitializing = false;
        return true;
      }

      console.log('⚠️ Storage bucket does not exist, initializing...');
      
      // Initialize storage
      const initResponse = await fetch(`${API_BASE_URL}/api/admin/init-storage`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (initResponse.ok) {
        const result = await initResponse.json();
        console.log('✅ Storage initialized:', result);
        storageInitialized = true;
        storageInitializing = false;
        return true;
      } else {
        console.warn('⚠️ Could not initialize storage, but uploads may still work');
        storageInitializing = false;
        return false;
      }
    } else {
      console.warn('⚠️ Could not check storage status');
      storageInitializing = false;
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking/initializing storage:', error);
    storageInitializing = false;
    return false;
  }
}

// Auto-check storage on app load
export async function autoCheckStorage(): Promise<void> {
  try {
    // Wait a bit for the app to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('🔍 Auto-checking storage on app load...');
    await ensureStorageInitialized();
  } catch (error) {
    console.warn('⚠️ Auto-check storage failed (non-critical):', error);
  }
}
