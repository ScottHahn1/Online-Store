import { Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { createContext } from "react";

export type User = {
    email: string | null;
    userId: number | null;
    username: string | null;
}
    
export type UserContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    accessToken: string | null;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
    children: ReactNode;
}

export function useUserContext(): UserContextType {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>
          {children}
        </UserContext.Provider>
      );
}