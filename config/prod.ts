import type { UserConfigExport } from '@tarojs/cli'

export default {
  mini: {},
  h5: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
} satisfies UserConfigExport
