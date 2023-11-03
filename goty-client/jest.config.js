/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "setupFilesAfterEnv": [
    "<rootDir>/src/setupTests.ts"
  ],
  moduleNameMapper: {
    '^.+\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js'
  }
};