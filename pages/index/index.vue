<template>
  <view class="main-container">
    <!-- 内容区域：根据 currentTab 显示对应组件 -->
    <view v-show="currentTab === 'iching'" class="page-content">
      <IChing ref="iching" />
    </view>
    <view v-show="currentTab === 'picker'" class="page-content">
      <Picker ref="picker" />
    </view>

    <!-- 自定义底部 TabBar -->
    <CustomTabBar :theme="currentTab === 'iching' ? 'iching' : 'picker'" @tabChange="handleTabChange" />
  </view>
</template>

<script>
import IChing from '@/pages/components/IChing.vue'
import Picker from '@/pages/components/Picker.vue'
import CustomTabBar from '@/pages/components/CustomTabBar.vue'

export default {
  components: { IChing, Picker, CustomTabBar },
  data() {
    return {
      currentTab: 'iching' // 'iching' 或 'picker'
    }
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab
      // 切换时可以根据需要设置导航栏颜色和标题
      if (tab === 'iching') {
        uni.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#f9f3e6' })
        uni.setNavigationBarTitle({ title: '周易占卜' })
      } else {
        uni.setNavigationBarColor({ frontColor: '#000000', backgroundColor: '#e6f2ff' })
        uni.setNavigationBarTitle({ title: '答案选择器' })
      }
    }
  },
  onLoad() {
    // 初始化导航栏
    this.handleTabChange(this.currentTab)
  }
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f3e6; /* 默认背景，会被组件覆盖 */
}
.page-content {
  flex: 1;
  overflow-y: auto;
}
</style>