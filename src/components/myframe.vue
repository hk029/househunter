<template>
  <div class="myframe">
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane name="豆瓣小组"  label="豆瓣小组">
      <list :keyword="keyword" :city="city" :debug="debug"></list>
    </el-tab-pane>
    <el-tab-pane v-for="tab in tabs" :key="tab" :name="tab"  :label="tab" @tab-click="handleClick">
      <iframe v-if="src" :src="src" frameborder="0"></iframe>
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
      src: "https://hz.5i5j.com/zufang/n14/",
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
          if(dist["5i5j"][this.city][area]){
            this.src = this.src + `_${this.area}`;

          }
          console.log(this.src);
          break;
        case "58租房":
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
  props: ["city", "price", "area","keyword","debug"]
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
</style>

