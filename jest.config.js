// jest.config.js
module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text', 'text-summary'],
    collectCoverageFrom: ['src/**/*.js'], // collect coverage from all .js files in src folder
  };
  