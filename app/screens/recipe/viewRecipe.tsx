import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { Ingredient, Recipe } from "../../model/templates";
import { GlobalStateContext } from "../../lib/provider/GlobalState";
import { useLocalSearchParams } from "expo-router";
import { useRecipe } from "../../lib/hooks/useRecipe";
import { useNavigation } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import Header from "../../components/header";

export default function ViewRecipe() {
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const { recipeName, ingredients, instructions } = useRecipe(
        params,
        recipeList
    );
    return (
        <View style={styles.container}>
            <Header headerText={"Recipe"} />
            {/* <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.icon}
                >
                    <Entypo name="arrow-left" size={44} />
                </Pressable>
                <Text style={styles.headerText}>Recipe</Text>
                <Text> </Text>
            </View> */}
            <Text>{recipeName}</Text>
            {ingredients.map((ingredient) => (
                <Text key={ingredient.ID}>
                    {ingredient.ingName} - {ingredient.quantity}{" "}
                    {ingredient.unit}
                </Text>
            ))}
            <Text>{instructions}</Text>
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
});
