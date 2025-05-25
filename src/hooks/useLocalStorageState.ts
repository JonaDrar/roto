
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

function useLocalStorageState<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [internalState, setInternalState] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setInternalState(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
      setIsInitialized(true);
    }
  }, [key]);

  const setValue: SetValue<T> = useCallback((value) => {
    if (typeof window === 'undefined') {
        console.warn(`Tried to set localStorage key “${key}” even though environment is not a client`);
        return;
    }
    try {
      const valueToStore = value instanceof Function ? value(internalState) : value;
      setInternalState(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, internalState]);

  // Effect to update state if localStorage changes in another tab/window
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setInternalState(JSON.parse(event.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      } else if (event.key === key && event.newValue === null) {
        // Handle item removal
        setInternalState(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, isInitialized, initialValue]);
  
  // Return initialValue until client-side hydration and localStorage read is complete
  return [isInitialized ? internalState : initialValue, setValue];
}

export default useLocalStorageState;
