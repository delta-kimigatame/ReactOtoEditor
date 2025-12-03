import type { Preview } from '@storybook/react-vite';
import { I18nextProvider } from 'react-i18next';
import i18n from '../src/i18n/configs';
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },

  // i18n統合
  decorators: [
    (Story, context) => {
      // グローバルツールバーから言語を取得
      const locale = context.globals.locale || 'ja';
      i18n.changeLanguage(locale);
      
      return (
        <I18nextProvider i18n={i18n}>
          <Story />
        </I18nextProvider>
      );
    },
  ],

  // グローバルツールバーで言語切り替え
  globalTypes: {
    locale: {
      description: '言語',
      defaultValue: 'ja',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'ja', title: '日本語' },
          { value: 'en', title: 'English' },
          { value: 'zh', title: '中文' },
        ],
        showName: true,
      },
    },
  },
};

export default preview;