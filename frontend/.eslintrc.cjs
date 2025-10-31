/**
 * ESLint Configuration - Enforces design principles and code quality standards
 * Following design principles: Configuration over code, quality standards
 * 
 * Core enforcement areas:
 * - Type safety: No explicit any, proper return types
 * - Code complexity: Manageable function sizes and cyclomatic complexity
 * - Consistency: Enforce best practices across codebase
 */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react-refresh'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],

    // Type Safety - Design Principle: No explicit any types
    '@typescript-eslint/no-explicit-any': 'error',
    // Function return types - off for React components (TypeScript infers correctly)
    // Utility functions use explicit return types for better documentation (already done)
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // Code Quality - Design Principle: Single Responsibility
    // More lenient for UI/presentation components which often have layout code
    'max-lines-per-function': [
      'warn',
      {
        max: 150, // Increased for UI components with layout
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'complexity': ['warn', 15], // Cyclomatic complexity threshold (lenient for UI rendering logic)

    // Best Practices - Design Principle: Explicit over implicit
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',

    // React Best Practices
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};

