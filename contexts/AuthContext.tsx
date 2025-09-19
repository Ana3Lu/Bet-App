import { router } from "expo-router";
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
  register: (user: any, password: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<any>) => Promise<boolean>;
  setUser: (user: any | null) => void;
  logout: () => Promise<void>;
  resetPasswordSimulated: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null as any);
  const [isLoading, setIsLoading] = useState(false);

  // Keep session active
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("✅ Active session on app start:", session);
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
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("👉 Login result:", { data, error });

      if (error) {
        console.log("❌ Login error:", error.message);
        alert("Login failed: " + (error.message || "Invalid credentials"));
        return false;
      }

      setIsLoading(false);

      if (data.user) {
        console.log("✅ Login success, loading profile...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select('*')
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          console.error("❌ Profile not found for this user:", profileError.message);
          // Use basic profile if none exists
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.email?.split('@')[0] || 'Unknown',
            bio: "hello!",
            phone: "",
            gender: "",
            points: 0
          });
        } else {
          setUser(profile);
        }

        return true;
      }

      return false;
    } catch (err) {
      console.log("Unexpected login error:", err);
      return false;
    }
  }

  // Register 
  const register = async (user: any, password: string) => {
    try {
      setIsLoading(true);
      console.log(">>> REGISTER:", { user, password });
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password,
        options: { data: { name: user.name } }
      });
      console.log("👉 Register result:", { data, error });

      if (error) {
        console.log("❌ Auth signUp error:", error.message);
        alert("Registration failed: " + (error.message || "Unknown error"));
        throw new Error(error.message);
      }

      console.log("✅ Auth signUp success, creating profile...");
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            name: user.name || user.email.split('@')[0],
            email: user.email,
            phone: "",
            gender: "",
            points: 0,
            bio: "hello!"
          });

        console.log("👉 Profile insert result:", { profileError });

        if (profileError) {
          console.error("❌ Error inserting profile:", profileError.message);
          throw new Error("Error inserting profile: " + profileError.message);
        }

        setUser({
          id: data.user.id,
          email: data.user.email,
          name: user.name || user.email.split('@')[0],
          phone: "",
          gender: "",
          points: 0,
          bio: "hello!"
        });

        setIsLoading(false);

        console.log("✅ Profile created, logging in...");
        alert("Registration successful!");

        const loginResult = await login(user.email, password);
        if (loginResult) {
          router.replace("/main/(tabs)/home");
        }
        return true;
      } else {
        console.error("❌ No user data returned after signUp.");
        return false;
      }     
      
    } catch (err) {
      console.error("Unexpected registration error:", err);
      return false;
    }
  };

  // Update profile
  const updateProfile = async (profileData: Partial<any>) => {
    if (!user?.id) {
      alert("No user logged in.");
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ ...profileData, updated_at: new Date().toISOString})
        .eq("id", user.id);

      if (error) {
        console.error("❌ Update profile error:", error.message);
        throw new Error(error.message);
      }

      setUser({ ...user, ...profileData });
      return true;
    } catch (err) {
      console.error("Unexpected update profile error:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Reset password 
  const resetPasswordSimulated = async (email: string) => {
    setIsLoading(true);
    try {
        // Simulate password reset
        if (!email || !email.includes("@")) {
        alert("Please provide an email address.");
        return false;
        }
        console.log(`Simulating password reset for: ${email}`);
        alert(
        `If exists an account with ${email}, we will send you an email to reset your password...`
        );
        return true;
    } catch (err) {
        console.error("Unexpected reset password error:", err);
        return false;
    } finally {
        setIsLoading(false);
    }
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
        resetPasswordSimulated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
