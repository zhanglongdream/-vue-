function Observer(data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  walk: function (data) {
    var self = this
    Object.keys(data).forEach((key) => {
      self.definePropertyObserver(data, key, data[key])
    })
  },
  definePropertyObserver: (data, key, value)=> {
    var childObj = observer(value)
    var dep = new Dep()
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get: function() {
        console.log(Dep.target)
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return value
      },
      set: function(newVal) {
        if (value === newVal) return
        value = newVal
        dep.notify()
      }
    })
  }
}
