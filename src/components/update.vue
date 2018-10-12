<template>
  <div class="aboutme">
    <div class="pattern-img">
      <div class="about-title">
        更新日志
      </div>
      <div class="mask"></div>
    </div>
    <div class="container">
      <div class="entry">
        <h3>v1.3.1</h3>
<ul>
<li>加入了58同城租房信息</li>
</ul>
        <h3>v1.3.0</h3>
<ul>
<li>调整了整体布局，加入了其他平台信息（5i5j)</li>
<li>调整了租房条件布局，加入了价格，同时整体做成了折叠式</li>
<li>区域内容增加了更细化的区域筛选</li>
</ul>
        <h3>v1.2.1</h3>
<ul>
<li>增加了<strong>最后一次筛选条件本地缓存</strong>功能，方便用户查找上次的内容</li>
<li>增加了关于我，更新日志页面</li>
<li>跳转地址改成在新页跳转</li>
</ul>
       <h3>v1.2.0</h3>
<ul>
<li>增加了<strong>北京</strong>的数据</li>
<li>增加了<strong>地铁线路</strong>数据</li>

</ul>
<h3>v1.1.1</h3>
<ul>
<li>修改了每页的数量，加快加载速度</li>
<li>加入了loading，提升体验</li>

</ul>
<h3>v.1.1.0</h3>
<ul>
<li>增加了多条件筛选功能</li>
<li>增加了分页功能</li>
<li>增加了回到顶部功能</li>
<li>增加了图片预览</li>
<li>修改了介绍内容过多显示不美观，改成了弹出显示</li>
<li>数据存入mongoDB</li>

</ul>
<h3>v.1.0.0</h3>
<ul>
<li>基本前端框架搭建，可以根据豆瓣api显示内容</li>
<li>每小时数据缓存，防止多次访问接口被禁止</li>

</ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Update"
};
</script>

<style scoped>
.pattern-img {
  background-image: url(http://easyread.top/20181012153931020582249.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  background-origin: border-box;
  width: 100%;
  height: 200px;
  position: relative;
}

.mask {
  width: 100%;
  height: 200px;
  background: rgba(144, 144, 144, 0.31);
  position: absolute;
  top: 0;
}

.about-title {
  text-align: center;
  font-size: 38px;
  line-height: 200px;
  color: white;
  width: 100%;
  font-family: PingFang SC, Hiragino Sans GB, Microsoft YaHei, STHeiti,
    WenQuanYi Micro Hei, Helvetica, Arial;
}

.container {
  width: 750px;
  margin: 0 auto;
  margin-top: 20px;
}

.card {
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 5px;
}

@media screen and (max-width: 980px) {
  .container {
    width: 80%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
