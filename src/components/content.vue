<template>
  <div class="content">
    <select-box @submit="submit" :city="city"></select-box>
    <list :keyword="keyword" :city="city"></list>
  </div>
</template>

<script>
import SelectBox from "./SelectBox";
import List from "./List";
export default {
  name: "Content",
  components: { SelectBox, List },
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
    getData(){

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

</style>
