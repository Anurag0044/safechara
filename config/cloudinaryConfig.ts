export const cloudinaryConfig = {
  cloudName: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  apiBaseUrl: process.env.EXPO_PUBLIC_CLOUDINARY_API_BASE_URL || 'https://api.cloudinary.com/v1_1',
};

export const uploadImageToCloudinary = async (imageUri: string): Promise<string> => {
  const { cloudName, uploadPreset, apiBaseUrl } = cloudinaryConfig;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are missing.');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: `safechara-${Date.now()}.jpg`,
  } as any);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`${apiBaseUrl}/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message || 'Cloudinary upload failed.');
  }

  return payload.secure_url;
};
