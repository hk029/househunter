<template>
  <div class="list">
     <el-table
     v-loading="loading"
     element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"

    :data="tableData"
    style="width: 100%;text-align:center"
    v-if="!small">
    <el-table-column
      prop="alt"
      label="图片"
      width="250"
    >
    <template slot-scope="scope">
      <el-carousel height="200px" indicator-position="none">
        <div v-if="scope.row.imgs.length > 0">
        <el-carousel-item v-for="item in scope.row.imgs" :key="JSON.stringify(item)">
           <a :href="item.url"><img :src="item.alt" style="width:100%;height:100%"></a>
        </el-carousel-item>
        </div>
        <div v-if="scope.row.imgs.length === 0">
          <img src="../assets/default.jpg" style="width:100%;height:100%">
        </div>
      </el-carousel>
    </template>
    </el-table-column>
    <el-table-column
      label="标题"
      width="250">
     <template slot-scope="scope">
      <a :href="scope.row.url">{{scope.row.name}}</a>
      <p>发帖时间：{{scope.row.date}}</p>
    </template>
    </el-table-column>
    <el-table-column
      prop="content"
      label="描述"
    >
    <template slot-scope="scope">
       <el-popover trigger="hover" placement="top" width="200">
          <p>介绍: {{ scope.row.content }}</p>
          <div slot="reference" class="name-wrapper">
             <span class="content">{{scope.row.content}}</span>
          </div>
        </el-popover>
    </template>
    </el-table-column>
    <el-table-column
      prop="source"
      label="来源"
      width="100"
      :filters="tags"
      :filter-method="filterTag"
      filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.source === '豆瓣' ? 'success' : (scope.row.tag === '自如'?'warning':'danger')"
          disable-transitions>{{scope.row.source}}</el-tag>
      </template>
    </el-table-column>
  </el-table>

 <el-table
     v-loading="loading"
     element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"

    :data="tableData"
    style="width: 100%;text-align:center"
    v-if="small">
    <el-table-column
      prop="alt"
      label="图片"
      width="halfWidth"
    >
    <template slot-scope="scope">
      <el-carousel height="150px" indicator-position="none">
        <div v-if="scope.row.imgs.length > 0">
        <el-carousel-item v-for="item in scope.row.imgs" :key="JSON.stringify(item)" style="height:150px">
           <a :href="item.url"><img :src="item.alt" style="width:100%"></a>
        </el-carousel-item>
        </div>
        <div v-if="scope.row.imgs.length === 0">
          <img src="../assets/default.jpg" style="width:100%">
        </div>
      </el-carousel>
    </template>
    </el-table-column>
    <el-table-column
      label="房子情况"
      >
     <template slot-scope="scope">
      <i class="myico">{{scope.row.source}}</i><a :href="scope.row.url">{{scope.row.name}}</a>
      <p>发帖时间：{{scope.row.date}}</p>
    </template>
    </el-table-column>
  </el-table>

  <el-pagination
  small="small"
  :page-size=20
  :total="total"
      layout=" pager,jumper"
      :current-page="curpage"
    @current-change="pageChg"
      >
  </el-pagination>
  </div>
</template>

<script>
export default {
  name: "List",
  created() {
    var that = this;
    this.updateList();
    if(window.innerWidth<900){
      this.small = true;
      this.halfWidth = window.innerWidth/2;
      this.halfHeight = this.halfWidth*0.75 + 'px'
    }
  },
  data() {
    return {
      tags: [{ text: "豆瓣", value: "豆瓣" }, { text: "自如", value: "自如" }],
      tableData: [],
      curpage: 0,
      total:50,
      pagesize: 20,
      curCount: 0,
      loading: true,
      small:false,
      hasNext: true,
      halfWidth:200,
      halfHeight:"150px",
      busy: false,
      api: "/api"
      // api: "http://localhost:8000/api"
    };
  },
  methods: {
    getCount() {
      var that = this;
      var mykeyword = this.keyword || ".*";
      this.$http.get(`${this.api}/getCount/${this.city}?keyword=${mykeyword}`).then(response => {

        // console.log(response);
        if (response.status === 200) {
          that.total = Number(response.data.totalcount);
        }
      });
    },
    getDate(type) {
      var that = this;
      var mykeyword = this.keyword || ".*";
      this.loading = true;
      this.tableData.splice(2,this.tableData.length-2);
      this.$http
        .get( `${this.api}/getData/${this.city}?keyword=${mykeyword}&start=${(this.curpage-1) * this.pagesize}&pagesize=${this.pagesize}`)
        .then(response => {
          var topics = [];
            that.loading = false;
          if (response.status === 200) {
            // console.log(response);
            topics = response.data.data;
            that.curCount = Number(response.data.count);
            // 如果获取的数据count小于一页数目，说明是最后一页了
            if (that.curCount < that.pagesize) {
              that.hasNext = false;
            }
            that.busy = false;
            //
            if (type && type === "append") {
              that.tableData = that.tableData.concat(topics);
            } else {
              that.tableData = topics;
            }
          }
        }).catch(err=>{
            that.loading = false;
        });
    },
    updateList() {
      this.curpage = 1;
      this.getCount();
      this.getDate();
    },
    pageChg(p) {
      this.curpage = p;
      this.getDate();
    },
    filterTag(value, row) {
      return row.source === value;
    }
  },
  watch: {
    keyword(to, from) {
      // console.log(from,to);
      this.updateList();
    },
    city(){
      this.updateList();
    }
  },
  props: ["keyword","city"]
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  margin-top: 30px;
  border-radius: 5px;
  border: 1px solid #eee;
}
.list .el-table th > .cell {
  text-align: center;
}
.content {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.list .el-popover,
.list .el-popper {
  width: 200px;
}
.loading {
  width: 100%;
  margin-top: 20px;
}
.loading img {
  margin: 0 auto;
  width: 100px;
}
.list .el-pagination {
  padding: 20px 5px;
}


@media screen and (max-width: 980px) {
  .myico{
       background: #23d12b;
    border-radius: 2px;
    font-size: 6px;
    color: #fff;
    padding: 1px 2px;
    font-style: normal;
    margin-right: 4px;
  }

}
</style>
