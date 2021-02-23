import { Plugin } from 'vite';
import { transformAsync } from '@babel/core';

export type ImportPluginOptions = Array<{
  [key: string]: any;
  libraryName: string;
  libraryDirectory?: string;
  camel2DashComponentName?: boolean;
}>;

export default (options: ImportPluginOptions) => {
  /**
   * fast check and pass by code that does not contains libraryName
   */
  const codeIncludesLibraryName = (code: string) => !options.every(({ libraryName }) => !new RegExp(`('${libraryName}')|("${libraryName}")`).test(code));

  const plugin: Plugin = {
    name: 'modular-import',

    async transform(src) {
      if (!codeIncludesLibraryName(src)) {
        return undefined;
      }

      const result = await transformAsync(src, {
        plugins: options.map((mod) => ['import', mod, `import-${mod.libraryDirectory}`]),
      });

      return result?.code;
    },
  };

  return plugin;
};
