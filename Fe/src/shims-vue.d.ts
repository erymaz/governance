declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare module 'cbor-web';
declare module 'marked';
declare module '@bloks/constants';
declare module 'vue3-cookies';
