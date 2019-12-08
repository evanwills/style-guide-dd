'use strict'

const browserSync = require('browser-sync').create()
const concat = require('concat')
const del = require('del')
const { dest, src, watch } = require('gulp')
// const kssConfig = require('./build/kss-config.json')
const sassLint = require('gulp-sass-lint')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

let sass = require('gulp-sass')
sass.compiler = require('node-sass')

/**
 * a Gulp task for compiling Sass files to CSS and creating source maps
 *
 * @param {string} srcPath path to sass files to be linted
 * @param {string} configFile path to sass-lint config YAML file
 * @param {bool} failOnError whether or not sasslint should fail on error
 *
 * @returns {function} can be used as a gulp task
 */
// const compileSass = (srcPath, destPath, sassOpts) => (cb) => {
const compileSass = (srcPath, destPath, sassOpts) => () => {
  console.log('inside compileSass()')
  // console.log('typeof cb:', typeof cb)
  // console.log('cb:', cb)
  src(`${srcPath}**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOpts).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(dest(destPath))
  console.log('completed compileSass()')
  // cb()
}

/**
 * a Gulp task for linting Sass files
 *
 * @param {string} srcPath path to sass files to be linted
 * @param {string} configFile path to sass-lint config YAML file
 * @param {bool} failOnError whether or not sasslint should fail on error
 *
 * @returns {function} can be used as a gulp task
 */
const lintSassFiles = (srcPath, configFile, failOnError) => {
  console.log('inside lintSassFiles()')
  if (typeof failOnError === 'boolean' && failOnError === true) {
    // return (cb) => {
    return () => {
      console.log('inside lintSassFiles() (failOnError)')
      // console.log('typeof cb:', typeof cb)
      // console.log('cb:', cb)
      src(`${srcPath}**/*.scss`)
        .pipe(sassLint({ configFile: configFile }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
      console.log('completed lintSassFiles()')
      // cb()
    }
  } else {
    // return (cb) => {
    return () => {
      console.log('inside lintSassFiles() (ignore errors)')
      // console.log('typeof cb:', typeof cb)
      // console.log('cb:', cb)
      src(`${srcPath}**/*.scss`)
        .pipe(sassLint({ configFile: configFile }))
        .pipe(sassLint.format())
      console.log('completed lintSassFiles()')
      // cb()
    }
  }
}

/**
 * Concatinate and minify JS files into a single file.
 *
 * @param {array}  jsFiles  list of JS files (including path) to be
 *                          concatinated and uglified
 * @param {string} destPath path to where outputted file is to be
 *                          saved
 *
 * @returns {function} can be used as a gulp task
 */
// const copyJS = (jsFiles, destPath) => (cb) => {
const copyJS = (jsFiles, destPath) => () => {
  console.log('inside copyJS()')
  src(jsFiles)
    .pipe(dest(destPath))
  console.log('completed copyJS()')
  // cb()
}

/**
 * Concatinate and minify JS files into a single file.
 *
 * @param {array}  jsFiles  list of JS files (including path) to be
 *                          concatinated and uglified
 * @param {string} outputFileName name of concatinated file to be
 *                          outputted
 * @param {string} destPath path to where outputted file is to be
 *                          saved
 *
 * @returns {function} can be used as a gulp task
 */
// const prepJS = (jsFiles, outputFileName, destPath) => (cb) => {
const prepJS = (jsFiles, outputFileName, destPath) => () => {
  console.log('inside prepJS()')
  // console.log('typeof cb:', typeof cb)
  // console.log('cb:', cb)
  src(jsFiles)
    .pipe(concat(outputFileName))
    .pipe(uglify())
    .pipe(dest(destPath))
  console.log('completed prepJS()')
  // cb()
}

/**
 * creates a set of watchers for different paths so Scss, JS &
 * @param {array} lookAt list of path/function objects to be watched
 *                       and executed
 * @param {string} destPath path to destination folder to be watched
 *                      so browserSync can be reloaded
 *
 * @returns {function} can be used as a gulp task
 */
// const watcher = (lookAt, destPath) => (cb) => {
const watcher = (lookAt, destPath) => () => {
  console.log('inside watcher()')
  for (let a = 0; a < lookAt.length; a += 1) {
    console.log(`watching: (${a}) ${lookAt[a].path}`)
    watch(lookAt[a].path).on('change', lookAt[a].func)
  }
  watch(`${destPath}**/*.css`).on('change', browserSync.reload)
  watch(`${destPath}**/*.css`).on('change', browserSync.reload)
  watch(`${destPath}**/*.html`).on('change', browserSync.reload)
  console.log('completed watcher()')
  // cb()
}

/**
 * Initialise browserSync
 *
 * @param {string} destPath path to digitial standards site.
 */
// const bsServer = (destPath) => (cb) => {
const bsServer = (destPath) => () => {
  console.log('inside bsServer()')
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: destPath
    }
  })
  // cb()
}

/**
 * delete all the files in the list supplied.
 *
 * @param {array} paths list of files to be deleted
 *
 * @returns {function} async function
 */
// const deleteAll = (paths) => async (cb) => {
const deleteAll = (paths) => async () => {
  console.log('inside deleteAll()')
  // console.log('typeof cb:', typeof cb)
  // console.log('cb:', cb)
  await del(paths)
  console.log('completed deleteAll()')
  // cb()
}

module.exports = { bsServer, compileSass, copyJS, deleteAll, lintSassFiles, prepJS, watcher }
