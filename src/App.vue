<template>
  <div id="app">
    <header>
      <div class="title">
      <h2>租房猎手 v{{version}}</h2>
      <p>by <a href="http://voidsky.cc"  target="_blank">voidsky</a></p>
      </div>
    </header>
    <main>
     <div class="select-box">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="关键词">
            <el-input v-model="form.keyword" placeholder="关键词可以用&(并且)和|(或)分隔，例如：阳台&独卫|主卧&步行街，表示需要有阳台+独卫或主卧+步行街"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="请选择生活区域">
               <el-option
                v-for="item in regionOption"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价位">
            <el-select v-model="form.price" placeholder="请选择价位">
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
     <list :keyword="keyword"></list>
    </main>
    <div class="back-to-top" @click="toTop">
      <img src="./assets/rocket.svg" alt="">
    </div>
  </div>
</template>

<script>
import List from "./components/List";
export default {
  name: "App",
  components: {
    List
  },
  data() {
    return {
      version:"1.1.0",
      regionOption: [{ value: "西湖" },{ value: "滨江" }, { value: "下城" },{ value: "上城" }, { value: "江干" },  { value: "萧山" }, { value: "拱墅" }, { value: "余杭" }],
      form: {
        name: "",
        region: "",
        price:"",
        keyword:""
      },
      keyword: ""
    };
  },
  methods: {
    toTop(){
      window.scrollTo(0,0);
    },
    onSubmit() {
      // this.keyword = this.form.name.replace(' ','|');
      console.log(this.form.keyword);
      this.keyword = this.form.keyword !== ''?this.form.keyword + '&' + this.form.region:this.form.region;
    },
    reset(){
      this.form.keyword = "";
      this.form.region = "";
      this.keyword="";
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
    height: 70px;
    background: #f9f9f9;
    border-bottom: 1px solid #eee;
    box-shadow: 1px 1px 20px 0px #eee;
}
header .title{
  width:300px;
  margin:0 auto;
}
header .title h2 {
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
}
header .title p{
  text-align: right;
}
main {
  max-width: 1000px;
  padding:0 20px;
  /* text-align: center; */
  margin: 10px auto;
}
.select-box {
  text-align: left;
  padding: 10px;
  /* width: 100%; */
  border: 1px solid #ccc;
  border-radius: 5px;
}
.back-to-top{
  position:  fixed;
  right:60px;
  bottom: 80px;
  width:80px;
  height:80px;
  /* border:solid 1px #eee; */
  cursor: pointer;
}
.back-to-top img{
  width:80%;
}

.el-table th>.cell{
  text-align: center;
}
</style>
