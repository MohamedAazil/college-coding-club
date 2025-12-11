import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
interface AppContextType {
    user: User | null
    session: Session | null
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

interface AppContextProviderProps  {
    children?: ReactNode
}

export const AppContext = createContext<AppContextType|undefined>(undefined);
export const AppContextProvider = ({children}: AppContextProviderProps) => {

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  
  const [user, setUser] = useState<User|null>(null)
  const [session, setSession] = useState<Session|null>(null)
  const navigate = useNavigate()

  const configureSessionUserData = (currentSession:Session | null) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
  }

  useEffect(()=>{
    supabase.auth.getSession()
    .then(({data})=>{
      configureSessionUserData(data.session)
    })
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    }) 
    
    return () => listener?.subscription?.unsubscribe()
  }, [])

  const login = async (email: string, password:string) => {
    // const {data, error} = await supabase.auth.signInWithPassword({email, password})
    supabase.auth.signInWithPassword({email, password})
    .then((resp) => console.log(resp))
    // if(error) throw error
    // configureSessionUserData(data.session)
    navigate("/")
  }

  const logout = async () => {
    await supabase.auth.signOut()
    configureSessionUserData(null)
  }

  const getUserDetails = async () => {
    const response = fetch(`${BACKEND_URL}/`)
  }
    // const navigate = useNavigate()


    return (
    <AppContext.Provider value={{ user, session, setUser, setSession, login, logout }}>
      {children}
    </AppContext.Provider>
  );
} 

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppContextProvider')
  return context
}

