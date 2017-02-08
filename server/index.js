/* eslint-disable no-undef */
require('babel-core/register')
require('babel-polyfill')
require('dotenv').config()

require('./server').start()
