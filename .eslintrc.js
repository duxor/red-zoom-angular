module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    ignorePatterns: [
        '*.spec.ts',
    ],
    overrides: [
        {
            files: ['*.js'],
            rules: {
                quotes: [
                    'error',
                    'single'
                ],
                'quote-props': [
                    'error',
                    'as-needed'
                ],
            },
        },
        {
            files: ['*.ts'],
            excludedFiles: ['*.spec.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: [
                    'projects/demo/tsconfig.app.json',
                ],
                sourceType: 'module',
                createDefaultProgram: true
            },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:@angular-eslint/recommended',
                'prettier',
            ],
            plugins: [
                'eslint-plugin-import',
                'eslint-plugin-jsdoc',
                '@angular-eslint/eslint-plugin',
                '@angular-eslint/eslint-plugin-template',
                '@typescript-eslint/eslint-plugin'
            ],
            rules: {
                '@angular-eslint/component-class-suffix': 'error',
                '@angular-eslint/contextual-lifecycle': 'error',
                '@angular-eslint/directive-class-suffix': 'error',
                '@angular-eslint/no-conflicting-lifecycle': 'error',
                '@angular-eslint/no-host-metadata-property': 'error',
                '@angular-eslint/no-input-rename': 'error',
                '@angular-eslint/no-inputs-metadata-property': 'error',
                '@angular-eslint/no-output-native': 'error',
                '@angular-eslint/no-output-on-prefix': 'error',
                '@angular-eslint/no-output-rename': 'error',
                '@angular-eslint/no-outputs-metadata-property': 'error',
                '@angular-eslint/use-lifecycle-interface': 'error',
                '@angular-eslint/use-pipe-transform-interface': 'error',
                '@typescript-eslint/adjacent-overload-signatures': 'error',
                '@typescript-eslint/array-type': 'off',
                '@typescript-eslint/ban-types': [
                    'error',
                    {
                        types: {
                            Object: {
                                message: 'Avoid using the `Object` type. Did you mean `object`?'
                            },
                            Function: {
                                message: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.'
                            },
                            Boolean: {
                                message: 'Avoid using the `Boolean` type. Did you mean `boolean`?'
                            },
                            Number: {
                                message: 'Avoid using the `Number` type. Did you mean `number`?'
                            },
                            String: {
                                message: 'Avoid using the `String` type. Did you mean `string`?'
                            },
                            Symbol: {
                                message: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
                            }
                        }
                    }
                ],
                '@typescript-eslint/consistent-type-assertions': 'error',
                '@typescript-eslint/dot-notation': 'error',
                '@typescript-eslint/indent': [
                    'error',
                    4,
                    {
                        SwitchCase: 1,
                        FunctionDeclaration: {
                            parameters: 'first'
                        },
                        FunctionExpression: {
                            parameters: 'first'
                        }
                    }
                ],
                '@typescript-eslint/member-delimiter-style': [
                    'error',
                    {
                        multiline: {
                            delimiter: 'semi',
                            requireLast: true
                        },
                        singleline: {
                            delimiter: 'semi',
                            requireLast: false
                        }
                    }
                ],
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/naming-convention': 'error',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-empty-interface': 'error',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    {
                        ignoreParameters: true
                    }
                ],
                '@typescript-eslint/no-misused-new': 'error',
                '@typescript-eslint/no-namespace': 'error',
                '@typescript-eslint/no-non-null-assertion': 'error',
                '@typescript-eslint/no-parameter-properties': 'off',
                '@typescript-eslint/no-shadow': [
                    'error',
                    {
                        hoist: 'all'
                    }
                ],
                '@typescript-eslint/no-unused-expressions': 'error',
                '@typescript-eslint/no-use-before-define': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/prefer-for-of': 'error',
                '@typescript-eslint/prefer-function-type': 'error',
                '@typescript-eslint/prefer-namespace-keyword': 'error',
                '@typescript-eslint/quotes': [
                    'error',
                    'single'
                ],
                '@typescript-eslint/semi': [
                    'error',
                    'always'
                ],
                '@typescript-eslint/triple-slash-reference': [
                    'error',
                    {
                        path: 'always',
                        types: 'prefer-import',
                        lib: 'always'
                    }
                ],
                '@typescript-eslint/type-annotation-spacing': 'error',
                '@typescript-eslint/unified-signatures': 'error',
                'arrow-body-style': 'error',
                complexity: 'off',
                'constructor-super': 'error',
                curly: 'error',
                'eol-last': 'error',
                eqeqeq: [
                    'error',
                    'smart'
                ],
                'guard-for-in': 'error',
                'id-blacklist': [
                    'error',
                    'any',
                    'Number',
                    'number',
                    'String',
                    'string',
                    'Boolean',
                    'boolean',
                    'Undefined',
                    'undefined'
                ],
                'id-match': 'error',
                'import/no-deprecated': 'warn',
                'jsdoc/check-alignment': 'error',
                'jsdoc/check-indentation': 'error',
                'jsdoc/newline-after-description': 'error',
                'jsdoc/no-types': 'error',
                'max-classes-per-file': 'off',
                'max-len': [
                    'error',
                    {
                        code: 140
                    }
                ],
                'new-parens': 'error',
                'no-bitwise': 'error',
                'no-caller': 'error',
                'no-cond-assign': 'error',
                'no-console': [
                    'error',
                    {
                        allow: [
                            'log',
                            'warn',
                            'dir',
                            'timeLog',
                            'assert',
                            'clear',
                            'count',
                            'countReset',
                            'group',
                            'groupEnd',
                            'table',
                            'dirxml',
                            'error',
                            'groupCollapsed',
                            'Console',
                            'profile',
                            'profileEnd',
                            'timeStamp',
                            'context'
                        ]
                    }
                ],
                'no-debugger': 'error',
                'no-empty': 'off',
                'no-eval': 'error',
                'no-fallthrough': 'error',
                'no-invalid-this': 'off',
                'no-new-wrappers': 'error',
                'no-restricted-imports': [
                    'error',
                    'rxjs/Rx'
                ],
                'no-throw-literal': 'error',
                'no-trailing-spaces': 'error',
                'no-undef-init': 'error',
                'no-underscore-dangle': 'error',
                'no-unsafe-finally': 'error',
                'no-unused-labels': 'error',
                'no-var': 'error',
                'object-shorthand': 'error',
                'one-var': [
                    'error',
                    'never'
                ],
                'prefer-const': 'error',
                'quote-props': [
                    'error',
                    'as-needed'
                ],
                radix: 'error',
                'space-before-function-paren': [
                    'error',
                    {
                        anonymous: 'never',
                        asyncArrow: 'always',
                        named: 'never'
                    }
                ],
                'spaced-comment': [
                    'error',
                    'always',
                    {
                        markers: [
                            '/'
                        ]
                    }
                ],
                'use-isnan': 'error',
                'valid-typeof': 'off'
            }
        },
        {
            files: ['*.html'],
            parser: '@angular-eslint/template-parser',
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {
                '@angular-eslint/template/banana-in-box': 'error',
                '@angular-eslint/template/eqeqeq': 'error',
                '@angular-eslint/template/no-negated-async': 'error',
            }
        },
    ]
};
