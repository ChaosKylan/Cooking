import { View, Text, StyleSheet } from "react-native";
import recipeSchema from "../model/recipeModel";

export default function Tab() {
    var recipeModel = recipeSchema.getModel();

    recipeModel.ID = "1";
    recipeModel.recipeIngredient = "Test";
    recipeModel.recipeInstructions = "Test2";

    recipeModel.insert();

    // var test = recipeSchema.testGetAll();

    // console.log("test: " + test);
    return (
        <View style={styles.container}>
            <Text>Tab [Home]</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
