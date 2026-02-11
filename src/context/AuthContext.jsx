import { createContext, useState, useEffect, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged , signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [ loading, setLoading] = useState(true);


    const forgotPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    }
    //Auto restore user on refresh
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth , (firebaseUser) =>{
            console.log("FirebaseUSer" , firebaseUser)
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    },[])

    //Signup api
    const signup = async(email,password) => {
        const res = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        console.log("firebase created user", res.user)
        return res.user;
    }

    //login api
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth,email,password)
    }

    //logout
    const logout = () => {
        signOut(auth);
    }

    return(
        <AuthContext.Provider value={{user,signup,login,logout,loading, forgotPassword}}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => useContext(AuthContext);



