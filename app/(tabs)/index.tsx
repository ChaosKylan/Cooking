import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../lib/provider/themeContext";
import { useContext } from "react";
import theme from "../theme/defaultTheme";

export default function Tab() {
    const [theme, setTheme] = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            <Text>Tab [Home]</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.borderColor,
        color: theme.fontColor,
    },
});
