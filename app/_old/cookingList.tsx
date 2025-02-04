import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Pressable,
    TouchableWithoutFeedback,
    Keyboard,
    Modal,
    LayoutRectangle,
    ProgressBarAndroidBase,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import SQliter from "../lib/data/sql";
import { mealPlansSchema } from "../model/schema/mealPlan";
import { recipeSchema } from "../model/schema/recipe";
import { mealRecipRelSchema } from "../model/schema/mealPlanRecipeRel";
import * as Progress from "react-native-progress";
import Header from "../components/header";

interface Plan {
    ID: number;
    name: string;
    numberOfRecipe: number;
    recipesDone: number;
}

export default function Tab() {
    const [plan, setPlan] = useState<Array<Plan>>([]);

    useEffect(() => {
        const planList = SQliter.connection().findAll(mealPlansSchema);

        planList?.forEach((model) => {
            const joinModelList = model.join(recipeSchema, mealRecipRelSchema);

            var tempPlan: Plan = {
                ID: model.ID,
                name: model.Name,
                numberOfRecipe: joinModelList?.target?.length || 0,
                recipesDone:
                    joinModelList?.relation?.map((rel) => rel.done == true)
                        .length || 0,
            };

            setPlan((planList: any) => [...planList, tempPlan]);
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Header backArrow={false} addIcon={true} />
            </View>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <ScrollView>
                    {plan.map((tempPlan: Plan, index: number) => (
                        <View key={tempPlan.ID} style={styles.planContainer}>
                            <Text style={styles.planName}>{tempPlan.name}</Text>
                            <Progress.Bar
                                progress={
                                    tempPlan.numberOfRecipe > 0
                                        ? tempPlan.recipesDone /
                                          tempPlan.numberOfRecipe
                                        : 0
                                }
                                width={200}
                                color="#4caf50"
                            />
                            <Text style={styles.progressText}>
                                {tempPlan.recipesDone} /
                                {tempPlan.numberOfRecipe} Recipes Done
                            </Text>
                        </View>
                    ))}
                </ScrollView>
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
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    icon: {
        alignSelf: "flex-end",
        color: "black",
        paddingBottom: 10,
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
    progressText: {
        marginTop: 8,
        fontSize: 14,
        color: "#555",
    },
});
