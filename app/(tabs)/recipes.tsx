import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { useState, useContext, useRef } from "react";
import { useRouter } from "expo-router";
import { GlobalStateContext } from "../lib/provider/GlobalState";
import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/schema/recipe";
import { Recipe } from "../model/templates";
import recipIngSchema from "../model/schema/recipeIngredientRel";
import recIngMapper from "../helper/recIngMapper";
import Header from "../components/header";
import Card from "../components/Card";
import EditDeleteModal from "../components/EditDeleteModal";

export default function Tab() {
    var [searchText, setSearchText] = useState("");
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const recipeRefs = useRef<{ [key: number]: View }>({});

    const router = useRouter();
    function searchCheck(model: Recipe) {
        if (!searchText || searchText == "") return true;
        return model.title.includes(searchText);
    }

    const handleLongPress = (recipe: Recipe, index: number) => {
        setSelectedRecipe(recipe);
        recipeRefs.current[index].measure(
            (x, y, width, height, pageX, pageY) => {
                setModalPosition({
                    top: pageY,
                    left: pageX + width,
                });
                setModalVisible(true);
            }
        );
    };

    const handleEdit = () => {
        if (selectedRecipe != null) {
            setModalVisible(false);
            router.push({
                pathname: `screens/recipe/addRecipe`,
                params: { recipeID: selectedRecipe.ID },
            });
        }
    };

    const handleDelete = () => {
        if (selectedRecipe != null) {
            setRecipeList(
                recipeList.filter(
                    (recipe: Recipe) => recipe.ID !== selectedRecipe.ID
                )
            );

            var recipeModel = SQliter.Model(recipeSchema);
            recipeModel.ID = selectedRecipe.ID;
            recipeModel.delete();
            var recipeIngModel = SQliter.Model(recipIngSchema);
            recipeIngModel.delete(
                `${recipeSchema.tableName.toLocaleLowerCase()}ID = ${
                    selectedRecipe.ID
                }`
            );
        }
        setModalVisible(false);
    };

    const handleNew = () => {
        router.push({
            pathname: `screens/recipe/addRecipe`,
            //params: { recipeID: 1 },
        });
    };

    const renderItem = ({ item, index }: { item: Recipe; index: number }) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                router.push({
                    pathname: `screens/recipe/viewRecipe`,
                    params: { recipeID: item.ID },
                });
            }}
            onLongPress={() => handleLongPress(item, index)}
            ref={(ref) => {
                if (ref) {
                    recipeRefs.current[index] = ref;
                }
            }}
        >
            <Card title={item.title}>
                <View style={styles.cardInner}>
                    <Text style={styles.cardSubTitle}>Zutaten:</Text>
                    <Text style={styles.cardText}>
                        {
                            //mapDataToString(model.ID)
                            recIngMapper(item.ID, recipeList)
                                .trim()
                                .slice(0, -1)
                                .substring(0, 43)
                        }
                    </Text>
                </View>
                <View style={styles.cardInner}>
                    <Text style={styles.cardSubTitle}>Anleitung: </Text>
                    <Text style={styles.cardText}>
                        {item.instructions.substring(0, 50)}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
    //screens/addRecipe
    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                {/* <Pressable onPress={() => router.push("../screens/addRecipe")}> */}
                <Header backArrow={false} addIcon={true} onAdd={handleNew} />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Suchen"
                    onChangeText={(data) => {
                        setSearchText(data);
                    }}
                ></TextInput>
            </View>
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
            >
                <FlatList
                    data={recipeList.filter((model: Recipe) =>
                        searchCheck(model)
                    )}
                    renderItem={renderItem}
                    keyExtractor={(item: Recipe, index: number) =>
                        index.toString()
                    }
                />
            </TouchableWithoutFeedback>
            <EditDeleteModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                modalPosition={modalPosition}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
    },
    card: {
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 3,
        marginBottom: 10,
    },
    cardInner: {
        flexDirection: "row",
        marginBottom: 10,
    },
    topBox: {
        flexDirection: "column",
        marginBottom: 30,
    },
    cardText: {
        flexGrow: 1,
        paddingTop: 5,
        flexShrink: 1,
    },
    cardTitle: {
        padding: 10,
        fontWeight: "bold",
    },
    cardSubTitle: {
        flexGrow: 1,
        fontWeight: "bold",
        paddingTop: 5,
        paddingLeft: 5,
    },
    searchInput: {
        flexGrow: 1,
        borderColor: "black",
        borderRadius: 20,
        borderWidth: 3,
        margin: 10,
        textAlign: "center",
        fontSize: 24,
    },
    addButton: {},
    icon: {
        alignSelf: "flex-end",
        color: "black",
        paddingBottom: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        width: "30%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingLeft: 5,
    },
    iconButton: {
        flexDirection: "row",
        alignItems: "center",
    },
});
