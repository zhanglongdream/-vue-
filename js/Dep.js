function Dep () {
	this.subs = []
}

Dep.prototype.addSub = function(sub){
	this.subs.push(sub)
};

Dep.prototype.notify = function(sub){
	 this.subs.forEach((sub) => sub.update())
};


//Watcher是一个类，通过这个类创建的实例都拥有update方法
function Watcher(vm, exp, fn) {
	this.vm = vm
	this.exp = exp  //添加到订阅中
  this.fn = fn

  Dep.target = this;
  let val = vm
  let arr = RegExp.$1.split('.');
	arr.forEach((v) => {
    val = val[v]
	})
	Dep.target = null;
}

Watcher.prototype.update = function () {
  let val = this.vm 
  let arr = this.exp.split('.');
	arr.forEach((v) => {
    val = val[v]
	})

  this.fn(val)
}

// let watcher = new Watcher(function() {
// 	//监听函数
// 	alert(1)
// })

// let dep = new Dep()

// //将watcher放到数组中
// dep.addSub(watcher)
// dep.addSub(watcher)
// console.log(dep.subs)





