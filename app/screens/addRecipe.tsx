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
import React, { useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";

import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/recipeModel";
import { GlobalStateContext } from "../lib/provider/GlobalState";

var ingredientCount: number = 0;

interface Ing {
    id: number;
    value: string;
    quantity: string;
    unit: string;
}

export default function AddRecipe() {
    const navigation = useNavigation();
    const [recipeName, setRecipeName] = useState<string>();
    const [ingredients, setIngredients] = useState<Array<Ing>>([]);
    const [instructions, setInstructions] = useState<string>();

    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    function addIngredient() {
        setIngredients((prevIngredients) => [
            ...prevIngredients,
            { id: ingredientCount, value: "", quantity: "", unit: "g" },
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
        setIngredients((prevIngredients) =>
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

        var recipeModel = SQliter.Model("Recipes", recipeSchema);
        for (var i: number = 0; i < ingredients.length; i++) {
            //  ingJsonString += ingredients[i].value +" , " +  + " | ";
            ingJsonString += `${ingredients[i].value.trim()} , ${ingredients[
                i
            ].quantity.trim()} ${ingredients[i].unit.trim()} | `;
        }

        if (recipeName != "" || recipeName != null) {
            recipeModel.title = recipeName;
            recipeModel.ingredient = ingJsonString
                .trim()
                .substring(0, ingJsonString.length);
            recipeModel.instructions = instructions ?? " ";

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
            <View style={styles.urlContainer}>
                <TextInput
                    style={styles.urlInput}
                    placeholder="URL"
                ></TextInput>
                <Pressable style={styles.urlButton}>
                    <Text style={styles.urlText}>Los</Text>
                </Pressable>
            </View>
            <ScrollView>
                <View style={styles.contentContainer}>
                    <Text>RezeptName</Text>
                    <TextInput
                        key={"recipeName"}
                        style={styles.ingInput}
                        placeholder="Rezeptname"
                        onChangeText={setRecipeName}
                    ></TextInput>
                </View>
                <View style={styles.contentContainer}>
                    <Text>Zutaten</Text>
                    {ingredients.map((ingredient) => (
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
                    <Pressable onPress={addIngredient}>
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
                        onChangeText={setInstructions}
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
