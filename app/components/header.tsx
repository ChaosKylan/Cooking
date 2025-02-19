import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";

interface HeaderProps {
    onSave?: () => void;
    onAdd?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
    onGoBack?: () => void;
    headerText?: string;
    saveIcon?: boolean;
    addIcon?: boolean;
    backArrow?: boolean;
    deleteIcon?: boolean;
    editIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    onSave,
    onAdd,
    onEdit,
    onDelete,
    onGoBack,
    headerText,
    saveIcon = false,
    backArrow = true,
    addIcon = false,
    deleteIcon = false,
    editIcon = false,
}) => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {backArrow && (
                    <Pressable
                        onPress={onGoBack ?? router.back}
                        style={styles.icon}
                    >
                        <Entypo name="arrow-left" size={32} color="#fff" />
                    </Pressable>
                )}
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.headerText}>{headerText}</Text>
            </View>
            <View style={styles.rightContainer}>
                {editIcon && (
                    <Pressable onPress={onEdit} style={styles.icon}>
                        <Entypo name="edit" size={32} color="#fff" />
                    </Pressable>
                )}
                {saveIcon && (
                    <Pressable onPress={onSave} style={styles.icon}>
                        <Entypo name="save" size={32} color="#fff" />
                    </Pressable>
                )}
                {deleteIcon && (
                    <Pressable onPress={onDelete} style={styles.icon}>
                        <Entypo name="trash" size={32} color="#fff" />
                    </Pressable>
                )}
                {addIcon && (
                    <Pressable onPress={onAdd} style={styles.icon}>
                        <Entypo name="plus" size={32} color="#fff" />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 20,

        borderBottomWidth: 1,
        borderBottomColor: "#333", // Leichter Rand unten für Trennung
    },
    leftContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    centerContainer: {
        flex: 2,
        alignItems: "center",
    },
    rightContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    icon: {
        paddingLeft: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff", // Weiße Schriftfarbe für besseren Kontrast
    },
});

export default Header;
