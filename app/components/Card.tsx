import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CardProps {
    title?: string;
    children?: React.ReactNode;
    cardStyle?: ViewStyle;
    cardTitleStyle?: TextStyle;
    visible?: boolean;
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    cardStyle,
    cardTitleStyle,
    visible = true,
}) => {
    return (
        visible && (
            <View style={[styles.card, cardStyle]}>
                {title ? (
                    <Text style={[styles.cardTitle, cardTitleStyle]}>
                        {title}
                    </Text>
                ) : null}
                {children}
            </View>
        )
    );
};
const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1e1e1e",
        borderBottomRightRadius: 35,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#4caf50",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 1,
        shadowRadius: 25,
        elevation: 7,
    },
    cardTitle: {
        fontWeight: "bold",
        marginBottom: 10,
        color: "#fff",
    },
});

export default Card;
