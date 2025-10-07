import { supabase } from "@/utils/supabase";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export interface Bet {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  cost: number;
  commission: number;
  created_at: string;
  ends_at?: string | null;
  status: "ACTIVE" | "CLOSED";
}

interface BetContextProps {
  bets: Bet[];
  fetchBets: () => Promise<void>;
  createBet: (bet: Omit<Bet, "id" | "created_at">) => Promise<void>;
  editBet: (id: string, updatedBet: Partial<Omit<Bet, "id" | "created_at">>) => Promise<void>;
  deleteBet?: (id: string) => Promise<void>;
}

export const BetContext = createContext({} as BetContextProps);

export const BetProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext);
  const [bets, setBets] = useState<Bet[]>([]);

  const fetchBets = useCallback(async () => {
    const { data, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBets(data as Bet[]);
  }, []);

  const createBet = useCallback(
    async (bet: Omit<Bet, "id" | "created_at">) => {
      const { error } = await supabase.from("bets").insert([{ ...bet, created_by: user?.id }]);
      if (error) throw error;
      await fetchBets();
    },
    [user, fetchBets]
  );

  const editBet = useCallback(
    async (id: string, updatedBet: Partial<Omit<Bet, "id" | "created_at">>) => {
      const { error } = await supabase
        .from("bets")
        .update(updatedBet)
        .eq("id", id);

      if (!error) fetchBets();
    },
    [fetchBets]
  );

  const deleteBet = useCallback(async (id: string) => {
    const { error } = await supabase.from("bets").delete().eq("id", id);
    if (!error) fetchBets();
  }, [fetchBets]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  return (
    <BetContext.Provider value={{ bets, fetchBets, createBet, editBet, deleteBet }}>
      {children}
    </BetContext.Provider>
  );
};
