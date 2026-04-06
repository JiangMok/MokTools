<template>
	<view class=".picker-container picker-theme" :style="{ paddingBottom: tabBarHeight + 'px' }">
		<!-- 选项数量切换 -->
		<view class="option-tabs">
			<view class="tab-item" :class="{ active: optionCount === 2 }" @click="optionCount = 2">2个选项</view>
			<view class="tab-item" :class="{ active: optionCount === 3 }" @click="optionCount = 3">3个选项</view>
			<view class="tab-item" :class="{ active: optionCount === 4 }" @click="optionCount = 4">4个选项</view>
		</view>

		<!-- 动态输入框列表 -->
		<view class="input-list">
			<view v-for="i in optionCount" :key="i" class="input-item">
				<text class="input-label">选项{{ i }}：</text>
				<input class="input-field" v-model="options[i-1]" :placeholder="`请输入选项${i}`" />
			</view>
		</view>

		<!-- 抽取按钮 -->
		<button class="pick-btn" @click="pickRandom">
			<text class="btn-text">🎲 随机抽取答案</text>
		</button>

		<!-- 结果显示卡片 -->
		<view class="result-card" :class="{ 'animate-pulse': animateResult }" v-if="result !== null">
			<view class="result-header">本次抽取结果：</view>
			<view class="result-content">{{ result || '✨ 抽选中 ✨' }}</view>
		</view>

		<!-- 复制按钮 -->
		<!--    <button class="copy-btn" @click="copyResult" :disabled="!result">
	      <text class="btn-text">📋 复制结果</text>
	    </button> -->

		<view class="disclaimer">
			<text>🎲 随机结果仅供参考，请结合实际生活判断。</text>
		</view>
		<view class="privacy-link" @click="goToPrivacy">📄 隐私政策</view>
	</view>
</template>

<script>
	import {
		doVibrateShort
	} from '@/utils/CommonUtils.js'

	export default {
		data() {
			return {
				optionCount: 2,
				options: ['', '', '', ''],
				result: null,
				animateResult: false,
				tabBarHeight: 120 // rpx 底部预留空间
			}
		},
		onShow() {
			// 设置导航栏为浅蓝色
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#e6f2ff'
			})
			uni.setNavigationBarTitle({
				title: '答案选择器'
			})
		},
		watch: {
			optionCount(newVal) {
				for (let i = 0; i < this.options.length; i++) {
					if (i >= newVal) this.options[i] = ''
				}
				this.result = null
			}
		},
		methods: {
			pickRandom() {
				doVibrateShort()
				const validOptions = []
				for (let i = 0; i < this.optionCount; i++) {
					const val = this.options[i]?.trim()
					if (val) validOptions.push(val)
				}
				if (validOptions.length === 0) {
					uni.showToast({
						title: '请至少填写一个选项',
						icon: 'none'
					})
					return
				}
				this.result = ''
				this.animateResult = false
				this.$nextTick(() => {
					const randomIndex = Math.floor(Math.random() * validOptions.length)
					this.result = validOptions[randomIndex]
					this.animateResult = true
					setTimeout(() => {
						this.animateResult = false
					}, 300)
				})
			},
			copyResult() {
				if (!this.result) {
					uni.showToast({
						title: '暂无结果，请先抽取',
						icon: 'none'
					})
					return
				}
				uni.setClipboardData({
					data: this.result,
					success: () => uni.showToast({
						title: '已复制',
						icon: 'success'
					}),
					fail: () => uni.showToast({
						title: '复制失败',
						icon: 'none'
					})
				})
			},
			goToPrivacy() {
				uni.navigateTo({
					url: '/pages/privacy/privacy?from=index'
				})
			}
		}
	}
</script>

<style>
	/* 浅蓝色主题完整样式 */
	.picker-theme {
		background: linear-gradient(145deg, #e6f2ff 0%, #cce5ff 100%);
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	}

	.picker-theme .option-tabs {
		display: flex;
		justify-content: center;
		gap: 24rpx;
		margin: 20rpx 0 40rpx;
		background: rgba(255, 255, 255, 0.8);
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
		box-shadow: 0 4rpx 12rpx rgba(74, 125, 181, 0.3);
	}

	.picker-theme .input-list {
		width: 100%;
		margin: 20rpx 0;
	}

	.picker-theme .input-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 60rpx;
		padding: 12rpx 24rpx;
		margin: 16rpx 0;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
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

	.picker-theme .pick-btn {
		width: 80%;
		border-radius: 80rpx;
		margin: 30rpx 0 20rpx;
		padding: 20rpx 0;
		background: linear-gradient(135deg, #4a7db5, #2c5a8c);
		border: none;
		transition: all 0.2s;
	}

	.picker-theme .pick-btn:active {
		transform: scale(0.96);
	}

	.picker-theme .btn-text {
		font-size: 32rpx;
		font-weight: 600;
		color: white;
	}

	.picker-theme .result-card {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 36rpx;
		padding: 30rpx 20rpx;
		width: 90%;
		margin: 20rpx 0;
		text-align: center;
		box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
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
		background: rgba(255, 255, 255, 0.9);
		border: 2rpx solid #4a7db5;
		transition: all 0.2s;
	}

	.picker-theme .copy-btn:active {
		transform: scale(0.96);
	}

	.picker-theme .copy-btn .btn-text {
		color: #4a7db5;
	}

	.picker-theme .animate-pulse {
		animation: pulse-blue 0.3s ease-in-out;
	}

	@keyframes pulse-blue {
		0% {
			transform: scale(1);
			background: rgba(255, 255, 255, 0.95);
		}

		50% {
			transform: scale(1.02);
			background: #d9ebff;
		}

		100% {
			transform: scale(1);
			background: rgba(255, 255, 255, 0.95);
		}
	}

	.disclaimer {
		text-align: center;
		font-size: 22rpx;
		color: #b0a088;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
	}

	.privacy-link {
		text-align: center;
		font-size: 24rpx;
		color: #8b7a66;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		text-decoration: underline;
	}
</style>