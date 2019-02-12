function Vue(options = {}) {
	this.$options = options
	var data = this._data = this.$options.data

	observer(data)
	for (let key in data) {
		Object.defineProperty(this, key, {
			enumerable: true,
			get() {
				return this._data[key];
			},
			set(newVal) {
				this._data[key] = newVal;
			}
		})
	}
  initComputed.call(this)
	new Compile(this.$options.el, this)

}

function initComputed(){
  let vm = this
  let computed = this.$options.computed;
  Object.keys(computed).forEach((target) => {
      Object.defineProperty(vm, target, {
      	get: typeof computed[target] === 'function' ? computed[target]: computed[target].get,
      	set() {}
      })
  })
}


function Observe(data) {
	let dep = new Dep()
	for (let key in data) {
		let val = data[key];
		observer(val)

		Object.defineProperty(data, key, {
			enumerable: true,
			get() {
				Dep.target && dep.addSub(Dep.target)
				return val;
			},
			set(newVal) {
				if (newVal === val) {
					return;
				}
				val = newVal;
				observer(newVal)

				dep.notify()
			}
		})
	}
}
//观察对象，给对象增加object.defineProperty
function observer(data) {
	if (typeof data !== 'object') return
	return new Observe(data)
}



function Compile(el, vm) {
	vm.$el = document.querySelector(el);
	//将节点保存在内存中
	let fragment = document.createDocumentFragment();
	while (child = vm.$el.firstChild) {
		fragment.appendChild(child);
	}
	replace(fragment)

	function replace(fragment) {
		Array.from(fragment.childNodes).forEach((node) => {
			var text = node.textContent
			var reg = /\{\{(.*)\}\}/;
			if (node.nodeType === 3 && reg.test(text)) {

				let arr = RegExp.$1.split('.');
				//这里一个技巧，就是找到深层对象的值
				let val = vm
				arr.forEach((v) => {
					val = val[v]
				})
				new Watcher(vm, RegExp.$1, function(newVal) {
					node.textContent = text.replace(/\{\{(.*)\}\}/, JSON.stringify(newVal))
				})
				node.textContent = text.replace(/\{\{(.*)\}\}/, JSON.stringify(val))
			}
			if (node.nodeType === 1) {
				let nodeAttrs = node.attributes;
				Array.from(nodeAttrs).forEach((attr) => {

					if (attr.name.indexOf('v-') === 0) {
						let key = attr.value;
						node.value = vm[key]
						new Watcher(vm, key, function(newVal) {
							node.value = newVal
						})

						node.addEventListener('input', (e) => {
							let newVal = e.target.value
							vm[key] = newVal
						})
					}
				})
			}


			if (node.childNodes) {
				replace(node)
			}
		})
	}
	vm.$el.appendChild(fragment);
}