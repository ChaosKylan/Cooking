import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    LayoutRectangle,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { cleanUpStringForView } from "../lib/cleanUpString";
import { useState, useContext, useRef } from "react";
import { useRouter } from "expo-router";
import { GlobalStateContext } from "../lib/provider/GlobalState";
import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/schema/recipe";
import {
    Recipe,
    Layout,
    RecipeIngredientRel,
    Ingredient,
} from "../model/templates";
import ingredientSchema from "../model/schema/ingredient";
import recipIngSchema from "../model/schema/recipeIngredientRel";
import { recIngMapper } from "../helper/recIngMapper";
import Header from "../components/header";

import { CustomModal } from "../components/CustomModal";

export default function Tab() {
    var [searchText, setSearchText] = useState("");
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const recipeRefs = useRef<{ [key: number]: LayoutRectangle }>({});

    const router = useRouter();
    function searchCheck(model: Recipe) {
        if (!searchText || searchText == "") return true;
        return model.title.includes(searchText);
    }

    const handleLongPress = (recipe: Recipe, layout: Layout) => {
        setSelectedRecipe(recipe);
        setModalPosition({
            top: layout.y - layout.height - 105,
            left: layout.x + 120,
        });

        setModalVisible(true);
    };

    const handleEdit = () => {
        if (selectedRecipe != null) {
            setModalVisible(false);
            router.push({
                pathname: `screens/addRecipe`,
                params: { recipeID: selectedRecipe.ID },
            });
        }
    };

    const handleDelete = () => {
        if (selectedRecipe != null) {
            setRecipeList(
                recipeList.filter(
                    (recipe: Recipe) => recipe.ID !== selectedRecipe.ID
                )
            );

            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.ID = selectedRecipe.ID;
            recipeModel.delete();
            var recipeIngModel = SQliter.Model(recipIngSchema);
            recipeIngModel.delete(
                `${recipeSchema.tableName.toLocaleLowerCase()}ID = ${
                    selectedRecipe.ID
                }`
            );
        }
        setModalVisible(false);
    };

    const handleNew = () => {
        router.push({
            pathname: `screens/addRecipe`,
            //params: { recipeID: 1 },
        });
    };

    //screens/addRecipe
    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                {/* <Pressable onPress={() => router.push("../screens/addRecipe")}> */}
                <Header backArrow={false} addIcon={true} onAdd={handleNew} />
                {/* <Pressable
                    onPress={() => {
                        handleNew();
                    }}
                >
                    <Entypo name="plus" size={34} style={styles.icon} />
                </Pressable> */}
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
                        .filter((model: Recipe) => searchCheck(model))
                        .map((model: Recipe, index: number) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    router.push({
                                        pathname: `screens/viewRecipe`,
                                        params: { recipeID: model.ID },
                                    });
                                }}
                                onLongPress={(event) =>
                                    handleLongPress(
                                        model,
                                        recipeRefs.current[index]
                                    )
                                }
                                onLayout={(event) => {
                                    recipeRefs.current[index] =
                                        event.nativeEvent.layout;
                                }}
                            >
                                {/* <Modal
                                    animationType="none"
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => {
                                        setModalVisible(!modalVisible);
                                    }}
                                >
                                    <TouchableWithoutFeedback
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <View style={styles.centeredView}>
                                            <TouchableWithoutFeedback>
                                                <View
                                                    style={[
                                                        styles.modalView,
                                                        {
                                                            top: modalPosition.top,
                                                            left: modalPosition.left,
                                                        },
                                                    ]}
                                                >
                                                    <View
                                                        style={
                                                            styles.iconContainer
                                                        }
                                                    >
                                                        <Pressable
                                                            style={
                                                                styles.iconButton
                                                            }
                                                            onPress={handleEdit}
                                                        >
                                                            <Entypo
                                                                name="edit"
                                                                size={44}
                                                                color="black"
                                                            />
                                                        </Pressable>
                                                        <Pressable
                                                            style={
                                                                styles.iconButton
                                                            }
                                                            onPress={
                                                                handleDelete
                                                            }
                                                        >
                                                            <Entypo
                                                                name="trash"
                                                                size={44}
                                                                color="black"
                                                            />
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </Modal> */}

                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        {model.title}
                                    </Text>
                                    <View style={styles.cardInner}>
                                        <Text style={styles.cardSubTitle}>
                                            Zutaten:
                                        </Text>
                                        <Text style={styles.cardText}>
                                            {
                                                //mapDataToString(model.ID)
                                                recIngMapper(
                                                    model.ID,
                                                    recipeList
                                                )
                                                    .trim()
                                                    .slice(0, -1)
                                                    .substring(0, 43)
                                            }
                                        </Text>
                                    </View>
                                    <View style={styles.cardInner}>
                                        <Text style={styles.cardSubTitle}>
                                            Anleitung:{" "}
                                        </Text>
                                        <Text style={styles.cardText}>
                                            {model.instructions.substring(
                                                0,
                                                50
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                </ScrollView>
            </TouchableWithoutFeedback>
            <CustomModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                modalPosition={modalPosition}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
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
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        width: "30%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingLeft: 5,
    },
    iconButton: {
        flexDirection: "row",
        alignItems: "center",
    },
});
