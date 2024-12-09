import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                'sfpromed': ['SFPROMEDIUM', 'roboto', 'sans-serif'],
                'sfproreg': ['SFPROREGULAR', 'roboto', 'sans-serif'],
                'sfprobold': ['SFPROBOLD', 'roboto', 'sans-serif']
            },
        },
    },

    daisyui: {
        themes: [],
    },

    plugins: [require('@tailwindcss/forms'), require('daisyui')],

    
};
