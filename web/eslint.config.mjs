import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import reactCompilerPlugin from 'eslint-plugin-react-compiler';
import pluginQuery from '@tanstack/eslint-plugin-query';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...pluginQuery.configs['flat/recommended'],
    {
        name: 'react-compiler/recommended',
        plugins: {
            'react-compiler': reactCompilerPlugin,
        },
        rules: {
            'react-compiler/react-compiler': 'error',
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
];

export default eslintConfig;
