module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            "babel-preset-expo",
            "module:metro-react-native-babel-preset",
        ],
        plugins: [
            "expo-router/babel",
            "react-native-paper/babel",
            "@babel/plugin-transform-export-namespace-from",
            "react-native-reanimated/plugin",
            "@babel/plugin-transform-private-property-in-object",
        ],
    };
};
