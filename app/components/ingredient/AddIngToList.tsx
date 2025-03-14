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
import { Ingredient } from "@/app/model/templates";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomPicker from "@/app/components/CustomPicker";
import { shopListIngRelSchema } from "@/app/model/schema/shoppingList/shopListIngRel";

interface AddIngToListProps {
    saveIngredientToList: (selectedIngredient: Ingredient) => void;
}

const AddIngToList: React.FC<AddIngToListProps> = ({
    saveIngredientToList,
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

    const params = useLocalSearchParams();

    const [tile, setTile] = useState<string>((params.listName as string) ?? "");
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    useEffect(() => {
        const fetchedIngredients =
            SQliter.connection().findAll(ingredientSchema);
        setIngredientList(fetchedIngredients);
    }, []);

    const handleAddIngredient = (item: Ingredient) => {
        console.log("Add Ingredient: ", item);
        setSelectedIngredient(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }: { item: Ingredient }) => (
        <View style={styles.cardItems}>
            <Text style={styles.cardText}>{item.ingName}</Text>

            <Pressable
                style={styles.addButton}
                onPress={() => handleAddIngredient(item)}
            >
                <Ionicons name="add" size={24} color={theme.colors.primary} />
            </Pressable>
        </View>
    );
    const handleOnTextChange = (text: string) => {
        setSearchText(text);
        setCardVisible(true);
        if (text.trim() !== "") {
            const filteredIngredients: Ingredient[] = (ingredientList ?? [])
                .filter((ingredient: any) =>
                    ingredient.ingName
                        ?.toLowerCase()
                        .startsWith(text.trim().toLowerCase())
                )
                .map((ingredient: any) => ({
                    id: ingredient.ID,
                    value: ingredient.ingName,
                    quantity: "",
                    unit: "",
                }));
            var tmpIng: Ingredient = {
                ID: -1,
                ingName: text.trim(),
                quantity: "",
                unit: "",
            };
            setLocalIngredients([tmpIng, ...filteredIngredients]);
        } else {
            setLocalIngredients([]);
            setCardVisible(false);
        }
    };

    return (
        <View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Zutat hinzufügen"
                    placeholderTextColor={theme.colors.placeholderText}
                    value={searchText}
                    onChangeText={handleOnTextChange}
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
            {selectedIngredient && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {selectedIngredient.ingName}
                                </Text>
                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Ionicons
                                        name="close"
                                        size={24}
                                        color={theme.colors.iconColor}
                                    />
                                </Pressable>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Menge"
                                placeholderTextColor={
                                    theme.colors.placeholderText
                                }
                                value={quantity}
                                onChangeText={(text) => {
                                    setQuantity(text);
                                    if (selectedIngredient) {
                                        setSelectedIngredient({
                                            ...selectedIngredient,
                                            quantity: text,
                                        });
                                    }
                                }}
                                keyboardType="numeric"
                            />
                            <CustomPicker
                                placeholder="Einheit"
                                selectedValue={unit}
                                onValueChange={(value) => {
                                    setUnit(value);
                                    if (selectedIngredient) {
                                        setSelectedIngredient({
                                            ...selectedIngredient,
                                            unit: value,
                                        });
                                    }
                                }}
                                items={[
                                    { label: "Gramm", value: "g" },
                                    { label: "Kilogramm", value: "kg" },
                                    { label: "Milliliter", value: "ml" },
                                    { label: "Stück", value: "pcs" },
                                ]}
                            />
                            <Pressable
                                style={styles.button}
                                onPress={() => {
                                    saveIngredientToList(selectedIngredient);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>
                                    Hinzufügen
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
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
