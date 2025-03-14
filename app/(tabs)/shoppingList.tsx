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
import { Ingredient, ShoppingLists, ShopListIngRel } from "../model/templates";
import shoppingListIngMapper from "../helper/shoppingListIngMapper";
import Body from "../components/body";

interface ShoppingListRel {
    shoppingList: ShoppingLists;
    ingsDone: number;
    ingsTotal: number;
}

export default function Tab() {
    //const [localList, setLocalList] = useState<Array<ShoppingLists>>([]);
    const [localList, setLocalList] = useState<Array<ShoppingListRel>>([]);
    const [relList, setRelList] = useState<Array<ShopListIngRel>>([]);
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
        const shoppingLists = SQliter.connection().findAll(shoppingListSchema);
        // console.log("plans", shoppingLists);
        shoppingLists?.forEach((model) => {
            const mapList = shoppingListIngMapper(model.ID);

            const tmpShoppingListRel: ShoppingListRel = {
                shoppingList: {
                    listName: model.listName,
                    ID: model.ID,
                },
                ingsDone: mapList.filter((rel) => rel.shopListIngRel.done)
                    .length,
                ingsTotal: mapList.length,
            };
            setLocalList((prevList) => [...prevList, tmpShoppingListRel]);
        });
    }, []);

    function handleRename(item: ShoppingListRel): void {
        setModalVisible(true);
        setNewListName(item.shoppingList.listName);

        var model = SQliter.Model(shoppingListSchema);
        model.ID = item.shoppingList.ID;
        model.listName = newListName;
        model.update();

        setLocalList((prevList) =>
            prevList.map((list) =>
                list.shoppingList.ID === item.shoppingList.ID
                    ? { ...list, listName: newListName }
                    : list
            )
        );
    }

    function handleDelete(ID: number): void {
        var model = SQliter.Model(shoppingListSchema);
        model.ID = ID;
        model.delete();

        setLocalList((prevList) =>
            prevList.filter((list) => list.shoppingList.ID !== ID)
        );
    }
    function handelEdit(name: string, ID: number) {
        router.push({
            pathname: `screens/shoppingList/ingredientsList`,
            params: {
                listName: name,
                listID: ID,
            },
        });
    }

    const renderItem = ({ item }: { item: ShoppingListRel | null }) => {
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
                    handelEdit(
                        item.shoppingList.listName,
                        item.shoppingList.ID
                    );
                }}
            >
                <Card title={item.shoppingList.listName}>
                    <View style={styles.horiContainer}>
                        <Progress.Bar
                            progress={
                                item.ingsTotal > 0
                                    ? item.ingsDone / item.ingsTotal
                                    : 0
                            }
                            color={theme.colors.primary}
                            unfilledColor={theme.colors.borderColor}
                            style={styles.progessBar}
                            height={18}
                            width={null}
                        >
                            <Text style={styles.progressText}>
                                {item.ingsDone}/{item.ingsTotal}
                            </Text>
                        </Progress.Bar>
                        <View style={styles.spacer} />
                        <Menu
                            visible={menuVisible[item.shoppingList.ID] || false}
                            onDismiss={() =>
                                setMenuVisible((prev) => ({
                                    ...prev,
                                    [item.shoppingList.ID]: false,
                                }))
                            }
                            anchor={
                                <Pressable
                                    onPress={() =>
                                        setMenuVisible((prev) => ({
                                            ...prev,
                                            [item.shoppingList.ID]: true,
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
                                onPress={() =>
                                    handleDelete(item.shoppingList.ID)
                                }
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
        model.listName = newListName || "Neue Liste";
        model = model.insert();

        var newShoppingList: ShoppingListRel = {
            shoppingList: {
                listName: model.listName,
                ID: model.ID,
            },
            ingsDone: 0,
            ingsTotal: 0,
        };

        setLocalList([...localList, newShoppingList]);

        setModalVisible(false);
        setNewListName("");

        handelEdit(model.listName, model.ID);
    };

    return (
        <Provider>
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
                                    <Text style={styles.buttonText}>
                                        Erstellen
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        </Provider>
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
    });
