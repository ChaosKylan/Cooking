import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { recipeSchema } from "../model/recipeModel";
import SQliter from "../lib/data/sql";
import { cleanUpStringForView } from "../lib/cleanUpString";
import { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { GlobalStateContext } from "../lib/provider/GlobalState";

export default function Tab() {
    var db = new SQliter();
    var [recipeModelList, setRecipeModelList]: any = useState(
        db.findAll("Recipes", recipeSchema)
    );
    var [searchText, setSearchText] = useState("");
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);

    function addRecipeModel(model: any) {
        setRecipeModelList((recipeModelList: any) => [
            ...recipeModelList,
            model,
        ]);
    }

    const router = useRouter();
    function searchCheck(model: any) {
        if (!searchText || searchText == "") return true;
        if (model.title.indexOf(searchText) > 0) {
            return true;
        } else {
            return false;
        }
    }
    //screens/addRecipe
    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                {/* <Pressable onPress={() => router.push("../screens/addRecipe")}> */}
                <Pressable
                    onPress={() => {
                        router.push({
                            pathname: `screens/addRecipe`,
                        });
                    }}
                >
                    <Entypo name="plus" size={34} style={styles.icon} />
                </Pressable>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Suchen"
                    onChangeText={(data) => {
                        setSearchText(data);
                    }}
                ></TextInput>
            </View>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView>
                    {recipeList
                        .filter((model: any) => searchCheck(model))
                        .map((model: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.cardTitle}>
                                    {model.title}
                                </Text>
                                <View style={styles.cardInner}>
                                    <Text style={styles.cardSubTitle}>
                                        Zutaten:
                                    </Text>
                                    <Text style={styles.cardText}>
                                        {
                                            //model.ingredient.substring(0, 50)
                                            cleanUpStringForView(
                                                model.ingredient
                                            ).substring(0, 43)
                                        }
                                    </Text>
                                </View>
                                <View style={styles.cardInner}>
                                    <Text style={styles.cardSubTitle}>
                                        Anleitung:{" "}
                                    </Text>
                                    <Text style={styles.cardText}>
                                        {cleanUpStringForView(
                                            model.instructions
                                        ).substring(0, 100)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
    },
    card: {
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 3,
        marginBottom: 10,
    },
    cardInner: {
        flexDirection: "row",
        marginBottom: 10,
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    cardText: {
        flexGrow: 1,
        paddingTop: 5,
        flexShrink: 1,
    },
    cardTitle: {
        padding: 10,
        fontWeight: "bold",
    },
    cardSubTitle: {
        flexGrow: 1,
        fontWeight: "bold",
        paddingTop: 5,
        paddingLeft: 5,
    },
    searchInput: {
        flexGrow: 1,
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 3,
        margin: 10,
        textAlign: "center",
        fontSize: 24,
    },
    addButton: {},
    icon: {
        alignSelf: "flex-end",
        color: "black",
        paddingBottom: 10,
    },
});
