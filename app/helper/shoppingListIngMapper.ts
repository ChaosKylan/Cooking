import { ShopListIngRel, ShoppingListRelMapper } from "../model/templates";
import { shoppingListSchema } from "../model/schema/shoppingList/shoppinglist";
import { shopListIngRelSchema } from "../model/schema/shoppingList/shopListIngRel";
import ingredientSchema from "../model/schema/ingredient";
import SQliter from "../lib/data/sql";

const shoppingListIngMapper = (ID: Number) => {
    var shoppingListModel = SQliter.connection().findOne(
        shoppingListSchema,
        `ID = ${ID}`
    );

    var data = shoppingListModel?.join(ingredientSchema, shopListIngRelSchema);

    var ingredientList: ShoppingListRelMapper[] = [];

    if (data && Array.isArray(data.target) && Array.isArray(data.relation)) {
        for (let i = 0; i < data.target.length; i++) {
            const item = data.target[i];
            const relation = data.relation[i];
            const newEntry: ShoppingListRelMapper = {
                ingredient: {
                    ID: item.ID,
                    ingName: item.ingName,
                    quantity: "",
                    unit: "",
                },
                shopListIngRel: {
                    ID: relation.ID,
                    shopListID: relation.shoppinglistsID,
                    ingredientsID: relation.ingredientsID,
                    unit: relation ? relation.unit : null,
                    quantity: relation ? relation.amount : null,
                    done: relation ? relation.done === "true" : false,
                },
            };
            ingredientList.push(newEntry);
        }
    }
    return ingredientList;
};

export default shoppingListIngMapper;
