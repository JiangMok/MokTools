<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const agreed = uni.getStorageSync('privacy_agreed')
			if (!agreed) {
				uni.reLaunch({ url: '/pages/privacy/privacy' })
				//---弹窗
				// uni.showModal({
				// 	title: '隐私政策提示',
				// 	content: '本应用目前不收集任何个人信息，无需任何权限。请阅读应用内的《隐私政策》了解详情。',
				// 	confirmText: '同意并继续',
				// 	cancelText: '不同意',
				// 	success(res) {
				// 		if (res.confirm) {
				// 			uni.setStorageSync('privacy_agreed', true)
				// 		} else {
				// 			// #ifdef APP-PLUS
				// 			plus.runtime.quit()
				// 			// #endif
				// 			// #ifdef MP-WEIXIN
				// 			uni.showToast({
				// 				title: '请同意隐私政策后使用',
				// 				icon: 'none'
				// 			})
				// 			// #endif
				// 		}
				// 	}
				// })
			}
		}
	}
</script>

<style>
	/* 全局样式 */
	page {
		background-color: #f5f5f5;
	}
</style>