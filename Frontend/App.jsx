import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { Store } from "./reducers/Store";
import { NavigationContainer } from "@react-navigation/native";
import Routers from "./Navigations/Routers";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
    useEffect(() => {
        // registerGlobals();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Provider store={Store}>
                    <NavigationContainer>
                        <Routers />
                    </NavigationContainer>
                </Provider>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
};

export default App;
