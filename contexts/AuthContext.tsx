import { createContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

interface Profile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  gender?: string;
  points?: number;
}

interface AuthContextProps {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  setUser: (user: Profile | null) => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mantener sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
    console.log("✅ Sesión activa al iniciar la app:", session);
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select()
          .eq("id", session.user.id)
          .single();
        if (data) setUser(data);
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select()
            .eq("id", session.user.id)
            .single();
          if (data) setUser(data);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("✅ Sesión Supabase:", data.session);
    console.log("👉 Resultado login:", { data, error });


    if (error || !data.user) {
      console.log("Error en login:", error?.message);
      alert("Error al iniciar sesión: " + error?.message);
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", data.user.id)
      .single();

    if (profileError) {
        console.log("⚠️ No existe perfil en profiles, creando uno nuevo...");

  const { data: newProfile, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: data.user.id,
      name: data.user.user_metadata.full_name,
      email: data.user.email,
      points: 0,
      bio: "hello!",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    console.log("Error al crear perfil automáticamente:", insertError.message);
    setIsLoading(false);
    return false;
  }

  setUser(newProfile);
  setIsLoading(false);
  return true;
}



    if (profile) setUser(profile);
    return true;
  } catch (error) {
    console.log("Error inesperado en login:", error);
    alert("Error inesperado al iniciar sesión");
    return false;
  } finally {
    setIsLoading(false); // 🔥 siempre libera loading
  }
};


  // Registro
  const register = async (name: string, email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("❌ Error en auth.signUp:", error?.message);
      alert("Error al registrar el usuario: " + error?.message);
      return false;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,   // mismo UUID que en auth.users
        name: name.trim(),
        email: email.trim(),
        points: 0,
        bio: "hello!",
      });

    if (profileError) {
      console.log("❌ Error insertando en profiles:", profileError.message);
      alert("Error al registrar el perfil: " + profileError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.log("Error inesperado en registro:", err);
    alert("Error inesperado al registrar el usuario");
    return false;
  } finally {
    setIsLoading(false);
  }
};


  // Actualizar perfil
  const updateProfile = async(profileData: Partial<Profile>) => {
    if (!user) return false;

    setIsLoading(true);
    try {
        const {data, error} = await supabase
            .from("profiles")
            .update(profileData)
            .eq("id", user.id)
            .select()
            .single();

            if (error || !data) {
                console.log("Error en actualización de perfil:", error?.message);
                alert("Error al actualizar el perfil: " + error?.message);
                setIsLoading(false);
                return false;
            }

            setUser(data);
            setIsLoading(false);
            return true;
    } catch (error) {
        console.log("Error inesperado en actualización de perfil:", error);
        alert("Error inesperado al actualizar el perfil");
        setIsLoading(false);
        return false;
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        updateProfile,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};