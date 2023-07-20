import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    FlatList,
    Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import Icon, { Icons } from "../components/ui/Icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers/Store";
import { setPostShow } from "../reducers/UtilsReducer";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Toast } from "../components/ui/Toast";
import { setStatus } from "../reducers/LoadingReducer";
import Video from "expo-av";
import { createNewPost } from "../api/statusPostApi";
import * as Location from "expo-location";
const { v4: uuidv4 } = require("uuid");

function PostScreen() {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [description, setDescription] = useState("");

    const user = useSelector((state) => state.userInfo);
    const postVisible = useSelector((state) => state.Utils.postShow);
    const token = useSelector((state) => state.token.key);
    const uid = useSelector((state) => state.uid.id);

    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);

    const dispatch = useDispatch();

    const toggleModal = () => {
        dispatch(setPostShow(!postVisible));
    };

    const postStatus = () => {
        if (description === "" && mediaFiles.length === 0) {
            Toast("Please enter something");
            return;
        }

        toggleModal();
        dispatch(setStatus(true));

        const dataForm = new FormData();

        for (let i = 0; i < mediaFiles.length; i++) {
            dataForm.append("media-files", mediaFiles[i]);
        }

        dataForm.append("description", description);

        createNewPost(dataForm, uid, token)
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    return response.data;
                } else {
                    console.log(response.status);
                    throw new Error(response.data.errorMessage);
                }
            })
            .then((data) => {
                Toast("Post successfully!");
            })
            .catch((error) => Toast(error.message))
            .finally(() => {
                dispatch(setStatus(false));
            });
    };

    const takePhotoFromCamera = async () => {
        if (mediaFiles.length > 0 && mediaFiles[0].type === "video/mp4") {
            Toast("Only multiple images can be selected!");
            return;
        }

        try {
            const { status } =
                await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Toast("Permission to access camera denied");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                setMediaFiles([
                    ...mediaFiles,
                    {
                        uri: result.uri,
                        type: "image/jpeg",
                        name: uuidv4() + "_post-file",
                    },
                ]);
            }
        } catch (error) {
            Toast(error.message);
        }
    };

    const choosePhotoFromLibrary = async () => {
        if (mediaFiles.length > 0 && mediaFiles[0].type === "video/mp4") {
            Toast("Only multiple images can be selected!");
            return;
        }

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== "granted") {
                Toast("Permission to access media library denied");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                var selectedImages = [];
                let i = 1;
                result.assets.forEach((image) => {
                    selectedImages.push({
                        uri: image.uri,
                        type: "image/jpeg",
                        name: uuidv4() + i + "_post-file",
                    });
                    i += 1;
                });
                setMediaFiles([...mediaFiles, ...selectedImages]);
            }
        } catch (error) {
            Toast(error.message);
        }
    };

    const selectVideo = async () => {
        if (mediaFiles.length > 0 && mediaFiles[0].type === "image/jpeg") {
            Toast("Only multiple videos can be selected!");
            return;
        }

        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Toast("Permission to access media library denied");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: false,
                quality: 1,
            });

            if (!result.canceled) {
                setMediaFiles([
                    {
                        uri: result.assets[0].uri,
                        type: result.assets[0].type,
                        name: result.assets[0].assetId,
                    },
                ]);
            }
        } catch (error) {
            Toast(error.message);
        }
    };

    useEffect(() => {
        setDescription("");
        setMediaFiles([]);
    }, [postVisible]);

    const postLocation = async () => {
        try {
            // Kiểm tra quyền truy cập vị trí của người dùng
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast("Permission to access location denied");
                return;
            }

            // Lấy thông tin vị trí hiện tại của người dùng
            const location = await Location.getCurrentPositionAsync({});

            // Lấy địa chỉ địa lý từ thông tin vị trí
            const { latitude, longitude } = location.coords;
            const newAddress = await Location.reverseGeocodeAsync({
                newlatitude,
                newlongitude,
            });

            // Chuyển đổi thông tin địa chỉ thành một chuỗi hiển thị dễ đọc
            const formattedAddress = `${newAddress[0].name}, ${newAddress[0].streetNumber}, ${newAddress[0].street}, ${newAddress[0].district}, ${newAddress[0].city}, ${newAddress[0].subregion}, ${newAddress[0].region}, ${newAddress[0].country}`;

            // Cập nhật state selectedLocation với địa chỉ địa lý đã chọn
            setLocation(formattedAddress);

            // Hiển thị thông báo hoặc thực hiện các xử lý khác liên quan khi thành công
            console.log("latitude: " + latitude + ", longitude: " + longitude);
            console.log("Location selected: " + formattedAddress);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error fetching location:", error);
            Toast("Error fetching location");
        }
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            let addressData = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            setAddress(addressData[0]);
        })();
    }, []);

    const MedifafileView = ({ item }) => {
        const screenWidth = Dimensions.get("window").width;
        return (
            <View style={{ flex: 1 }}>
                {item.type === "video/mp4" ? (
                    <View
                        style={{
                            height: 230,
                            backgroundColor: "gray",
                            width: screenWidth,
                        }}
                    >
                        <Video
                            source={{ uri: item.uri }}
                            style={{ width: "100%", height: "100%" }}
                            useNativeControls
                        />
                    </View>
                ) : (
                    <Image
                        style={{
                            height: 120,
                            width: 160,
                            borderRadius: 3,
                            margin: 5,
                        }}
                        source={{ uri: item.uri }}
                    />
                )}

                <View
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: Colors.white,
                        borderRadius: 50,
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>
                            setMediaFiles(
                                mediaFiles.filter((i) => i.uri != item.uri)
                            )
                        }
                    >
                        <Icon
                            type={Icons.AntDesign}
                            name="closecircle"
                            color={Colors.darkOverlayColor}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <Modal
            onBackdropPress={() => dispatch(setPostShow(false))}
            onBackButtonPress={() => dispatch(setPostShow(false))}
            isVisible={postVisible}
            style={{ margin: 0 }}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.modalContent}>
                    <View style={{ height: 70 }} />
                    <View style={{ backgroundColor: "white", flex: 1 }}>
                        <View
                            style={{
                                paddingHorizontal: 20,
                                marginTop: 20,
                                flex: 1,
                            }}
                        >
                            <TextInput
                                value={description}
                                onChangeText={setDescription}
                                style={{
                                    color: "black",
                                    fontSize: 19,
                                    paddingTop: 16,
                                    flex: 1,
                                    textAlignVertical: "top",
                                }}
                                placeholder="What do you want to talk about?"
                                multiline={true}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            {mediaFiles.length > 0 && (
                <View style={{ backgroundColor: Colors.white }}>
                    <FlatList
                        data={mediaFiles}
                        renderItem={({ item }) => (
                            <MedifafileView item={item} />
                        )}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            )}
            <View style={{ height: 65 }} />

            <View style={styles.topView}>
                <View
                    style={{
                        margin: 20,
                        flexDirection: "row",
                    }}
                >
                    <TouchableOpacity
                        onPress={toggleModal}
                        style={{ marginTop: 3 }}
                    >
                        <Icon type={Icons.AntDesign} name="close" />
                    </TouchableOpacity>
                    <Image
                        source={
                            user.profileImagePath === ""
                                ? require("../assets/images/Spiderman.jpg")
                                : { uri: user.profileImagePath }
                        }
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 35,
                            marginHorizontal: 20,
                        }}
                    />
                    <View
                        style={{
                            marginTop: 3,
                            marginLeft: "auto",
                            flexDirection: "row",
                        }}
                    >
                        <TouchableOpacity
                            style={{ marginTop: 5 }}
                            onPress={() => postLocation()}
                        >
                            <Icon type={Icons.Feather} name="clock" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={postStatus}
                            style={{ marginLeft: 20 }}
                        >
                            <View
                                style={{
                                    backgroundColor: "#0085f1",
                                    paddingHorizontal: 15,
                                    paddingVertical: 5,
                                    borderRadius: 15,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Post
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: Colors.white,
                }}
            >
                <View style={{ flexDirection: "row", padding: 20 }}>
                    <TouchableOpacity onPress={takePhotoFromCamera}>
                        <Icon type={Icons.Entypo} name="camera" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectVideo}>
                        <Icon
                            type={Icons.Ionicons}
                            name="ios-videocam"
                            size={25}
                            style={{ marginLeft: 20 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={choosePhotoFromLibrary}
                        style={{ marginLeft: 20 }}
                    >
                        <Icon type={Icons.FontAwesome} name="photo" size={25} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: "auto" }}>
                        <TouchableOpacity style={{ flexDirection: "row" }}>
                            <Icon
                                type={Icons.Ionicons}
                                name="chatbox-ellipses"
                                size={25}
                            />
                            <Text style={{ marginLeft: 10 }}>Anyone</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default PostScreen;

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: "#fff",
        flex: 1,
    },
    topView: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        elevation: 5,
    },
});
