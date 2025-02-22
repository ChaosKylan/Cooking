import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList,
    Pressable,
    TextInput,
    Keyboard,
} from "react-native";
import { useContext, useState, useEffect } from "react";
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

export default function AddIngredientsToList() {
    const [searchText, setSearchText] = useState("");
    const [localIngredients, setLocalIngredients] = useState<string[]>([]);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const { ingredientList, setIngredientList } =
        useContext(GlobalStateContext);
    const [cardVisible, setCardVisible] = useState(false);

    const params = useLocalSearchParams();

    const [tile, setTile] = useState<string>((params.listName as string) ?? "");
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const fetchedIngredients =
            SQliter.connection().findAll(ingredientSchema);
        setIngredientList(fetchedIngredients);
    }, []);

    const handleAddIngredient = () => {};

    const renderItem = ({ item }: { item: string }) => (
        <View style={styles.cardItems}>
            <Text style={styles.cardText}>{item}</Text>
        </View>
    );

    const handleOnTextChange = (text: string) => {
        setSearchText(text);
        setCardVisible(true);
        if (text.trim() !== "") {
            const filteredIngredients: any[] = (ingredientList ?? []).filter(
                (ingredient: any) =>
                    ingredient.ingName
                        ?.toLowerCase()
                        .startsWith(text.trim().toLowerCase())
            );
            setLocalIngredients([
                text.trim(),
                ...filteredIngredients.map((ingredient) => ingredient.ingName),
            ]);
        } else {
            setLocalIngredients([]);
            setCardVisible(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    <Header backArrow={true} headerText={tile}></Header>
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        placeholder="Zutat hinzufügen"
                        placeholderTextColor={theme.colors.placeholderText}
                        value={searchText}
                        onChangeText={handleOnTextChange}
                        onSubmitEditing={handleAddIngredient}
                    />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <Card visible={cardVisible}>
                            <FlatList
                                data={localIngredients}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </Card>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        cardItems: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        cardText: {
            color: theme.colors.text,
        },
    });
