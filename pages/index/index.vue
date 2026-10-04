<template>
  <view class="main-container">
    <view v-show="currentTab === 'iching'" class="page-content">
      <IChing ref="iching" :active="pageVisible && currentTab === 'iching'" />
    </view>
    <view v-show="currentTab === 'liuren'" class="page-content">
      <LiuRen ref="liuren" />
    </view>
    <view v-show="currentTab === 'comprehensive'" class="page-content">
      <Comprehensive ref="comprehensive" />
    </view>
    <view v-show="currentTab === 'picker'" class="page-content">
      <Picker ref="picker" :active="pageVisible && currentTab === 'picker'" />
    </view>
    <CustomTabBar :theme="currentTab" @tabChange="handleTabChange" />
  </view>
</template>

<script>
import IChing from '@/pages/components/IChing.vue'
import LiuRen from '@/pages/components/LiuRen.vue'
import Comprehensive from '@/pages/components/Comprehensive.vue'
import Picker from '@/pages/components/Picker.vue'
import CustomTabBar from '@/pages/components/CustomTabBar.vue'
import { getTabConfig } from '@/utils/tabConfig.js'

export default {
  components: { IChing, LiuRen, Comprehensive, Picker, CustomTabBar },
  data() {
    return {
      currentTab: 'picker',
      pageVisible: false
    }
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab
      const config = getTabConfig(tab)
      if (!config) return
      uni.setNavigationBarColor({ frontColor: '#000000', backgroundColor: config.backgroundColor })
      uni.setNavigationBarTitle({ title: config.title })
    }
  },
  onLoad() {
    this.handleTabChange(this.currentTab)
  },
  onShow() {
    this.pageVisible = true
  },
  onHide() {
    this.pageVisible = false
  },
  onUnload() {
    this.pageVisible = false
  }
}
</script>

<style scoped>
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #e6f2ff;
}
.page-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
</style>
