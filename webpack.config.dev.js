const path = require('path'); // Importa módulo path
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Crea archivo HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Plugin para extraer CSS
const CopyPlugin = require('copy-webpack-plugin'); // Plugin para copiar archivos
const Dotenv = require('dotenv-webpack'); // Carga variables de entorno
const webpack = require('webpack'); // Importa webpack


module.exports = {
    mode: 'development', // o 'production'
    entry: {
        main: './src/mainIndex.js', // Archivo de entrada (que genera bundle.js)
        mainValidarXML: './src/mainValidarXML.js', // entrada adicional
        mainInventarioCert: './src/mainInventarioCert.js', // entrada adicional
        mainLogErrores: './src/mainLogErrores.js', // entrada adicional        
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // limpia la carpeta dist en cada compilación
    },
    resolve: {
        extensions: ['.js'], // Extensiones a resolver
        fallback: {
            stream: require.resolve('stream-browserify'),  // Polyfill para el módulo 'stream'
            timers: require.resolve('timers-browserify'),  // Polyfill para el módulo 'timers'
            buffer: require.resolve('buffer/'),  // Polyfill para el módulo 'buffer'
            path: require.resolve('path-browserify'),  // Polyfill para el módulo 'path'
            os: require.resolve('os-browserify/browser'),  // Polyfill para el módulo 'os'
            crypto: require.resolve('crypto-browserify'),  // Polyfill para el módulo 'crypto'
            "vm": false,  // Desactiva la inclusión de un polyfill para 'vm'
            "process": require.resolve("process/browser"),  // Polyfill para el módulo 'process'
        },
        alias: { // Alias para rutas
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
            '@scripts': path.resolve(__dirname, 'src/scripts/'),
            '@dist': path.resolve(__dirname, 'dist/')
        }
    },
    module: {
        rules: [ // Reglas para archivos
            {
                test: /\.m?js$/, // Archivos JS o MJS
                exclude: /node_modules/, // Excluir node_modules
                use: { loader: 'babel-loader' } // Transpila con Babel
            },
            {
                test: /\.css|.styl$/i, // Archivos CSS o Stylus
                use: [MiniCssExtractPlugin.loader, 'css-loader'] // Procesadores CSS
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ // Configuración del plugin HTML
            inject: true, // Inyecta automáticamente
            template: './public/index.html', // Plantilla HTML
            filename: './index.html', // Archivo HTML de salida
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/validarXML.html',
            filename: './validarXML.html', // Archivo de salida en dist
            chunks: ['mainValidarXML']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/inventarioCert.html',
            filename: './inventarioCert.html', // Archivo de salida en dist
            chunks: ['mainInventarioCert']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/logErrores.html',
            filename: './logErrores.html', // Archivo de salida en dist
            chunks: ['mainLogErrores']
        }),
        new MiniCssExtractPlugin({ // Configuración del plugin CSS
            filename: 'assets/[name].[contenthash].css' // Nombre del archivo CSS con hash
        }),
        new CopyPlugin({ // Configuración del plugin de copiado
            patterns: [
                { from: path.resolve(__dirname, "src", "assets/images"), to: "assets/images" }, // Copia imágenes
                { from: path.resolve(__dirname, "src", "utils/files.json"), to: "utils/files.json" },
                { from: path.resolve(__dirname, "src", "upload"), to: "upload" }
            ]
        }),
        new Dotenv({ // Carga variables de entorno
            path: './.env', // Ruta al archivo .env
            systemvars: true, // Cargar variables del sistema también
            silent: true, // No mostrar advertencias si el archivo .env no existe
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',  // Para usar process.env en frontend
        }),
    ],
    devServer: {
        // Aquí añades el proxy para redirigir las solicitudes a tu backend
        proxy: {
            '/validate': 'http://localhost:3000', // Redirige las solicitudes a /validate al backend Express
        },
        hot: true, // Habilita hot module replacement (HMR)
        open: true, // Abre el navegador automáticamente
        port: 8080, // Puerto en el que Webpack dev server estará corriendo (puedes cambiarlo si es necesario)
        historyApiFallback: true, // Permite el uso de la API de historia sin recargar la página
    },
};
