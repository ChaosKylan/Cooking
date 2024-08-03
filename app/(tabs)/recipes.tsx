import { View, Text, StyleSheet } from "react-native";
import { recipeSchema } from "../model/recipeModel";
import SQliter from "../lib/data/sql";

export default function Tab() {
    var recipeModel = SQliter.Model("Recipes", recipeSchema);
    recipeModel.ID = "1";
    recipeModel.recipeIngredient = "Test";
    recipeModel.recipeInstructions = "Test2";

    recipeModel.insert();
    recipeModel.recipeInstructions = "Test5";
    recipeModel.update();
    //recipeModel.delete();

    var test = new SQliter();
    var testmodel: any = test.findOne("Recipes", recipeSchema);
    testmodel = test.findOne("Recipes", recipeSchema);

    console.log("testmodel 2: " + testmodel.recipeInstructions);

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
