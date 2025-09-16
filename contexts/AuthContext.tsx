import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

// Traer hijos de esa etiqueta, exponiendo todo lo que tenga adentro
interface AuthContextProps {
    user: any,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    
    const [user, setUser] = useState<any>(null);
    const [isLoading,setIsLoading] = useState(false);

    // Mantener sesión en memoria al recargar la 
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setUser(session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            alert("Email and password are required");
            return;
        } 
        setIsLoading(true);

        const response = await supabase.auth.signInWithPassword({ email, password });

        if (response.error) {
            alert(response.error.message);
        } else {
            setUser(response.data.user);
        }
    }

    const register = async (name: string, email: string, password: string) => {
        if (!email || !password || !name) {
            alert("All fields are required");
            return;
        }

        const response = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });

        if (response.error) {
            alert(response.error.message);
        } else {
            setUser(response.data.user);
        }
    };

    const logout = async () => {
        setUser(null);
    }

    return <AuthContext.Provider
        value={{
            user,
            isLoading,
            login,
            register,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
}