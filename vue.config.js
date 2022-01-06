module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/offers-module' : '/',
	configureWebpack: (config) => {
		config.output.filename = '[name].[hash:8].js';
		config.output.chunkFilename = '[name].[hash:8].js';
	}
}