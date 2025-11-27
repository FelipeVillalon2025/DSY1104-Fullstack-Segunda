export default function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.spec.jsx', type: 'module' }
    ],
    preprocessors: {
      'src/**/*.spec.jsx': ['babel']
    },
    babelPreprocessor: {
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-transform-modules-commonjs']
      }
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity,
    client: {
      jasmine: {
        random: false
      }
    }
  });
};