declare module 'vite-plugin-node-stdlib-browser' {
  //可以添加需要的类型，让ts有提示，当然any最方便
  const nodePolyfills: any //这里xx最好和vite中import xx form '模块'导入时的名一样
  export default nodePolyfills
}
