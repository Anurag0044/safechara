import AsyncStorage from '@react-native-async-storage/async-storage';
import { TestRecord } from '../types';

const STORAGE_KEY = '@safechara_history';

export const saveTestRecord = async (record: TestRecord) => {
  try {
    const existing = await getTestRecords();
    const updated = [record, ...existing];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save record', e);
  }
};

export const getTestRecords = async (): Promise<TestRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get records', e);
    return [];
  }
};
