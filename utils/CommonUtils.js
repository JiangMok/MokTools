/**
 * 短震动
 */
export function doVibrateShort() {
	// 优先使用 uni-app 的震动 API
	if (uni.vibrateShort) {
		uni.vibrateShort({
			type: 'light',
			fail: () => {
				// 如果失败，尝试降级
				this.vibrateFallback()
			}
		})
	} else {
		this.vibrateFallback()
	}
}
/**
 * 长震动
 */
export function doVibrateLong() {
	// 优先使用 uni-app 的震动 API
	if (uni.vibrateLong) {
		uni.vibrateLong({
			type: 'medium',
			fail: () => {
				// 如果失败，尝试降级
				this.vibrateFallback()
			}
		})
	} else {
		this.vibrateFallback()
	}
}
/**
 * 震动失败降级策略
 */
export function vibrateFallback() {
	// #ifdef APP-PLUS
	if (typeof plus !== 'undefined' && plus.device) {
		plus.device.vibrate(50) // 震动 50 毫秒
	}
	// #endif
	// #ifdef MP-WEIXIN
	// 小程序不支持震动 fallback，忽略
	// #endif
}