import { View, Text, StyleSheet } from "react-native";
import Header from "../components/header";
import Body from "../components/body";
import { useState } from "react";

export default function Tab() {
    const [localList, setLocalList] = useState([]);
    const [isEndReached, setIsEndReached] = useState(Boolean);

    const renderItem = ({ item }: { item: string }) => {
        return <Text>{item}</Text>;
    };

    return (
        <View style={styles.container}>
            <View>
                <Header></Header>
            </View>
            <Body
                data={localList}
                isEndReached={isEndReached}
                renderItem={renderItem}
            ></Body>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
