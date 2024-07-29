import { createContext, useContext, useState, useEffect } from "react";
import * as dafaultTheme from "../../theme/defaultTheme";

export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//     const [theme, setTheme] = useState(dafaultTheme); // ToDo hole aktuelles Theme aus Local Storage

//     // useEffect(() => {
//     //     //toDo setNew Theme Name to Local Storage
//     // }, [theme]);

//     // // console.log(theme);
//     // const contextValue = {
//     //     theme,
//     //     setTheme,
//     // };

//     return (
//         <ThemeContext.Provider value={contextValue}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// export const useTheme = () => {
//     return useContext(ThemeContext);
// };

export const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(dafaultTheme);
    return (
        <ThemeContext.Provider value={[theme, setTheme]}>
            {props.children}
        </ThemeContext.Provider>
    );
};
