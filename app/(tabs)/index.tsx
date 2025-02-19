import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList,
    Modal,
    Pressable,
    TextInput,
    ImageBackground,
} from "react-native";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import SQliter from "../lib/data/sql";
import { mealPlansSchema } from "../model/schema/mealPlan";
import { recipeSchema } from "../model/schema/recipe";
import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
import * as Progress from "react-native-progress";
import Header from "../components/header";
import Card from "../components/Card";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { Menu, Provider } from "react-native-paper";
import { Colors } from "react-native/Libraries/NewAppScreen";
import mealReciMapper from "../helper/mealReciMapper";
import { RecipeWithOrder } from "../model/templates";
import { SafeAreaView } from "react-native-safe-area-context";

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

    const router = useRouter();

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

    const renderItem = ({ item }: { item: Plan }) => (
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
                        color="#4caf50"
                        unfilledColor="#555"
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
                                    color="white"
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
                            addIcon={true}
                            backArrow={false}
                        ></Header>
                    </View>

                    <TouchableWithoutFeedback
                        onPress={() => setModalVisible(false)}
                    >
                        <View>
                            <FlatList
                                data={plan}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.ID.toString()}
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
                                                    color="white"
                                                />
                                            </Pressable>
                                        </View>
                                        <TextInput
                                            placeholder="Name des Essenplans"
                                            placeholderTextColor="#888"
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
                                                color="#4caf50"
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
                                                    placeholderTextColor="#888"
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
                                                    color="white"
                                                />
                                            </Pressable>
                                        </View>
                                        <TextInput
                                            placeholder="Neuer Name des Essenplans"
                                            placeholderTextColor="#888"
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
                </View>
            </SafeAreaView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#121212",
    },

    container: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: "#121212",
    },
    horiContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        alignSelf: "center",
    },
    progessBar: {
        alignItems: "center",
        width: "90%",
        borderRadius: 10,
        borderColor: "#4caf50",
    },
    spacer: {
        width: 10,
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    planContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#1e1e1e",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    planName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#fff",
    },
    checkBoxText: {
        marginLeft: 8,
        color: "#fff",
    },
    progressText: {
        fontSize: 14,
        marginBottom: 4,
        color: "#fff",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "75%",
        padding: 20,
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingBottom: 10,
    },
    closeButton: {
        padding: 5,
    },
    input: {
        width: "100%",
        borderColor: "#555",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        color: "#fff",
        padding: 10,
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#4caf50",
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    menuContent: {
        backgroundColor: "#1e1e1e",
        borderColor: "#4caf50",
        borderWidth: 1,
    },
    menuItemText: {
        color: "#fff",
    },
});
