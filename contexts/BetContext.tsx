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
  favorites_count?: number;
}

interface BetContextProps {
  bets: Bet[];
  participations: string[];
  favorites: string[];
  fetchFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (betId: string, userId: string) => Promise<void>;
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
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchFavorites = useCallback(async (userId: string) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("bet_favorites")
      .select("bet_id")
      .eq("user_id", userId);
    if (!error) setFavorites(data.map((f) => f.bet_id));
  }, []);

  const toggleFavorite = useCallback(async (betId: string, userId: string) => {
    if (!userId) return;
    const isFav = favorites.includes(betId);

    if (isFav) {
      await supabase
        .from("bet_favorites")
        .delete()
        .eq("bet_id", betId)
        .eq("user_id", userId);

      // ↓ resta 1 del contador
      await supabase.rpc("decrement_favorites", { bet_id_input: betId });

      setFavorites((prev) => prev.filter((id) => id !== betId));
    } else {
      await supabase.from("bet_favorites").insert({ bet_id: betId, user_id: userId });

      // ↓ suma 1 al contador
      await supabase.rpc("increment_favorites", { bet_id_input: betId });

      setFavorites((prev) => [...prev, betId]);
    }
  }, [favorites]);

  const fetchBets = useCallback(async () => {
    const { data, error } = await supabase
      .from("bets")
      .select("*, bet_favorites(count)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const formatted = data.map((b: any) => ({
        ...b,
        favorites_count: b.bet_favorites[0]?.count || 0
      }));
      setBets(formatted);
    }
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
    <BetContext.Provider value={{ bets, participations, favorites, fetchFavorites, toggleFavorite, fetchBets, fetchParticipations, createBet, editBet, deleteBet, closeBet }}>
      {children}
    </BetContext.Provider>
  );
};
