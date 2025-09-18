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
  resetPasswordSimulated: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Keep session active
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
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

      if (error || !data.user) {
        console.log("❌ Login error:", error?.message);
        alert("Login failed: " + (error?.message || "Invalid credentials"));
        return false;
      }

      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        console.log("❌ Profile not found for this user");
        alert("Profile not found. Please contact support.");
        return false;
      }

      setUser(profile);
      return true;
    } catch (err) {
      console.log("Unexpected login error:", err);
      alert("Unexpected error while logging in.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register (create user + profile)
  const register = async (name: string, email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      console.log("❌ Auth signUp error:", error?.message);
      alert("Registration failed: " + error?.message);
      return false;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name: name.trim(),
        email: email.trim(),
        points: 0,
        bio: "hello!",
      });

    if (profileError) {
      console.log("❌ Error inserting profile:", profileError.message);
      alert("Error creating profile: " + profileError.message);
      return false;
    }

    return true;
  } catch (err) {
    console.log("Unexpected registration error:", err);
    alert("Unexpected error during registration.");
    return false;
  } finally {
    setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id)
        .select()
        .single();

      if (error || !data) {
        console.log("❌ Update profile error:", error?.message);
        alert("Failed to update profile: " + error?.message);
        setIsLoading(false);
        return false;
      }

      setUser(data);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.log("Unexpected error updating profile:", err);
      alert("Unexpected error while updating profile.");
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
        console.log(`Simulating password reset for: ${email}`);
        alert(
        `If exists an account with ${email}, we will send you an email with instructions to reset your password...`
        );
        return true;
    } catch (err) {
        console.log("Unexpected reset error:", err);
        alert("Unexpected error while simulating reset.");
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
