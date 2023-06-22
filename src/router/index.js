import Vue from "vue";
// 引入VueRouter
import VueRouter from "vue-router";
// 使用插件
Vue.use(VueRouter);
// 引入路由组件
import Home from "@/pages/Home";
import Center from "@/pages/Center";
import Login from "@/pages/Login";
import Forgot from "@/pages/Forgot";
import Address from "@/pages/Address";
import CourseDetail from "@/pages/CourseDetail";
import User from "@/pages/User";
import Register from "@/pages/Register";
import Manager from "@/pages/Manager";
import ManageUsers from "@/pages/ManageUsers";
import ManageCourses from "@/pages/ManageCourses";
import ManageForms from "@/pages/ManageForms";

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};

//配置路由
export default new VueRouter({
	routes: [
		{
			path: "/",
			redirect: "/login", //redirect 是重新定向
		},
		{
			path: "/home",
			component: Home,
		},
		{
			path: "/center",
			name: "个人中心",
			component: Center,
		},
		{
			path: "/login",
			name: "登录",
			component: Login,
		},
		{
			path: "/register",
			name: "注册",
			component: Register,
		},
		{
			path: "/forgot",
			name: "忘记密码",
			component: Forgot,
		},
		{
			path: "/address",
			name: "联系方式",
			component: Address,
		},
		{
			path: "/courseDetail",
			name: "课程详情",
			component: CourseDetail,
		},
		{
			path: "/user",
			name: "用户",
			component: User,
		},
		{
			path: "/manager",
			name: "管理",
			component: Manager,
			children: [
				{
					path: "manageUsers",
					name: "管理用户",
					component: ManageUsers,
				},
				{
					path: "manageCourses",
					component: ManageCourses,
				},
				{
					path: "manageForms",
					component: ManageForms,
				},
			],
		},
	],
});
