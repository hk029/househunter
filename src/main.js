// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import css from './reset.css'
import './entry.css'
import router from './router'
// import { Button, Select,Table,Cascader,Loading,Dropdown,
//   DropdownMenu,
//   DropdownItem,Form,
//   FormItem,Input,TableColumn,Pagination,Carousel,
//   CarouselItem } from 'element-ui';
// // import ElementUI from 'element-ui';
// import axios from 'axios';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(Button);
// Vue.use(Select);
// Vue.use(Table);
// Vue.use(Cascader);
// Vue.use(Loading);
// Vue.use(Dropdown);
// Vue.use(DropdownMenu);
// Vue.use(DropdownItem);
// Vue.use(Form);
// Vue.use(FormItem);
// Vue.use(Input);
// Vue.use(TableColumn);
// Vue.use(Pagination);
// Vue.use(Carousel);
// Vue.use(CarouselItem);

Vue.prototype.$http = axios;
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
