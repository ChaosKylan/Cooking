import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/header";
import Card from "../../components/Card";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Recipe } from "../../model/templates";
import mealReciMapper from "@/app/helper/mealReciMapper";

export default function AddMealPlan() {
    const [localRecipeList, setLocalRecipeList] = useState<Recipe[]>([]);
    const [isEndReached, setIsEndReached] = useState(false);

    const params = useLocalSearchParams();
    const router = useRouter();

    const handleAddPress = () => {
        router.push({
            pathname: "screens/mealPlan/addMealToPlan",
            params: {
                /// callbackId: "addMealPlanCallback",
                title: params.title.toString(),
                planID: params.planID,
            },
        });
    };

    useEffect(() => {
        if (params.planID) {
            var newRecipes = mealReciMapper(Number(params.planID));
            setLocalRecipeList((prevList) => [...prevList, ...newRecipes]);
        }
    }, [params.title, params.planID]);

    const renderItem = ({ item }: { item: Recipe | null }) => {
        if (item === null) {
            return (
                <View>
                    <Text style={styles.placeHoler}></Text>
                </View>
            );
        }

        return (
            <View style={styles.cardContainer}>
                <Card cardStyle={styles.card}>
                    <View style={styles.horiContainer}>
                        <Text style={styles.titleText}>{item.title}</Text>
                        <View style={styles.iconContainer}>
                            <Ionicons name="dice" size={22} color="black" />
                            <Entypo name="cross" size={22} color="black" />
                        </View>
                    </View>
                </Card>
            </View>
        );
    };

    const goBack = () => {
        router.replace({
            pathname: "/",
            params: {},
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Header
                    headerText={params.title.toString()}
                    onGoBack={goBack}
                ></Header>
            </View>
            <FlatList
                data={[...localRecipeList, null]}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <Pressable
                style={[styles.addButton, isEndReached && styles.addButtonEnd]}
                onPress={handleAddPress}
            >
                <Text style={styles.addButtonText}>add</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    placeHoler: { height: 100 },
    container: {
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    cardContainer: {
        width: "100%",
        paddingHorizontal: 10,
    },
    card: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    horiContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 10,
    },
    titleText: {
        flex: 1,
        textAlign: "left",
        color: "black",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
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
    plusContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
