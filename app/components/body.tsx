// import React from "react";
// import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
// import { RecipeWithOrder } from "../model/templates";

// interface BodyProps {
//     renderItem: ({ item }: { item: any | null }) => JSX.Element;
//     handleAddPress?: () => void;
//     isEndReached: boolean;
//     addButtonVisible?: boolean;
//     data: any;
// }

// const Body: React.FC<BodyProps> = ({
//     renderItem,
//     handleAddPress,
//     isEndReached,
//     addButtonVisible = true,
//     data,
// }) => {
//     return (
//         <View>
//             <FlatList
//                 data={data}
//                 renderItem={renderItem}
//                 keyExtractor={(item, index) => index.toString()}
//             />

//             <Pressable style={[styles.addButton]} onPress={handleAddPress}>
//                 <Text style={styles.addButtonText}>add</Text>
//             </Pressable>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     addButton: {
//         position: "relative",
//         bottom: 0,
//         right: 0,
//         elevation: 5,
//         backgroundColor: "#4caf50",
//         borderRadius: 50,
//         width: 60,
//         height: 60,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     addButtonEnd: {
//         position: "relative",
//         bottom: 0,
//         right: 0,
//         marginTop: 20,
//     },
//     addButtonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",
//     },
// });

// export default Body;
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
    const renderFooter = () => {
        if (!addButtonVisible) return null;
        return (
            <Pressable
                style={[styles.addButton, isEndReached && styles.addButtonEnd]}
                onPress={handleAddPress}
            >
                <Text style={styles.addButtonText}>add</Text>
            </Pressable>
        );
    };

    return (
        <View>
            <FlatList
                data={[...data, { isButton: true }]} // Fügen Sie ein Dummy-Element für den Button hinzu
                renderItem={({ item }) =>
                    item.isButton ? renderFooter() : renderItem({ item })
                }
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flatListContent: {
        paddingBottom: 100, // Platz für den Button am Ende der Liste
    },
    addButton: {
        position: "absolute",
        bottom: 25,
        right: 25,
        elevation: 5,
        backgroundColor: "#4caf50",
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center", // Zentrieren Sie den Button horizontal
        marginVertical: 20, // Fügen Sie vertikalen Abstand hinzu
    },
    addButtonEnd: {
        marginTop: 20,
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Body;
