import {createContext,useContext,useEffect,useState} from "react";
import axios from "axios";

const AuthContext = createContext();
const API = "http://localhost:4000/auth";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };
    const fetchCurrentUser = async () => {
        try {

            const res = await axios.get(
                `${API}/me`,
                {
                    withCredentials: true,
                }
            );
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCurrentUser();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                updateUser,
                loading,
                fetchCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);