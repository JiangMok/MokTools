<template>
  <view class="custom-tabbar" :style="{ backgroundColor: bgColor }">
    <view class="tabbar-item" @click="onClick('iching')">
      <text class="tabbar-text" :style="{ color: current === 'iching' ? activeColor : inactiveColor }">{{ tabConfig.iching.label }}</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('liuren')">
      <text class="tabbar-text" :style="{ color: current === 'liuren' ? activeColor : inactiveColor }">{{ tabConfig.liuren.label }}</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('comprehensive')">
      <text class="tabbar-text" :style="{ color: current === 'comprehensive' ? activeColor : inactiveColor }">{{ tabConfig.comprehensive.label }}</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('picker')">
      <text class="tabbar-text" :style="{ color: current === 'picker' ? activeColor : inactiveColor }">{{ tabConfig.picker.label }}</text>
    </view>
  </view>
</template>

<script>
import { doVibrateShort } from '@/utils/CommonUtils.js'
import { TAB_CONFIG, getTabConfig } from '@/utils/tabConfig.js'

export default {
  props: {
    theme: {
      type: String,
      default: 'iching'
    }
  },
  data() {
    return {
      current: this.theme,
      tabConfig: TAB_CONFIG
    }
  },
  computed: {
    currentTabConfig() {
      return getTabConfig(this.current) || TAB_CONFIG.iching
    },
    bgColor() {
      return this.currentTabConfig.backgroundColor
    },
    activeColor() {
      return this.currentTabConfig.activeColor
    },
    inactiveColor() {
      return this.currentTabConfig.inactiveColor
    },
    dividerColor() {
      return this.currentTabConfig.dividerColor
    }
  },
  watch: {
    theme(newVal) {
      this.current = newVal
    }
  },
  methods: {
    onClick(tab) {
      if (this.current === tab) return
      doVibrateShort()
      this.current = tab
      this.$emit('tabChange', tab)
    }
  }
}
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  align-items: center;
  justify-content: space-around;
  backdrop-filter: blur(10px);
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.05);
  z-index: 1000;
}
.tabbar-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.tabbar-text {
  font-size: 28rpx;
  font-weight: 500;
  transition: color 0.2s;
}
.divider {
  width: 2rpx;
  height: 40rpx;
}
</style>
