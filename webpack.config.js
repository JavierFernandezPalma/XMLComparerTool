const path = require('path'); // Módulo de rutas
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Crea archivo HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Plugin para extraer CSS
const CopyPlugin = require('copy-webpack-plugin'); // Copia archivos
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Minifica CSS
const TerserPlugin = require('terser-webpack-plugin'); // Minifica JS
const Dotenv = require('dotenv-webpack'); // Carga variables de entorno
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // Limpia la carpeta de salida
const webpack = require('webpack'); // Importa webpack

module.exports = {
    mode: 'production',
    entry: {
        main: './src/mainIndex.js', // Archivo de entrada (que genera bundle.js)
        mainValidarXML: './src/mainValidarXML.js', // entrada adicional
        mainInventarioCert: './src/mainInventarioCert.js', // entrada adicional
        mainLogErrores: './src/mainLogErrores.js', // entrada adicional
        mapeosMensajes: './src/mainMapeosMensajes.js', // entrada adicional  
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // Carpeta de salida
        filename: '[name].[contenthash].js', // Nombre del archivo de salida
        // assetModuleFilename: 'assets/images/[hash][ext][query]' // Ruta de los assets
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
            '@components': path.resolve(__dirname, 'src/components/'),
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
            {
                test: /\.png/, // Archivos PNG - /\.(png|jpe?g|gif|svg)$/i Soporta más tipos de imágenes
                type: 'asset/resource', // Gestión de recursos
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 10 KB (puedes ajustar esto según tus necesidades)
                    },
                },
            },
            {
                test: /\.(woff|woff2)$/, // Archivos de fuentes
                use: {
                    loader: 'url-loader', // Convierte a URL si es pequeño
                    options: {
                        limit: 10000, // Límite de tamaño
                        mimetype: "application/font-woff", // Tipo MIME
                        name: "[name].[contenthash].[ext]", // Nombre del archivo con hash
                        outputPath: "./assets/fonts/", // Carpeta de salida de fuentes
                        publicPath: "../assets/fonts/", // Ruta pública de fuentes
                        esModule: false, // Modo no ES Module
                    },
                }
            }
        ]
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
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/mapeosMensajes.html',
            filename: './mapeosMensajes.html', // Archivo de salida en dist
            chunks: ['mapeosMensajes']
        }),
        new MiniCssExtractPlugin({ // Configuración del plugin CSS
            filename: 'assets/[name].[contenthash].css' // Nombre del archivo CSS con hash
        }),
        new CopyPlugin({ // Copia archivos
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
        new CleanWebpackPlugin(), // Limpia la carpeta de salida antes de cada build
        new webpack.ProvidePlugin({
            process: 'process/browser', // Para usar process.env en frontend
        }),
    ],
    optimization: {
        minimize: true, // Activa la minimización
        minimizer: [
            new CssMinimizerPlugin(), // Minifica CSS
            new TerserPlugin(
                {
                    terserOptions: {
                        ecma: 2020, // Asegúrate de estar usando una versión moderna de ECMAScript
                        warnings: false,
                        parse: {
                            ecma: 2020,
                        },
                        compress: {
                            drop_console: true, // Opcional: Elimina los `console.log` en producción
                        },
                    },
                }
            ), // Minifica JS
        ],
        splitChunks: {
            chunks: 'all', // Activa el "splitting" de chunks para bibliotecas comunes
        },
    }
}