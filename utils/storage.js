import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storageSet(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('AsyncStorage set error', e);
  }
}

export async function storageGet(key) {
  try {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch (e) {
    console.warn('AsyncStorage get error', e);
    return null;
  }
}

export async function storageRemove(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('AsyncStorage remove error', e);
  }
}
