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
import Checkbox from "expo-checkbox";
import { useContext, useEffect, useState } from "react";
import SQliter from "../lib/data/sql";
import { mealPlansSchema } from "../model/schema/mealPlan";
import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
import * as Progress from "react-native-progress";
import Header from "../components/header";
import Card from "../components/Card";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Menu, Provider } from "react-native-paper";
import mealReciMapper from "../helper/mealReciMapper";
import { RecipeWithOrder } from "../model/templates";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";

interface Plan {
    ID: number;
    name: string;
    numberOfRecipe: number;
    recipesDone: number;
}

export default function Tab() {
    const [plan, setPlan] = useState<Array<Plan>>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isModalChecked, setIsModalChecked] = useState(false);
    const [recipeCount, setRecipeCount] = useState("");
    const [newPlanName, setNewPlanName] = useState("");
    const [menuVisible, setMenuVisible] = useState<{ [key: number]: boolean }>(
        {}
    );
    const [renameModalVisible, setRenameModalVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

    const [isEndReached, setIsEndReached] = useState(false);

    const router = useRouter();

    const { theme, setTheme } = useContext(ThemeContext);

    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const planList = SQliter.connection().findAll(mealPlansSchema);
        planList?.forEach((model) => {
            const list: RecipeWithOrder[] = mealReciMapper(model.ID);

            var tempPlan: Plan = {
                ID: model.ID,
                name: model.planName,
                numberOfRecipe: list.length,
                recipesDone: list.filter((rel) => rel.done).length,
            };

            setPlan((planList: any) => [...planList, tempPlan]);
        });
    }, []);

    const renderItem = ({ item }: { item: Plan | null }) => {
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
                    handelEdit(item.name, item.ID);
                }}
            >
                <Card title={item.name}>
                    <View style={styles.horiContainer}>
                        <Progress.Bar
                            progress={
                                item.numberOfRecipe > 0
                                    ? item.recipesDone / item.numberOfRecipe
                                    : 0
                            }
                            color={theme.colors.primary}
                            unfilledColor={theme.colors.borderColor}
                            style={styles.progessBar}
                        >
                            <Text style={styles.progressText}>
                                {item.recipesDone} / {item.numberOfRecipe}
                            </Text>
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
                            contentStyle={styles.menuContent} // Menüinhalt-Stil hinzufügen
                        >
                            <Menu.Item
                                onPress={() => handleRename(item)}
                                title="Umbennen"
                                titleStyle={styles.menuItemText} // Menü-Item-Stil hinzufügen
                            />
                            <Menu.Item
                                onPress={() => handleDelete(item.ID)}
                                title="Löschen"
                                titleStyle={styles.menuItemText} // Menü-Item-Stil hinzufügen
                            />
                        </Menu>
                    </View>
                </Card>
            </Pressable>
        );
    };

    const handleRename = (item: Plan) => {
        setSelectedPlan(item);
        setNewPlanName(item.name);
        setRenameModalVisible(true);
        setMenuVisible((prev) => ({ ...prev, [item.ID]: false }));
    };

    const handelEdit = (_planName: string, _planID: number) => {
        router.push({
            pathname: `screens/mealPlan/addMealPlan`,
            params: {
                title: _planName,
                planID: _planID,
            },
        });
    };

    const handelAdd = () => {
        setModalVisible(true);
    };

    const handleDelete = (planID: number) => {
        var relModel = SQliter.Model(mealRecipRelSchema);
        relModel.delete(`${mealPlansSchema.tableName}ID = ${planID}`);
        var model = SQliter.Model(mealPlansSchema);
        model.ID = planID;
        model.delete();
        setPlan((prev) => prev.filter((plan) => plan.ID !== planID));
    };

    const handelCheckBoxChanged = (newValue: boolean) => {
        setIsModalChecked(newValue);
        if (!newValue) {
            setRecipeCount("1");
        }
    };

    const handelCreateClick = () => {
        var newName = newPlanName == "" ? "new Plan" : newPlanName;

        var model = SQliter.Model(mealPlansSchema);
        model.planName = newName;
        model.insert();
        setModalVisible(false);
        router.push({
            pathname: `screens/mealPlan/addMealPlan`,
            params: {
                title: newName,
                recipeCount: recipeCount,
                autoGen: isModalChecked.toString(),
                planID: model.ID,
            },
        });

        setNewPlanName("");
    };

    const handleRenameSubmit = () => {
        if (selectedPlan && newPlanName !== "") {
            var model = SQliter.connection().findOne(
                mealPlansSchema,
                `ID = ${selectedPlan.ID}`
            );

            if (!model) return; //ToDo Error Message
            model.planName = newPlanName;
            model.update();

            setPlan((prev) =>
                prev.map((plan) =>
                    plan.ID === selectedPlan.ID
                        ? { ...plan, name: newPlanName }
                        : plan
                )
            );

            setRenameModalVisible(false);
            setNewPlanName("");
            setSelectedPlan(null);
        }
    };

    return (
        <Provider>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.topBox}>
                        <Header
                            onAdd={handelAdd}
                            addIcon={false}
                            backArrow={false}
                        ></Header>
                    </View>
                    <TouchableWithoutFeedback
                        onPress={() => setModalVisible(false)}
                    >
                        <View>
                            <FlatList
                                data={[...plan, null]}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={() => setIsEndReached(true)}
                                onEndReachedThreshold={0.5}
                            />

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
                                                onPress={() =>
                                                    setModalVisible(false)
                                                }
                                            >
                                                <Entypo
                                                    name="cross"
                                                    size={24}
                                                    color={
                                                        theme.colors.iconColor
                                                    }
                                                />
                                            </Pressable>
                                        </View>
                                        <TextInput
                                            placeholder="Name des Essenplans"
                                            placeholderTextColor={
                                                theme.colors.placeholderText
                                            }
                                            style={styles.input}
                                            value={newPlanName}
                                            onChangeText={setNewPlanName}
                                        />
                                        <View style={styles.horiContainer}>
                                            <Checkbox
                                                value={isModalChecked}
                                                onValueChange={
                                                    handelCheckBoxChanged
                                                }
                                                color={theme.colors.primary}
                                            />
                                            <Text style={styles.checkBoxText}>
                                                Automatisch Generieren
                                            </Text>
                                        </View>
                                        {isModalChecked && (
                                            <View>
                                                <TextInput
                                                    keyboardType="number-pad"
                                                    placeholder="Anzahl an Essen"
                                                    placeholderTextColor={
                                                        theme.colors
                                                            .placeholderText
                                                    }
                                                    style={styles.input}
                                                    value={recipeCount}
                                                    onChangeText={
                                                        setRecipeCount
                                                    }
                                                ></TextInput>
                                            </View>
                                        )}
                                        <Pressable
                                            style={styles.button}
                                            onPress={handelCreateClick}
                                        >
                                            <Text style={styles.buttonText}>
                                                Erstellen
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                            <Modal
                                animationType="none"
                                transparent={true}
                                visible={renameModalVisible}
                                onRequestClose={() => {
                                    setRenameModalVisible(false);
                                }}
                            >
                                <View style={styles.modalOverlay}>
                                    <View style={styles.modalView}>
                                        <View style={styles.modalHeader}>
                                            <Pressable
                                                style={styles.closeButton}
                                                onPress={() =>
                                                    setRenameModalVisible(false)
                                                }
                                            >
                                                <Entypo
                                                    name="cross"
                                                    size={24}
                                                    color={
                                                        theme.colors.iconColor
                                                    }
                                                />
                                            </Pressable>
                                        </View>
                                        <TextInput
                                            placeholder="Neuer Name des Essenplans"
                                            placeholderTextColor={
                                                theme.colors.placeholderText
                                            }
                                            style={styles.input}
                                            value={newPlanName}
                                            onChangeText={setNewPlanName}
                                        />
                                        <Pressable
                                            style={styles.button}
                                            onPress={handleRenameSubmit}
                                        >
                                            <Text style={styles.buttonText}>
                                                Umbennen
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </TouchableWithoutFeedback>

                    <Pressable style={styles.addButton} onPress={handelAdd}>
                        <Text style={styles.addButtonText}>add</Text>
                    </Pressable>
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
        planContainer: {
            marginBottom: 16,
            padding: 16,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 8,
            shadowColor: theme.colors.shadowColor,
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        planName: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: theme.colors.text,
        },
        checkBoxText: {
            marginLeft: 8,
            color: theme.colors.text,
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
