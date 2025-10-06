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
  avatar_url?: string;
  role?: string;
}

interface AuthContextProps {
  user: Profile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      //console.log("Session:", session);
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

      if (error) {
        console.log("❌ Login error:", error.message);
        alert("Login failed: " + (error.message || "Invalid credentials"));
        return false;
      }

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
    } finally {
      setIsLoading(false);
    }
  }

  // Register (create user + profile)
  const register = async (name: string, email: string, password: string) => {
  setIsLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    //console.log(">>> Auth signUp:", { data, error });

    if (error || !data.user) {
      console.log("❌ Auth signUp error:", error?.message);
      alert("Registration failed: " + error?.message);
      return false;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user?.id,
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

    setUser({ id: data.user.id, name, email, points: 0 });
    alert("Registration successful! You can now log in.");
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
        if (!email || !email.includes("@") || !email.includes(".")) {
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
