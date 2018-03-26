function observer(value) {
    if (!value || typeof value !== 'object') {
        return
    }
    return new Observer(value)
}


function Dep() {
  this.subs = []

}

Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function() {
    this.subs.forEach(function(sub) {
      console.log(sub)
      sub.update()
    })
  }
}
Dep.target = null