module.exports = {
    "root": true,
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "env": {
        "browser": true,
        "node": true,
        "jest": true
    },
    "plugins": [
        "react"
    ],
    "extends": [
        "@homeaway/eslint-config",
        "@homeaway/eslint-config/node8",
        "@homeaway/eslint-config/es6",
        "@homeaway/eslint-config/react",
        "@homeaway/eslint-config/jsx-a11y"
    ],
    "rules": {
        "no-unused-vars": ['error', {"varsIgnorePattern": "^_+$", "argsIgnorePattern": "^_+$"}],
        "no-console": ['error', {allow: ["error"]}]
    },
    "settings": {
        "react": {
            "pragma": "React",
            "version": "16.12"
        }
    }
};
