import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    toggleDarkMode: () => {},
    setDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkModeState] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved === 'true';
    });

    useEffect(() => {
        // Apply dark mode class to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkModeState(prev => !prev);
    };

    const setDarkMode = (value: boolean) => {
        setDarkModeState(value);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};













