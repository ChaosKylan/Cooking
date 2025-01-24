import React, { createContext, useState, useEffect } from "react";
import SQliter from "../data/sql";
import { recipeSchema } from "../../model/recipeModel";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    var db = SQliter.connection();
    const [recipeList, setRecipeList] = useState([]);

    useEffect(() => {
        const recipes = db.findAll("Recipes", recipeSchema);
        setRecipeList(recipes || []);
    }, []);

    return (
        <GlobalStateContext.Provider value={{ recipeList, setRecipeList }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
