'use-strict'

/**
 * getCliArgs provides three functions for working with CLI arguments
 * passed when a NodeJS script is called.
 *
 * The three functions do exactly the same thing with differing
 * levels of type tollerance
 *
 * You pass
 */

// ========================================================
// START: utility functions

/**
 * Make argument names all lowercase alphabetical characters only
 *
 * @param {string} input argument name to be standardised
 *
 * @return {string} standardised argument name
 */
const standardiseArgName = (input) => {
  let _output = ''
  if (typeof input === 'string') {
    _output = input.replace(/[^a-z]/i, '')
    return _output.toLowerCase()
  } else {
    throw Error('Argument name must be a string')
  }
}

/**
 * Ensures that input is a scalar (or NULL) value and throws an
 * exception if not.
 *
 * @param {mixed} input value to be validated
 *
 * @param {mixed}
 */
const validateDefaultType = (input) => {
  const inputT = typeof input

  if (inputT === 'undefined') {
    return null
  } else if (inputT === 'string' || inputT === 'number' || inputT === 'boolean') {
    return input
  } else {
    throw Error('Expected default value to be string, number, boolean or NULL')
  }
}

//  END:  utility functions
// ========================================================
// START: pre-process cli arguments

/**
 * Extracts key/value pairs from commandline arguments passed when
 * the script was called
 *
 * NOTE: boolean ("true" & "false") & numeric (e.g. "123" or "6.54")
 *       strings are converted to boolean & number types when
 *       processed
 *
 * @param {array} cliArgs list of arguments passed to node script
 *
 * @returns {object} key/value pairs for cli arguments passed when
 *                   the script was called
 */
const innerArgs = ((cliArgs) => {
  let a = 0
  let args = {}
  let b = 0
  let _key = ''
  let _value = ''
  const regex = new RegExp('^--([a-z_\\-]+)(?:=(true|false|.+))?|-([a-z]+)$', 'i')
  let match = null

  for (a = 0; a < cliArgs.length; a += 1) {
    match = regex.exec(cliArgs[a])
    if (match !== null) {
      _key = standardiseArgName(match[1])
      _value = true
      if (typeof match[2] === 'string' && match[2] !== '') {
        switch (match[2].toLowerCase()) {
          case 'true':
            _value = true
            break
          case 'false':
            _value = false
            break
          default:
            if (isNaN(match[2] * 1)) {
              _value = match[2]
            } else {
              _value = match[2] * 1
            }
            break
        }
        args[_key] = _value
      } else if (typeof match[3] === 'string' && match[3] !== '') {
        const boolArgs = match[3].split('')

        for (b = 0; b < boolArgs.length; b += 1) {
          _key = boolArgs[b]
          args[_key] = true
        }
      }
    }
  }
  return args
}) (process.argv)

//  END:  pre-process cli arguments
// ========================================================
// START: end user functions

/**
 * Get the value for a specific argument supplied when script
 * was called
 *
 * @param {string} arg name of argument supplied when script
 *                     was called
 * @param {mixed} default_ default value to use if specified argument
 *                     was not passed when script was called
 *
 * @returns {mixed} value of argument supplied when script was
 *                  called or default value supplied when function
 *                  was called
 */
const cliArgs = (arg, default_) => {
  const args = innerArgs
  let _arg
  let _default

  try {
    _arg = standardiseArgName(arg)
  } catch (e) {
    throw Error(e.message)
  }

  try {
    _default = validateDefaultType(default_)
  } catch (e) {
    _default = null
  }

  return (typeof args[_arg] !== 'undefined') ? args[_arg] : _default
}

/**
 * Get the value for a specific argument supplied when script
 * was called
 *
 * NOTE: If the argument value type doesn't match the default value
 *       type the default value is returned
 *
 * @param {string} arg name of argument supplied when script
 *                     was called
 * @param {string|number|boolean|null} default_ default value
 *                     if argument was not passed when script
 *                     was called
 *
 * @returns {mixed} value of argument supplied when script was
 *                  called or default value supplied when function
 *                  was called
 */
const cliArgsStrict = (arg, default_) => {
  const args = innerArgs
  let _arg
  let _default

  try {
    _arg = standardiseArgName(arg)
  } catch (e) {
    throw Error(e.message)
  }

  try {
    _default = validateDefaultType(default_)
  } catch (e) {
    throw Error(e.message)
  }

  const _output = (typeof args[_arg] !== 'undefined') ? args[_arg] : _default

  return (_default === null || typeof _output === typeof _default) ? _output : _default
}

/**
 * Get the value for a specific argument supplied when script
 * was called
 *
 * NOTE: If the argument value type doesn't match the default value
 *       type an error is thrown
 *
 * @param {string} arg name of argument supplied when script
 *                     was called
 * @param {string|number|boolean|null} default_ default value
 *                     if argument was not passed when script
 *                     was called
 *
 * @returns {mixed} value of argument supplied when script was
 *                  called or default value supplied when function
 *                  was called
 */
const cliArgsStrictError = (arg, default_) => {
  const args = innerArgs
  let _arg
  let _default

  try {
    _arg = standardiseArgName(arg)
  } catch (e) {
    throw Error(e.message)
  }
  try {
    _default = validateDefaultType(default_)
  } catch (e) {
    throw Error(e.message)
  }

  const _output = (typeof args[_arg] !== 'undefined') ? args[_arg] : _default

  if (_default !== null && typeof _output === typeof _default) {
    return _output
  } else {
    throw Error('Supplied argument type did not match default type')
  }
}

//  END:  end user functions
// ========================================================

module.exports = { cliArgs, cliArgsStrict, cliArgsStrictError }
