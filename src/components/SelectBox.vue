<template>
       <div class="select-box">
         <el-collapse v-model="activeNames" @change="handleChange">
  <el-collapse-item title="租房条件" name="1">
     <el-form ref="form" :model="form" >
          <el-form-item label="其他关键词">
            <el-input v-model="form.keyword" placeholder="（暂只对豆瓣有效）阳台&独卫|主卧，表示需要有阳台+独卫或主卧"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
             <el-cascader
                placeholder="请选择生活区域"
                :options="form.areaOption"
                v-model="form.area"
                change-on-select
              ></el-cascader>
          </el-form-item>
          <el-form-item label="价位">
             <el-autocomplete
             style="width:100px"
              class="inline-input"
              v-model="form.price_min"
              :fetch-suggestions="querySearch"
              placeholder="金额下限"
            ></el-autocomplete>
            -
             <el-autocomplete
              style="width:100px"
              class="inline-input"
              v-model="form.price_max"
              :fetch-suggestions="querySearch"
              placeholder="金额上限"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
  </el-collapse-item>
         </el-collapse>
        <!-- <el-form ref="form" :model="form" label-width="70px"> -->

      </div>
</template>

<script>
export default {
  name: "SelectBox",
  created() {
    console.log(this.debug);
    if (this.debug) {
      this.api = "http://localhost:8000/api";
    }
    this.updateArea();
  },
  data() {
    return {
      version: "1.1.0",
      regionOption: [],
      form: {
        name: "",
        region: "",
        price: "",
        prices: ["500-1000", "1000-2000", "2000-3000"],
        keyword: "",
        area: [],
        areaOption: [],
        price_min: "",
        price_max: ""
      },
      priceList: [
        { value: "500" },
        { value: "1000" },
        { value: "2000" },
        { value: "3000" },
        { value: "4000" },
        { value: "5000" },
        { value: "8000" },
        { value: "10000" }
      ],
      first: true,
      api: "/api"
      // api: "http://localhost:8000/api"
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var priceList = this.priceList;
      var results = queryString
        ? priceList.filter(this.createFilter(queryString))
        : priceList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return price => {
        return (
          price.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect() {
      console.log(this.form.price_min);
    },
    updateArea() {
      var that = this;
      this.$http.get(this.api + "/getArea/" + this.city).then(response => {
        var topics = [];
        if (response.status === 200) {
          if(that.debug){
            console.log(response);
          }
          if (response.data === "") {
            that.form.areaOption = [
              { label: "没有获取到数据", value: "notfound" }
            ];
          } else {
            that.form.areaOption = response.data.area;
            if (that.first) {
              that.getLocalData();
            }
          }
        }
      });
    },
    setLocalData() {
      localStorage.setItem(
        "search_data",
        JSON.stringify({
          city: this.city,
          keyword: this.form.keyword,
          area: this.form.area
        })
      );
    },
    getLocalData() {
      var data = JSON.parse(localStorage.getItem("search_data"));
      if(this.debug){
        console.log(data);
      }
      // 如果存储的数据是当前城市的数据 则更新
      if (data && data.city === this.city) {
        this.form.keyword = data.keyword;
        this.form.area = data.area;
        this.onSubmit();
      }
    },
    onSubmit() {
      // console.log(this.form.area)
      var area = this.form.area && this.form.area[this.form.area.length - 1];
      // area = area&&area.replace("站","");
      var keyword =
        this.form.keyword !== "" ? this.form.keyword + "&" + area : area;
      this.setLocalData();
      keyword = keyword && keyword.replace("全部", "");
      console.log(keyword);
      if (
        isNaN(Number(this.form.price_min)) ||
        isNaN(Number(this.form.price_max)) ||
        Number(this.form.price_min) > Number(this.form.price_max)
      ) {
        this.$message.error("金额输入错误");
      } else {
        this.$emit("submit", {
          keyword: keyword,
          price: { min: this.form.price_min, max: this.form.price_max },
          area: area
        });
      }
    },
    reset() {
      this.form.keyword = "";
      this.form.area = [];
      this.keyword = "";
      this.$emit("reset");
    }
  },
  watch: {
    city(to, from) {
      // var that = this;
      this.reset();
      this.updateArea();
    }
  },
  props: ["city", "debug"]
};
</script>

<style>
.select-box {
  text-align: left;
  padding: 5px 10px 0px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.el-form-item__content {
  margin-left: 85px;
}
.select-box .el-form-item__label {
  width: 85px;
}
@media screen and (max-width: 980px) {
  .select-box .el-input__inner {
    font-size: 10px;
  }
  .el-form-item__content {
    margin-left: 75px;
  }
  .select-box .el-form-item__label {
    width: 75px;
    font-size: 12px;
  }
  .select-box .el-form-item__content {
    /* text-align: center; */
  }
}
</style>
