function Vue (options) {
    var self = this
    this.data = options.data
    this.methods = options.methods

    Object.keys(this.data).forEach(function(key) {
        self._proxy(key)
    })

    observer(this.data)
    new Compile(options.el, this)
    options.mounted.call(this) 
}

Vue.prototype = {
	_proxy: function (key){		
		Object.defineProperty(this, key, {
			enumerable: false,
			configurable: true,
			get: () => {
				return this.data[key]
			},
			set: (newVal) => {
				this.data[key] = newVal
			}
		})
	}
}