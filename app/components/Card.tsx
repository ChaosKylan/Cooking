import { Text, View, StyleSheet, ViewStyle, TextStyle } from "react-native";

interface CardProps {
    title?: string;
    children?: React.ReactNode;
    cardStyle?: ViewStyle;
    cardTitleStyle?: TextStyle;
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    cardStyle,
    cardTitleStyle,
}) => {
    return (
        <View style={[styles.card, cardStyle]}>
            {title ? (
                <Text style={[styles.cardTitle, cardTitleStyle]}>{title}</Text>
            ) : null}
            {children}
        </View>
    );
};
const styles = StyleSheet.create({
    card: {
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 3,
        marginBottom: 10,
        padding: 10,
    },
    cardTitle: {
        //padding: 10,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default Card;
