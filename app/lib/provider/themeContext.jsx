import { createContext, useContext, useState, useEffect } from "react";
import defaultColors from "../../theme/defaultTheme";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
    const [statusBarColor, setStatusBarColor] = useState("auto");

    const [theme, setTheme] = useState(defaultColors);

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(theme.colors.background);
        setStatusBarColor(theme.colors.statusBar);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <StatusBar style={statusBarColor} />
            {props.children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
