import { createContext,useContext,useEffect,useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("chat-theme") || "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove( "dark","light","midnight" );
        root.classList.add(theme);
        localStorage.setItem( "chat-theme",theme );
    }, [theme]);
    const changeTheme = (newTheme) => {
        if ( !["dark", "light", "midnight"].includes( newTheme )) {
            return;
        }
        setTheme(newTheme);
    };
    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }
    return context;
};