import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    FlatList,
    Pressable,
    TextInput,
    Keyboard,
    Modal,
} from "react-native";
import { useContext, useState, useEffect } from "react";
import SQliter from "../../lib/data/sql";
import Card from "../../components/Card";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeContext } from "../../lib/provider/themeContext";
import defaultTheme from "../../theme/defaultTheme";
import globalStyles from "../../styles/globalstyles";
import ingredientSchema from "@/app/model/schema/ingredient";
import { GlobalStateContext } from "../../lib/provider/GlobalState";
import { Ingredient, listData } from "@/app/model/templates";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomPicker from "@/app/components/CustomPicker";
import { shopListIngRelSchema } from "@/app/model/schema/shoppingList/shopListIngRel";
import IngredientModal from "./IngredientModal";
import recipIngSchema from "@/app/model/schema/recipeIngredientRel";
import CustomTextInput from "../CustomTextInput";
import { ListType } from "@/app/helper/enum/listType";

interface AddIngToListProps {
    listData?: listData;
    saveIngredientToList: (selectedIngredient: Ingredient) => void;
}

const AddIngToList: React.FC<AddIngToListProps> = ({
    saveIngredientToList,
    listData,
}) => {
    const [searchText, setSearchText] = useState("");
    const [localIngredients, setLocalIngredients] = useState<Ingredient[]>([]);
    const { theme } = useContext(ThemeContext);
    const router = useRouter();
    const { ingredientList, setIngredientList } =
        useContext(GlobalStateContext);
    const [cardVisible, setCardVisible] = useState(false);
    const [selectedIngredient, setSelectedIngredient] =
        useState<Ingredient | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [idAlreadyExists, setIdAlreadyExists] = useState<Array<Number>>([]);

    const params = useLocalSearchParams();

    const [tile, setTile] = useState<string>((params.listName as string) ?? "");
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const fetchedIngredients =
            SQliter.connection().findAll(ingredientSchema);
        fetchedIngredients?.forEach((element) => {
            var tempIng: Ingredient = {
                ID: element.ID,
                ingName: element.ingName,
                quantity: "",
                unit: "",
            };

            setLocalIngredients((prev) => [...prev, tempIng]);
        });
        if (listData) {
            var result: any = [];
            switch (listData.listType) {
                case ListType.ShoppingList:
                    result =
                        SQliter.connection().findAll(
                            shopListIngRelSchema,
                            `shoppinglistsID = ${params.listID}`
                        ) ?? [];
                    break;
                case ListType.RecipeList:
                    result =
                        SQliter.connection().findAll(
                            recipIngSchema,
                            `shoppinglistsID = ${params.listID}`
                        ) ?? [];
                    break;
            }
            if (result.length > 0) {
                var tempId: Array<Number> = [];
                result.forEach((element: any) => {
                    tempId.push(element.ingredientsID);
                });
                console.log(tempId);
                setIdAlreadyExists(tempId);
            }
        }
    }, []);

    const handleAddIngredient = (item: Ingredient) => {
        setSelectedIngredient(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: Ingredient }) => (
        <View style={styles.cardItems}>
            <Text style={styles.cardText}>{item.ingName}</Text>

            {idAlreadyExists.includes(item.ID) ? (
                <Pressable style={styles.addButton}>
                    <Ionicons name="checkmark-circle" size={24} color="green" />
                </Pressable>
            ) : (
                <Pressable
                    style={styles.addButton}
                    onPress={() => handleAddIngredient(item)}
                >
                    <Ionicons
                        name="add"
                        size={24}
                        color={theme.colors.primary}
                    />
                </Pressable>
            )}
        </View>
    );
    const handleOnTextChange = (text: string) => {
        setSearchText(text);
        setCardVisible(true);
        if (text.trim() !== "") {
            const filteredIngredients: Ingredient[] = (ingredientList ?? [])
                .filter((ingredient: Ingredient) =>
                    ingredient.ingName
                        ?.toLowerCase()
                        .startsWith(text.trim().toLowerCase())
                )
                .map((ingredient: Ingredient) => ({
                    ID: ingredient.ID,
                    ingName: ingredient.ingName,
                    quantity: "",
                    unit: "",
                }));

            const isTextInFilteredIngredients = filteredIngredients.some(
                (ingredient) =>
                    ingredient.ingName.toLowerCase() ===
                    text.trim().toLowerCase()
            );

            if (!isTextInFilteredIngredients) {
                var tmpIng: Ingredient = {
                    ID: -1,
                    ingName: text.trim(),
                    quantity: "",
                    unit: "",
                };
                setLocalIngredients([tmpIng, ...filteredIngredients]);
            } else {
                setLocalIngredients(filteredIngredients);
            }
        } else {
            setLocalIngredients([]);
            setCardVisible(false);
        }
    };
    const clearSearchText = () => {
        setSearchText("");
        setLocalIngredients([]);
        setCardVisible(false);
    };
    const addIdToIdAlreadyExists = (id: number) => {
        setIdAlreadyExists((prev) => [...prev, id]);
    };
    return (
        <View>
            <CustomTextInput
                value={searchText}
                onChangeText={handleOnTextChange}
                onClear={clearSearchText}
                placeholder="Zutat hinzufügen"
                placeholderTextColor={theme.colors.placeholderText}
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
            {selectedIngredient && (
                <IngredientModal
                    ingredient={selectedIngredient}
                    save={() => {
                        saveIngredientToList(selectedIngredient);
                        addIdToIdAlreadyExists(selectedIngredient.ID);
                    }}
                    visible={modalVisible}
                    buttonText="Hinzufügen"
                ></IngredientModal>
            )}
        </View>
    );
};

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

export default AddIngToList;
