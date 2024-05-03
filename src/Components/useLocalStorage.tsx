import { useState, useEffect } from "react";

function getStorageValue<Type>(key: string, defaultValue: Type): Type {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = (saved ? JSON.parse(saved) : null);
  return initial || defaultValue;
}

export function useLocalStorage<Type>(key: string, defaultValue: Type): [Type, (value: Type) => void] {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}