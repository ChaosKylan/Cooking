import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
    onSave?: () => void;
    onAdd?: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
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
    headerText,
    saveIcon = false,
    backArrow = true,
    addIcon = false,
    deleteIcon = false,
    editIcon = false,
}) => {
    const navigation = useNavigation();

    const showPlaceholder = !saveIcon && !addIcon && !deleteIcon && !editIcon;
    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {backArrow && (
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.icon}
                    >
                        <Entypo name="arrow-left" size={44} />
                    </Pressable>
                )}
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.headerText}>{headerText}</Text>
            </View>
            <View style={styles.rightContainer}>
                {editIcon && (
                    <Pressable onPress={onEdit} style={styles.icon}>
                        <Entypo name="edit" size={44} />
                    </Pressable>
                )}
                {saveIcon && (
                    <Pressable onPress={onSave} style={styles.icon}>
                        <Entypo name="save" size={44} />
                    </Pressable>
                )}
                {deleteIcon && (
                    <Pressable onPress={onDelete} style={styles.icon}>
                        <Entypo name="trash" size={44} />
                    </Pressable>
                )}
                {addIcon && (
                    <Pressable onPress={onAdd} style={styles.icon}>
                        <Entypo name="plus" size={44} />
                    </Pressable>
                )}
            </View>
        </View>
        // <View style={styles.header}>
        //     {backArrow ? (
        //         <Pressable
        //             onPress={() => navigation.goBack()}
        //             style={styles.icon}
        //         >
        //             <Entypo name="arrow-left" size={44} />
        //         </Pressable>
        //     ) : (
        //         <View style={styles.iconPlaceholder} />
        //     )}
        //     <Text style={styles.headerText}>{headerText}</Text>

        //     {editIcon && (
        //         <Pressable onPress={onSave} style={styles.icon}>
        //             <Entypo name="edit" size={44} />
        //         </Pressable>
        //     )}
        //     {saveIcon && (
        //         <Pressable onPress={onSave} style={styles.icon}>
        //             <Entypo name="save" size={44} />
        //         </Pressable>
        //     )}

        //     {deleteIcon && (
        //         <Pressable onPress={onSave} style={styles.icon}>
        //             <Entypo name="trash" size={44} />
        //         </Pressable>
        //     )}
        //     {addIcon && (
        //         <Pressable onPress={onAdd}>
        //             <Entypo name="plus" size={44} style={styles.icon} />
        //         </Pressable>
        //     )}
        //     {showPlaceholder && <View style={styles.iconPlaceholder} />}
        // </View>
    );
};
const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
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
    icon: {},
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
    },
});
// const styles = StyleSheet.create({
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingBottom: 16,
//     },
//     icon: {},
//     iconPlaceholder: {
//         padding: 8,
//         width: 44, // Icon size
//     },
//     headerText: {
//         fontSize: 24,
//         fontWeight: "bold",
//     },
// });

export default Header;
