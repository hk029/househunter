<template>
  <div class="content mid">
    <select-box @submit="submit" :city="city" @reset="reset"></select-box>
    <list :keyword="keyword" :city="city"></list>
  </div>
</template>

<script>
import SelectBox from "./SelectBox";
import List from "./List";
export default {
  name: "Content",
  components: { SelectBox, List },
  created(){
    var path = location.hash.replace('#/','');
    this.city = path;
  },
  data() {
    return {
      keyword: "",
      city:"hangzhou"
    };
  },
  methods: {
    submit(word) {
      this.keyword = word;
    },
    reset(){
      this.keyword="";
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
</style>
