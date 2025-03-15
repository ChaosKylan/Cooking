import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import TextRecognition from "react-native-text-recognition";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

const TakePhoto = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [recognizedText, setRecognizedText] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    useEffect(() => {
        if (recognizedText.length > 0) {
            const text = recognizedText.join(" ");
            console.log("Recognized Text:", text);
        }
    }, [recognizedText]);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                setImageUri(photo.uri);
                processImage(photo.uri);
            }
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            processImage(uri);
        }
    };

    const processImage = async (uri: string) => {
        setLoading(true);
        try {
            const text = await TextRecognition.recognize(uri);
            setRecognizedText(text);
        } catch (error) {
            console.error("processImage", error);
        }
        setLoading(false);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>Kein Zugriff auf die Kamera</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {!imageUri ? (
                <CameraView style={styles.camera} ref={cameraRef} facing="back">
                    <View style={styles.cameraContainer}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                        >
                            <Text style={styles.buttonText}>Foto machen</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                    {loading && <ActivityIndicator size="large" color="blue" />}
                    <Text style={styles.recognizedText}>
                        {recognizedText.join("\n")}
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setImageUri(null)}
                    >
                        <Text style={styles.buttonText}>Neues Foto machen</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity
                onPress={pickImage}
                style={{ margin: 10, padding: 10, backgroundColor: "green" }}
            >
                <Text style={{ color: "white" }}>Bild auswählen</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    camera: {
        width: width,
        height: height * 0.8,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    cameraContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 20,
    },
    captureButton: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: width,
        height: height * 0.8,
    },
    recognizedText: {
        color: "#000",
        fontSize: 16,
        marginTop: 10,
    },
    button: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
});

export default TakePhoto;
