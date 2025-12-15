import { supabase } from "@/lib/supabaseClient";
import type { UserProfile } from "@/types";
import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
interface AppContextType {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getUserDetails: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  BACKEND_URL: string;
}

interface AppContextProviderProps {
  children?: ReactNode;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const configureSessionUserData = (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      configureSessionUserData(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        configureSessionUserData(session);
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    configureSessionUserData(data.session);
    navigate("/");
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    configureSessionUserData(data.session);
    navigate("/");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    configureSessionUserData(null);
  };

  const getUserDetails = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    configureSessionUserData(session);
    // const res = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json"
    //   }
    // });
    if (!(session && user && token)) {
      navigate("/login");
      return;
    }
    try {
      const httpResponse = await fetch(`${BACKEND_URL}/api/user-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (!httpResponse.ok) throw new Error("Something went wrong");

      const responseData = httpResponse.json();
      console.log(responseData);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };
  // const navigate = useNavigate()

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        setUser,
        setSession,
        login,
        logout,
        getUserDetails,
        signup,
        BACKEND_URL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider");
  return context;
};
