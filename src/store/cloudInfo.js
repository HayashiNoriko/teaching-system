// import { nanoid } from "nanoid";
export default {
	namespaced: true,
	actions: {},
	mutations: {
		getData() {
			// 完成后正常使用资源方的已授权的云资源
			// console.log("this是", this);
			// this是他妈的Store啊
			this._vm.c1.callFunction({
				name: "getData", //调用的云函数名字
				success: (res) => {
					console.log("成功了，", res);
				},
				fail: (err) => {
					console.log("失败了，", err);
				},
			});
		},
	},
	state: {},
	getters: {},
};
