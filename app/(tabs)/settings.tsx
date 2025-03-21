import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { ThemeContext } from "../lib/provider/themeContext";
import defaultTheme from "../theme/defaultTheme";
import globalStyles from "../styles/globalstyles";
import { useContext, useState } from "react";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../components/Card";
import Header from "../components/header";
import SQliter from "../lib/data/sql";
import { recipeSchema } from "../model/schema/recipe";
import Schema from "../lib/data/schema/schema";
import recipIngSchema from "../model/schema/recipeIngredientRel";
import isValidFormat from "../helper/validedBackUpFileFormat";
import { GlobalStateContext } from "../lib/provider/GlobalState";
import ingredientSchema from "../model/schema/ingredient";
import getSchemaList from "../model/schemaList";

export default function Tab() {
    const [modalVisible, setModalVisible] = useState(false);
    const { recipeList, setRecipeList } = useContext(GlobalStateContext);

    const { theme, setTheme } = useContext(ThemeContext);
    const schemaList: Array<Schema> = getSchemaList();

    var styles = { ...createStyles(theme), ...globalStyles(theme) };

    const handleExport = async () => {
        var dataToExport = SQliter.connection().exportDataToFile(schemaList);

        const directoryPath = `${FileSystem.documentDirectory}ChaosCookingBook`;

        const filePath = `${directoryPath}/exportedData.json`;

        try {
            // Create directory if it doesn't exist
            const dirInfo = await FileSystem.getInfoAsync(directoryPath);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(directoryPath, {
                    intermediates: true,
                });
            }

            // Write data to file
            await FileSystem.writeAsStringAsync(
                filePath,
                JSON.stringify(dataToExport),
                {
                    encoding: FileSystem.EncodingType.UTF8,
                }
            );
            console.log("Data successfully saved to", filePath);
        } catch (err) {
            console.error("Error saving data:", err);
        }
    };

    const handleImport = () => {
        setModalVisible(true);
    };

    const handleImportAccept = async () => {
        const directoryPath = `${FileSystem.documentDirectory}ChaosCookingBook`;
        const filePath = `${directoryPath}/exportedData.json`;
        var recipeInsertedList: any = [];

        try {
            const data = await FileSystem.readAsStringAsync(filePath, {
                encoding: FileSystem.EncodingType.UTF8,
            });

            const importedData = JSON.parse(data);

            if (!isValidFormat(importedData)) {
                console.error("Invalid data format");
                return;
            }

            setRecipeList([]);
            SQliter.connection().clearDatabase(schemaList);

            importedData.forEach((element: any) => {
                var parsedElement = JSON.parse(element.data);
                parsedElement.forEach((data: any) => {
                    var schema = schemaList.find(
                        (schema) => schema.tableName === element.schemaName
                    );
                    if (schema) {
                        var model =
                            SQliter.connection().generateModelFromSchema(
                                schema,
                                data
                            );
                        if (model) {
                            model.insert();
                            if (schema.tableName === "Recipes") {
                                recipeInsertedList.push(model);
                            }
                        }
                    }
                });
            });

            setRecipeList(recipeInsertedList);
            setModalVisible(false);

            // SQliter.connection().importData(importedData);
            console.log("Data successfully imported");
        } catch (err) {
            console.error("Error reading data:", err);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.topBox}>
                <Header backArrow={false}></Header>
            </View>
            <View style={styles.container}>
                <Card>
                    <Pressable onPress={handleExport} style={styles.button}>
                        <Text style={styles.buttonText}>Export Data</Text>
                    </Pressable>
                    <Pressable onPress={handleImport} style={styles.button}>
                        <Text style={styles.buttonText}>Import Data</Text>
                    </Pressable>
                </Card>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.buttonText}>
                            Alle vorhandenen Daten werden gelöscht und durch die
                            Daten aus dem Backup ersetzt.
                        </Text>
                        <Pressable
                            style={[styles.button, styles.button]}
                            onPress={handleImportAccept}
                        >
                            <Text style={styles.buttonText}>
                                Daten Importieren
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.button]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.buttonText}>Abbrechen</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const createStyles = (theme: typeof defaultTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
            padding: 35,
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
    });
