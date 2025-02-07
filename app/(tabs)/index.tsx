// import { View, Text, StyleSheet } from "react-native";
// import { ThemeContext } from "../lib/provider/themeContext";
// import { useContext } from "react";
// import theme from "../theme/defaultTheme";

// export default function Tab() {
//     const [theme, setTheme] = useContext(ThemeContext);
//     return (
//         <View style={styles.container}>
//             <Text>Tab [Home]</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: theme.borderColor,
//         color: theme.fontColor,
//     },
// });
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Modal,
    Pressable,
    TextInput,
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
import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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
    const [recipeCount, setRecipeCount] = useState("1");
    const [newPlanName, setNewPlanName] = useState("");

    const router = useRouter();

    useEffect(() => {
        const planList = SQliter.connection().findAll(mealPlansSchema);
        planList?.forEach((model) => {
            const joinModelList = model.join(recipeSchema, mealRecipRelSchema);

            var tempPlan: Plan = {
                ID: model.ID,
                name: model.planName,
                numberOfRecipe: joinModelList?.target?.length || 0,
                recipesDone:
                    joinModelList?.relation?.filter((rel) => {
                        Boolean(rel.done) === true;
                    }).length || 0,
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
                <Progress.Bar
                    progress={
                        item.numberOfRecipe > 0
                            ? item.recipesDone / item.numberOfRecipe
                            : 0
                    }
                    width={200}
                    color="#4caf50"
                />
                <Text style={styles.progressText}>
                    {item.recipesDone} /{item.numberOfRecipe} Recipes Done
                </Text>
            </Card>
        </Pressable>
    );

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

    const handelCheckBoxChanged = (newValue: boolean) => {
        setIsModalChecked(newValue);
        if (!newValue) {
            setRecipeCount("1");
        }
    };
    const handelCreateClick = () => {
        if (newPlanName != "") {
            var model = SQliter.Model(mealPlansSchema);
            model.planName = newPlanName;
            model.insert();
            setModalVisible(false);
            router.push({
                pathname: `screens/mealPlan/addMealPlan`,
                params: {
                    title: newPlanName,
                    recipeCount: recipeCount,
                    autoGen: isModalChecked.toString(),
                },
            });

            setNewPlanName("");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Header
                    onAdd={handelAdd}
                    addIcon={true}
                    backArrow={false}
                ></Header>
            </View>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
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
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Entypo
                                            name="cross"
                                            size={24}
                                            color="black"
                                        />
                                    </Pressable>
                                </View>
                                <TextInput
                                    placeholder="Name des Essenplans"
                                    style={styles.input}
                                    value={newPlanName}
                                    onChangeText={setNewPlanName}
                                />
                                <View style={styles.horiContainer}>
                                    <Checkbox
                                        value={isModalChecked}
                                        onValueChange={handelCheckBoxChanged}
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
                                            style={styles.input}
                                            value={recipeCount}
                                            onChangeText={setRecipeCount}
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
                </View>
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
    horiContainer: {
        flexDirection: "row",
        marginBottom: 10,
    },

    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    planContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#fff",
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
    },
    checkBoxText: {
        marginLeft: 8,
    },
    progressText: {
        marginTop: 8,
        fontSize: 14,
        color: "#555",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Hintergrund transparent machen
    },
    modalView: {
        width: "75%",
        padding: 20,
        backgroundColor: "white",
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
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
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
});
