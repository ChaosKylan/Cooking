import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    TextInput,
    FlatList,
    Modal,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import React, { useState, useContext, useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Header from "../../components/header";
import Card from "@/app/components/Card";
import { ThemeContext } from "../../lib/provider/themeContext";
import defaultTheme from "../../theme/defaultTheme";
import globalStyles from "../../styles/globalstyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ingredient, Recipe } from "@/app/model/templates";
import AddIngToList from "@/app/components/ingredient/AddIngToList";
import getIngredientID from "@/app/helper/getIngredientID";
import SQliter from "@/app/lib/data/sql";
import recipIngSchema from "@/app/model/schema/recipeIngredientRel";
import { recipeSchema } from "@/app/model/schema/recipe";
import ingredientSchema from "@/app/model/schema/ingredient";
import { GlobalStateContext } from "@/app/lib/provider/GlobalState";

export default function AddRecipe() {
    const params = useLocalSearchParams();
    const { theme, setTheme } = useContext(ThemeContext);
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    const [titleModalVisible, setTitleModalVisible] = useState(false);
    const [instructionModalVisible, setInstructionModalVisible] =
        useState(false);
    const [ingredientModalVisible, setIngredientModalVisible] = useState(false);
    const [recipeName, setRecipeName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [recipe, setRecipe] = useState<Recipe>();
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);

    useEffect(() => {
        var recipe = SQliter.connection().findOne(
            recipeSchema,
            `ID = ${params.recipeID}`
        );
        if (recipe) {
            var tmpRecipe = {
                ID: recipe.ID,
                title: recipe.title,
                ingredient: recipe.ingredient,
                instructions: recipe.instructions,
            };
            setInstructions(tmpRecipe.instructions);
            setRecipe(tmpRecipe);
            setRecipeName(tmpRecipe.title);

            var tmpRel = SQliter.connection().findAll(
                recipIngSchema,
                `recipesID = ${params.recipeID}`
            );
            if (tmpRel) {
                var tmpIng: Ingredient[] = [];
                tmpRel.forEach((rel) => {
                    var ing = SQliter.connection().findOne(
                        ingredientSchema,
                        `ID = ${rel.ingredientsID}`
                    );
                    if (ing) {
                        var tmpIngItem: Ingredient = {
                            ID: ing.ID,
                            ingName: ing.ingName,
                            quantity: rel.amount,
                            unit: rel.unit,
                        };
                        tmpIng.push(tmpIngItem);
                    }
                });
                setIngredients(tmpIng);
            }
        }
    }, [params.recipeID]);

    const handleSaveRecipeName = () => {
        setTitleModalVisible(false);
    };

    const handleSaveInstructions = () => {
        setInstructionModalVisible(false);
        var recipeModel = SQliter.Model(recipeSchema);
        recipeModel.ID = params.recipeID;
        recipeModel.instructions = instructions;
        recipeModel.title = recipeName;
        recipeModel.update();
        setRecipeList();
    };

    const addIng = (ing: Ingredient) => {
        setIngredients([...ingredients, ing]);
        var ingID = getIngredientID(ing);
        var ingRelModel = SQliter.Model(recipIngSchema);
        ingRelModel.recipesID = params.recipeID;
        ingRelModel.ingredientsID = ingID;
        ingRelModel.quantity = ing.quantity;
        ingRelModel.unit = ing.unit ?? "";
        var tmpRel = ingRelModel.insert();
        console.log(tmpRel);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header headerText={recipe?.title} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Card cardStyle={{ flex: 1 }}>
                        <Card>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Zutaten</Text>
                                <Pressable
                                    onPress={() => {
                                        setIngredientModalVisible(true);
                                    }}
                                >
                                    <Entypo
                                        name="edit"
                                        size={18}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            </View>
                            <View style={styles.cardContent}>
                                {ingredients.length > 0 ? (
                                    ingredients.map((ingredient, index) => (
                                        <View
                                            key={index}
                                            style={styles.ingredientContainer}
                                        >
                                            <Text style={styles.text}>
                                                {ingredient.ingName} -{" "}
                                                {ingredient.quantity}{" "}
                                                {ingredient.unit}
                                            </Text>
                                            <Pressable
                                                onPress={() => {
                                                    // Add your edit logic here
                                                }}
                                            >
                                                <Entypo
                                                    name="trash"
                                                    size={18}
                                                    color={
                                                        theme.colors.iconColor
                                                    }
                                                />
                                            </Pressable>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.text}>
                                        Füge Zutaten hinzu...
                                    </Text>
                                )}
                            </View>
                        </Card>
                        <Card>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>
                                    Zubereitung
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        setInstructionModalVisible(true);
                                    }}
                                >
                                    <Entypo
                                        name="edit"
                                        size={18}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            </View>
                            <View style={styles.cardContent}>
                                <Text style={styles.text}>
                                    {instructions
                                        ? instructions
                                        : "Füge eine Anleitung hinzu..."}
                                </Text>
                            </View>
                        </Card>
                    </Card>
                </ScrollView>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={titleModalVisible}
                onRequestClose={() => setTitleModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                onPress={() => setTitleModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Entypo
                                    name="cross"
                                    size={24}
                                    color={theme.colors.iconColor}
                                />
                            </Pressable>
                        </View>
                        <Text style={styles.modalTitle}>Rezeptname</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name des Rezepts"
                            placeholderTextColor={theme.colors.placeholderText}
                            value={recipeName}
                            onChangeText={setRecipeName}
                        />
                        <Pressable
                            style={styles.button}
                            onPress={handleSaveRecipeName}
                        >
                            <Text style={styles.buttonText}>Speichern</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={instructionModalVisible}
                onRequestClose={() => setInstructionModalVisible(false)}
            >
                <View style={styles.fullScreenModalOverlay}>
                    <View style={styles.fullScreenModalView}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                onPress={() =>
                                    setInstructionModalVisible(false)
                                }
                                style={styles.closeButton}
                            >
                                <Entypo
                                    name="cross"
                                    size={24}
                                    color={theme.colors.iconColor}
                                />
                            </Pressable>
                        </View>
                        <TextInput
                            style={styles.fullScreenInput}
                            placeholder="Anleitung"
                            placeholderTextColor={theme.colors.placeholderText}
                            value={instructions}
                            onChangeText={setInstructions}
                            multiline={true}
                        />
                        <Pressable
                            style={styles.button}
                            onPress={handleSaveInstructions}
                        >
                            <Text style={styles.buttonText}>Speichern</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={ingredientModalVisible}
                onRequestClose={() => setIngredientModalVisible(false)}
            >
                <View style={styles.fullScreenModalOverlay}>
                    <View style={styles.fullScreenModalView}>
                        <View style={styles.modalHeader}>
                            <Pressable
                                onPress={() => setIngredientModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Entypo
                                    name="cross"
                                    size={24}
                                    color={theme.colors.iconColor}
                                />
                            </Pressable>
                        </View>
                        <AddIngToList
                            saveIngredientToList={addIng}
                        ></AddIngToList>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
            paddingBottom: 10,
        },
        scrollViewContent: {
            flexGrow: 1,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
        },
        cardContent: {
            padding: 10,
            color: theme.colors.text,
        },
        text: {
            color: theme.colors.text,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: 15,
        },
        fullScreenModalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        fullScreenModalView: {
            width: "90%",
            height: "90%",
            padding: 20,
            backgroundColor: theme.colors.cardBackground,
            borderBottomRightRadius: 35,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 15,
            borderBottomLeftRadius: 15,
            shadowColor: theme.colors.shadowColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        fullScreenInput: {
            flex: 1,
            borderColor: theme.colors.borderColor,
            borderWidth: 1,
            borderRadius: 5,
            color: theme.colors.text,
            padding: 10,
            textAlignVertical: "top",
        },
        modalHeader: {
            flex: 1,
            alignItems: "flex-end",
        },

        ingredientContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderColor,
        },
    });
