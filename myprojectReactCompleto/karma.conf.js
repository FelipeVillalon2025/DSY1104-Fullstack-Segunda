module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.spec.js',
      'src/**/*.spec.jsx'
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.spec.js': ['babel'],
      'src/**/*.spec.jsx': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        sourceMap: 'inline'
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};