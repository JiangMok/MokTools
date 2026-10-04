<template>
  <view class="comprehensive-container">
    <view class="question-container">
      <textarea class="question-input" v-model="question" placeholder="问题放在这里吧（可选）" :maxlength="200" auto-height />
    </view>

    <button class="divine-btn" @click="handleDivine">
      <text class="btn-text">🔮 一键综合占卜 🔮</text>
    </button>

    <view v-if="liurenSteps.length > 0" class="result-section liuren-section">
      <view class="section-title">📿 小六壬推算</view>
      <view class="liuren-numbers">随机数：{{ liurenNumbers.join('、') }}</view>
      <view class="liuren-steps">
        <view v-for="(step, idx) in liurenSteps" :key="idx" class="step-item">{{ step }}</view>
      </view>
      <view class="final-point">✨ 最终落点：{{ liurenFinal }} ✨</view>
    </view>

    <view v-if="ichingResult" class="result-section iching-section">
      <view class="section-title">🔯 周易六爻</view>

      <view v-if="ichingResult.hasChange" class="double-layout">
        <view class="card ben-card">
          <view class="gua-header"><text class="gua-title">本卦</text></view>
          <view class="yao-list">
            <view v-for="(item, idx) in ichingResult.benDisplay" :key="idx" class="yao-row"
              :class="{ 'yao-divider': idx === 2 }">
              <text class="score" :class="{ 'changing-score': item.isChanging }">{{ item.score }}</text>
              <text class="line" :class="{ 'changing-line': item.isChanging }">{{ item.line }}</text>
            </view>
          </view>
          <text class="gua-name">{{ ichingResult.benGua }}</text>
        </view>
        <view class="card bian-card">
          <view class="gua-header"><text class="gua-title">之卦</text></view>
          <view class="yao-list bian-list">
            <view v-for="(line, idx) in ichingResult.bianDisplay" :key="idx" class="yao-row bian-row"
              :class="{ 'yao-divider': idx === 2 }">
              <text class="line bian-line">{{ line }}</text>
            </view>
          </view>
          <text class="gua-name">{{ ichingResult.bianGua }}</text>
        </view>
      </view>

      <view v-else class="single-layout">
        <view class="card single-card">
          <view class="gua-header"><text class="gua-title">本卦</text></view>
          <view class="yao-list">
            <view v-for="(item, idx) in ichingResult.benDisplay" :key="idx" class="yao-row"
              :class="{ 'yao-divider': idx === 2 }">
              <text class="score" :class="{ 'changing-score': item.isChanging }">{{ item.score }}</text>
              <text class="line" :class="{ 'changing-line': item.isChanging }">{{ item.line }}</text>
            </view>
          </view>
          <text class="gua-name">{{ ichingResult.benGua }}</text>
        </view>
      </view>

      <view class="info-card">
        <view class="info-header">
          <text class="info-icon">📌</text>
          <text class="info-title">变爻信息</text>
        </view>
        <view v-if="ichingResult.hasChange" class="change-tags">
          <text v-for="(c, idx) in ichingResult.changeList" :key="idx" class="change-item">
            {{ c.position }} ({{ c.type }})
          </text>
        </view>
        <text v-else class="no-change">无变卦</text>
      </view>
    </view>

    <button class="copy-btn" @click="copyResult" :disabled="!liurenSteps.length && !ichingResult">
      <text class="btn-text">📋 复制综合结果</text>
    </button>

    <view class="disclaimer">
      <text>⚖️ 本工具仅供娱乐参考，请理性看待，相信科学。</text>
    </view>
    <view class="privacy-link" @click="goToPrivacy">📄 隐私政策</view>
  </view>
</template>

<script>
import { divine as ichingDivine, makePureLines, getScoreLines } from '@/utils/iching.js'

import { generateLiuren } from '@/utils/liuren.js'
import { doVibrateShort } from '@/utils/CommonUtils.js'

