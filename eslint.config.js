import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import betterTailwind from 'eslint-plugin-better-tailwindcss';
import commentLength from 'eslint-plugin-comment-length';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import perfectionist from 'eslint-plugin-perfectionist';
import promise from 'eslint-plugin-promise';
import reactHooks from 'eslint-plugin-react-hooks';
import validateJsxNesting from 'eslint-plugin-validate-jsx-nesting';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

const react = eslintReact.configs['recommended-type-checked'];
// eslint-plugin-react-hooks reports these already.
const reactHooksDuplicates = Object.keys(
  eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'].rules,
).map((name) => name.replace('react-hooks/', '@eslint-react/'));

/** Tailwind rules for files whose classes are built by the stylesheet at `entryPoint`. */
const tailwind = (files, entryPoint) => ({
  files,
  plugins: { 'better-tailwindcss': betterTailwind },
  rules: Object.fromEntries(
    [
      'enforce-canonical-classes',
      'enforce-consistent-class-order',
      'no-conflicting-classes',
      'no-deprecated-classes',
      'no-duplicate-classes',
      'no-unknown-classes',
      'no-unnecessary-whitespace',
    ].map((rule) => [`better-tailwindcss/${rule}`, ['error', { entryPoint }]]),
  ),
});

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.react-router/**',
      '**/.wrangler/**',
      'packages/db/drizzle/**',
    ],
  },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  js.configs.recommended,
  tsConfigs.strictTypeChecked,
  tsConfigs.stylisticTypeChecked,
  promise.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      // Listed rather than found with `projectService`, because each app's tests are type-checked
      // by its worker/tsconfig.json rather than the nearest one.
      parserOptions: {
        project: [
          './apps/*/worker/tsconfig.json',
          './apps/*/tsconfig.json',
          './packages/*/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { 'comment-length': commentLength, perfectionist },
    rules: {
      'capitalized-comments': [
        'error',
        'always',
        { ignoreConsecutiveComments: true, ignorePattern: 'eslint|pragma|ignored|`[^`]*`' },
      ],
      'comment-length/limit-multi-line-comments': ['error', { maxLength: 100 }],
      'comment-length/limit-single-line-comments': ['error', { maxLength: 100 }],
      'no-array-constructor': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'inline-type-imports', prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-regexp-exec': 'error',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: true,
        },
      ],

      'import-x/namespace': 'off',
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': 'error',
      // Vite and Wrangler resolve these; TypeScript already checks every import resolves.
      'import-x/no-unresolved': 'off',

      'perfectionist/sort-imports': ['error', { type: 'natural' }],
      'perfectionist/sort-interfaces': 'error',
      'perfectionist/sort-intersection-types': 'error',
      'perfectionist/sort-object-types': 'error',
      'perfectionist/sort-objects': [
        'error',
        { partitionByComment: true, partitionByNewLine: true },
      ],
      'perfectionist/sort-union-types': 'error',

      'promise/always-return': 'off',
      'promise/no-callback-in-promise': 'error',
      'promise/no-nesting': 'error',
      'promise/no-promise-in-callback': 'error',
      'promise/no-return-in-finally': 'error',
      'promise/valid-params': 'error',
    },
    settings: { 'import-x/resolver-next': [createTypeScriptImportResolver()] },
  },
  {
    // Vitest's asymmetric matchers (expect.any, expect.objectContaining) are typed `any`, and
    // jose's test keys come from WebCrypto rather than a JavaScript constructor.
    files: ['apps/*/test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-class-instance-assignment': 'off',
    },
  },
  {
    // Column order in a table definition is the order of the columns in the database.
    files: ['packages/db/src/schema.ts'],
    rules: { 'perfectionist/sort-objects': 'off' },
  },
  {
    extends: [tsConfigs.disableTypeChecked],
    files: ['**/*.{js,mjs,cjs}'],
  },
  {
    extends: [jsxA11y.flatConfigs.recommended, react, reactHooks.configs.flat.recommended],
    files: ['apps/*/src/**/*.tsx', 'apps/site/app/**/*.tsx', 'packages/shared/src/**/*.tsx'],
    plugins: { 'validate-jsx-nesting': validateJsxNesting },
    rules: {
      ...Object.fromEntries(reactHooksDuplicates.map((name) => [name, 'off'])),
      'validate-jsx-nesting/no-invalid-jsx-nesting': 'error',
    },
  },
  {
    extends: [reactHooks.configs.flat.recommended],
    files: ['apps/*/src/**/*.ts', 'apps/site/app/**/*.ts', 'packages/shared/src/**/*.ts'],
  },
  tailwind(['apps/site/app/**/*.tsx'], 'apps/site/app/app.css'),
  tailwind(['apps/app/src/**/*.tsx'], 'apps/app/src/index.css'),
  tailwind(['apps/admin/src/**/*.tsx', 'packages/shared/src/**/*.tsx'], 'apps/admin/src/index.css'),
);
