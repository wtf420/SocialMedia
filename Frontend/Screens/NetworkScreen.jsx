/* eslint-disable react-native/no-inline-styles */
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from "react-native";
import React, { useState } from "react";
import Icon, { Icons } from "../components/ui/Icons";
import FriendList from "../components/ui/FriendList";
import Colors from "../constants/Colors";

function NetworkScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("myNetworks")}>
                <View style={styles.manageNetworkView}>
                    <Text style={styles.title}>Manage my network</Text>
                    <Icon type={Icons.AntDesign} name={"right"} />
                </View>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#eeeeee", height: 10 }} />
            <TouchableOpacity
                onPress={() => navigation.navigate("invitations")}
            >
                <View style={styles.manageNetworkView}>
                    <Text style={styles.title}>Invitation</Text>
                    <Icon type={Icons.AntDesign} name={"right"} />
                </View>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#eeeeee", height: 10 }} />
            <View>
                <View style={styles.manageNetworkView}>
                    <Text style={styles.title}>People you may know</Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                    <FriendList navigation={navigation} />
                </View>
            </View>
        </View>
    );
}

export default NetworkScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    manageNetworkView: {
        margin: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        color: Colors.primary,
        fontSize: 20,
        fontWeight: "semibold",
    },
    circle: {
        backgroundColor: "white",
        width: 60,
        height: 60,
        position: "absolute",
        bottom: 40,
        right: 40,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
});