export default {
  name: 'Comprehensive',
  data() {
    return {
      question: '',
      liurenNumbers: [],
      liurenSteps: [],
      liurenFinal: '',
      ichingResult: null
    }
  },
  methods: {
    handleDivine() {
      doVibrateShort()

      const liuren = generateLiuren()
      this.liurenNumbers = liuren.numbers
      this.liurenSteps = liuren.steps
      this.liurenFinal = liuren.final

      const res = ichingDivine()
      const benGua = res.benGua
      const bianGua = res.bianGua
      const hasChange = res.bianGua !== null
      const changeList = res.changeList || []

      const pureLines = makePureLines(res.yaos)
      const scores = getScoreLines(res.scores)
      const changes = res.changes

      const reversedLines = [...pureLines].reverse()
      const reversedScores = [...scores].reverse()
      const reversedChanges = [...changes].reverse()

      const benDisplay = reversedLines.map((line, i) => ({
        score: reversedScores[i],
        line: line,
        isChanging: reversedChanges[i]
      }))

      let bianDisplay = []
      if (hasChange) {
        const newYaos = [...res.yaos]
        for (let i = 0; i < newYaos.length; i++) {
          if (res.changes[i]) newYaos[i] = 1 - newYaos[i]
        }
        const bianPureLines = makePureLines(newYaos)
        bianDisplay = bianPureLines.reverse()
      }

      this.ichingResult = { benGua, bianGua, hasChange, changeList, benDisplay, bianDisplay }
    },
    copyResult() {
      if (!this.liurenSteps.length && !this.ichingResult) {
        uni.showToast({ title: '请先占卜', icon: 'none' })
        return
      }
      let text = ''
      if (this.question && this.question.trim()) {
        text += `问：${this.question.trim()}\n\n`
      }
      if (this.liurenSteps.length) {
        text += `【小六壬】\n随机数：${this.liurenNumbers.join('、')}\n`
        text += `推算过程：\n${this.liurenSteps.join('\n')}\n`
        text += `最终落点：${this.liurenFinal}\n\n`
      }
      if (this.ichingResult) {
        text += `【周易六爻】\n本卦：${this.ichingResult.benGua}\n`
        if (this.ichingResult.bianGua) {
          text += `之卦：${this.ichingResult.bianGua}\n`
        }
        if (this.ichingResult.changeList.length) {
          const changeDesc = this.ichingResult.changeList.map(c => `${c.position}(${c.type})`).join('、')
          text += `变爻：${changeDesc}\n`
        } else {
          text += `无变卦\n`
        }
        text += '\n请你通过"小六壬"和"周易六爻"进行解读,不美化、不延伸、不虚构、不安慰、不升华'
      }
      uni.setClipboardData({
        data: text,
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
.comprehensive-container {
  min-height: 100%;
  background: linear-gradient(145deg, #ede7f6 0%, #d1c4e9 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30rpx 20rpx 120rpx;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.question-container {
  background: rgba(237, 231, 246, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 32rpx;
  padding: 8rpx;
  margin: 10rpx 0 16rpx;
  width: 90%;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
  border: 1rpx solid rgba(179, 157, 219, 0.6);
}
.question-input {
  background: #ffffffdd;
  border-radius: 28rpx;
  padding: 20rpx 24rpx;
  font-size: 30rpx;
  color: #311b92;
  line-height: 1.5;
  width: 100%;
  box-sizing: border-box;
  border: 1rpx solid #b39ddb;
}
.question-input:focus {
  border-color: #5e35b1;
  box-shadow: 0 0 0 2rpx rgba(94, 53, 177, 0.1);
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
  background: linear-gradient(135deg, #5e35b1, #4527a0);
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
  border: 2rpx solid #5e35b1;
  color: #5e35b1;
}
.copy-btn:active { transform: scale(0.96); }
.copy-btn .btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #5e35b1;
}
.copy-btn[disabled] { opacity: 0.6; transform: none; }
.result-section {
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(4px);
  border-radius: 48rpx;
  padding: 32rpx 28rpx;
  width: 90%;
  margin: 20rpx 0;
  box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.08);
}
.section-title {
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}
.liuren-section .section-title { color: #2e7d32; }
.iching-section .section-title { color: #5e35b1; }
.liuren-numbers, .liuren-steps, .final-point {
  font-size: 28rpx;
  color: #1b5e20;
  margin: 12rpx 0;
}
.step-item {
  padding: 8rpx 0;
  border-bottom: 1rpx dashed #a5d6a7;
}
.final-point {
  font-size: 32rpx;
  font-weight: bold;
  color: #c62828;
  margin-top: 20rpx;
  text-align: center;
}
.double-layout {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  margin: 20rpx 0;
  gap: 20rpx;
}
.card {
  box-sizing: border-box;
  min-width: 0;
  background: rgba(255, 252, 245, 0.95);
  backdrop-filter: blur(2px);
  border-radius: 36rpx;
  padding: 20rpx 12rpx;
  width: calc(50% - 10rpx);
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.08);
  border: 1rpx solid rgba(255, 255, 230, 0.6);
}
.gua-header {
  display: flex;
  justify-content: center;
  align-items: baseline;
  padding: 0 8rpx;
  margin-bottom: 12rpx;
  border-bottom: 2rpx solid #e9dbc9;
}
.gua-title { font-size: 28rpx; font-weight: bold; color: #5a3e2e; }
.yao-list { width: 100%; margin: 8rpx 0; }
.yao-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6rpx 0;
}
.score {
  font-family: 'Courier New', monospace;
  font-size: 30rpx;
  width: 56rpx;
  text-align: center;
  margin-right: 12rpx;
  color: #c2492d;
  font-weight: bold;
  background: #fff0e0;
  border-radius: 32rpx;
  padding: 2rpx 0;
  line-height: 1.4;
}
.line {
  font-family: 'Courier New', monospace;
  font-size: 36rpx;
  letter-spacing: 4rpx;
  white-space: pre;
  display: inline-block;
  min-width: 180rpx;
  text-align: center;
  color: #3a2a1e;
  font-weight: 500;
  line-height: 1.4;
}
.changing-score { color: #d42e12 !important; background: #ffede8; }
.changing-line { color: #d42e12 !important; }
.bian-row { justify-content: center; }
.bian-line { margin-left: 0; }
.gua-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #9b7b5c;
  text-align: center;
  margin-top: 16rpx;
  padding-top: 12rpx;
  border-top: 1rpx solid #efdfce;
}
.single-layout {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20rpx 0;
}
.single-card { width: 70%; max-width: 480rpx; }
.yao-divider { margin-bottom: 20rpx; position: relative; }
.yao-divider::after {
  content: '';
  position: absolute;
  bottom: -10rpx;
  left: 10%;
  width: 80%;
  height: 2rpx;
  background: #d9c8b6;
}
.info-card {
  background: rgba(255, 252, 240, 0.9);
  border-radius: 36rpx;
  padding: 20rpx 24rpx;
  margin: 24rpx 0 16rpx;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
}
.info-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}
.info-icon { font-size: 36rpx; margin-right: 8rpx; }
.info-title { font-size: 28rpx; font-weight: bold; color: #5a3e2e; }
.change-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12rpx;
  width: 100%;
  box-sizing: border-box;
}
.change-item {
  background: #efe1d0;
  padding: 6rpx 20rpx;
  border-radius: 48rpx;
  font-size: 24rpx;
  color: #7a4a2a;
  font-weight: 500;
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;
}
.no-change {
  text-align: center;
  font-size: 26rpx;
  color: #b0a088;
  padding: 8rpx;
}
.disclaimer {
  text-align: center;
  font-size: 22rpx;
  color: #6b4c3b;
  margin-top: 20rpx;
}
.privacy-link {
  text-align: center;
  font-size: 24rpx;
  color: #6b4c3b;
  margin-top: 20rpx;
  margin-bottom: 30rpx;
  text-decoration: underline;
}
@media (max-width: 500px) {
  .change-item {
    white-space: normal;
    word-break: keep-all;
    padding: 6rpx 16rpx;
  }
}
</style>
