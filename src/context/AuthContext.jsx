import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../config/supabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user || null);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    // Signup
    const signup = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    };

    // Login
    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data.user;
    };

    // Forgot Password
    const forgotPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:5173/reset-password", // change for prod
        });

        if (error) throw error;
    };

    // Logout
    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{ user, signup, login, logout, loading, forgotPassword }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
