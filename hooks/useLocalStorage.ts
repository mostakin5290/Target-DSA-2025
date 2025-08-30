
import { useState } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            if (!item) {
                return initialValue;
            }
            // Handle Set deserialization
            if (initialValue instanceof Set) {
                return new Set(JSON.parse(item)) as T;
            }
            // Handle Map deserialization
            if (initialValue instanceof Map) {
                return new Map(JSON.parse(item)) as T;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                // Handle Set serialization
                if (valueToStore instanceof Set) {
                    window.localStorage.setItem(key, JSON.stringify(Array.from(valueToStore.values())));
                } 
                // Handle Map serialization
                else if (valueToStore instanceof Map) {
                     window.localStorage.setItem(key, JSON.stringify(Array.from(valueToStore.entries())));
                }
                else {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            }
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
