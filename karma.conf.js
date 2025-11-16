// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // opciones adicionales para Jasmine (si las necesitas)
      },
      clearContext: false // deja visible el resultado en el navegador
    },
    jasmineHtmlReporter: {
      suppressAll: true // quita trazas duplicadas
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/susc-comp'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],

    // 👇 Opción A: usar ChromeHeadless por defecto
    browsers: ['ChromeHeadless'],

    restartOnFileChange: true,
    singleRun: false,

    // Dejamos el launcher extra por si quieres usarlo en CI con --browsers=ChromeHeadlessCI
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-extensions'
        ]
      }
    }
  });
};
