import React from "react";
import {
    Modal,
    View,
    Pressable,
    StyleSheet,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

interface CustomModalProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    modalPosition: { top: number; left: number };
    handleEdit: () => void;
    handleDelete: () => void;
}

const EditDeleteModal: React.FC<CustomModalProps> = ({
    modalVisible,
    setModalVisible,
    modalPosition,
    handleEdit,
    handleDelete,
}) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    const adjustedTop = Math.min(modalPosition.top, screenHeight - 100);
    const adjustedLeft = Math.min(modalPosition.left, screenWidth - 200);
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.modalView,
                                {
                                    top: adjustedTop - 100,
                                    left: adjustedLeft + 25,
                                },
                            ]}
                        >
                            <View style={styles.iconContainer}>
                                <Pressable
                                    style={styles.iconButton}
                                    onPress={handleEdit}
                                >
                                    <Entypo
                                        name="edit"
                                        size={44}
                                        color="black"
                                    />
                                </Pressable>
                                <Pressable
                                    style={styles.iconButton}
                                    onPress={handleDelete}
                                >
                                    <Entypo
                                        name="trash"
                                        size={44}
                                        color="black"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 22,
    },
    modalView: {
        position: "absolute",
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
        justifyContent: "center",
        width: "100%",
        paddingLeft: 5,
    },
    iconButton: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
    },
});

export default EditDeleteModal;
