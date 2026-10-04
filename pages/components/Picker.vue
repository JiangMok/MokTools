<template>
  <view class="container picker-theme">
    <view class="option-tabs">
      <view class="tab-item" :class="{ active: optionCount === 2 }" @click="optionCount = 2">🔘 2个选项</view>
      <view class="tab-item" :class="{ active: optionCount === 3 }" @click="optionCount = 3">🔘 3个选项</view>
      <view class="tab-item" :class="{ active: optionCount === 4 }" @click="optionCount = 4">🔘 4个选项</view>
    </view>

    <view class="input-list">
      <view v-for="i in optionCount" :key="i" class="input-item">
        <text class="input-label">选项{{ i }}：</text>
        <input class="input-field" v-model="options[i-1]" :placeholder="`请输入选项${i}`" />
      </view>
    </view>

    <view class="slot-machine" v-if="slotOptions.length > 0">
      <view class="slot-window">
        <view class="slot-list" :style="{ transform: `translateY(${slotOffset}px)`, transition: slotTransition }">
          <view v-for="(opt, idx) in displayOptions" :key="idx" class="slot-item" :class="{ highlight: idx === highlightIndex }">
            {{ opt }}
          </view>
        </view>
      </view>
    </view>

    <button class="pick-btn" @click="pickRandomWithRoll" :disabled="isRolling" :loading="isRolling">
      <text class="btn-text">🎲 随机抽取答案</text>
    </button>

    <view class="result-card" v-if="result">
      <view class="result-header">本次抽取结果：</view>
      <view class="result-content">{{ result }}</view>
    </view>

    <button class="copy-btn" @click="copyCurrentTime">
      <text class="btn-text">📋 复制当前时间</text>
    </button>

    <view class="disclaimer">
      <text>🎲 随机结果仅供参考，请结合实际生活判断。</text>
    </view>
    <view class="privacy-link" @click="goToPrivacy">📄 隐私政策</view>
  </view>
</template>

<script>
import { doVibrateShort } from '@/utils/CommonUtils.js'

