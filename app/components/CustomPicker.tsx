import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";

interface CustomPickerProps {
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: { label: string; value: string }[];
    placeholder?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
    selectedValue,
    onValueChange,
    items,
    placeholder = "",
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { theme } = useContext(ThemeContext);
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    const handleSelect = (value: string) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    style={
                        selectedValue
                            ? styles.pickerText
                            : styles.placeholderText
                    }
                >
                    {items.find((item) => item.value === selectedValue)
                        ?.label || placeholder}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={24}
                    color={theme.colors.text}
                />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalView}>
                                <FlatList
                                    data={items}
                                    keyExtractor={(item) => item.value}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.item}
                                            onPress={() =>
                                                handleSelect(item.value)
                                            }
                                        >
                                            <Text style={styles.itemText}>
                                                {item.label}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        pickerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderColor: theme.colors.borderColor,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            backgroundColor: theme.colors.cardBackground,
        },
        pickerText: {
            color: theme.colors.text,
        },
        item: {
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderColor,
        },
        itemText: {
            color: theme.colors.text,
        },

        placeholderText: {
            color: theme.colors.placeholderText,
        },
    });

export default CustomPicker;
