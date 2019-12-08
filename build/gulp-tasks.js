'use strict'
/**
 * This Gulp file runs in two modes:
 *  - "prod" (Production)
 *  - "dev" (default - Development)
 *
 * To run this task in Production mode, you pass mode=prod as a
 * parameter after "gulp"
 *
 * Some useful links to help with understanding this file:
 * * https://www.webstoemp.com/blog/switching-to-gulp4/
 */

const { series, parallel, dest, src, watch } = require('gulp')
const childProcess = require('child_process')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const del = require('del')
// const concat = require('concat') // not needed until we start prod stuff
const sassLint = require('gulp-sass-lint')
const sourcemaps = require('gulp-sourcemaps')
// const uglify = require('gulp-uglify') // not needed until we start prod stuff

// using let because we attache extra stuff to the sass object
// in a moment
let sass = require('gulp-sass')

const { cliArgs } = require('./build/getCliArgs')

sass.compiler = require('node-sass')

/**
 * @var {object} config configuration stuff needed for everything
 *                    to follow
 */
const config = require('./sgdd.config.json')

/**
 * @var {string} mode mode gulp task is to run in
 */
const mode = cliArgs('mode', 'dev')

/**
 * @var {array} list of files to be deleted each time gulp is run.
 */
const filesToDelete = [
  `${config.paths.dest}**/*.html`,
  `${config.paths.dest}css/*.css`,
  `${config.paths.dest}js/*.js`,
  `${config.paths.dest}img/*.*`
]

/**
 * @var {object} sassOptionsDev options to get Sass to compile
 *                              correctly for development mode
 *                              (and to build a CSS file that KSS can
 *                               use to compile the style guide.)
 */
const sassOptionsDev = {
  eyeglass: {
    enableImportOnce: false
  },
  indent_type: 'space',
  outputStyle: 'expanded',
  source_comments: true
}

// ==============================================
// START: end user runtime documentation

console.log('')
console.log('Running gulp in "' + mode + '" mode (--mode=' + mode + ')')
console.log('')
console.log('To run this task in Production mode, you need to pass "--mode=prod" as')
console.log('a parameter after "gulp"')
console.log('e.g. $ gulp --mode=prod or')
console.log('     $ gulp --mode=dev')
console.log('     $ gulp --mode=test // testing new gulp functionality')
console.log('')

//  END:  end user runtime documentation
// ==============================================

// Start doin' tha do

