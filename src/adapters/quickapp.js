var utils = require('../utils')

module.exports = function(config) {
  var defaults = this.defaults
  if (defaults && defaults.quickapp) {
    // https://doc.quickapp.cn/features/system/fetch.html
    return new Promise(function(resolve, reject) {
      defaults.quickapp.fetch({
        url: config.url,
        data: config.data,
        header: config.headers,
        method: config.method,
        success: function(response) {
          utils.clearTimer(timer)
          resolve({
            data: response.data,
            status: response.code,
            headers: response.headers
          })
        },
        fail: function(data, code) {
          utils.clearTimer(timer)
          reject({data: data, code: code})
        }
      })

      if (config.timeout) {
        timer = setTimeout(function() {
          reject(utils.createError('timeout'))
        }, config.timeout)
      }

      if (config.cancelToken) {
        // not real cancel, wait for api
        config.cancelToken.promise.then(function onCancel(reason) {
          reject(reason)
        })
      }
    })
  }
}
