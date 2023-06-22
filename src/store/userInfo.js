// import { nanoid } from "nanoid";
export default {
	namespaced: true,
	actions: {
		register(context, value) {
			this._vm.c1.callFunction({});
			return false;
		},
		login(context, { activeName, account, password, verifyCode }) {
			// 遗留问题：verifyCode需要给手机发送短信，我们暂时无法开通，无法使用。。。
			let myInfo = {};
			this._vm.c1.callFunction({
				name: "login", //调用的云函数名字
				data: { activeName, account, password, verifyCode },
				success: (res) => {
					console.log("成功调用云函数login，", res);
					console.log(res.result.data.length);
					if (res.result.data.length === 0) {
						context.state.loginState = {
							isLogin: false,
							msg: "账号密码错误",
						};
						return;
					}
					context.state.myInfo = res.result.data[0];
					console.log(
						"userInfo.js里的myInfo是：",
						context.state.myInfo
					);
					context.state.loginState = {
						isLogin: true,
						msg: "已登录",
					};
					// context.state = { ...context.state, ...myInfo };
					// console.log(context.state);
				},
				fail: (err) => {
					console.log("失败调用云函数login，", err);
					context.state.loginState = {
						isLogin: false,
						msg: "网络连接失败",
					};
				},
			});
		},
		updateUserInfo(
			context,
			{ userId, userType, name, no, faculty, major }
		) {
			context.myInfoState = { msg: "waiting..." };
			console.log(
				"updateUserInfo方法接收到的参数有：",
				userId,
				name,
				no,
				faculty,
				major
			);

			this._vm.c1.callFunction({
				name: "updateUserInfo",
				data: { userId, userType, name, no, faculty, major },
				success: (res) => {
					console.log("云函数updateUserInfo调用成功", res);
					if (res.result.stats.updated === 0) {
						context.state.myInfoState = { msg: "no" };
						console.log("未更新任何数据");
					} else {
						console.log("个人资料更改成功");
						context.state.myInfoState = { msg: "ok" };

						// 把state里的数据也改一下咯，虽然也会改数据库的，但是靠数据库->强刷，刷不到
						if (userType === "XS") {
							context.state.myInfo.studentInfo.no = no;
						} else {
							context.state.myInfo.teacherInfo.no = no;
						}
						context.state.myInfo.userName = name;
						context.state.myInfo.faculty = faculty;
						context.state.myInfo.major = major;
					}
				},
				fail: (err) => {
					console.log("云函数updateUserInfo调用失败", err);
				},
			});
		},
		updatePassword(context, { userId, oldPassword, newPassword }) {
			context.passwordState = { msg: "waiting..." };
			console.log(
				"updatePassword中收到的参数有",
				userId,
				oldPassword,
				newPassword
			);
			this._vm.c1.callFunction({
				name: "updatePassword",
				data: { userId, oldPassword, newPassword },
				success: (res) => {
					console.log("云函数updatePassword调用成功", res);
					if (res.result.stats.updated === 0) {
						context.state.passwordState = { msg: "no" };
						console.log("未更新任何数据");
					} else {
						console.log("密码更改成功");
						context.state.passwordState = { msg: "ok" };
						context.state.myInfo.password = newPassword;
					}
				},
				fail: (err) => {
					console.log("云函数updatePassword调用失败", err);
					context.state.passwordState = { msg: "no" };
					console.log("未更新任何数据");
				},
			});
		},
	},
	mutations: {},
	state: {
		myInfo: {
			// 账号信息
			userId: "", // 由nanoid生成，前缀有 xs_ js_ gly_ 这四种
			phoneNumber: "",
			email: "",
			userName: "",
			userType: "", // XS JS GLY
			avatarUrl: "", // 默认头像： https://6d79-my-environment-7g940fk3627d95fb-1312393850.tcb.qcloud.la/%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png
			password: "",

			// 个人基本信息
			school: "",
			faculty: "",
			major: "",
			studentInfo: {
				no: "",
				className: "",
				coursesLearn: [],
				coursesLearnObjects: [],
			},
			teacherInfo: { no: "", coursesTeach: [], coursesSupervise: [] },
		},

		// 通讯信息
		loginState: { isLogin: false, msg: "waiting..." },
		passwordState: { msg: "waiting..." },
		myInfoState: { msg: "waiting..." },
	},
	getters: {
		courseIds() {
			return ["123", "456", "789"];
		},
		avatarUrl() {
			return "/img/avatar1.jpg";
		},
		terms() {
			return [
				"2019-2020 第一学期",
				"2019-2020 第二学期",
				"2020-2021 第一学期",
				"2020-2021 第二学期",
				"2021-2022 第一学期",
				"2021-2022 第二学期",
				"2022-2023 第一学期",
				"2022-2023 第二学期",
			].reverse();
		},
	},
};
