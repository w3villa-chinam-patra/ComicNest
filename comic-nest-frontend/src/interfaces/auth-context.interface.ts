import type { User } from "./user.interface";

export interface AuthContextInterface {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
