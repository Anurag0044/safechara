import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { uploadImageToCloudinary } from '../config/cloudinaryConfig';
import { auth, db } from '../config/firebaseConfig';

type SampleType = 'Feed' | 'Silage';

interface SaveTestRecordInput {
  sampleType: SampleType;
  cattleType?: string;
  cattleCondition?: string;
  imageUri?: string;
  result: any;
  advisoryText: {
    en: string;
    hi?: string;
  };
}

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const saveTestRecord = async ({ sampleType, cattleType, cattleCondition, imageUri, result, advisoryText }: SaveTestRecordInput) => {
  if (!auth.currentUser) {
    throw new Error('No authenticated user.');
  }

  const imageUrl = imageUri ? await uploadImageToCloudinary(imageUri) : '';

  const record = {
    userId: auth.currentUser.uid,
    sampleType: sampleType.toLowerCase(),
    cattleType: sampleType === 'Feed' ? cattleType || '' : '',
    cattleCondition: sampleType === 'Feed' ? cattleCondition || '' : '',
    imageUrl,
    proteinPct: toNumber(result.proteinPct),
    moisturePct: toNumber(result.moisturePct),
    fiberPct: toNumber(result.fiberPct),
    phValue: toNumber(result.phValue),
    conductivityValue: toNumber(result.conductivityValue),
    mouldDetected: Boolean(result.mouldDetected),
    ureaAdulterationFlag: Boolean(result.ureaFlag),
    sandContaminationFlag: Boolean(result.sandFlag),
    advisoryText,
    timestamp: serverTimestamp(),
    syncStatus: 'Synced',
  };

  return addDoc(collection(db, 'test_records'), record);
};
