import { View, StyleSheet, Text, Pressable, FlatList } from "react-native";
import { useContext, useEffect, useState } from "react";
import SQliter from "../../lib/data/sql";
import Header from "../../components/header";
import Card from "../../components/Card";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../lib/provider/themeContext";
import defaultTheme from "../../theme/defaultTheme";
import globalStyles from "../../styles/globalstyles";
import ingredientSchema from "@/app/model/schema/ingredient";
import { GlobalStateContext } from "../../lib/provider/GlobalState";
import { Ingredient, ShoppingListRelMapper } from "@/app/model/templates";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomPicker from "@/app/components/CustomPicker";
import { shopListIngRelSchema } from "@/app/model/schema/shoppingList/shopListIngRel";
import AddIngToList from "@/app/components/ingredient/AddIngToList";
import Body from "@/app/components/body";
import { shoppingListSchema } from "@/app/model/schema/shoppingList/shoppinglist";
import shoppingListIngMapper from "@/app/helper/shoppingListIngMapper";
import { Entypo } from "@expo/vector-icons";

export default function AddIngredientsToList() {
    const { theme } = useContext(ThemeContext);
    const params = useLocalSearchParams();
    const router = useRouter();

    const listID = Array.isArray(params.listID)
        ? parseInt(params.listID[0])
        : parseInt(params.listID as string);

    const [tile, setTile] = useState<string>((params.listName as string) ?? "");
    const [localList, setLocalList] = useState<Array<ShoppingListRelMapper>>(
        []
    );
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const mapList = shoppingListIngMapper(listID);
        setLocalList(mapList);
    }, []);

    const handleAddPress = () => {
        router.push({
            pathname: `screens/shoppingList/addIngredientsToList`,
            params: {
                listName: params.listName,
                listID: params.ID,
            },
        });
    };

    const handleCheck = (item: ShoppingListRelMapper) => {
        const newLocalList = localList.map((listItem) => {
            if (listItem.ingredient.ID === item.ingredient.ID) {
                return {
                    ...listItem,
                    shopListIngRel: {
                        ...listItem.shopListIngRel,
                        done: !listItem.shopListIngRel.done,
                    },
                };
            }
            return listItem;
        });

        var updateModel = SQliter.Model(shopListIngRelSchema);
        updateModel.ID = item.shopListIngRel.ID;
        updateModel.shoppinglistsID = listID;
        updateModel.ingredientsID = item.ingredient.ID;
        updateModel.amount = item.shopListIngRel.quantity;
        updateModel.unit = item.shopListIngRel.unit;
        updateModel.done = !item.shopListIngRel.done;
        updateModel.update();

        setLocalList(newLocalList);
    };

    const renderItem = ({ item }: { item: ShoppingListRelMapper | null }) => {
        if (item === null) {
            return (
                <View>
                    <Text style={styles.placeHoler}></Text>
                </View>
            );
        }
        return (
            <Card
                cardStyle={StyleSheet.flatten([
                    styles.card,
                    item.shopListIngRel.done && styles.doneItemBackground,
                ])}
            >
                <View style={styles.horiContainer}>
                    <Pressable
                        style={styles.checkIconContainer}
                        onPress={() => handleCheck(item)}
                    >
                        <View style={styles.circle}>
                            {item.shopListIngRel.done && (
                                <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color={theme.colors.checkMarkDone}
                                />
                            )}
                        </View>
                    </Pressable>

                    <Text style={styles.titleText}>
                        {item.ingredient.ingName}
                        {", "}
                        {item.shopListIngRel.quantity}{" "}
                        {item.shopListIngRel.unit}
                    </Text>
                    <View style={styles.iconContainer}>
                        <Pressable
                        // onPress={() => handleItemDel(item)}
                        >
                            <Entypo
                                name="edit"
                                size={22}
                                color={theme.colors.iconColor}
                                style={styles.icon}
                            />
                        </Pressable>
                        <Pressable
                        // onPress={() => handleItemDel(item)}
                        >
                            <Entypo
                                name="cross"
                                size={33}
                                color={theme.colors.iconColor}
                            />
                        </Pressable>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header backArrow={true} headerText={tile}></Header>
                </View>
                <FlatList
                    data={[...localList, null]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Pressable style={[styles.addButton]} onPress={handleAddPress}>
                    <Text style={styles.addButtonText}>add</Text>
                </Pressable>
                <Body
                    isEndReached={false}
                    data={localList}
                    renderItem={renderItem}
                    handleAddPress={handleAddPress}
                ></Body>
            </View>
        </SafeAreaView>
    );
}
const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        icon: {
            marginTop: 5,
            marginRight: 5,
        },
        titleText: {
            flex: 1,
            fontSize: 18,
            textAlign: "left",
            color: theme.colors.text,
            marginLeft: 20,
        },
        iconContainer: {
            flexDirection: "row",
            justifyContent: "flex-end",
        },
        checkIconContainer: {
            marginRight: 10,
        },
        circle: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.colors.borderColor,
            justifyContent: "center",
            alignItems: "center",
        },
        card: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        cardItems: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        cardText: {
            color: theme.colors.text,
        },
        // addButton: {
        //     backgroundColor: theme.colors.background,
        //     borderRadius: 50,
        //     width: 40,
        //     height: 40,
        //     justifyContent: "center",
        //     alignItems: "center",
        // },
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
        pickerContainer: {
            borderColor: theme.colors.borderColor,
            borderWidth: 1,
            borderRadius: 10,
            marginBottom: 20,
        },
        picker: {
            width: "100%",
            height: 50,
            color: theme.colors.text,
            backgroundColor: theme.colors.cardBackground,
        },
        pickerItem: {
            backgroundColor: theme.colors.cardBackground,
            color: theme.colors.text,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
        },
    });
