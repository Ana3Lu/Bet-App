import { createContext, useState } from "react";

// Traer hijos de esa etiqueta, exponiendo todo lo que tenga adentro
interface AuthContextProps {
    user: any,
    isLoading: boolean,
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
}

const fakeDataSource = [
    {
        email: "test@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test1@test.com",
        password: "12345678",
        name: "TEST"
    },
    {
        email: "test2@test.com",
        password: "12345678",
        name: "TEST"
    }
]

export const AuthContext = createContext({} as AuthContextProps);

interface User {
        email: string;
        password: string;
        name: string;
    }

export const AuthProvider = ({ children }: any) => {
    
    const [user, setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        // si pasa correo y contraseña, decir si exite o no, y en login con handle login al pusal sesion.. pasar email
        if (!email || !password) {
            alert("Email and password are required");
            return;
        } 
        setIsLoading(true);

        setTimeout(() => {
            const foundUser = fakeDataSource.find(user => user.email === email && user.password === password);
            if (foundUser) {
                setUser(foundUser);
            } else {
                alert("Invalid email or password");
            }
            setIsLoading(false);
        }, 2000);
    }

    const register = async (name: string, email: string, password: string) => {
        if (!email || !password || !name) {
            alert("All fields are required");
            return;
        }

        const exists = fakeDataSource.find(u => u.email === email);
        
        if (exists) {
            alert("Email already exists");
            return;
        }

        const newUser = { email, password, name };

        fakeDataSource.push(newUser);
        setUser(newUser);
    };

    const logout = async () => {
        setUser(null);
    }

    return <AuthContext.Provider
        value={{
            user,
            isLoading,
            login,
            register,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
}