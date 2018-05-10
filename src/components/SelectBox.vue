<template>
       <div class="select-box">
        <!-- <el-form ref="form" :model="form" label-width="70px"> -->
        <el-form ref="form" :model="form" >
          <el-form-item label="关键词">
            <el-input v-model="form.keyword" placeholder="阳台&独卫|主卧，表示需要有阳台+独卫或主卧"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
             <el-cascader
                placeholder="请选择生活区域"
                :options="form.areaOption"
                v-model="form.area"
              ></el-cascader>
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
</template>

<script>
export default {
  name:"SelectBox",
  created(){
    this.updateArea()
  },
   data() {
    return {
      version:"1.1.0",
      regionOption:[],
      form: {
        name: "",
        region: "",
        price:"",
        keyword:"",
        area:[],
        areaOption:[]
      },
      api: "/api"
      // api: "http://localhost:8000/api"
    };
  },
  methods:{
    updateArea(){
      var that = this;
       this.$http.get(this.api+'/getArea/'+this.city).then(response => {
          var topics = [];
          if (response.status === 200) {
            console.log(response);
            if(response.data === ''){
              that.form.areaOption= [{label:'没有获取到数据',value:'notfound'}]
            }else{
              that.form.areaOption= response.data.area;
            }
          }
      });
    },
    onSubmit(){
      console.log(this.form.area)
      var area = this.form.area && this.form.area[this.form.area.length-1];
      area = area.replace("站","");
      var keyword = this.form.keyword !== "" ? this.form.keyword + "&" + area : area;
      console.log(keyword)


      this.$emit('submit',keyword);
    },
    reset(){
      this.form.keyword = "";
      this.form.area = [];
      this.keyword="";
      this.$emit('reset');
    }
  },
  watch: {
    city(to, from) {
      // var that = this;
      this.reset();
      this.updateArea();
    }
  },
  props: ["city"]
}
</script>

<style>
.select-box {
  text-align: left;
  padding: 22px 10px 0px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.el-form-item__content{
    margin-left: 70px;
  }
  .select-box .el-form-item__label{
    width: 70px;
  }
@media screen and (max-width: 980px) {
  .select-box .el-input__inner{
  font-size: 10px;
  }
  .el-form-item__content{
    margin-left: 60px;
  }
  .select-box .el-form-item__label{
    width: 60px;
    font-size: 12px;
  }
  .select-box .el-form-item__content{
    /* text-align: center; */
  }
}
</style>
