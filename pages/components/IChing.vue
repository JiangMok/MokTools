<template>
	<view class="iching-container">
		<button class="divine-btn" @click="handleDivine">
			<text class="btn-text">✨ 占卜一下 ✨</text>
		</button>
		<view class="shake-switch">
			<text>摇一摇占卜</text>
			<switch :checked="shakeEnabled" @change="toggleShake" color="#6b4c3b" />
		</view>
		<!-- 无占卜结果时的占位卡片 -->
		<view v-if="!benGua" class="empty-state">
			<view class="empty-icon">🔮🌿</view>
			<view class="empty-title">轻触铜钱，感知易理</view>
			<view class="empty-desc">六爻随机生成，本卦变卦清晰呈现</view>
			<view class="empty-tips">
				<text>🐚 花=3 字=2 · 老阴老阳皆动</text>
				<text>📜 一键复制后给AI对话软件，深度解读</text>
			</view>
		</view>
		<!-- 双栏布局（有变卦） -->
		<view v-if="hasChange && benGua" class="double-layout">
			<view class="card ben-card">
				<view class="gua-header">
					<text class="gua-title">本卦</text>
				</view>
				<view class="yao-list">
					<view v-for="(item, idx) in benDisplay" :key="idx" class="yao-row"
						:class="{ 'yao-divider': idx === 2 }">
						<text class="score" :class="{ 'changing-score': item.isChanging }">{{ item.score }}</text>
						<text class="line" :class="{ 'changing-line': item.isChanging }">{{ item.line }}</text>
					</view>
				</view>
				<text class="gua-name">{{ benGua }}</text>
			</view>
			<view class="card bian-card">
				<view class="gua-header">
					<text class="gua-title">变卦</text>
				</view>
				<view class="yao-list bian-list">
					<view v-for="(line, idx) in bianDisplay" :key="idx" class="yao-row bian-row"
						:class="{ 'yao-divider': idx === 2 }">
						<text class="line bian-line">{{ line }}</text>
					</view>
				</view>
				<text class="gua-name">{{ bianGua }}</text>
			</view>
		</view>

		<!-- 单栏布局（无变卦） -->
		<view v-if="!hasChange && benGua" class="single-layout">
			<view class="card single-card">
				<view class="gua-header">
					<text class="gua-title">本卦</text>
				</view>
				<view class="yao-list">
					<view v-for="(item, idx) in benDisplay" :key="idx" class="yao-row"
						:class="{ 'yao-divider': idx === 2 }">
						<text class="score" :class="{ 'changing-score': item.isChanging }">{{ item.score }}</text>
						<text class="line" :class="{ 'changing-line': item.isChanging }">{{ item.line }}</text>
					</view>
				</view>
				<text class="gua-name">{{ benGua }}</text>
			</view>
		</view>

		<!-- 变爻信息卡片 -->
		<view v-if="benGua" class="info-card">
			<view class="info-header">
				<text class="info-icon">📌</text>
				<text class="info-title">变爻信息</text>
			</view>
			<view v-if="hasChange" class="change-tags">
				<text v-for="(c, idx) in changeList" :key="idx" class="change-item">
					{{ c.position }} ({{ c.type }})
				</text>
			</view>
			<text v-else class="no-change">无变卦</text>
		</view>

		<button class="copy-btn" @click="copyPrompt">
			<text class="btn-text">📋 复制解读提示词</text>
		</button>
		<view class="disclaimer">
			<text>⚖️ 本工具仅供娱乐参考，请理性看待，相信科学。</text>
		</view>
		<view class="privacy-link" @click="goToPrivacy">📄 隐私政策</view>
		<view class="bottom-space"></view>
	</view>
