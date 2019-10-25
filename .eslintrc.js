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
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "settings": {
        "react": {
            "pragma": "React",
            "version": "16.7"
        }
    }
}