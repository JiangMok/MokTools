export const TAB_CONFIG = {
  iching: {
    label: '🔮 占卜',
    title: '周易占卜',
    backgroundColor: '#f9f3e6',
    activeColor: '#6b4c3b',
    inactiveColor: '#b0a088',
    dividerColor: '#d9c8b6'
  },
  liuren: {
    label: '📿 小六壬',
    title: '小六壬',
    backgroundColor: '#e8f5e9',
    activeColor: '#2e7d32',
    inactiveColor: '#a5d6a7',
    dividerColor: '#c8e6c9'
  },
  comprehensive: {
    label: '🔯 综合',
    title: '综合占卜',
    backgroundColor: '#ede7f6',
    activeColor: '#5e35b1',
    inactiveColor: '#b39ddb',
    dividerColor: '#d1c4e9'
  },
  picker: {
    label: '🎲 选择器',
    title: '答案选择器',
    backgroundColor: '#e6f2ff',
    activeColor: '#4a7db5',
    inactiveColor: '#8db3d6',
    dividerColor: '#c2dcff'
  }
}

export function getTabConfig(tab) {
  return Object.prototype.hasOwnProperty.call(TAB_CONFIG, tab) ? TAB_CONFIG[tab] : null
}
