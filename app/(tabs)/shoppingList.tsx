import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList,
    Modal,
    Pressable,
    TextInput,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import SQliter from "../lib/data/sql";
import * as Progress from "react-native-progress";
import Header from "../components/header";
import Card from "../components/Card";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Menu, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";
import { shoppingListSchema } from "../model/schema/shoppingList/shoppinglist";
import { ShoppingLists } from "../model/templates";

export default function Tab() {
    const [localList, setLocalList] = useState<Array<ShoppingLists>>([]);
    const [isEndReached, setIsEndReached] = useState(Boolean);
    const [modalVisible, setModalVisible] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [menuVisible, setMenuVisible] = useState<{ [key: number]: boolean }>(
        {}
    );
    const router = useRouter();

    const { theme, setTheme } = useContext(ThemeContext);

    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const planList = SQliter.connection().findAll(shoppingListSchema);
        planList?.forEach((model) => {
            // const list: RecipeWithOrder[] = mealReciMapper(model.ID);

            // var tempPlan: Plan = {
            //     ID: model.ID,
            //     name: model.planName,
            //     numberOfRecipe: list.length,
            //     recipesDone: list.filter((rel) => rel.done).length,
            // };

            // setPlan((planList: any) => [...planList, tempPlan]);
            setLocalList((prevList) => [
                ...prevList,
                { listName: model.listName, ID: model.ID },
            ]);
        });
    }, []);

    function handleRename(item: ShoppingLists): void {
        setModalVisible(true);
        setNewListName(item.listName);

        var model = SQliter.Model(shoppingListSchema);
        model.ID = item.ID;
        model.listName = newListName;
        model.update();

        setLocalList((prevList) =>
            prevList.map((list) =>
                list.ID === item.ID ? { ...list, listName: newListName } : list
            )
        );
    }

    function handleDelete(ID: number): void {
        var model = SQliter.Model(shoppingListSchema);
        model.ID = ID;
        model.delete();

        setLocalList((prevList) => prevList.filter((list) => list.ID !== ID));
    }
    function handelEdit(name: string, ID: number) {
        router.push({
            pathname: `screens/shoppingList/addIngredientsToList`,
            params: {
                listName: name,
                listID: ID,
            },
        });
    }

    const renderItem = ({ item }: { item: ShoppingLists | null }) => {
        if (item === null) {
            return (
                <View>
                    <Text style={styles.placeHoler}></Text>
                </View>
            );
        }

        return (
            <Pressable
                onPress={() => {
                    handelEdit(item.listName, item.ID);
                }}
            >
                <Card title={item.listName}>
                    <View style={styles.horiContainer}>
                        <Progress.Bar
                            // progress={
                            //     item.numberOfRecipe > 0
                            //         ? item.recipesDone / item.numberOfRecipe
                            //         : 0
                            // }
                            color={theme.colors.primary}
                            unfilledColor={theme.colors.borderColor}
                            style={styles.progessBar}
                        >
                            {/* <Text style={styles.progressText}>
                                {item.recipesDone} / {item.numberOfRecipe}
                            </Text> */}
                        </Progress.Bar>
                        <View style={styles.spacer} />
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
                                        size={24}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            }
                            contentStyle={styles.menuContent}
                        >
                            <Menu.Item
                                onPress={() => handleRename(item)}
                                title="Umbennen"
                                titleStyle={styles.menuItemText}
                            />
                            <Menu.Item
                                onPress={() => handleDelete(item.ID)}
                                title="Löschen"
                                titleStyle={styles.menuItemText}
                            />
                        </Menu>
                    </View>
                </Card>
            </Pressable>
        );
    };
    const handleCreateClick = () => {
        var model = SQliter.Model(shoppingListSchema);
        model.listName = newListName;
        model = model.insert();

        var newShoppingList: ShoppingLists = {
            listName: newListName,
            ID: model.ID,
        };

        setLocalList([...localList, newShoppingList]);

        setModalVisible(false);
        setNewListName("");
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header backArrow={false}></Header>
                </View>
                <FlatList
                    data={[...localList, null]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Pressable
                    style={[
                        styles.addButton,
                        isEndReached && styles.addButtonEnd,
                    ]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>add</Text>
                </Pressable>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Entypo
                                        name="cross"
                                        size={24}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            </View>
                            <TextInput
                                placeholder="Name der Liste"
                                placeholderTextColor={
                                    theme.colors.placeholderText
                                }
                                style={styles.input}
                                value={newListName}
                                onChangeText={setNewListName}
                            />
                            <Pressable
                                style={styles.button}
                                onPress={handleCreateClick}
                            >
                                <Text style={styles.buttonText}>Erstellen</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        addButton: {
            position: "absolute",
            bottom: 20,
            right: 20,
            elevation: 5,
            backgroundColor: "#4caf50",
            borderRadius: 50,
            width: 60,
            height: 60,
            justifyContent: "center",
            alignItems: "center",
        },
        addButtonEnd: {
            position: "relative",
            bottom: 0,
            right: 0,
            marginTop: 20,
        },
        addButtonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
        },
        progessBar: {
            alignItems: "center",
            width: "90%",
            borderRadius: 10,
            borderColor: theme.colors.primary,
        },
        progressText: {
            fontSize: 14,
            marginBottom: 4,
            color: theme.colors.text,
        },
    });
