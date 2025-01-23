import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useState, useContext, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams } from "expo-router";
import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/recipeModel";
import { GlobalStateContext } from "../lib/provider/GlobalState";

import { Ingredient } from "../model/templates";
import { useRecipe } from "../lib/hooks/useRecipe";

var ingredientCount: number = 0;

export default function AddRecipe() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
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
                const ingredientsArray = recipe.ingredient
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
                id: ingredientCount,
                value: _value,
                quantity: _quantity,
                unit: _unit,
            },
        ]);
        ++ingredientCount;
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
                ingredient.id === id
                    ? {
                          ...ingredient,
                          value: _text,
                          quantity: _quantity,
                          unit: _unit,
                      }
                    : ingredient
            )
        );
    }
    function save() {
        var ingJsonString: string = " ";

        // var recipeModel = SQliter.Model("Recipes", recipeSchema);
        var recipeModel = SQliter.Model(recipeSchema);
        for (var i: number = 0; i < localIngredients.length; i++) {
            //  ingJsonString += ingredients[i].value +" , " +  + " | ";
            ingJsonString += `${localIngredients[
                i
            ].value.trim()} , ${localIngredients[
                i
            ].quantity.trim()} ${localIngredients[i].unit.trim()} | `;
        }
        if (ingJsonString.endsWith(" | ")) {
            ingJsonString = ingJsonString.slice(0, -3);
        }
        if (localRecipeName != "" || localRecipeName != null) {
            recipeModel.title = localRecipeName;
            recipeModel.ingredient = ingJsonString.trim();
            // .substring(0, ingJsonString.length);
            recipeModel.instructions = localInstructions ?? " ";

            recipeModel = recipeModel.insert();

            addRecipeModel(recipeModel);

            navigation.goBack();
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.icon}
                >
                    <Entypo name="arrow-left" size={44} />
                </Pressable>
                <Text style={styles.headerText}>Recipe</Text>
                <Pressable onPress={save}>
                    <Entypo name="save" size={44} />
                </Pressable>
            </View>
            {params.recipeID === undefined && (
                <View style={styles.urlContainer}>
                    <TextInput style={styles.urlInput} placeholder="URL" />
                    <Pressable style={styles.urlButton}>
                        <Text style={styles.urlText}>Los</Text>
                    </Pressable>
                </View>
            )}
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
                        <View key={ingredient.id}>
                            <View style={styles.horiContainer}>
                                <TextInput
                                    style={styles.ingInput}
                                    placeholder="Zutat eingeben"
                                    value={ingredient.value}
                                    onChangeText={(text) =>
                                        updateIngredientValue(
                                            ingredient.id,
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
                                            ingredient.id,
                                            ingredient.value,
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
                                        onValueChange={(itemValue, itemIndex) =>
                                            updateIngredientValue(
                                                ingredient.id,
                                                ingredient.value,
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
                                            style={{ margin: 0, padding: 0 }}
                                        ></Picker.Item>
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    ))}
                    <Pressable onPress={() => addIngredient()}>
                        <View style={styles.horiContainer}>
                            <Entypo name="plus" size={34} style={styles.icon} />
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
    icon: {},
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
