import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Pressable,
    TextInput,
    Keyboard,
    FlatList,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Icon, { Icons } from "../components/ui/Icons";
import Colors from "../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers/Store";
import { Toast } from "../components/ui/Toast";
import * as ImagePicker from "expo-image-picker";
import { ToastAndroid } from "react-native";
import {
    createComment,
    deleteComment,
    getAllComments,
} from "../api/statusCommentApi";
import ItemComment from "../components/ui/ItemComment";
import ShowPosts from "../components/ui/ShowPosts";
import {
    decrementComment,
    deleteAStatusPost,
    imcrementComment,
    updateAStatusPost,
} from "../reducers/StatusPostReducer";
import { useFocusEffect } from "@react-navigation/native";
import { deleteAStatusPostApi, getAStatusPostById } from "../api/statusPostApi";

export default function DetailStatusScreen(navigation, route) {
    const deviceWidth = Dimensions.get("window").width;

    const user = useSelector((state) => state.userInfo);
    const uid = useSelector((state) => state.uid.id);
    const token = useSelector((state) => state.token.key);

    const { idPost } = route.params;

    const item = useSelector((state) => {
        return (
            state.statusPost.HomePage.find((item) => item._id === idPost) ||
            state.statusPost.sub.find((item) => item._id === idPost)
        );
    });

    const [comment, setComment] = useState("");

    const [mediaFile, setMediaFile] = useState();

    const [isFocused, setIsFocused] = useState(false);

    const [comments, setComments] = useState([]);

    const commentRef = useRef < TextInput > null;

    const dispatch = useDispatch();

    const handleDelete = async (idPost) => {
        try {
            const response = await deleteAStatusPostApi(uid, token, idPost);
            if (response.status === 204) {
                navigation.goBack();
                dispatch(deleteAStatusPost(idPost));
                Toast("Delete Success");
            } else {
                Toast("Delete Fail");
            }
        } catch (error) {
            Toast(error);
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const response = await deleteComment(item._id, id, token);
            console.log(response);
            if (response.status == 204) {
                Toast("Delete comment successfully");
                setComments((prevComments) =>
                    prevComments.filter((item) => item._id !== id)
                );
                dispatch(decrementComment(item._id));
            } else throw new Error(response.data.errorMessage);
        } catch (error) {
            Toast(error.message);
        }
    };

    const postComment = async () => {
        if (comment === "" && mediaFile === undefined) {
            Toast("Comment is empty");
            return;
        }

        try {
            const response = await createComment(
                { mediaFile, content: comment, userId: uid },
                item._id,
                token
            );
            if (response.status === 200) {
                console.log(response.data);
                const dataComment = response.data;
                setComments((prevComments) => [...prevComments, dataComment]);
                dispatch(imcrementComment(item._id));
            } else {
                console.log(response.status);
                throw new Error(response.data.errorMessage);
            }
        } catch (error) {
            Toast(error.message);
        }

        setComment("");
        setMediaFile(undefined);
        Keyboard.dismiss();
    };

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            height: 140,
            width: 140,
            cropperCircleOverlay: true,
        })
            .then((image) => {
                setMediaFile({
                    uri: image.path,
                    type: image.mime,
                    name: image.path.split("/").pop(),
                });
            })
            .catch((error) => Toast(error.message));
    };

    const choosePhotoFromLibrary = async () => {
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                ToastAndroid.show(
                    "Permission to access media library denied",
                    ToastAndroid.SHORT
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled) {
                setMediaFile({
                    uri: result.uri,
                    type: "image/jpeg", // or result.type
                    name: "photo.jpg", // or result.name
                });
            }
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
    };

    const getComments = async () => {
        try {
            const response = await getAllComments(item._id, token);
            if (response.status === 200) {
                setComments(response.data);
            } else {
                console.log(response.status);
                throw new Error(response.data.errorMessage);
            }
        } catch (error) {
            Toast(error.message);
        }
    };

    const handleKeyboardDismiss = () => {
        setIsFocused(false);
        commentRef.current?.blur();
    };

    const updateStatus = async () => {
        try {
            const response = await getAStatusPostById(token, item._id);
            if (response.status === 200) {
                const dataStatus = response.data;
                dispatch(updateAStatusPost(dataStatus));
            } else {
                console.log(response.status);
                throw new Error(response.data.errorMessage);
            }
        } catch (error) {
            Toast(error.message);
        }
    };

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            handleKeyboardDismiss
        );
        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getComments();
            updateStatus();
            return () => {
                // Cleanup or cancel any pending requests if needed
            };
        }, [])
    );

    return (
        <View style={Styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, marginTop: 57 }}
                showsVerticalScrollIndicator={false}
            >
                <ShowPosts
                    item={item}
                    navigation={navigation}
                    pressComment={() => {
                        commentRef.current?.focus();
                    }}
                    pressDelete={() => {
                        handleDelete(item._id);
                    }}
                />
                <View
                    style={{ flex: 1, marginVertical: 5, paddingVertical: 10 }}
                >
                    {comments.map((comment, index) => (
                        <ItemComment
                            statusId={item._id}
                            navigation={navigation}
                            item={comment}
                            IdAuthorOfStatus={item.author._id}
                            handleDeleteComment={() => {
                                handleDeleteComment(comment._id);
                            }}
                            key={index}
                        />
                    ))}
                </View>
                <View style={{ height: 160 }} />
            </ScrollView>
            <View style={Styles.topView}>
                <View style={{ margin: 15, flexDirection: "row" }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{ marginTop: 3 }}
                    >
                        <Icon type={Icons.Ionicons} name="arrow-back" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={Styles.bottomView}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 10,
                    }}
                >
                    <Image
                        source={
                            user.profileImagePath
                                ? { uri: user.profileImagePath }
                                : require("../assets/images/Spiderman.jpg")
                        }
                        style={{
                            height: 40,
                            width: 40,
                            borderRadius: 100,
                            alignSelf: "flex-start",
                        }}
                    />
                    <View style={{ marginLeft: 10, flex: 1, maxHeight: 200 }}>
                        <ScrollView
                            style={{ flexGrow: 0 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <TextInput
                                ref={commentRef}
                                value={comment}
                                onChangeText={setComment}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Write a comment..."
                                multiline={true}
                            />
                            {mediaFile && (
                                <View style={{ marginRight: 15 }}>
                                    <Image
                                        style={{
                                            borderRadius: 3,
                                            margin: 5,
                                            height: 200,
                                        }}
                                        resizeMode="cover"
                                        source={{ uri: mediaFile.uri }}
                                    />
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: 5,
                                            right: 10,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() =>
                                                setMediaFile(undefined)
                                            }
                                        >
                                            <Icon
                                                type={Icons.FontAwesome}
                                                name="close"
                                                color={Colors.gray}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>

                    {!isFocused && !comment && !mediaFile && (
                        <View style={{ padding: 10 }}>
                            <TouchableOpacity onPress={postComment}>
                                <Text
                                    style={{
                                        color: Colors.bag10Bg,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Post
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {(isFocused || comment || mediaFile) && (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderTopWidth: 1,
                            borderTopColor: Colors.darkGray,
                            paddingHorizontal: 10,
                            paddingTop: 5,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{ marginHorizontal: 10 }}
                                onPress={takePhotoFromCamera}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name="camera-outline"
                                    size={30}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ marginHorizontal: 10 }}
                                onPress={choosePhotoFromLibrary}
                            >
                                <Icon
                                    type={Icons.Ionicons}
                                    name="image-outline"
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 10 }}>
                            <TouchableOpacity onPress={postComment}>
                                <Text
                                    style={{
                                        color: Colors.bag10Bg,
                                        fontSize: 15,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Post
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    topView: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        elevation: 10,
    },
    title: {
        fontSize: 24,
        color: "black",
    },
    flexCenter: {
        flexDirection: "row",
        alignItems: "center",
    },
    bottomView: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        elevation: 10,
        paddingVertical: 10,
    },
    textImageMore: {
        position: "absolute",
        width: "100%",
        height: "100%",
        marginTop: 1.5,
        color: Colors.white,
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
});
