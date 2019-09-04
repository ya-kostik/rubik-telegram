module.exports = {
  verbose: true,
  browser: false,
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/jest.config.js',
    '!**/.eslintrc.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
  ],
  globals: {
  }
}
