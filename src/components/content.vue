<template>
  <div class="content mid">
    <select-box @submit="submit" :city="city" @reset="reset" :debug="debug"></select-box>
    <!-- <h2 class="sec-title">—— 豆瓣小组 ——</h2>
    <list :keyword="keyword" :city="city" :debug="debug"></list> -->
    <!-- <h2 class="sec-title">—— 其他平台 ——</h2> -->
    <my-frame :city="city" :price="price" :area="area" :keyword="keyword" :debug="debug"></my-frame>
  </div>
</template>

<script>
import SelectBox from "./SelectBox";
import List from "./List";
import MyFrame from "./myframe";
export default {
  name: "Content",
  components: { SelectBox, List,MyFrame },
  created(){
    var path = location.hash.replace('#/','');
    this.city = path;
  },
  data() {
    return {
      keyword: "",
      city:"hz",
      area:"",
      // debug:true,
      debug:false,
      price:{min:0,max:10000}
    };
  },
  methods: {
    submit(obj) {
      this.keyword = obj.keyword;
      this.price = obj.price;
      this.area = obj.area;
    },
    reset(){
      this.keyword="";
      this.price = {min:"",max:""},
      this.area = "";
    }
  },
  watch: {
    $route(to, from) {
      this.city = to.path.replace('/','');
      this.keyword = "";
      console.log(this.city);
    }
  }
};
</script>

<style scoped>
.content{
  margin-top: 20px;
  padding: 0 20px;
}
.sec-title{
  margin:30px 0 20px;
  text-align: center;
}

</style>
