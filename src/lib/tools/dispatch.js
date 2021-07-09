export default function (componentName, eventName, ...params) {
  // 获取基于当前组件的父组件实例，这里对父组件实例和根组件实例做了兼容处理
  var parent = this.$parent || this.$root

  // 通过父组件的 $option 属性获取组件的名称
  var name = parent.$options.componentName

  // 当相对当前组件的父组件实例存在，而且当父组件的名称不存在或者父组件的名称不等于传入的组件名称时，执行循环
  while (parent && (!name || name !== componentName)) {
    // 记录父组件的父组件
    parent = parent.$parent

    // 当父组件的父组件存在时，获取祖父组件的名称
    if (parent) {
      name = parent.$options.componentName
    }
  }

  // 当循环结束是，parent 的值就是最终匹配的组件实例
  if (parent) {
    // 当 parent 值存在时调用 $emit 方法
    // 传入 parent 实例、事件名称与 params 参数组成的数组
    // 触发传入事件名称 eventName 同名的事件
    parent.$emit.apply(parent, [eventName].concat(...params))
  }

  // const parents = []

  // while (parent) {
  //   if (name === componentName) {
  //     parents.push(parent)
  //   }
  //   // 记录父组件的父组件
  //   parent = parent.$parent

  //   // 当父组件的父组件存在时，获取祖父组件的名称
  //   if (parent) {
  //     name = parent.$options.componentName
  //   }
  // }

  // // parents.forEach((p) => {
  // //   p.$emit.apply(p, [eventName].concat(...params))
  // // })
  // if (parents.length > 0) {
  //   parents[parents.length - 1].$emit.apply(parents[parents.length - 1], [eventName].concat(...params))
  // }
}
