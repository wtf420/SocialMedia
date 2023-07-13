import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ChatRoom from "./Screens/chatScreens/ChatRoom";
import ChatScreen from "./Screens/chatScreens/ChatScreen";
import VideoCallScreen from "./Screens/chatScreens/VideoCallScreen";
import ChangePassCreen from "./Screens/ChangePassScreen";
import DetailStatusScreen from "./Screens/DetailStatusScreen";
import EditPostScreen from "./Screens/EditPostScreen";
import EditProfileScreen from "./Screens/EditProfileScreen";
import FirstTimeUserScreen from "./Screens/FirstTimeUseScreen";
import LoginScreen from "./Screens/LoginScreen";
import SignUpHrScreen from "./Screens/SignUpScreen";
import NotificationsScreen from "./Screens/NotificationsScreen";


export default function App() {
    return FirstTimeUserScreen();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
