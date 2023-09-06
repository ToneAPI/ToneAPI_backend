module.exports = {
    plugins: ["jest"],
    "env": {
        "es2021": true,
        "node": true,
        "jest/globals": true
    },
    "extends": "standard-with-typescript",
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        project: ["./tsconfig.eslint.json"],
    },
    "rules": {
    "@typescript-eslint/strict-boolean-expressions": 0,
    "@typescript-eslint/explicit-function-return-type": "off",
    },
}
