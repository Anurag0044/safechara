export const cloudinaryConfig = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiBaseUrl: process.env.EXPO_PUBLIC_CLOUDINARY_API_BASE_URL || 'https://api.cloudinary.com/v1_1',
};

// Use the new expo-file-system v2 API (File class) + expo/fetch for multipart uploads.
// FileSystem.uploadAsync from 'expo-file-system' is DEPRECATED in SDK 54+ and throws at runtime.
import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  const { cloudName, uploadPreset, apiBaseUrl } = cloudinaryConfig;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  const uploadUrl = `${apiBaseUrl}/${cloudName}/image/upload`;

  try {
    // Wrap the local file URI in the new File class (implements Blob interface).
    const file = new File(imageUri);

    // Build a multipart/form-data body using standard FormData.
    const formData = new FormData();
    formData.append('file', file as unknown as Blob);
    formData.append('upload_preset', uploadPreset);

    // Use expo/fetch which supports streaming File/Blob bodies on React Native.
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const payload = await response.json();

    if (!payload.secure_url) {
      throw new Error(payload.error?.message || 'Cloudinary upload failed.');
    }

    return payload.secure_url as string;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Network request failed. Please check your internet connection.');
  }
};
