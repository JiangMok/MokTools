<template>
  <view class="liuren-container liuren-theme">
    <view class="question-container">
      <textarea class="question-input" v-model="question" placeholder="问题放在这里吧" :maxlength="200" auto-height />
    </view>
    <button class="divine-btn" @click="handleDivine">
      <text class="btn-text">📿 小六壬占卜 📿</text>
    </button>

    <view v-if="stepResults.length > 0" class="process-card">
      <view class="process-title">推算过程</view>
      <view v-for="(step, idx) in stepResults" :key="idx" class="process-step">
        <text>{{ step }}</text>
      </view>
      <view class="final-result">
        <text>✨ 最终落点：{{ finalResultName }} ✨</text>
      </view>
    </view>

    <view v-if="resultText" class="result-card">
      <view class="result-header">占卜结果：</view>
      <view class="result-content">{{ resultText }}</view>
    </view>

    <button class="copy-btn" @click="copyResult" :disabled="!resultText">
      <text class="btn-text">📋 复制结果</text>
    </button>

    <view class="disclaimer">
      <text>⚖️ 本工具仅供娱乐参考，请理性看待，相信科学。</text>
    </view>
    <view class="privacy-link" @click="goToPrivacy">📄 隐私政策</view>
  </view>
</template>

<script>
import { generateLiuren } from '@/utils/liuren.js'
import { doVibrateShort } from '@/utils/CommonUtils.js'

export default {
  name: 'LiuRen',
  data() {
    return {
      question: '',
      stepResults: [],
      finalResultName: '',
      resultText: ''
    }
  },
  methods: {
    handleDivine() {
      const res = generateLiuren()
      this.stepResults = res.steps
      this.finalResultName = res.final

      let result = `小六壬随机数：${res.numbers.join('、')}，落点分别是：${res.landings.join('、')}。最终落点：${res.final}。`
      if (this.question && this.question.trim()) {
        result += ` 问的是：${this.question.trim()}`
      }
      this.resultText = result
      doVibrateShort()
    },
    copyResult() {
      if (!this.resultText) {
        uni.showToast({ title: '请先占卜', icon: 'none' })
        return
      }
      uni.setClipboardData({
        data: this.resultText,
        success: () => uni.showToast({ title: '已复制', icon: 'success' }),
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
.liuren-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx 120rpx;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.liuren-theme {
  background: linear-gradient(145deg, #e8f5e9 0%, #c8e6c9 100%);
}
.question-container {
  background: rgba(200, 230, 201, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 32rpx;
  padding: 8rpx 8rpx;
  margin: 10rpx 0 16rpx;
  width: 90%;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(129, 199, 132, 0.6);
}
.question-input {
  background: #ffffffdd;
  border-radius: 28rpx;
  padding: 20rpx 24rpx;
  font-size: 30rpx;
  color: #1b5e20;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  border: 1rpx solid #a5d6a7;
}
.question-input:focus {
  border-color: #2e7d32;
  box-shadow: 0 0 0 2rpx rgba(46, 125, 50, 0.1);
}
.divine-btn, .copy-btn {
  width: 80%;
  border-radius: 80rpx;
  margin: 16rpx 0;
  padding: 20rpx 0;
  transition: all 0.2s ease;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
}
.divine-btn {
  background: linear-gradient(135deg, #388e3c, #1b5e20);
  border: none;
}
.divine-btn:active { transform: scale(0.96); }
.divine-btn .btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #fff9f0;
}
.copy-btn {
  background: rgba(255, 255, 240, 0.9);
  border: 2rpx solid #2e7d32;
  color: #2e7d32;
}
.copy-btn:active { transform: scale(0.96); }
.copy-btn .btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #2e7d32;
}
.copy-btn[disabled] { opacity: 0.6; transform: none; }
.process-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 48rpx;
  padding: 32rpx 28rpx;
  width: 90%;
  margin: 24rpx 0;
  box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.1);
  border: 1rpx solid #a5d6a7;
}
.process-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #2e7d32;
  text-align: center;
  margin-bottom: 28rpx;
  letter-spacing: 2rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.process-title::before,
.process-title::after {
  content: "✦";
  font-size: 28rpx;
  color: #81c784;
}
.process-step {
  font-size: 28rpx;
  line-height: 1.6;
  color: #1b5e20;
  margin: 16rpx 0;
  padding: 12rpx 20rpx;
  background: rgba(200, 230, 201, 0.4);
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.process-step::before {
  content: "●";
  color: #66bb6a;
  font-size: 24rpx;
  margin-right: 8rpx;
}
.final-result {
  margin-top: 28rpx;
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  background: linear-gradient(135deg, #fff9e6, #fff0d6);
  border-radius: 60rpx;
  padding: 16rpx;
  color: #c62828;
  border: 1rpx solid #ffcc80;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.final-result::before {
  content: "🏆";
  margin-right: 12rpx;
}
.result-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 48rpx;
  padding: 32rpx 28rpx;
  width: 90%;
  margin: 20rpx 0;
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid #c8e6c9;
}
.result-header {
  font-size: 30rpx;
  color: #2e7d32;
  margin-bottom: 16rpx;
  font-weight: bold;
}
.result-content {
  font-size: 32rpx;
  font-weight: bold;
  color: #1b5e20;
  word-break: break-word;
  line-height: 1.5;
}
.disclaimer {
  text-align: center;
  font-size: 22rpx;
  color: #6b4c3b;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.privacy-link {
  text-align: center;
  font-size: 24rpx;
  color: #6b4c3b;
  margin-bottom: 30rpx;
  text-decoration: underline;
}
</style>
