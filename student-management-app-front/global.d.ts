// Project-level ambient declarations to help the TypeScript compiler in this workspace

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE?: string;
    NODE_ENV?: "development" | "production" | "test";
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
} & NodeJS.Process;

// Allow any JSX intrinsic elements to avoid missing React type errors in environments
// where @types/react may not be available in the editor. This is a fallback only.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Provide minimal module declarations to silence editor errors when packages
// are not installed in the environment.
declare module "react/jsx-runtime" {
  export function jsx(type: any, props: any, key?: any): any;
  export function jsxs(type: any, props: any, key?: any): any;
  export function jsxDEV(type: any, props: any, key?: any): any;
}

declare module "lucide-react" {
  const content: any;
  export = content;
  export default content;
  // Common icons used in this project — typed as `any` to avoid editor errors when
  // the package or its types are not installed in the environment.
  export const Loader2: any;
  export const AlertCircle: any;
  export const Edit2: any;
  export const Trash2: any;
  // fallback for any other named exports
  export const __icons: { [key: string]: any };
}
