import { supabase } from "@/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
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
  
  const [user, setUser] = useState<User|null>(null)
  const [session, setSession] = useState<Session|null>(null)

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
    const {data, error} = await supabase.auth.signInWithPassword({email, password})
    if(error) throw error
    configureSessionUserData(data.session)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    configureSessionUserData(null)
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

