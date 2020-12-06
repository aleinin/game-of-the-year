module.exports = {
    preset: 'jest-preset-angular',
    roots: ['src'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],
    moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/app/$1',
        '@assets/(.*)': '<rootDir>/src/assets/$1',
        '@core/(.*)': '<rootDir>/src/app/core/$1',
        '@env': '<rootDir>/src/environments/environment',
        '@src/(.*)': '<rootDir>/src/src/$1',
        '@state/(.*)': '<rootDir>/src/app/state/$1'
    },
    testMatch: ['**/**.spec.[jt]s'],
};
