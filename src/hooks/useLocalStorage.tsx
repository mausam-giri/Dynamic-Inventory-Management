import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const readValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T | []>(readValue);

  const setValue = (value: T | []) => {
    try {
      const valueToStore = value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const clearValue = () => {
    try {
      if (!confirm("Are you sure to delete all records.")) return;
      window.localStorage.removeItem(key);
      setValue([]);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  };

  const setInitialValue = () => {
    try {
      if (!confirm("Are you sure to reset to default.")) return;
      const item = window.localStorage.getItem(key);
      if (item) window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error(`Error getting initial value: ${error}`);
    }
  };

  return { storedValue, setValue, clearValue, setInitialValue } as const;
}
