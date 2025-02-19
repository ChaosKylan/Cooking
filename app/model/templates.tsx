export interface Ingredient {
    id: number;
    value: string;
    quantity: string;
    unit: string;
}

export interface IngredientNew {
    ID: number;
    ingName: string;
}

export interface Recipe {
    ID: number;
    title: string;
    ingredient: string;
    instructions: string;
}

export interface RecipeIngredientRel {
    recipesID: number;
    ingredientsID: number;
    quantity: string;
    unit: string;
}

export interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface RecipeWithOrder {
    recipe: Recipe;
    orderID: number;
    done: boolean;
}

export interface ShopListIngRel {
    shopListID: number;
    ingredientsID: number;
    quantity: string;
    unit: string;
    done: boolean;
    ID: number;
}
export interface ShoppingLists {
    listName: string;
    ID: number;
}
