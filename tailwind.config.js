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
            },

            background: {

            },

            backgroundImage: {
                glassGradient: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) 15%, rgba(255, 255, 255, 0.05) 35%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.25))',
                lightGradient: 'linear-gradient(to bottom, rgba(247, 251, 255) 1%, rgba(252, 253, 255) 15%, rgba(247, 251, 255) 80%, rgba(232, 244, 255) 96%)'
            }
        },
    },

    plugins: [forms, daisyui],
};
