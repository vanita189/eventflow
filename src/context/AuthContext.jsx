import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../config/supabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    
    // const [profileLoading, setProfileLoading] = useState(false);

    // //fetch user profile
    // const fetchProfile = async (userId) => {
    //     setProfileLoading(true);

    //     const { data, error } = await supabase
    //         .from("profiles")
    //         .select("*")
    //         .eq("id", userId)
    //         .maybeSingle();

    //     if (!error) setProfile(data);

    //     setProfileLoading(false);
    // };

    // useEffect(() => {
    //     const initAuth = async () => {
    //         const { data } = await supabase.auth.getSession();
    //         const sessionUser = data?.session?.user || null;

    //         setUser(sessionUser);
    //         setLoading(false); // ✅ UI should not wait for profile

    //         if (sessionUser) {
    //             fetchProfile(sessionUser.id); // ✅ async profile fetch
    //         }
    //     };

    //     initAuth();

    //     const { data: listener } = supabase.auth.onAuthStateChange(
    //         (_event, session) => {
    //             const sessionUser = session?.user || null;
    //             setUser(sessionUser);
    //             setLoading(false);

    //             if (sessionUser) {
    //                 fetchProfile(sessionUser.id);
    //             } else {
    //                 setProfile(null);
    //             }
    //         }
    //     );

    //     return () => listener.subscription.unsubscribe();
    // }, []);

    // In AuthContext.jsx
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
            setProfile(data); // add profile to context
        };
        fetchProfile();
    }, [user]);


    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);
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

        console.log("LOGIN DATA:", data);
        console.log("LOGIN ERROR:", error);
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
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, profile, signup, login, logout, loading, forgotPassword }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
