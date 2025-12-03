import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'node:url';

// __dirnameを定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  
  addons: [
    "@storybook/addon-essentials",
  ],
  
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // 静的ファイルのディレクトリを指定
  staticDirs: ['./public'],
  
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
    });
  },
};

export default config;