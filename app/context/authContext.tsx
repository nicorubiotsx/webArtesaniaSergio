"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";

type User = {
  id: string;
  email: string | null;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        setUser({
          id: session.data.session.user.id,
          email: session.data.session.user.email ?? null,
        });
      }
      setLoading(false);

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? null });
          localStorage.setItem(
            "sb-session",
            JSON.stringify({
              user: session.user,
              access_token: session.access_token,
            })
          );
        } else {
          setUser(null);
          localStorage.removeItem("sb-session");
        }
      });
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session?.user) {
      setUser({ id: data.session.user.id, email: data.session.user.email ?? null });
      localStorage.setItem(
        "sb-session",
        JSON.stringify({ user: data.session.user, access_token: data.session.access_token })
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("sb-session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
