import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    FlatList,
    Pressable,
    Modal,
} from "react-native";
import { useState, useContext, useRef } from "react";
import { useRouter } from "expo-router";
import { GlobalStateContext } from "../lib/provider/GlobalState";
import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/schema/recipe";
import { Recipe } from "../model/templates";
import recipIngSchema from "../model/schema/recipeIngredientRel";
import recIngMapper from "../helper/recIngMapper";
import Header from "../components/header";
import Card from "../components/Card";
import EditDeleteModal from "../components/EditDeleteModal";

import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from "@expo/vector-icons/Entypo";
import { Menu, Provider } from "react-native-paper";
import MenuItem from "react-native-paper/lib/typescript/components/Menu/MenuItem";

export default function Tab() {
    var [searchText, setSearchText] = useState("");
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalNewVisible, setModalNewVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [recipeName, setRecipeName] = useState("");
    const [menuVisible, setMenuVisible] = useState<{ [key: number]: boolean }>(
        {}
    );
    const [isUpdate, setIsUpdate] = useState(false);

    const recipeRefs = useRef<{ [key: number]: View }>({});

    const router = useRouter();

    const { theme, setTheme } = useContext(ThemeContext);

    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    function searchCheck(model: Recipe) {
        if (!searchText || searchText == "") return true;
        return model.title.includes(searchText);
    }

    const handleLongPress = (recipe: Recipe, index: number) => {
        setSelectedRecipe(recipe);
        recipeRefs.current[index].measure(
            (x, y, width, height, pageX, pageY) => {
                setModalPosition({
                    top: pageY,
                    left: pageX + width,
                });
                setModalVisible(true);
            }
        );
    };

    // const handleEdit = () => {
    //     if (selectedRecipe != null) {
    //         setModalVisible(false);
    //         router.push({
    //             pathname: `screens/recipe/addRecipe`,
    //             params: { recipeID: selectedRecipe.ID },
    //         });
    //     }
    // };

    const handleDelete = (item: Recipe) => {
        if (item != null) {
            setRecipeList(
                recipeList.filter((recipe: Recipe) => recipe.ID !== item.ID)
            );

            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.ID = item.ID;
            recipeModel.delete();
            var recipeIngModel = SQliter.Model(recipIngSchema);
            recipeIngModel.delete(
                `${recipeSchema.tableName.toLocaleLowerCase()}ID = ${item.ID}`
            );
        }
        setMenuVisible((prev) => {
            const newMenuVisible = { ...prev };
            delete newMenuVisible[item.ID];
            return newMenuVisible;
        });
    };

    const handleEdit = () => {
        if (selectedRecipe) {
            selectedRecipe.title = recipeName;
            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.ID = selectedRecipe.ID;
            recipeModel.title = recipeName;
            recipeModel.instructions = selectedRecipe.instructions;
            recipeModel.update();
            setRecipeList(
                recipeList.map((recipe: Recipe) =>
                    recipe.ID === selectedRecipe.ID ? recipeModel : recipe
                )
            );
            setModalNewVisible(false);
            setMenuVisible((prev) => ({
                ...prev,
                [selectedRecipe?.ID ?? 0]: false,
            }));
            setIsUpdate(false);
            setRecipeName("");
        }
    };

    const handleNew = () => {
        var recipeModel = SQliter.Model(recipeSchema);
        recipeModel.title = recipeName;
        recipeModel.instructions = "";
        recipeModel = recipeModel.insert();
        setRecipeList([...recipeList, recipeModel]);
        setModalNewVisible(false);
        setMenuVisible((prev) => ({
            ...prev,
            [selectedRecipe?.ID ?? 0]: false,
        }));
        setIsUpdate(false);
        setRecipeName("");
        router.push({
            pathname: `screens/recipe/addRecipe`,
            params: { recipeID: recipeModel.ID },
        });
    };

    const renderItem = ({ item }: { item: Recipe }) => {
        return (
            <Pressable
                onPress={() => {
                    router.push({
                        pathname: `screens/recipe/addRecipe`,
                        params: { recipeID: item.ID },
                    });
                }}
            >
                <Card>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardText}>{item.title}</Text>
                        <Menu
                            visible={menuVisible[item.ID] || false}
                            onDismiss={() =>
                                setMenuVisible((prev) => ({
                                    ...prev,
                                    [item.ID]: false,
                                }))
                            }
                            anchor={
                                <Pressable
                                    onPress={() =>
                                        setMenuVisible((prev) => ({
                                            ...prev,
                                            [item.ID]: true,
                                        }))
                                    }
                                >
                                    <Entypo
                                        name="dots-three-vertical"
                                        size={18}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            }
                            contentStyle={styles.menuContent}
                        >
                            <Menu.Item
                                onPress={() => {
                                    setIsUpdate(true);
                                    setSelectedRecipe(item);
                                    setRecipeName(item.title);
                                    setModalNewVisible(true);
                                }}
                                title="Umbenennen"
                                titleStyle={styles.menuItemText}
                            />
                            <Menu.Item
                                onPress={() => handleDelete(item)}
                                title="Löschen"
                                titleStyle={styles.menuItemText}
                            />
                        </Menu>
                    </View>
                </Card>
            </Pressable>
        );
    };

    return (
        <Provider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.topBox}>
                        <Header
                            backArrow={false}
                            addIcon={true}
                            onAdd={() => setModalNewVisible(true)}
                        />

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Suchen"
                            placeholderTextColor={theme.colors.text}
                            onChangeText={(data) => {
                                setSearchText(data);
                            }}
                        ></TextInput>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={Keyboard.dismiss}
                        accessible={false}
                    >
                        <FlatList
                            data={recipeList.filter((model: Recipe) =>
                                searchCheck(model)
                            )}
                            renderItem={renderItem}
                            keyExtractor={(item: Recipe, index: number) =>
                                index.toString()
                            }
                        />
                    </TouchableWithoutFeedback>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalNewVisible}
                    onRequestClose={() => {
                        setModalNewVisible(false);
                        setMenuVisible((prev) => ({
                            ...prev,
                            [selectedRecipe?.ID ?? 0]: false,
                        }));
                        setIsUpdate(false);
                        setRecipeName("");
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Pressable
                                    onPress={() => {
                                        setModalNewVisible(false);
                                        setMenuVisible((prev) => ({
                                            ...prev,
                                            [selectedRecipe?.ID ?? 0]: false,
                                        }));
                                        setIsUpdate(false);
                                        setRecipeName("");
                                    }}
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
                                style={styles.input}
                                placeholder="Name des Rezepts"
                                placeholderTextColor={
                                    theme.colors.placeholderText
                                }
                                value={recipeName}
                                onChangeText={setRecipeName}
                            />
                            {isUpdate === false ? (
                                <Pressable
                                    style={styles.button}
                                    onPress={handleNew}
                                >
                                    <Text style={styles.buttonText}>
                                        Speichern
                                    </Text>
                                </Pressable>
                            ) : (
                                <Pressable
                                    style={styles.button}
                                    onPress={handleEdit}
                                >
                                    <Text style={styles.buttonText}>
                                        Ändern
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </Provider>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
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
        cardText: {
            flexGrow: 1,
            paddingBottom: 7,
            paddingHorizontal: 10,
            flexShrink: 1,
            color: theme.colors.text,
            fontSize: 18,
        },
        cardTitle: {
            padding: 10,
            fontWeight: "bold",
            color: theme.colors.text,
        },
        cardSubTitle: {
            flexGrow: 1,
            fontWeight: "bold",
            paddingTop: 5,
            paddingLeft: 5,
            color: theme.colors.text,
        },
        searchInput: {
            flexGrow: 1,
            borderColor: theme.colors.borderColor,
            borderRadius: 20,
            borderWidth: 1,
            margin: 10,
            textAlign: "center",
            fontSize: 24,
            color: theme.colors.text,
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
            backgroundColor: theme.colors.background,
            borderRadius: 20,
            padding: 10,
            width: "30%",
            alignItems: "center",
            shadowColor: theme.colors.shadowColor,
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
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: 15,
        },
        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
            paddingVertical: 5,
            paddingBottom: 10,
        },
    });
