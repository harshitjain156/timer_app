import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T = any>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function setItem<T = any>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function mergeItem<T = any>(key: string, value: Partial<T>): Promise<void> {
  const existing = await getItem<T>(key);
  const merged = { ...existing, ...value };
  await setItem(key, merged);
} 