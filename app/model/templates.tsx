export interface Ingredient {
    id: number;
    value: string;
    quantity: string;
    unit: string;
}

export interface Recipe {
    ID: number;
    title: string;
    ingredient: string;
    instructions: string;
}

export interface Layout {
    x: number;
    y: number;
    width: number;
    height: number;
}
