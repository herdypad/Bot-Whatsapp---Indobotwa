const fetch = require('node-fetch')
const { fromBuffer } = require('file-type')
const fs = require('fs-extra')
const FormData = require('form-data')


/**
 * Fetch text from URL.
 * @param {string} url 
 * @param {object} [options]
 * @returns {Promise<string>}
 */
 const fetchText = (url, options) => {
    return new Promise((resolve, reject) => {
        return fetch(url, options)
            .then((response) => response.text())
            .then((text) => resolve(text))
            .catch((err) => reject(err))
    })
}

module.exports = {
    fetchText
}