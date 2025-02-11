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
} from "react-native";
import { useState, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { GlobalStateContext } from "../../lib/provider/GlobalState";
import SQliter from "../../lib/data/sql";
import Header from "../../components/header";
import Card from "../../components/Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Recipe } from "../../model/templates";
import { mealRecipRelSchema } from "@/app/model/schema/mealPlanRecipeRel";

export default function AddMealToPlan() {
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    var [searchText, setSearchText] = useState("");
    const router = useRouter();

    const [addedItems, setAddedItems] = useState<{ [key: string]: boolean }>(
        {}
    );
    const params = useLocalSearchParams();

    const handleAdd = (item: Recipe) => {
        var model = SQliter.Model(mealRecipRelSchema);
        model.mealplansID = params.planID;
        model.recipesID = item.ID;
        model.done = false;
        const maxOrder = Number(
            SQliter.connection().getMax(
                mealRecipRelSchema,
                `orderID`,
                `mealplansID = ${params.planID}`
            )
        );
        model.orderID = isNaN(maxOrder) ? 0 : maxOrder + 1;
        model.insert();

        setAddedItems((prev) => ({ ...prev, [item.ID]: true }));
        setTimeout(() => {
            setAddedItems((prev) => ({ ...prev, [item.ID]: false }));
        }, 3000);
    };

    const renderItem = ({ item, index }: { item: Recipe; index: number }) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                router.push({
                    pathname: `screens/recipe/viewRecipe`,
                    params: { recipeID: item.ID },
                });
            }}
        >
            <Card>
                <View style={styles.cardItems}>
                    <Text style={styles.cardText}>{item.title}</Text>

                    {addedItems[item.ID] ? (
                        <Pressable style={styles.addButton}>
                            <Ionicons
                                name="checkmark"
                                size={24}
                                color="white"
                            />
                        </Pressable>
                    ) : (
                        <Pressable
                            style={styles.addButton}
                            onPress={() => handleAdd(item)}
                        >
                            <Ionicons name="add" size={24} color="white" />
                        </Pressable>
                    )}
                </View>
            </Card>
        </TouchableOpacity>
    );

    const searchCheck = (model: Recipe) => {
        if (!searchText || searchText == "") return true;
        return model.title.includes(searchText);
    };

    const goBack = () => {
        router.replace({
            pathname: "screens/mealPlan/addMealPlan",
            params: {
                title: params.title.toString(),
                planID: params.planID,
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Header headerText="Rezepte" onGoBack={goBack}></Header>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
    },

    addButton: {
        backgroundColor: "#4caf50",
        borderRadius: 50,
        width: 40,
        height: 40,
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
        fontSize: 22,
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    card: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        flex: 1,
        textAlign: "left",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    plusContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
});
