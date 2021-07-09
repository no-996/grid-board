// 定义 broadcast 方法，接受三个参数，分别是：组件名称、将要触发的事件名称、回调函数传递的参数
export default function broadcast(componentName, eventName, ...params) {
  // 依次循环当前组件的子组件
  this.$children.forEach((child) => {
    // 获取每个子组件的名字
    var name = child.$options.componentName

    // 判断子组件的名字是否等于传入的组件名称
    if (name === componentName) {
      // 如果子组件的名字等于传入的组件名称就调用 $emit 触发事件
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      // 如果子组件的名字不等于传入的组件名称就递归遍历调用 broadcast 孙子组件
      // broadcast.apply(child, [componentName, eventName].concat([...params]))
    }
    broadcast.apply(child, [componentName, eventName].concat([...params]))
  })
}
