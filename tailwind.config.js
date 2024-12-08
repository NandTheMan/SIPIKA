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
                philosopher: ['Philosopher', ...defaultTheme.fontFamily.sans],
                montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },

            colors: {
                textBoxBlue: '#495e8f',
                buttonBlue: '#576c9c',
                buttonBlueHover: '#364a78',
            }
        },
    },

    plugins: [forms, daisyui],
};
