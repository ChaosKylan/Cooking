import { StyleSheet } from "react-native";
import defaultTheme from "../theme/defaultTheme";

const globalStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        placeHoler: { height: 200 },
        safeArea: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },

        doneItemBackground: {
            backgroundColor: theme.colors.done,
        },
        container: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            backgroundColor: theme.colors.background,
        },
        horiContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            alignSelf: "center",
        },
        spacer: {
            width: 10,
        },
        topBox: {
            flexDirection: "column",
            marginBottom: 30,
        },
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
            justifyContent: "flex-end",
            paddingBottom: 5,
        },
        closeButton: {
            paddingTop: 5,
            paddingRight: 5,
            paddingBottom: 0,
            paddingLeft: 5,
            top: -10,
            right: -10,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 50,
            elevation: 5,
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
            marginTop: 10,
            padding: 10,
            backgroundColor: theme.colors.primary,
            borderRadius: 5,
            alignItems: "center",
        },
        buttonText: {
            color: theme.colors.text,
            fontWeight: "bold",
        },
        menuContent: {
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.primary,
            borderWidth: 1,
        },
        menuItemText: {
            color: theme.colors.text,
        },
    });

export default globalStyles;
