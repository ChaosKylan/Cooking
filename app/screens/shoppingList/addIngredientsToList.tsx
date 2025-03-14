import { View, StyleSheet } from "react-native";
import { useContext, useState } from "react";
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
import { Ingredient } from "@/app/model/templates";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomPicker from "@/app/components/CustomPicker";
import { shopListIngRelSchema } from "@/app/model/schema/shoppingList/shopListIngRel";
import AddIngToList from "@/app/components/ingredient/AddIngToList";
import getIngredientID from "@/app/helper/getIngredientID";

export default function AddIngredientsToList() {
    const { theme } = useContext(ThemeContext);

    const params = useLocalSearchParams();
    const router = useRouter();

    const [tile, setTile] = useState<string>((params.listName as string) ?? "");
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    const saveIngredientToList = (ingredient: Ingredient) => {
        // var newIng = SQliter.Model(ingredientSchema);
        // if (ingredient.ID === -1) {
        //     newIng.ingName = ingredient.ingName;
        //     newIng = newIng.insert();
        // } else {
        //     newIng.id = ingredient.ID;
        // }
        var ingID = getIngredientID(ingredient);

        var ingRelModel = SQliter.Model(shopListIngRelSchema);
        ingRelModel.shoppinglistsID = params.listID;
        ingRelModel.ingredientsID = ingID;
        ingRelModel.amount = ingredient.quantity;
        ingRelModel.unit = ingredient.unit ?? "";
        ingRelModel.done = false;
        ingRelModel.insert();
    };

    const goBack = () => {
        router.replace({
            pathname: `screens/shoppingList/ingredientsList`,
            params: {
                listName: params.listName,
                listID: params.listID,
            },
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header
                        backArrow={true}
                        headerText={tile}
                        onGoBack={goBack}
                    ></Header>
                </View>
                <AddIngToList
                    saveIngredientToList={saveIngredientToList}
                ></AddIngToList>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        cardItems: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        cardText: {
            color: theme.colors.text,
        },
        addButton: {
            backgroundColor: theme.colors.background,
            borderRadius: 50,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
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
