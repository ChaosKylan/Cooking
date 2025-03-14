import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useState, useContext, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import SQliter from "../../lib/data/sql";
import { recipeSchema } from "../../model/schema/recipe";
import { GlobalStateContext } from "../../lib/provider/GlobalState";

import { Ingredient, IngredientNew } from "../../model/templates";
import { useRecipe } from "../../lib/hooks/useRecipe";
import ingredientSchema from "../../model/schema/ingredient";
import recipIngSchema from "../../model/schema/recipeIngredientRel";
import recIngMapper from "../../helper/recIngMapper";
import Header from "../../components/header";

export default function AddRecipe() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    const { ingredientList, setIngredientList } =
        useContext(GlobalStateContext);
    const { recipeName, ingredients, instructions } = useRecipe(
        params,
        recipeList
    );
    const [localRecipeName, setLocalRecipeName] = useState<string>(recipeName);
    const [localIngredients, setLocalIngredients] =
        useState<Array<Ingredient>>(ingredients);
    const [localInstructions, setLocalInstructions] =
        useState<string>(instructions);

    useEffect(() => {
        if (params.recipeID) {
            const recipe = recipeList.find(
                (r: any) => r.ID == Number(params.recipeID)
            );
            if (recipe) {
                setLocalRecipeName(recipe.title);
                //const ingredientsArray = recipe.ingredient
                const ingredientsArray = recIngMapper(recipe.ID, recipeList)
                    .split(" | ")
                    .map((ingredient: string, index: number) => {
                        const [value, quantityUnit] = ingredient.split(" , ");
                        const [quantity, unit] = quantityUnit.split(" ");
                        return { id: index, value, quantity, unit };
                    });
                setLocalIngredients(ingredientsArray);
                setLocalInstructions(recipe.instructions);
            }
        }
    }, [params.recipeID, recipeList]);

    function addIngredient(
        _value: string = "",
        _quantity: string = "",
        _unit: string = "g"
    ) {
        setLocalIngredients((prevIngredients) => [
            ...prevIngredients,
            {
                ID: localIngredients.length + 1 || 0,
                ingName: _value,
                quantity: _quantity,
                unit: _unit,
            },
        ]);
    }
    function removeIngredient(ingredientID: number) {
        setLocalIngredients((prevIngredients) =>
            prevIngredients.filter(
                (ingredient) => ingredient.ID !== ingredientID
            )
        );
    }

    function addRecipeModel(model: any) {
        setRecipeList((recipeModelList: any) => [...recipeModelList, model]);
    }

    function updateIngredientValue(
        id: number,
        _text: string,
        _quantity: string,
        _unit: string
    ) {
        setLocalIngredients((prevIngredients) =>
            prevIngredients.map((ingredient) =>
                ingredient.ID === id
                    ? {
                          ...ingredient,
                          ingName: _text,
                          quantity: _quantity,
                          unit: _unit,
                      }
                    : ingredient
            )
        );
    }

    function saveIngredientData(recipeModelID: number) {
        for (var i: number = 0; i < localIngredients.length; i++) {
            var ingredientModel = SQliter.Model(ingredientSchema);
            if (
                ingredientList.findIndex(
                    (ingredient: any) =>
                        ingredient.ingName === localIngredients[i].ingName
                ) === -1
            ) {
                ingredientModel.ingName = localIngredients[i].ingName;

                ingredientModel = ingredientModel.insert();
                setIngredientList((ingredientList: any) => [
                    ...ingredientList,
                    ingredientModel,
                ]);
            } else {
                ingredientModel = ingredientList.find(
                    (ingredient: any) =>
                        ingredient.ingName === localIngredients[i].ingName
                );
            }

            var recipeIngModel = SQliter.Model(recipIngSchema);

            recipeIngModel.recipesID = recipeModelID;
            recipeIngModel.ingredientsID = ingredientModel.ID;
            recipeIngModel.quantity = localIngredients[i].quantity;
            recipeIngModel.unit = localIngredients[i].unit;
            recipeIngModel.insert();
        }
    }

    function addNewRecipe() {
        if (localRecipeName != "" && localRecipeName != null) {
            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.title = localRecipeName;
            recipeModel.instructions = localInstructions ?? " ";

            recipeModel = recipeModel.insert();

            addRecipeModel(recipeModel);
            saveIngredientData(recipeModel.ID);

            navigation.goBack();
        }
    }

    function updateRecipe() {
        if (localRecipeName != "" && localRecipeName != null) {
            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.ID = params.recipeID;
            recipeModel.title = localRecipeName;
            recipeModel.instructions = localInstructions ?? " ";

            recipeModel.update();

            setRecipeList((prevList: any[]) =>
                prevList.map((recipe: any) =>
                    recipe.ID === recipeModel.ID ? recipeModel : recipe
                )
            );

            var recipeIngModel = SQliter.Model(recipIngSchema);
            recipeIngModel.delete(
                `${recipeSchema.tableName.toLocaleLowerCase()}ID = ${
                    recipeModel.ID
                }`
            );

            saveIngredientData(recipeModel.ID);
            navigation.goBack();
        }
    }

    function save() {
        params.recipeID === undefined ? addNewRecipe() : updateRecipe();
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Header onSave={save} headerText={"Recipe"} saveIcon={true} />
            </View>
            <ScrollView>
                <View style={styles.contentContainer}>
                    <Text>RezeptName</Text>
                    <TextInput
                        key={"recipeName"}
                        style={styles.ingInput}
                        placeholder="Rezeptname"
                        value={localRecipeName}
                        onChangeText={setLocalRecipeName}
                    ></TextInput>
                </View>
                <View style={styles.contentContainer}>
                    <Text>Zutaten</Text>
                    {localIngredients.map((ingredient) => (
                        <View key={ingredient.ID}>
                            <View style={styles.horiContainer}>
                                <View style={styles.VertContainer}>
                                    <View style={styles.horiContainer}>
                                        <TextInput
                                            style={styles.ingInput}
                                            placeholder="Zutat eingeben"
                                            value={ingredient.ingName}
                                            onChangeText={(text) =>
                                                updateIngredientValue(
                                                    ingredient.ID,
                                                    text,
                                                    ingredient.quantity,
                                                    ingredient.unit
                                                )
                                            }
                                        />
                                    </View>
                                    <View style={styles.horiContainer}>
                                        <TextInput
                                            style={styles.amountInput}
                                            placeholder="Menge"
                                            value={ingredient.quantity}
                                            keyboardType="number-pad"
                                            onChangeText={(text) =>
                                                updateIngredientValue(
                                                    ingredient.ID,
                                                    ingredient.ingName,
                                                    text,
                                                    ingredient.unit
                                                )
                                            }
                                        ></TextInput>
                                        <View style={styles.pickerContainer}>
                                            <Picker
                                                style={styles.picker}
                                                mode="dropdown"
                                                selectedValue={ingredient.unit}
                                                onValueChange={(
                                                    itemValue,
                                                    itemIndex
                                                ) =>
                                                    updateIngredientValue(
                                                        ingredient.ID,
                                                        ingredient.ingName,
                                                        ingredient.quantity,
                                                        itemValue
                                                    )
                                                }
                                            >
                                                <Picker.Item
                                                    label="g"
                                                    value="g"
                                                ></Picker.Item>
                                                <Picker.Item
                                                    label="ml"
                                                    value="ml"
                                                    style={{
                                                        margin: 0,
                                                        padding: 0,
                                                    }}
                                                ></Picker.Item>
                                                <Picker.Item
                                                    label="st"
                                                    value="st"
                                                    style={{
                                                        margin: 0,
                                                        padding: 0,
                                                    }}
                                                ></Picker.Item>
                                            </Picker>
                                        </View>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() =>
                                        removeIngredient(ingredient.ID)
                                    }
                                >
                                    <Entypo
                                        name="trash"
                                        size={50}
                                        style={styles.icon}
                                    ></Entypo>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                    <Pressable onPress={() => addIngredient()}>
                        <View style={styles.horiContainer}>
                            <Entypo name="plus" size={34} />
                            <Text style={styles.txtAdd}> add </Text>
                        </View>
                    </Pressable>
                </View>

                <View style={styles.contentContainer}>
                    <Text>Anleitung</Text>
                    <TextInput
                        multiline={true}
                        style={styles.instInput}
                        value={localInstructions}
                        onChangeText={setLocalInstructions}
                    ></TextInput>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: "column",
    },
    horiContainer: {
        flex: 1,
        flexDirection: "row",
    },
    VertContainer: {
        flex: 1,
        flexDirection: "column",
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "black",
        borderBottomWidth: 3,
        marginBottom: 10,
    },
    contentContainer: {
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 28,
    },
    icon: {
        marginTop: 10,
    },
    urlContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 30,
        paddingBottom: 5,
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    urlButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: "black",
    },
    urlText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
    urlInput: {
        flexGrow: 1,
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        textAlign: "center",
        fontSize: 24,
    },
    txtAdd: {
        alignSelf: "center",
    },
    ingInput: {
        flexGrow: 4,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        textAlign: "center",
        fontSize: 18,
    },
    amountInput: {
        flexGrow: 1,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        textAlign: "center",
        fontSize: 18,
        width: 50,
    },
    instInput: {
        flexGrow: 1,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
        textAlign: "justify",
        textAlignVertical: "top",
        fontSize: 18,
        height: 400,
    },
    pickerContainer: {
        flex: 1,
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginRight: 5,
    },
    picker: {
        flexGrow: 1,
        margin: 0,
        padding: 0,
    },
});
