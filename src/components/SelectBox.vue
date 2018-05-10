<template>
       <div class="select-box">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="关键词">
            <el-input v-model="form.keyword" placeholder="关键词可以用&(并且)和|(或)分隔，例如：阳台&独卫|主卧&步行街，表示需要有阳台+独卫或主卧+步行街"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
             <el-cascader
                placeholder="请选择生活区域"
                :options="form.areaOption"
                v-model="form.area"
                filterable
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

<style scoped>

</style>
