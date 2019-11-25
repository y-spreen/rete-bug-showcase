import Vue from "vue";
import App from "./components/App/comp.vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";

import "./custom.scss";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App)
}).$mount("#app");
