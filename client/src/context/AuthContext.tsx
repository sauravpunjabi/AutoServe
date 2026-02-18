import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

interface User {
    id: string;
    full_name: string;
    email: string;
    role: "customer" | "mechanic" | "manager" | "admin";
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Ensure decoded token has user structure matching our expectation
                if (decoded.user) {
                    setUser(decoded.user);
                } else {
                    console.error("Invalid token structure");
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const decoded: any = jwtDecode(token);
        setUser(decoded.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
