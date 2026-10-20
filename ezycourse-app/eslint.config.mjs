// @ts-check
import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

// Fixed sleeps make tests slow and flaky: wait for an element or a condition instead. See "Rules" in CLAUDE.md.
const NO_PAUSE = {
    selector: "CallExpression[callee.object.name=/^(browser|driver)$/][callee.property.name='pause']",
    message: 'No fixed sleeps. Use waitForDisplayed(), waitUntil() or another explicit wait.',
}

export default defineConfig([
    globalIgnores(['node_modules/**', 'screenshots/**', 'logs/**']),

    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        rules: {
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            'no-restricted-syntax': ['error', NO_PAUSE],
        },
    },

    // The project rule "tests must not contain locators", enforced by the linter.
    {
        files: ['tests/**/*.spec.ts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@wdio/globals',
                            importNames: ['$', '$$'],
                            message: 'No locators in spec files. Add a locator or a method to a screen in screens/.',
                        },
                    ],
                },
            ],
            'no-restricted-syntax': [
                'error',
                NO_PAUSE,
                {
                    selector:
                        'CallExpression[callee.object.name=/^(browser|driver)$/][callee.property.name=/^[$]{1,2}$/]',
                    message: 'No locators in spec files. Add a locator or a method to a screen in screens/.',
                },
            ],
        },
    },

    // Must stay last: switches off every rule that would fight with Prettier's formatting.
    prettier,
])
