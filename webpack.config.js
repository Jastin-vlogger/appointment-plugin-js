const path = require('path');

module.exports = {
    entry: './public/appointment.js',
    output: {
        filename: 'appointment.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'AppointmentPlugin',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    mode: 'production'
};
