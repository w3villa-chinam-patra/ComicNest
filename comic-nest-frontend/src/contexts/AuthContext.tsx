import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextInterface, User } from "../interfaces";

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userInfo: User) => setUser(userInfo);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextInterface => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
