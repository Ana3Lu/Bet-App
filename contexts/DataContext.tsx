import { supabase } from "@/utils/supabase";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

interface DataContextProps {
  users: any[];
  chats: any[];
  getUsers: () => Promise<any[]>;
  getChats: () => Promise<any[]>;
  getSingleChat: (id: string) => any;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext); // Authenticated user
  const [users, setUsers] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  // Obtain other users
  const getUsers = useCallback(async () => {
    if (!user) return [];
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;

      const filtered = data?.filter((u) => u.id !== user.id) ?? [];
      setUsers(filtered);
      return filtered;
    } catch (err) {
      console.log("Error getUsers:", err);
      return [];
    }
  }, [user]);

  // Obtain related chats
  const getChats = useCallback(async () => {
    if (!user) return [];
    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*, user:user_id(*), user1:user_id2(*), messages(*)")
        .or(`user_id.eq.${user.id},user_id2.eq.${user.id}`);
      if (error) throw error;

      setChats(data ?? []);
      return data ?? [];
    } catch (err) {
      console.log("Error getChats:", err);
      return [];
    }
  }, [user]);

  const getSingleChat = (id: string) => {
    return chats.find((c) => c.id === id);
  };

  useEffect(() => {
    if (user) {
      getUsers();
      getChats();
    }
  }, [user, getUsers, getChats]);

  return (
    <DataContext.Provider 
        value={{ 
            users, 
            chats, 
            getUsers, 
            getChats, 
            getSingleChat 
        }}>
    
        {children}
    </DataContext.Provider>
  );
};