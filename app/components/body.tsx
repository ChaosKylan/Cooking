import React from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { RecipeWithOrder } from "../model/templates";

interface BodyProps {
    renderItem: ({ item }: { item: any | null }) => JSX.Element;
    handleAddPress?: () => void;
    isEndReached: boolean;
    addButtonVisible?: boolean;
    data: any;
}

const Body: React.FC<BodyProps> = ({
    renderItem,
    handleAddPress,
    isEndReached,
    addButtonVisible = true,
    data,
}) => {
    return (
        <View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <Pressable
                style={[styles.addButton, isEndReached && styles.addButtonEnd]}
                onPress={handleAddPress}
            >
                <Text style={styles.addButtonText}>add</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        elevation: 5,
        backgroundColor: "#4caf50",
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonEnd: {
        position: "relative",
        bottom: 0,
        right: 0,
        marginTop: 20,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Body;
