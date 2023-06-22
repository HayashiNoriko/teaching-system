// 该文件用于创建vuex中最为核心的store

// 引入Vue
import Vue from "vue";
// 引入Vuex
import Vuex from "vuex";

// 使用Vuex插件
Vue.use(Vuex);

// 引入
import userInfoOptions from "./userInfo.js";
import cloudInfoOptions from "./cloudInfo.js";
import universityInfoOptions from "./universityInfo.js";
import courseInfoOptions from "./courseInfo.js";
import formInfoOptions from "./formInfo.js";
import manageInfoOptions from "./manageInfo.js";

// 创建并暴露/导出store
export default new Vuex.Store({
	modules: {
		userInfoOptions,
		cloudInfoOptions,
		universityInfoOptions,
		courseInfoOptions,
		formInfoOptions,
		manageInfoOptions,
	},
});