export default {
  name: 'Picker',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      optionCount: 2,
      options: ['', '', '', ''],
      slotOptions: [],
      displayOptions: [],
      slotOffset: 0,
      slotTransition: 'none',
      highlightIndex: -1,
      result: null,
      isRolling: false,
      rollTimer: null,
      rollVersion: 0
    }
  },
  watch: {
    active(value) {
      if (!value && this.isRolling) this.updateSlotOptions()
    },
    optionCount() {
      this.updateSlotOptions()
    },
    options: {
      deep: true,
      handler() {
        this.updateSlotOptions()
      }
    }
  },
  mounted() {
    this.updateSlotOptions()
  },
  beforeDestroy() {
    this.cancelRoll()
  },
  beforeUnmount() {
    this.cancelRoll()
  },
  methods: {
    cancelRoll() {
      this.rollVersion += 1
      if (this.rollTimer !== null) {
        clearTimeout(this.rollTimer)
        this.rollTimer = null
      }
      this.isRolling = false
      this.slotTransition = 'none'
    },
    updateSlotOptions() {
      this.cancelRoll()
      const valid = []
      for (let i = 0; i < this.optionCount; i++) {
        const val = this.options[i]?.trim()
        if (val) valid.push(val)
      }
      this.slotOptions = valid
      this.displayOptions = [...valid, ...valid, ...valid]
      this.slotOffset = 0
      this.highlightIndex = -1
      this.result = null
    },
    pickRandomWithRoll() {
      if (!this.active || this.isRolling) return
      const valid = [...this.slotOptions]
      if (valid.length === 0) {
        uni.showToast({ title: '请至少填写一个选项', icon: 'none' })
        return
      }
      this.cancelRoll()
      this.isRolling = true
      this.result = null
      this.highlightIndex = -1
      this.slotOffset = 0

      const version = this.rollVersion
      const finalIndex = Math.floor(Math.random() * valid.length)
      const finalResult = valid[finalIndex]
      const randomRolls = 5 + Math.floor(Math.random() * 6)
      const targetGlobalIndex = (randomRolls + 1) * valid.length + finalIndex
      // 补足所有滚动圈数和最终落点上下两行，避免滚到列表之外。
      const displayOptions = []
      for (let i = 0; i < randomRolls + 3; i++) {
        displayOptions.push(...valid)
      }
      this.displayOptions = displayOptions

      this.$nextTick(() => {
        if (version !== this.rollVersion || !this.active) return
        const query = uni.createSelectorQuery().in(this)
        query.select('.slot-item').boundingClientRect(data => {
          if (version !== this.rollVersion || !this.active) return
          if (!data || !Number.isFinite(data.height) || data.height <= 0) {
            this.simplePick(finalResult)
            return
          }

          this.slotTransition = 'transform 2s cubic-bezier(0.2, 0.9, 0.4, 1)'
          this.slotOffset = -(targetGlobalIndex - 1) * data.height
          this.rollTimer = setTimeout(() => {
            if (version !== this.rollVersion || !this.active) return
            this.rollTimer = null
            this.highlightIndex = targetGlobalIndex
            this.result = finalResult
            this.isRolling = false
            doVibrateShort()
          }, 2000)
        }).exec()
      })
    },
    simplePick(result) {
      this.displayOptions = [result]
      this.slotOffset = 0
      this.highlightIndex = 0
      this.result = result
      this.isRolling = false
      doVibrateShort()
    },
    copyCurrentTime() {
      const now = new Date()
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const text = `现在是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日星期${weekdays[now.getDay()]}${now.getHours()}点${now.getMinutes()}分.`
      uni.setClipboardData({
        data: text,
        success: () => uni.showToast({ title: '当前时间已复制', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' })
      })
    },
    goToPrivacy() {
      uni.navigateTo({ url: '/pages/privacy/privacy?from=index' })
    }
  }
}
</script>

<style scoped>
.picker-theme {
  background: linear-gradient(145deg, #e6f2ff 0%, #cce5ff 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx 120rpx;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.picker-theme .option-tabs {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  margin: 20rpx 0 40rpx;
  background: rgba(255,255,255,0.8);
  padding: 12rpx 24rpx;
  border-radius: 60rpx;
}
.picker-theme .tab-item {
  font-size: 30rpx;
  padding: 12rpx 28rpx;
  border-radius: 60rpx;
  background: transparent;
  color: #4a7db5;
  transition: all 0.2s;
}
.picker-theme .tab-item.active {
  background: #4a7db5;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(74,125,181,0.3);
}
.picker-theme .input-list { width: 100%; margin: 20rpx 0; }
.picker-theme .input-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.9);
  border-radius: 60rpx;
  padding: 12rpx 24rpx;
  margin: 16rpx 0;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
}
.picker-theme .input-label {
  font-size: 30rpx;
  font-weight: bold;
  color: #2c5a8c;
  width: 120rpx;
}
.picker-theme .input-field {
  flex: 1;
  font-size: 28rpx;
  background: transparent;
  padding: 12rpx 0;
  border-bottom: 2rpx solid #b8d4f0;
  text-align: center;
}
.slot-machine {
  width: 80%;
  margin: 30rpx 0;
  background: #fff8f0;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: inset 0 0 10rpx rgba(0,0,0,0.05);
}
.slot-window {
  height: 240rpx;
  overflow: hidden;
  position: relative;
  background: #fef9e6;
}
.slot-list {
  display: flex;
  flex-direction: column;
  will-change: transform;
}
.slot-item {
  box-sizing: border-box;
  flex-shrink: 0;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 36rpx;
  color: #2c5a8c;
  border-bottom: 1rpx solid #e9dbc9;
}
.slot-item.highlight {
  background: #ffe6c7;
  color: #d42e12;
  font-weight: bold;
}
.picker-theme .pick-btn {
  width: 80%;
  border-radius: 80rpx;
  margin: 30rpx 0 20rpx;
  padding: 20rpx 0;
  background: linear-gradient(135deg, #4a7db5, #2c5a8c);
  border: none;
}
.picker-theme .pick-btn:active { transform: scale(0.96); }
.picker-theme .pick-btn[disabled] { opacity: 0.6; transform: none; }
.picker-theme .btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
}
.picker-theme .result-card {
  background: rgba(255,255,255,0.95);
  border-radius: 36rpx;
  padding: 30rpx 20rpx;
  width: 90%;
  margin: 20rpx 0;
  text-align: center;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.08);
  border: 1rpx solid #c2dcff;
}
.picker-theme .result-header {
  font-size: 28rpx;
  color: #4a7db5;
  margin-bottom: 16rpx;
}
.picker-theme .result-content {
  font-size: 40rpx;
  font-weight: bold;
  color: #2c5a8c;
  word-break: break-word;
}
.picker-theme .copy-btn {
  width: 80%;
  border-radius: 80rpx;
  margin: 20rpx 0;
  padding: 20rpx 0;
  background: rgba(255,255,255,0.9);
  border: 2rpx solid #4a7db5;
}
.picker-theme .copy-btn:active { transform: scale(0.96); }
.picker-theme .copy-btn .btn-text { color: #4a7db5; }
.picker-theme .disclaimer {
  text-align: center;
  font-size: 22rpx;
  color: #6b7d8f;
  margin-top: 20rpx;
}
.picker-theme .privacy-link {
  text-align: center;
  font-size: 24rpx;
  color: #4a7db5;
  margin-top: 20rpx;
  margin-bottom: 30rpx;
  text-decoration: underline;
}
</style>
