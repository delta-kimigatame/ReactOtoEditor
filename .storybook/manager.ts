import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: {
    showRoots: true,
    filters: {
      patterns: (item) => {
        // Tutorialセクションのみ表示
        return item.id.startsWith('tutorial-');
      },
    },
  },
});
