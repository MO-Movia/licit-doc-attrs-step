module.exports = {
  setupFilesAfterEnv: ['jest-prosemirror/environment'],
  testEnvironment: 'jsdom', // Required for dom manipulation
};