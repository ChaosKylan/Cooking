import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/header";
import Card from "../../components/Card";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Recipe } from "../../model/templates";
import mealReciMapper from "@/app/helper/mealReciMapper";
import { GlobalStateContext } from "../../lib/provider/GlobalState";
import SQliter from "@/app/lib/data/sql";
import { mealRecipRelSchema } from "@/app/model/schema/mealPlanRecipeRel";
import { RecipeWithOrder } from "../../model/templates";

import { ThemeContext } from "../../lib/provider/themeContext";
import defaultTheme from "../../theme/defaultTheme";
import globalStyles from "../../styles/globalstyles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddMealPlan() {
    const [localRecipeList, setLocalRecipeList] = useState<RecipeWithOrder[]>(
        []
    );
    const [isEndReached, setIsEndReached] = useState(false);
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);

    const params = useLocalSearchParams();
    const router = useRouter();

    const { theme, setTheme } = useContext(ThemeContext);

    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    const handleAddPress = () => {
        router.push({
            pathname: "screens/mealPlan/addMealToPlan",
            params: {
                title: params.title.toString(),
                planID: params.planID,
            },
        });
    };

    const getRandomRecipe = (excludedIDs: number[]): Recipe | null => {
        const filteredRecipes: Recipe[] = recipeList.filter(
            (recipe: Recipe) => !excludedIDs.includes(recipe.ID)
        );
        if (filteredRecipes.length > 0) {
            return filteredRecipes[
                Math.floor(Math.random() * filteredRecipes.length)
            ];
        }
        return null;
    };

    const handleRnd = (item: RecipeWithOrder) => {
        const randomRecipe = getRandomRecipe([item.recipe.ID]);
        if (randomRecipe) {
            var model = SQliter.connection().findOne(
                mealRecipRelSchema,
                `mealplansID = ${params.planID} AND recipesID = ${item.recipe.ID} and orderID = ${item.orderID}`
            );
            if (model) {
                model.recipesID = randomRecipe.ID;
                model.update(
                    `mealplansID = ${params.planID} AND orderID = ${model.orderID}`
                );
                var newRnd: RecipeWithOrder = {
                    recipe: randomRecipe,
                    orderID: model.orderID,
                    done: false,
                };
                setLocalRecipeList((prevList) =>
                    prevList.map((listItem) =>
                        listItem.recipe.ID === item.recipe.ID &&
                        listItem.orderID === item.orderID
                            ? newRnd
                            : listItem
                    )
                );
            } else {
                console.log("handleRnd", "Da ist was schiefgelaufen");
            }
        } else {
            console.log("Keine anderen Rezepte verfügbar");
        }
    };

    const handleItemDel = (item: RecipeWithOrder) => {
        var model = SQliter.Model(mealRecipRelSchema);
        model?.delete(
            `mealplansID = ${params.planID} AND recipesID = ${item.recipe.ID} and orderID = ${item.orderID}`
        );
        setLocalRecipeList((prevList) =>
            prevList.filter(
                (listItem) =>
                    listItem.recipe.ID !== item.recipe.ID ||
                    listItem.orderID !== item.orderID
            )
        );
    };

    useEffect(() => {
        if (params.planID) {
            if (params.autoGen == "true") {
                const addedRecipeIDs: number[] = [];
                const recipeCount = Math.max(1, Number(params.recipeCount));
                for (var i: number = 0; i < recipeCount; i++) {
                    let randomRecipe = getRandomRecipe(addedRecipeIDs);
                    if (!randomRecipe && addedRecipeIDs.length > 0) {
                        addedRecipeIDs.length = 0;
                        randomRecipe = getRandomRecipe(addedRecipeIDs);
                    }
                    if (randomRecipe) {
                        addedRecipeIDs.push(randomRecipe.ID);
                        var model = SQliter.Model(mealRecipRelSchema);
                        model.mealplansID = params.planID;
                        model.recipesID = randomRecipe.ID;
                        model.orderID = i;
                        model.insert();

                        var newRecipeWithOrder: RecipeWithOrder = {
                            recipe: randomRecipe,
                            orderID: i,
                            done: false,
                        };

                        setLocalRecipeList((prevList) => [
                            ...prevList,
                            newRecipeWithOrder,
                        ]);
                    }
                }
                router.replace({
                    pathname: "screens/mealPlan/addMealPlan",
                    params: {
                        title: params.title.toString(),
                        planID: params.planID,
                    },
                });
            } else {
                var newRecipes = mealReciMapper(Number(params.planID));

                setLocalRecipeList((prevList) => [...prevList, ...newRecipes]);
            }
        }
    }, [params.title, params.planID, params.autoGen]);

    const handleCheck = (item: RecipeWithOrder) => {
        var model = SQliter.Model(mealRecipRelSchema);
        model.recipesID = item.recipe.ID;
        model.mealplansID = params.planID;
        model.done = !item.done;
        model.orderID = item.orderID;
        model.update(
            `mealplansID = ${params.planID} AND orderID = ${model.orderID}`
        );

        setLocalRecipeList((prevList) =>
            prevList.map((listItem) =>
                listItem.orderID === item.orderID
                    ? { ...listItem, done: !listItem.done }
                    : listItem
            )
        );
    };

    const renderItem = ({ item }: { item: RecipeWithOrder | null }) => {
        if (item === null) {
            return (
                <View>
                    <Text style={styles.placeHoler}></Text>
                </View>
            );
        }
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        router.push({
                            pathname: `screens/recipe/viewRecipe`,
                            params: { recipeID: item.recipe.ID },
                        });
                    }}
                >
                    <Card
                        cardStyle={StyleSheet.flatten([
                            styles.card,
                            item.done && styles.doneItemBackground,
                        ])}
                    >
                        <View style={styles.horiContainer}>
                            <Pressable
                                style={styles.checkIconContainer}
                                onPress={() => handleCheck(item)}
                            >
                                <View style={styles.circle}>
                                    {item.done && (
                                        <Ionicons
                                            name="checkmark"
                                            size={20}
                                            color={theme.colors.checkMarkDone}
                                        />
                                    )}
                                </View>
                            </Pressable>

                            <Text style={styles.titleText}>
                                {item.recipe.title}
                            </Text>
                            <View style={styles.iconContainer}>
                                <Pressable onPress={() => handleRnd(item)}>
                                    <Ionicons
                                        name="dice"
                                        size={33}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                                <Pressable onPress={() => handleItemDel(item)}>
                                    <Entypo
                                        name="cross"
                                        size={33}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        );
    };

    const goBack = () => {
        router.replace({
            pathname: "/",
            params: {},
        });
    };

    const sortedRecipeList = [...localRecipeList].sort((a, b) => {
        if (a.done === b.done) {
            return 0;
        }
        return a.done ? 1 : -1;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header
                        headerText={params.title.toString()}
                        onGoBack={goBack}
                    ></Header>
                </View>
                <FlatList
                    data={[...sortedRecipeList, null]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
                <Pressable
                    style={[
                        styles.addButton,
                        isEndReached && styles.addButtonEnd,
                    ]}
                    onPress={handleAddPress}
                >
                    <Text style={styles.addButtonText}>add</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        cardContainer: {
            width: "100%",
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
            color: theme.colors.text,
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
            backgroundColor: theme.colors.menuBorderColor,
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
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: "bold",
        },
        plusContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
    });
