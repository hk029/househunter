<template>
  <div id="app">
    <header class="top-head">
      <div class="mid">
        <div class="right-nav">
   <a href="/#/update" class="a-aboutme">更新日志</a> &nbsp | &nbsp
   <a href="/#/aboutme" class="a-aboutme">关于我&投食</a> &nbsp| &nbsp
      <el-dropdown class="city">
       <span class="el-dropdown-link"><i class="el-icon-location-outline"></i>{{city}}<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in cities" :key="item.value"><a :href="item.url">{{item.value}}</a></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        </div>
      <div class="title">
      <a href="/#/"><h2>租房猎手</h2></a>
      <p>by <a href="http://voidsky.cc"  target="_blank">voidsky</a></p>
      </div>
      </div>
    </header>
    <main>
      <router-view/>
    </main>
    <div class="back-to-top" @click="toTop">
      <img src="./assets/rocket.svg" alt="">
    </div>
    <a class="forkme" href="https://github.com/hk029/househunter"><img style="position: absolute; top: 0; left: 0; border: 0;" src="./assets/forkme.png" alt="Fork me on GitHub"></a>
  </div>
</template>

<script>
export default {
  name: "App",
  created(){
    var path = location.hash.replace('#','');
    this.city = this.cityname[path];

  },
  data() {
    return {
      version: "1.2.0",
      cities:[{value:"杭州",url:"/#/hz"},{value:"北京",url:"/#/bj"}],
      cityname:{'/bj':'北京','/hz':'杭州'},
      city:"杭州"
    };
  },
  methods: {
    toTop() {
      window.scrollTo(0, 0);
    }
  },
  watch:{
    $route(to,from){
      console.log(to);
      this.city = this.cityname[to.path];
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
.mid {
max-width: 1000px;
  /* text-align: center; */
  margin: 0 auto;
}
header.top-head {
  height: 70px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
  box-shadow: 1px 1px 20px 0px #eee;
  position: relative;
}
header{
  line-height: 70px;
}

header .right-nav{
  float: right;
  font-size: 14px;
  /* display: inline-block; */
}
header .right-nav>*{
  display: inline-block;
  /* margin-right: 10px; */
  color: #606266;
}
.select-box .el-collapse{
  border:none;
}
.select-box .el-collapse-item:last-child {
    margin-bottom: 0;
}
.select-box .el-collapse-item__header{
  text-align: center;
  font-size: 16px;
}
header .title {
    width: 200px;
    height: 70px;
    float: left;
}

header .title h2 {
  font-size: 20px;
  line-height: 40px;
  font-weight: bold;
}
header .title p {
  text-align: right;
    line-height: 10px;
}


.back-to-top {
  position: fixed;
  right: 60px;
  bottom: 80px;
  width: 80px;
  height: 80px;
  /* border:solid 1px #eee; */
  cursor: pointer;
}
.back-to-top img {
  width: 80%;
}

.el-table th > .cell {
  text-align: center;
}
iframe{
  width: 100%;
  max-width:1000px;
  height: 400px;
}

@media screen and (max-width: 1150px) {
  .title p{
    display: none;
  }

header{
  line-height: 60px;
}
  header.top-head {
    height: 60px;
  }
  header .title{
    width: 100px;
  }
  header .title h2{
    line-height: 60px;
  }
  .back-to-top {
  position: fixed;
  right: 10px;
  bottom: 30px;
  width: 40px;
  height: 40px;
  /* border:solid 1px #eee; */
  cursor: pointer;
}
  .forkme{
    display: none;
  }
}
</style>
