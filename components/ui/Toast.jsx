import React from "react";
import { ToastAndroid } from "react-native";

export const Toast = (message) => {
    ToastAndroid.showWithGravityAndOffset(
        message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
    );
};
