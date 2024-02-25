// shims-tsx.d.ts

import { HTMLAttributes } from 'vue'

declare module 'vue' {
  interface IntrinsicElements {
    // 直接扩展 JSX.IntrinsicElements 类型
    // 在这里添加你需要支持的 HTML 元素
    div?: HTMLAttributes<HTMLDivElement>
    // 添加其他元素...
  }
}