</template>
<script>
	import {
		divine,
		makePureLines,
		getScoreLines,
		makePrompt
	} from '@/utils/iching.js'

	import {
		doVibrateShort,
		doVibrateLong
	} from '@/utils/CommonUtils.js'

	export default {
		name: 'IChing',
		data() {
			return {
				benGua: '',
				bianGua: '',
				hasChange: false,
				changeList: [],
				benDisplay: [],
				bianDisplay: [],
				shakeEnabled: false, // 是否启用摇一摇
				lastShakeTime: 0,
				shakeThreshold: 40, // 加速度变化阈值（可调）
				shakeInterval: 10000, // 两次触发最小间隔（毫秒）
				accelerometerCallback: null // 保存回调引用
			}
		},
		onShow() {
			// 设置导航栏颜色（如果主页面未设置，可以在这里设置）
			uni.setNavigationBarColor({
				frontColor: '#000000',
				backgroundColor: '#f9f3e6'
			})
			uni.setNavigationBarTitle({
				title: '周易占卜'
			})
		},
		mounted() {
			this.startShakeListener()
		},
		beforeDestroy() {
			this.stopShakeListener()
		},
		methods: {
			// 启动加速度监听
			startShakeListener() {
				if (!this.shakeEnabled) return
				  let lastX = null, lastY = null, lastZ = null
				  this.accelerometerCallback = (res) => {
				    const x = res.x
				    const y = res.y
				    const z = res.z
				    if (lastX === null) {
				      // 第一次调用，只记录初始值，不判断
				      lastX = x
				      lastY = y
				      lastZ = z
				      return
				    }
				    const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ)
				    lastX = x
				    lastY = y
				    lastZ = z
				    const now = Date.now()
				    if (delta > this.shakeThreshold && (now - this.lastShakeTime) > this.shakeInterval) {
				      this.lastShakeTime = now
				      this.onShake()
				    }
				  }
				  uni.onAccelerometerChange(this.accelerometerCallback)
			},
			stopShakeListener() {
				if (this.accelerometerCallback) {
					uni.offAccelerometerChange(this.accelerometerCallback)
					this.accelerometerCallback = null
				}
			},
			onShake() {
				// 触发震动反馈
				if (uni.vibrateShort) {
					uni.vibrateShort({
						type: 'light'
					})
				}
				// 调用占卜
				this.handleDivine()
				// 可选：提示用户
				uni.showToast({
					title: '摇一摇占卜',
					icon: 'none',
					duration: 800
				})
			},
			handleDivine() {
				doVibrateLong()
				const res = divine()
				this.benGua = res.benGua
				this.bianGua = res.bianGua
				this.hasChange = res.bianGua !== null
				this.changeList = res.changeList || []

				const pureLines = makePureLines(res.yaos)
				const scores = getScoreLines(res.scores)
				const changes = res.changes

				const reversedLines = [...pureLines].reverse()
				const reversedScores = [...scores].reverse()
				const reversedChanges = [...changes].reverse()

				this.benDisplay = reversedLines.map((line, i) => ({
					score: reversedScores[i],
					line: line,
					isChanging: reversedChanges[i]
				}))

				if (this.hasChange) {
					const newYaos = [...res.yaos]
					for (let i = 0; i < newYaos.length; i++) {
						if (res.changes[i]) newYaos[i] = 1 - newYaos[i]
					}
					const bianPureLines = makePureLines(newYaos)
					this.bianDisplay = bianPureLines.reverse()
				} else {
					this.bianDisplay = []
				}
			},
			copyPrompt() {
				doVibrateShort()
				if (!this.benGua) {
					uni.showToast({
						title: '请先占卜',
						icon: 'none'
					})
					return
				}
				const prompt = makePrompt(this.benGua, this.bianGua, this.changeList)
				uni.setClipboardData({
					data: prompt,
					success: () => uni.showToast({
						title: '提示词已复制',
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
			},
			toggleShake(e) {
				this.shakeEnabled = e.detail.value
				if (this.shakeEnabled) {
					this.startShakeListener()
				} else {
					this.stopShakeListener()
				}
			}
		}
	}
</script>

<style>
	.iching-container {
		padding-bottom: 120rpx;
		min-height: 100vh;
		background: linear-gradient(145deg, #f9f3e6 0%, #e8e0d5 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 20rpx;
		box-sizing: border-box;
	}

	.divine-btn,
	.copy-btn {
		width: 80%;
		border-radius: 80rpx;
		margin: 16rpx 0;
		padding: 20rpx 0;
		transition: all 0.2s ease;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
	}

	.divine-btn {
		background: linear-gradient(135deg, #6b4c3b, #4a3224);
		border: none;
	}

	.divine-btn:active {
		transform: scale(0.96);
	}

	.copy-btn {
		background: rgba(255, 255, 240, 0.9);
		border: 2rpx solid #6b4c3b;
		color: #6b4c3b;
	}

	.copy-btn:active {
		transform: scale(0.96);
	}

	.btn-text {
		font-size: 32rpx;
		font-weight: 600;
	}

	.divine-btn .btn-text {
		color: #fff9f0;
	}

	.copy-btn .btn-text {
		color: #6b4c3b;
	}

	.double-layout {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
		width: 100%;
		margin: 30rpx 0 20rpx;
		gap: 20rpx;
	}

	.card {
		background: rgba(255, 252, 245, 0.95);
		backdrop-filter: blur(2px);
		border-radius: 36rpx;
		padding: 20rpx 12rpx;
		width: calc(50% - 10rpx);
		box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.08);
		transition: transform 0.2s ease;
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

	.gua-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #5a3e2e;
	}

	.yao-list {
		width: 100%;
		margin: 8rpx 0;
	}

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

	.changing-score {
		color: #d42e12 !important;
		background: #ffede8;
	}

	.changing-line {
		color: #d42e12 !important;
	}

	.bian-row {
		justify-content: center;
	}

	.bian-line {
		margin-left: 0;
	}

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
		margin: 30rpx 0;
	}

	.single-card {
		width: 70%;
		max-width: 480rpx;
	}

	.info-card {
		background: rgba(255, 252, 240, 0.9);
		border-radius: 36rpx;
		padding: 20rpx 24rpx;
		margin: 24rpx 0 16rpx;
		width: 90%;
		box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.info-header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 16rpx;
	}

	.info-icon {
		font-size: 36rpx;
		margin-right: 8rpx;
	}

	.info-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #5a3e2e;
	}

	.change-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12rpx;
	}

	.change-item {
		background: #efe1d0;
		padding: 6rpx 20rpx;
		border-radius: 48rpx;
		font-size: 24rpx;
		color: #7a4a2a;
		font-weight: 500;
	}

	.no-change {
		text-align: center;
		font-size: 26rpx;
		color: #b0a088;
		padding: 8rpx;
	}

	.bottom-space {
		height: 40rpx;
	}

	.yao-divider {
		margin-bottom: 20rpx;
		position: relative;
	}

	.yao-divider::after {
		content: '';
		position: absolute;
		bottom: -10rpx;
		left: 10%;
		width: 80%;
		height: 2rpx;
		background: #d9c8b6;
	}

	@media (max-width: 500px) {
		.card {
			padding: 16rpx 8rpx;
		}

		.gua-title {
			font-size: 24rpx;
		}

		.score {
			font-size: 26rpx;
			width: 48rpx;
			margin-right: 8rpx;
		}

		.line {
			font-size: 30rpx;
			min-width: 150rpx;
			letter-spacing: 2rpx;
		}

		.gua-name {
			font-size: 24rpx;
		}

		.double-layout {
			gap: 12rpx;
		}
	}

	.empty-state {
		background: rgba(255, 252, 240, 0.8);
		border-radius: 48rpx;
		padding: 60rpx 40rpx;
		margin: 40rpx 0;
		text-align: center;
		width: 90%;
	}

	.empty-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.empty-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #6b4c3b;
		margin-bottom: 16rpx;
	}

	.empty-desc {
		font-size: 28rpx;
		color: #8b7a66;
		margin-bottom: 30rpx;
	}

	.empty-tips {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
		font-size: 26rpx;
		color: #a99b8a;
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