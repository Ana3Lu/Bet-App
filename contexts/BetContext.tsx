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
  participations: string[];
  fetchBets: () => Promise<void>;
  fetchParticipations: () => Promise<void>;
  createBet: (bet: Omit<Bet, "id" | "created_at">) => Promise<void>;
  editBet: (id: string, updatedBet: Partial<Omit<Bet, "id" | "created_at">>) => Promise<void>;
  deleteBet?: (id: string) => Promise<void>;
  closeBet: (betId: string, winnerId: string) => Promise<void>;
}

export const BetContext = createContext({} as BetContextProps);

export const BetProvider = ({ children }: any) => {
  const { user } = useContext(AuthContext);
  const [bets, setBets] = useState<Bet[]>([]);
  const [participations, setParticipations] = useState<string[]>([]);

  const fetchBets = useCallback(async () => {
    const { data, error } = await supabase
      .from("bets")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setBets(data as Bet[]);
  }, []);

  const fetchParticipations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("bets_participations")
      .select("bet_id")
      .eq("player_id", user.id);

    if (!error && data) setParticipations(data.map(p => p.bet_id));
    }, [user]);

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

  const closeBet = useCallback(async (betId: string, winnerId: string) => {
    const { error: betError } = await supabase
      .from("bets")
      .update({ status: "CLOSED" })
      .eq("id", betId);

    if (betError) throw betError;

    const { data: participants } = await supabase
      .from("bets_participations")
      .select("id, player_id")
      .eq("bet_id", betId);

    if (participants && participants.length > 0) {
      for (const p of participants) {
        const { error } = await supabase
          .from("bets_participations")
          .update({ status: p.player_id === winnerId ? "WON" : "LOST" })
          .eq("id", p.id);

        if (error) throw error;
      }
    }

    await fetchBets();
  }, [fetchBets]);

  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  return (
    <BetContext.Provider value={{ bets, participations, fetchBets, fetchParticipations, createBet, editBet, deleteBet, closeBet }}>
      {children}
    </BetContext.Provider>
  );
};
