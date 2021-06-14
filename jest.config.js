module.exports = {
    setupFilesAfterEnv: ['jest-prosemirror/environment'],
    testEnvironment: 'jsdom', // Required for dom manipulation,
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.js"
    ],
    verbose: true,
    testTimeout: 30000,
    roots: [
        "<rootDir>/src"
    ],
    testRegex: "((\\.|/*.)(test))\\.js?$",
    moduleFileExtensions: [
        "js",
    ]
};