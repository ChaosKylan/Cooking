import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Touchable,
    Button,
    Pressable,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { recipeSchema } from "../model/recipeModel";
import SQliter from "../lib/data/sql";
import { cleanUpStringForDB, cleanUpStringForView } from "../lib/cleanUpString";
import { useState } from "react";
import { useNavigation, useRouter } from "expo-router";

export default function Tab() {
    var db = new SQliter();
    var [recipeModelList, setRecipeModelList]: any = useState(
        db.findAll("Recipes", recipeSchema)
    );
    var [searchText, setSearchText] = useState("");

    var recipeModel = SQliter.Model("Recipes", recipeSchema);

    recipeModel.ID = 1;
    recipeModel.title = "Spätzle mit Steack";
    recipeModel.ingredient = cleanUpStringForDB(
        '["Zwiebeln, gelb 1 St.","Paprika, grün 1 St.","Paprika, gelb 1 St.","Champignons, weiß 200 g","Minutensteaks vom Schwein 500 g","Salz Prise","Pfeffer, schwarz Prise","Spätzle, frisch 600 g","Petersilie, frisch 10 g","Öl 2 EL","Tomatenmark 20 g","Gemüsebrühe 650 ml","italienische Kräuter, getrocknet 1 TL","Frischkäse, natur 150 g"]'
    );

    recipeModel.instructions = cleanUpStringForDB(
        '[{"@type":"HowToStep","text":"Zwiebel halbieren und schälen. Paprika waschen, halbieren, Strunk und Kerngehäuse entfernen und in Streifen schneiden. Champignons ggf. mit Küchenkrepp säubern und je nach Größe vierteln oder halbieren. Minutensteaks waschen, trocken tupfen und in Streifen schneiden. Schnitzelstreifen kräftig mit Salz und Pfeffer würzen. Spätzle in den tiefen Dampfgaraufsatz geben."},{"@type":"HowToStep","text":"Petersilie waschen, trocken schütteln und grobe Stiele entfernen. In den Mixbehälter Petersilie geben und 4 Sek./Stufe 8 zerkleinern. Anschließend in eine Schüssel umfüllen."},{"@type":"HowToStep","text":"In den Mixbehälter Zwiebel geben und 4 Sek./Stufe 8 zerkleinern. Mit dem Spatel nach unten schieben. Schnitzelstreifen und Öl in den Mixtopf geben und Linkslauf/7 Min./Anbratstufe braten. Tomatenmark, Gemüsebrühe, Paprika, Champignons und Kräuter zugeben. Tiefen Dampfgaraufsatz auf den Mixbehälter geben, verschließen und 25 Min./Dampfgarstufe garen."},{"@type":"HowToStep","text":"Nach Ende der Garzeit tiefen Dampfgaraufsatz absetzen und beiseite stellen. Frischkäse in den Mixbehälter geben und Linkslauf/1 Min /100 °C/Stufe 1 verrühren. Schnitzeltopf mit Salz und Pfeffer abschmecken. Spätzle auf Teller geben, Schnitzeltopf darübergeben und mit Petersilie bestreut servieren. Guten Appetit!"}]'
    );
    const navigation = useNavigation();
    const router = useRouter();
    // recipeModel.insert();
    function searchCheck(model: any) {
        if (!searchText || searchText == "") return true;
        if (model.title.indexOf(searchText) > 0) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBox}>
                <Pressable onPress={() => router.push("../screens/addRecipe")}>
                    <Entypo name="plus" size={34} style={styles.icon} />
                </Pressable>
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
                <ScrollView>
                    {recipeModelList
                        .filter((model: any) => searchCheck(model))
                        .map((model: any, index: number) => (
                            <View key={index} style={styles.card}>
                                <Text style={styles.cardTitle}>
                                    {model.title}
                                </Text>
                                <View style={styles.cardInner}>
                                    <Text style={styles.cardSubTitle}>
                                        Zutaten:
                                    </Text>
                                    <Text style={styles.cardText}>
                                        {
                                            //model.ingredient.substring(0, 50)
                                            cleanUpStringForView(
                                                model.ingredient
                                            ).substring(0, 43)
                                        }
                                    </Text>
                                </View>
                                <View style={styles.cardInner}>
                                    <Text style={styles.cardSubTitle}>
                                        Anleitung:{" "}
                                    </Text>
                                    <Text style={styles.cardText}>
                                        {cleanUpStringForView(
                                            model.instructions
                                        ).substring(0, 100)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                </ScrollView>
            </TouchableWithoutFeedback>
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
});
