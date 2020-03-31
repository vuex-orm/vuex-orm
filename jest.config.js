module.exports = {
  preset: 'ts-jest',
  rootDir: __dirname,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1'
  },
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/attributes/types/Increment.ts',
    '!src/polyfills/index.ts',
    '!src/support/Utils.ts',
    '!src/index.cjs.ts',
    '!src/index.ts'
  ]
}
