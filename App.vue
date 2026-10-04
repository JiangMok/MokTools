<script>
export default {
  onLaunch: function() {
    const agreed = uni.getStorageSync('privacy_agreed')
    if (!agreed) {
      uni.reLaunch({ url: '/pages/privacy/privacy' })
    }
  }
}
</script>

<style>
page {
  background-color: #f9f3e6;
}
</style>
