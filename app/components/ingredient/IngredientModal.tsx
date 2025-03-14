import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Pressable,
    Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomPicker from "@/app/components/CustomPicker";
import { Ingredient } from "@/app/model/templates";
import { ThemeContext } from "@/app/lib/provider/themeContext";
import defaultTheme from "@/app/theme/defaultTheme";
import globalStyles from "@/app/styles/globalstyles";

interface IngredientModalProps {
    visible: boolean;
    ingredient: Ingredient;
    save: (ingredient: Ingredient) => void;
    buttonText: string;
    onclose?: () => void;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
    visible,
    ingredient,
    save,
    buttonText,
    onclose,
}) => {
    const { theme } = React.useContext(ThemeContext);
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    var [modalVisible, setModalVisible] = useState(false);
    var [quantity, setQuantity] = useState<string>("");
    var [unit, setUnit] = useState<string>("");

    useEffect(() => {
        setModalVisible(visible);
        setQuantity(ingredient.quantity.toString());
        setUnit(ingredient.unit);
    }, [visible, ingredient]);

    const handleClose = () => {
        var newIng = { ...ingredient, quantity: quantity, unit: unit };
        save(newIng);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                onclose && onclose();
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalView}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {ingredient.ingName}
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={() => {
                                setModalVisible(false);
                                onclose && onclose();
                            }}
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
                        placeholderTextColor={theme.colors.placeholderText}
                        value={quantity}
                        onChangeText={(text) => setQuantity(text)}
                        keyboardType="numeric"
                    />
                    <CustomPicker
                        placeholder="Einheit"
                        selectedValue={unit}
                        onValueChange={setUnit}
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
                            handleClose();
                            onclose && onclose();
                            setModalVisible(false);
                        }}
                    >
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        modalOverlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalView: {
            width: "75%",
            padding: 20,
            backgroundColor: theme.colors.cardBackground,
            borderBottomRightRadius: 35,
            borderTopLeftRadius: 35,
            borderTopRightRadius: 15,
            borderBottomLeftRadius: 15,
            shadowColor: theme.colors.shadowColor,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalHeader: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.text,
        },
        closeButton: {
            padding: 5,
        },
        input: {
            width: "100%",
            borderColor: theme.colors.borderColor,
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 10,
            color: theme.colors.text,
            padding: 10,
        },
        button: {
            backgroundColor: theme.colors.primary,
            borderRadius: 5,
            padding: 10,
            alignItems: "center",
        },
        buttonText: {
            color: theme.colors.text,
            fontWeight: "bold",
        },
    });

export default IngredientModal;
