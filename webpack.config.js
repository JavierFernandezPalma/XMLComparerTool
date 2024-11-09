const path = require('path'); // Módulo de rutas
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Crea archivo HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Plugin para extraer CSS
const CopyPlugin = require('copy-webpack-plugin'); // Copia archivos
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Minifica CSS
const TerserPlugin = require('terser-webpack-plugin'); // Minifica JS

module.exports = {
    entry: './src/index.js', // Archivo de entrada
    output: {
        path: path.resolve(__dirname, 'dist'), // Carpeta de salida
        filename: '[name].[contenthash].js', // Nombre del archivo de salida
        assetModuleFilename: 'assets/images/[hash][ext][query]' // Ruta de los assets
    },
    resolve: {
        extensions: ['.js'], // Extensiones a resolver
        alias: { // Alias para rutas
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
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
                test: /\.png/, // Archivos PNG
                type: 'asset/resource' // Gestión de recursos
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
            template: './public/indexPruebas.html', // Plantilla HTML
            filename: './index.html' // Archivo HTML de salida
        }),
        new MiniCssExtractPlugin({ // Configuración del plugin CSS
            filename: 'assets/[name].[contenthash].css' // Nombre del archivo CSS con hash
        }),
        new CopyPlugin({ // Copia archivos
            patterns: [
                { from: path.resolve(__dirname, "src", "assets/images"), to: "assets/images" } // Copia imágenes
            ]
        })
    ],
    optimization: {
        minimize: true, // Activa la minimización
        minimizer: [
            new CssMinimizerPlugin(), // Minifica CSS
            new TerserPlugin(), // Minifica JS
        ]
    }
}