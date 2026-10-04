<template>
  <view class="custom-tabbar" :style="{ backgroundColor: bgColor }">
    <view class="tabbar-item" @click="onClick('iching')">
      <text class="tabbar-text" :style="{ color: current === 'iching' ? activeColor : inactiveColor }">🔮 占卜</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('liuren')">
      <text class="tabbar-text" :style="{ color: current === 'liuren' ? activeColor : inactiveColor }">📿 小六壬</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('comprehensive')">
      <text class="tabbar-text" :style="{ color: current === 'comprehensive' ? activeColor : inactiveColor }">🔯 综合</text>
    </view>
    <view class="divider" :style="{ backgroundColor: dividerColor }"></view>
    <view class="tabbar-item" @click="onClick('picker')">
      <text class="tabbar-text" :style="{ color: current === 'picker' ? activeColor : inactiveColor }">🎲 选择器</text>
    </view>
  </view>
</template>

<script>
import { doVibrateShort } from '@/utils/CommonUtils.js'

export default {
  props: {
    theme: {
      type: String,
      default: 'iching'
    }
  },
  data() {
    return {
      current: this.theme
    }
  },
  computed: {
    bgColor() {
      if (this.current === 'iching') return '#f9f3e6'
      if (this.current === 'liuren') return '#e8f5e9'
      if (this.current === 'comprehensive') return '#ede7f6'
      if (this.current === 'picker') return '#e6f2ff'
      return '#f9f3e6'
    },
    activeColor() {
      if (this.current === 'iching') return '#6b4c3b'
      if (this.current === 'liuren') return '#2e7d32'
      if (this.current === 'comprehensive') return '#5e35b1'
      if (this.current === 'picker') return '#4a7db5'
      return '#6b4c3b'
    },
    inactiveColor() {
      if (this.current === 'iching') return '#b0a088'
      if (this.current === 'liuren') return '#a5d6a7'
      if (this.current === 'comprehensive') return '#b39ddb'
      if (this.current === 'picker') return '#8db3d6'
      return '#b0a088'
    },
    dividerColor() {
      if (this.current === 'iching') return '#d9c8b6'
      if (this.current === 'liuren') return '#c8e6c9'
      if (this.current === 'comprehensive') return '#d1c4e9'
      if (this.current === 'picker') return '#c2dcff'
      return '#d9c8b6'
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
