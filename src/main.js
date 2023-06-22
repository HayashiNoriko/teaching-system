import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import store from "./store";

// 关闭Vue的生产提示
Vue.config.productionTip = false;

// 引入ElementUI组件库
import ElementUI from "element-ui";
// 引入ElementUI全部样式
import "element-ui/lib/theme-chalk/index.css";
// 应用ElementUI
Vue.use(ElementUI);

// 把微信云挂载到Vue原型上
// Vue.prototype.cloud = window.cloud;
// 声明新的 cloud 实例
let c1 = new window.cloud.Cloud({
	// 必填，表示是未登录模式
	identityless: true,
	// 资源方 AppID 填自己的
	resourceAppid: "wx5153624bbc494af8",
	// 资源方环境 ID	填自己的
	resourceEnv: "my-environment-7g940fk3627d95fb",
});
//初始化
c1.init();

Vue.prototype.c1 = c1;

new Vue({
	el: "#app",
	render: (h) => h(App),
	router,
	store,
});
