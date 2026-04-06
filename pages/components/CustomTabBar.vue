<template>
	<view class="custom-tabbar" :style="{ backgroundColor: bgColor }">
		<view class="tabbar-item" @click="onClick('iching')">
			<text class="tabbar-text" :style="{ color: current === 'iching' ? activeColor : inactiveColor }">🔮
				占卜</text>
		</view>
		<view class="divider" :style="{ backgroundColor: dividerColor }"></view>
		<view class="tabbar-item" @click="onClick('picker')">
			<text class="tabbar-text" :style="{ color: current === 'picker' ? activeColor : inactiveColor }">🎲
				选择器</text>
		</view>
	</view>
</template>

<script>
	import {
		doVibrateShort
	} from '@/utils/CommonUtils.js'
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
				return this.theme === 'iching' ? '#f9f3e6' : '#e6f2ff'
			},
			activeColor() {
				return this.theme === 'iching' ? '#6b4c3b' : '#4a7db5'
			},
			inactiveColor() {
				return this.theme === 'iching' ? '#b0a088' : '#8db3d6'
			},
			dividerColor() {
				return this.theme === 'iching' ? '#d9c8b6' : '#c2dcff'
			}
		},
		watch: {
			theme(newVal) {
				this.current = newVal
			}
		},
		methods: {
			onClick(tab) {
				doVibrateShort()
				if (this.current === tab) return
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
		display: flex;
		align-items: center;
		justify-content: space-around;
		backdrop-filter: blur(10px);
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
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
		font-size: 32rpx;
		font-weight: 500;
		transition: color 0.2s;
	}

	.divider {
		width: 2rpx;
		height: 40rpx;
		background-color: #d9c8b6;
	}
</style>