<template>
  <div class="myframe">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane name="豆瓣小组"  label="豆瓣小组">
      <list :keyword="keyword" :city="city" :debug="debug"></list>
    </el-tab-pane>
    <el-tab-pane v-for="tab in tabs" :key="tab" :name="tab"  :label="tab" @tab-click="handleClick">
      <iframe v-if="src" :src="src" frameborder="0"></iframe>
    </el-tab-pane>
   <el-tab-pane name="58同城"  label="58同城">
      <div class="msg">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526631778264&di=8b5e79c3a51322c4aca89f7657cfda14&imgtype=0&src=http%3A%2F%2Fwww.cnhuadong.net%2Fuploadfiles%2Fimages%2F2016-3-26%2F2016326112320jpg57993.jpg" alt="">
      <p>抱歉，由于58租房的网站限制,没办法直接给您显示租房信息,您可以点击以下按钮跳转到对应筛选条件界面</p>
      <p></p>
      <a :href="href" target="_blank"><el-button>点击跳转</el-button></a>

      </div>
    </el-tab-pane>

  </el-tabs>
    <!-- <h3 class="frame-title">{{title}}</h3> -->


  </div>
</template>
<script>
import dist from "./dist.json";
import List from "./List";
// import { constants } from 'http2';
export default {
  name: "MyFrame",
  created() {
    this.handleClick();
  },
  components: { List },
  data() {
    return {
      tabs: ["5i5j"],
      src: "",
      href:"",
      title: "5i5j",
      activeName: "豆瓣小组"
    };
  },
  methods: {
    chgSrc() {
      switch (this.activeName) {
        case "5i5j":
          var url = `https://${this.city}.5i5j.com`;
          var area = this.area || "全部";
          console.log(dist);
          if (dist["5i5j"][this.city][area]) {
            this.src = url + dist["5i5j"][this.city][area];
          }
          if (this.price.min) {
            this.src = this.src + `b${this.price.min}e${this.price.max}/`;
          }
          if (!dist["5i5j"][this.city][area]) {
            this.src = this.src + `_${this.area}`;
          }
          console.log(this.src);
          break;
        case "58租房":
          // document.domain = '58.com';
          var url = `http://${this.city}.58.com`;
          var area = this.area || "全部";
          console.log(dist);
          if (dist["58租房"][this.city][area]) {
            this.src = url + dist["58租房"][this.city][area];
          }
          if (this.price.min) {
            this.src =
              this.src + `?minprice=${this.price.min}_${this.price.max}/`;
          }
          if (!dist["58租房"][this.city][area]) {
            this.src = this.src + `?key=${this.area}`;
          }
          console.log(this.src);
          break;
       case "58同城":
          // document.domain = '58.com';
          var url = `http://${this.city}.58.com`;
          var area = this.area || "全部";
          console.log(dist);
          if (dist["58租房"][this.city][area]) {
            this.href = url + dist["58租房"][this.city][area];
          }
          if (this.price.min) {
            this.href =
              this.href + `?minprice=${this.price.min}_${this.price.max}/`;
          }
          if (!dist["58租房"][this.city][area]) {
            this.href = this.href + `?key=${this.area}`;
          }
          console.log(this.href);
          break;
      }
    },
    handleClick(tab, event) {
      console.log(this.activeName);
      this.chgSrc();
    }
  },
  watch: {
    price(to, from) {
      console.log(this.price);
      this.chgSrc();
    },
    area(to, from) {
      console.log(this.area);
      this.chgSrc();
    }
  },
  props: ["city", "price", "area", "keyword", "debug"]
};
</script>

<style scoped>
.myframe {
  width: 100%;
  margin-top: 20px;
  /* border: 1px solid #eee; */
}
.myframe iframe {
  width: 100%;
  height: 600px;
}
.myframe p {
  line-height: 25px;
  text-align: left;
  margin:10px 0;

}
.myframe .msg{
  width: 80%;
  margin:0 auto;
  padding:20px 0;
}
.myframe .msg img{
  width: 100%;
  margin:10px 0 10px;
}
</style>

