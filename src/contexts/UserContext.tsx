import { createContext } from "react";

const UserContext = createContext<{ id: string } | null>(null);

export default UserContext;
