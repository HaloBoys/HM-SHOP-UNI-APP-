<template>
  <view>
    <!-- 搜索组件 -->
    <view class="search-box">
      <my-search @click="gotoSearch"></my-search>
    </view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类 -->
    <view class="nav_list">
      <view class="nav_item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav_img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 楼层 item 项 -->
      <view class="floor-item" v-for="(item, index) in floorList" :key="index">
        <!-- 楼层标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}"
              mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0"
              :url="item2.url">
              <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    data() {
      return {
        // 1. 轮播图的数据列表，默认为空数组
        swiperList: [],
        navList: [],
        floorList: []
      }
    },
    mixins: [badgeMix],
    onLoad() {
      // 2. 在小程序页面刚加载的时候，调用获取数据的方法
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods: {
      // 3. 获取轮播图数据的方法
      async getSwiperList() {
        // 3.1 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        // 3.3 请求成功，为 data 中的数据赋值
        this.swiperList = res.message
      },
      async getNavList() {
        // 3.1 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/catitems')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        // 3.3 请求成功，为 data 中的数据赋值
        this.navList = res.message
      },
      navClickHandler(item) {
        if (item.name == "分类") {
          uni.switchTab({
            url: "/pages/cate/cate"
          })
        }
      },
      async getFloorList() {
        // 3.1 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/floordata')
        // 3.2 请求失败
        if (res.meta.status !== 200) {
          return uni.showToast({
            title: '数据请求失败！',
            duration: 1500,
            icon: 'none',
          })
        }
        // 通过双层 forEach 循环，处理 URL 地址
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        // 3.3 请求成功，为 data 中的数据赋值
        this.floorList = res.message
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    },
  }
</script>

<style lang="scss">
  swiper {
    height: 330rpx;

    .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }

  .nav_list {
    display: flex;
    justify-content: space-between;
    margin: 15px;

    .nav_item {
      width: 128rpx;
      height: 128rpx;
    }

    .nav_img {
      width: 100%;
      height: 100%;
    }
  }

  .floor-title {
    height: 60rpx;
    width: 100%;
    display: flex;
  }

  .right-img-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
  }

  .search-box {
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的“位置”
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
</style>
