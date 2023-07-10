import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./Screens/LoginScreen";
import ChangePassCreen from "./Screens/ChangePassScreen";
import SignUpHrScreen from "./Screens/SignUpScreen";

export default function App() {
    return SignUpHrScreen();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
