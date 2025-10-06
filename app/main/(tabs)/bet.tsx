import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";
import BetAdminScreen from "../bet-admin";
import BetClientScreen from "../bet-client";

export default function BetTab() {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  return user.role === "ADMIN" ? <BetAdminScreen /> : <BetClientScreen />;
}
