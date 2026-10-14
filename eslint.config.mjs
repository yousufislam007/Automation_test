// @ts-check
import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import playwright from 'eslint-plugin-playwright'
import tseslint from 'typescript-eslint'

// Locator methods belong in page objects (pages/), not in spec files. See "Rules" in CLAUDE.md.
const LOCATOR_METHODS = 'locator|getByRole|getByText|getByLabel|getByPlaceholder|getByTestId|getByAltText|getByTitle'

export default defineConfig([
    globalIgnores([
        'node_modules/**',
        'legacy-appium/**',
        'playwright-report/**',
        'test-results/**',
        'playwright/.auth/**',
        'playwright/.rate/**',
        'screenshots/**',
    ]),

    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        rules: {
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
        },
    },

    // Playwright best-practice rules for everything that drives a browser.
    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**/*.ts', 'pages/**/*.ts', 'playwright/**/*.ts'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            // Helper functions in page objects and fixtures use expect() on purpose.
            'playwright/no-standalone-expect': 'off',
            // Page-object helpers named expectSomething() contain the assertions, so count them as assertions.
            'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect[A-Z]\\w*$'] }],
        },
    },

    // The project rule "tests must not contain locators", enforced by the linter.
    {
        files: ['tests/**/*.spec.ts'],
        rules: {
            'no-restricted-syntax': [
                'error',
                {
                    selector: `CallExpression[callee.property.name=/^(${LOCATOR_METHODS})$/]`,
                    message: 'No locators in spec files. Add a locator or a method to a page object in pages/ instead.',
                },
            ],
        },
    },

    // Must stay last: switches off every rule that would fight with Prettier's formatting.
    prettier,
])
