// SafeChara AI Analysis Service
// Sends feed images to the Python backend for visual screening analysis.
// The backend URL is read from the EXPO_PUBLIC_BACKEND_URL environment variable.

import { uploadImageToCloudinary } from '../config/cloudinaryConfig';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface VisualScreeningResult {
  // Visual heuristic results from the Python backend
  qualityScore: number;
  mouldDetected: boolean;
  mouldRiskScore: number;
  sandDetected: boolean;
  sandRiskScore: number;
  insectDetected: boolean;
  insectRiskScore: number;
  // Recommendation from backend
  recommendationStatus: string;
  recommendationColor: string;
  recommendationMessage: string;
  // Simulated sensor values (not yet measured by backend)
  proteinPct: string;
  moisturePct: string;
  fiberPct: string;
  phValue: string;
  conductivityValue: number;
  // Flags mapped from visual screening
  ureaFlag: boolean;
}

/**
 * Upload a feed image to Cloudinary, then send the URL to the
 * Python backend for visual screening analysis.
 */
export const analyzeSample = async (
  sampleType: 'Feed' | 'Silage',
  options: {
    imageUri?: string;
    cattleType?: string;
    cattleCondition?: string;
  }
): Promise<VisualScreeningResult> => {
  const { imageUri, cattleType, cattleCondition } = options;

  // --- Step 1: Upload the image to Cloudinary ---
  let imageUrl: string | undefined;
  if (imageUri) {
    try {
      imageUrl = await uploadImageToCloudinary(imageUri);
    } catch (err) {
      console.error('Cloudinary upload failed, continuing without image:', err);
    }
  }

  // --- Step 2: Call the Python backend ---
  if (imageUrl) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          animal: cattleType === 'buffalo' ? 'Buffalo' : 'Cow',
          condition: cattleCondition || 'Normal',
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Map the Python backend response to the frontend's expected shape.
        // Chemical properties (protein, pH, etc.) are simulated since the
        // backend only performs visual screening at this prototype stage.
        return {
          qualityScore: data.visual_screening?.quality_score ?? 0,
          mouldDetected: data.visual_screening?.mould?.present ?? false,
          mouldRiskScore: data.visual_screening?.mould?.risk_score ?? 0,
          sandDetected: data.visual_screening?.sand_foreign_particles?.present ?? false,
          sandRiskScore: data.visual_screening?.sand_foreign_particles?.risk_score ?? 0,
          insectDetected: data.visual_screening?.insect_pest?.present ?? false,
          insectRiskScore: data.visual_screening?.insect_pest?.risk_score ?? 0,
          recommendationStatus: data.recommendation?.status ?? 'UNKNOWN',
          recommendationColor: data.recommendation?.color ?? 'YELLOW',
          recommendationMessage: data.recommendation?.message ?? '',
          // Simulated sensor values (backend does not measure these yet)
          proteinPct: (Math.random() * 10 + 10).toFixed(1),
          moisturePct: (Math.random() * 20 + 40).toFixed(1),
          fiberPct: (Math.random() * 15 + 15).toFixed(1),
          phValue: (Math.random() * 2 + 4).toFixed(1),
          conductivityValue: Math.floor(Math.random() * 500 + 1000),
          // Map sand detection to the urea flag placeholder
          ureaFlag: false,
        };
      }

      console.warn('Backend returned success=false:', data.error);
    } catch (err) {
      console.error('Backend analysis failed, falling back to mock:', err);
    }
  }

  // --- Fallback: fully simulated results (no image or backend unavailable) ---
  return {
    qualityScore: 75,
    mouldDetected: Math.random() > 0.8,
    mouldRiskScore: 0.1,
    sandDetected: Math.random() > 0.9,
    sandRiskScore: 0.05,
    insectDetected: false,
    insectRiskScore: 0.05,
    recommendationStatus: 'CAUTION',
    recommendationColor: 'YELLOW',
    recommendationMessage: 'Results are simulated. No backend connection.',
    proteinPct: (Math.random() * 10 + 10).toFixed(1),
    moisturePct: (Math.random() * 20 + 40).toFixed(1),
    fiberPct: (Math.random() * 15 + 15).toFixed(1),
    phValue: (Math.random() * 2 + 4).toFixed(1),
    conductivityValue: Math.floor(Math.random() * 500 + 1000),
    ureaFlag: false,
  };
};
