import React from "react";
import {
    View,
    TextInput,
    Pressable,
    StyleSheet,
    TextInputProps,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";

interface CustomTextInputProps extends TextInputProps {
    value: string;
    onClear: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    value,
    onClear,
    ...props
}) => {
    const { theme } = React.useContext(ThemeContext);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, { paddingRight: value ? 40 : 10 }]}
                value={value}
                {...props}
            />
            {value !== "" && (
                <Pressable onPress={onClear} style={styles.clearButton}>
                    <Ionicons
                        name="close-circle"
                        size={24}
                        color={theme.colors.primary}
                    />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    input: {
        flex: 1,
        borderColor: defaultTheme.colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        color: defaultTheme.colors.text,
    },
    clearButton: {
        position: "absolute",
        right: 10,
    },
});

export default CustomTextInput;
