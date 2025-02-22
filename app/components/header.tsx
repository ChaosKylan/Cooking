import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";
import { ThemeContext } from "../lib/provider/themeContext";

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

    const { theme, setTheme } = useContext(ThemeContext);
    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {backArrow && (
                    <Pressable
                        onPress={onGoBack ?? router.back}
                        style={styles.icon}
                    >
                        <Entypo
                            name="arrow-left"
                            size={32}
                            color={theme.colors.iconColor}
                        />
                    </Pressable>
                )}
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.headerText}>{headerText}</Text>
            </View>
            <View style={styles.rightContainer}>
                {editIcon && (
                    <Pressable onPress={onEdit} style={styles.icon}>
                        <Entypo
                            name="edit"
                            size={32}
                            color={theme.colors.iconColor}
                        />
                    </Pressable>
                )}
                {saveIcon && (
                    <Pressable onPress={onSave} style={styles.icon}>
                        <Entypo
                            name="save"
                            size={32}
                            color={theme.colors.iconColor}
                        />
                    </Pressable>
                )}
                {deleteIcon && (
                    <Pressable onPress={onDelete} style={styles.icon}>
                        <Entypo
                            name="trash"
                            size={32}
                            color={theme.colors.iconColor}
                        />
                    </Pressable>
                )}
                {addIcon && (
                    <Pressable onPress={onAdd} style={styles.icon}>
                        <Entypo
                            name="plus"
                            size={32}
                            color={theme.colors.iconColor}
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        header: {
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 16,
            // borderBottomWidth: 1,
            // borderBottomColor: "#333",
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
            paddingTop: 5,
        },
        headerText: {
            fontSize: 20,
            fontWeight: "bold",
            color: theme.colors.text,
        },
    });

export default Header;
