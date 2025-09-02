import { useEffect, useState } from 'react';
// FIX: Update Firebase imports for v8.
// Fix: Corrected Firebase imports to use the v9 compatibility layer. This provides the v8 namespaced API and resolves the error where the `firebase.User` type was not found.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase/config';

export function useAuth() {
    // FIX: Use User type from firebase namespace for v8.
    const [user, setUser] = useState<firebase.User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // FIX: Use v8 syntax for auth state listener.
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
}
