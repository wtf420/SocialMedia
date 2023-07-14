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
            ["@babel/plugin-transform-class-properties", { "loose": true }],
            ["@babel/plugin-transform-private-methods", { "loose": true }],
            ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
        ] ,
    };
};
