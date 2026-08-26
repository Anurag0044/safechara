export const cloudinaryConfig = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiBaseUrl: process.env.EXPO_PUBLIC_CLOUDINARY_API_BASE_URL || 'https://api.cloudinary.com/v1_1',
};

import * as FileSystem from 'expo-file-system';

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  const { cloudName, uploadPreset, apiBaseUrl } = cloudinaryConfig;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  const uploadUrl = `${apiBaseUrl}/${cloudName}/image/upload`;

  try {
    const uploadResult = await FileSystem.uploadAsync(uploadUrl, imageUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      parameters: {
        upload_preset: uploadPreset,
      },
    });

    if (uploadResult.status !== 200) {
      throw new Error(`Upload failed with status ${uploadResult.status}`);
    }

    const payload = JSON.parse(uploadResult.body);

    if (!payload.secure_url) {
      throw new Error(payload.error?.message || 'Cloudinary upload failed.');
    }

    return payload.secure_url;
  } catch (error: any) {
    console.error('FileSystem uploadAsync error:', error);
    throw new Error(error.message || 'Network request failed. Please check your internet connection.');
  }
};
