import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: object[] | null) {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = (saved ? JSON.parse(saved) : null);
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: object[] | null) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};