if (mode === 'prod') {
  // ============================================
  // START: production mode

  // Now we're gettin' serious
  // This is all the production ready build and deployment stuff

  //  END:  production mode
  // ============================================
} else if (mode === 'test') {
  // ============================================
  // START: test mode

  // This is just for experimental stuff
  // No watching and no browserSync here

  /**
   * a Gulp task for compiling Sass files to CSS and creating source maps
   */
  const compileKss = (gulpCallBack) => {
    const kss = childProcess.spawn(
      'node_modules/kss/bin/kss',
      [
        '--config',
        config.kssConfig
      ]
    )
    kss.on('exit', (code) => {
      const errorMsg = (code === 0) ? null : 'ERROR: node-kss process exited with code: ' + code
      gulpCallBack(errorMsg)
    })
    return kss
  }

  exports.default = series(compileKss)
  // exports.default = series(compileSass, compileKss)

  //  END:  test mode
  // ============================================
} else {
  // ============================================
  // START: development mode

  // This is for normal day-to-day development stuff
  //
  // This makes life easier by setting up watchers and auto compiling
  // all the things
  //
  // It runs runs the following steps:
  // 1. sets up browser-sync to watch the style-guide directory for
  // changes
  // 2. watches the front-end/sass directory for changes and builds
  //    appropriate CSS files (with comments) that can be used by KSS
  //    to build the style-guide directory
  // 2.1. runs sass-lint with every build and outputs errors & warnings
  // 3. watches the front-end/js directory and copies updated files to
  //    the appropriate place in style-guide/js/
  // 3.1. watches front-end/js files using standardJS and outputs
  //      errors and warnings
  // 4. watches the front-end/vendor directory and copies updated files
  //    to the appropriate place in style-guide/vendor/
  //
  // This script assumes that the developer has both sass-lint and
  // "Standard JS" installed in their IDE and that the developer is
  // dealing with errors, warnings and notices generated by both
  // sass-lint and standard JS as they arise.

  /**
   * a Gulp task for compiling Sass files to CSS and creating source maps
   */
  const compileSass = () => {
    return src(`${config.src.css}**/*.scss`)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass(sassOptionsDev).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(dest(config.dest.css + 'css/'))
  }

  /**
   * a Gulp task for linting Sass files
   */
  const lintSassFiles = (updatedFile) => {
    // const _updatedFile = updatedFile.replace(/.*?\\/g, '**/')
    // return src(_updatedFile)
    src(`${config.src.css}**/*.scss`)
      .pipe(plumber())
      .pipe(sassLint({ configFile: config.cssPreProcessor.lintConfig }))
      .pipe(sassLint.format())
  }

  /**
   * a Gulp task for compiling the digital standards style-guide from
   * CSS compiled from Sass
   */
  const compileKss = () => {
    console.log('config.config.kss:', config.kssConfig)
    childProcess.spawn(
      './node_modules/kss/bin/kss',
      [
        '--config',
        config.kssConfig
      ]
    )
  }

  /**
   * Concatinate and minify JS files into a single file.
   */
  const copyJS = () => {
    return src(`${config.src.js}**/*.js`)
      .pipe(plumber())
      .pipe(dest(`${config.dest.js}`))
  }

  /**
   * Concatinate and minify JS files into a single file.
   */
  const copyImages = () => {
    console.log(config.src.imgages)
    console.log(config.dest.images)
    src(`${config.src.images}**/*.*`)
      .pipe(plumber())
      .pipe(dest(config.dest.images))
  }

  /**
   * Concatinate and minify JS files into a single file.
   */
  const copyVendor = () => {
    src(`${config.src.vendor}**/*.*`)
      .pipe(plumber())
      .pipe(dest(`${config.dest.vendor}vendor/`))
  }

  /**
   * Copy changed vendor files to style-guide vendor folder
   */
  const copyUpdatedVendor = (updatedFile) => {
    console.log('updatedFile:', updatedFile)
    const sourceDir = updatedFile.replace(/^.*?\/vendor\/(css|js|fonts|images)\/.*$/ig, '$1')
    console.log('sourceDir:', sourceDir)
    src(updatedFile)
      .pipe(plumber())
      .pipe(dest(`${config.paths.dest}vendor/${sourceDir}/`))
  }

  /**
   * delete all the files in the list supplied.
   */
  const deleteAll = async () => {
    await del(filesToDelete)
  }

  /**
   * creates a set of watchers for different paths so Scss, JS & HTML
   */
  const watcher = () => {
    // compile and do stuff
    watch(`${config.src.css}**/*.scss`).on('change', compileSass)
    watch(`${config.src.css}**/*.scss`).on('change', lintSassFiles)
    watch(`${config.src.js}**/*.js`).on('change', copyJS)
    watch(`${config.src.images}**/*.*`).on('change', copyImages)
    watch(`${config.src.vendor}**/*.*`).on('change', copyUpdatedVendor)

    // Build style-guide
    watch(`${config.paths.dest}css/*.css`).on('change', compileKss)

    // reload browser when compiled code is written
    watch(`${config.paths.dest}**/*.css`).on('change', browserSync.reload)
    watch(`${config.paths.dest}**/*.js`).on('change', browserSync.reload)
    watch(`${config.paths.dest}**/*.html`).on('change', browserSync.reload)
  }

  /**
   * Initialise browserSync
   *
   * @param {string} destPath path to digitial standards site.
   */
  const browserSyncInit = () => {
    browserSync.init({
      notify: false,
      open: false,
      server: {
        baseDir: config.paths.dest
      }
    })
  }

  exports.default = series(deleteAll, parallel(browserSyncInit, watcher, compileSass, copyImages, copyJS, copyVendor))

  //  END:  test mode
  // ============================================
}
