<template>
  <div id="app" class="w">
    <router-view></router-view>
    <Footer ref="Footer" class="Footer"></Footer>

  </div>
</template>

<script>
import ReadTab from '@/components/ReadTab.vue'
import Exercises from '@/views/Exercises'
import Footer from '@/components/Footer.vue'
import User from '@/views/User.vue'
export default {
  name: 'App',
  components: {
    ReadTab, Exercises, Footer, User
  },
  data() {
    return {

    }
  },
  methods: {
    GetFooterValue(value) {
      if (value === 'My') {
        this.$router.push({ name: 'user' })
      }
      else if (value === 'Index') {
        this.$router.push({ name: 'readTab' })
      }
    }
  },
  mounted() {
    this.$router.push({ name: 'readTab' })
    this.$refs.Footer.$on('FooterTab', this.GetFooterValue) //绑定自定义事件
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

.w {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.Footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
