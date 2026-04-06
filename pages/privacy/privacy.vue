<template>
	<view class="container" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="custom-nav">
			<text class="title"></text>
		</view>
		<view class="back-btn" @click="goBack">返回</view>
		<view class="title">隐私政策</view>
		<view class="update-date">更新日期：2026年4月5日</view>
		<view class="content">
			<text class="section-title">一、我们目前不收集任何个人信息</text>
			<text>本应用当前版本（包括周易占卜和答案选择器功能）完全在您的设备本地运行，不使用互联网连接，不需要任何系统权限（如摄像头、存储、位置、麦克风等）。我们不会以任何方式收集、存储、上传或分享您的任何个人数据。</text>

			<text class="section-title">二、第三方SDK</text>
			<text>本应用未集成任何第三方统计、推送、广告或云服务SDK。所有功能均不依赖外部服务，因此不存在通过第三方SDK收集数据的情况。</text>

			<text class="section-title">三、未来可能增加的功能</text>
			<text>为了提升使用体验，我们未来可能会推出可选的云存储功能（例如保存占卜记录、同步选择器选项）。该功能将需要您主动注册/登录账号，并且仅在您明确同意并登录后才会将您的数据加密上传至云端。我们绝不会在未经您同意的情况下收集或上传任何数据。</text>

			<text class="section-title">四、您的权利</text>
			<text>由于我们不收集任何个人信息，因此不存在查看、更正或删除个人信息的请求。如果您未来使用云存储功能，届时我们会提供完整的数据管理工具。</text>

			<text class="section-title">五、政策变更</text>
			<text>如果我们计划引入数据收集功能，我们会通过应用内弹窗再次明确告知并获得您的同意，并更新本隐私政策。继续使用即表示您同意变更后的政策。</text>

			<text class="section-title">六、联系我们</text>
			<text>如果您对本隐私政策有任何疑问，可通过应用内反馈功能或发送邮件至 [jiangmok@qq.com] 联系我们。</text>
		</view>

		<!-- 按钮区域：仅在首次强制同意时显示，从主页跳转时不显示 -->
		<view class="button-group" v-if="showButtons">
			<button class="agree-btn" @click="agree">同意并继续</button>
			<button class="disagree-btn" @click="disagree">不同意</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showButtons: true,
				statusBarHeight: 0
			}
		},
		onLoad(options) {
			// 如果是从主页“隐私政策”链接跳转过来的，则不显示同意按钮
			if (options.from === 'index') {
				this.showButtons = false
			}
			// 获取状态栏高度
			const systemInfo = uni.getSystemInfoSync()
			this.statusBarHeight = systemInfo.statusBarHeight
		},
		methods: {
			agree() {
				uni.setStorageSync('privacy_agreed', true)
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			disagree() {
				// #ifdef APP-PLUS
				plus.runtime.quit()
				// #endif
				// #ifdef MP-WEIXIN
				uni.showModal({
					title: '提示',
					content: '需要同意隐私政策才能使用本应用',
					showCancel: false,
					success: () => {
						// 小程序无法主动退出，只能再次提示
					}
				})
				// #endif
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 30rpx;
		background-color: #ffffff;
		min-height: 100vh;
	}

	.title {
		font-size: 44rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 20rpx;
		color: #3c2a1f;
	}

	.update-date {
		text-align: center;
		font-size: 24rpx;
		color: #000000;
		margin-bottom: 40rpx;
	}

	.content {
		font-size: 28rpx;
		line-height: 1.6;
		color: #2c2c2c;
	}

	.section-title {
		display: block;
		font-weight: bold;
		margin-top: 32rpx;
		margin-bottom: 12rpx;
		color: #000000;
	}

	.button-group {
		margin-top: 60rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.agree-btn {
		background: linear-gradient(135deg, #6b4c3b, #4a3224);
		color: white;
		border-radius: 80rpx;
	}

	.disagree-btn {
		background: transparent;
		border: 2rpx solid #8b7a66;
		color: #8b7a66;
		border-radius: 80rpx;
	}

	.custom-nav {
		background-color: #f9f3e6;
		padding: 20rpx;
		text-align: center;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #3c2a1f;
	}

	.container {
		min-height: 100vh;
		background: linear-gradient(145deg, #f9f3e6, #e8e0d5);
	}
</style>