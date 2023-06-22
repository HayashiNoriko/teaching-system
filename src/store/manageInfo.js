export default {
	namespaced: true,
	actions: {
		// 获取所有学生信息
		getAllStudentsData(context, value) {
			this._vm.c1.callFunction({
				name: "getAllStudentsData", //调用的云函数名字
				success: (res) => {
					console.log("云函数getAllStudentsData调用成功，", res);
					context.state.studentsData = res.result.data;
				},
				fail: (err) => {
					console.log("云函数getAllStudentsData调用失败，", err);
				},
			});
		},
		// 获取所有教师信息
		getAllTeachersData(context, value) {
			this._vm.c1.callFunction({
				name: "getAllTeachersData", //调用的云函数名字
				success: (res) => {
					console.log("云函数getAllTeachersData调用成功，", res);
					context.state.teachersData = res.result.data;
				},
				fail: (err) => {
					console.log("云函数getAllTeachersData调用失败，", err);
				},
			});
		},

		// 添加用户
		addUser(context, form) {
			console.log("manageInfo.js中拿到form为", form);
			this._vm.c1.callFunction({
				name: "addUser", //调用的云函数名字
				data: { ...form },
				success: (res) => {
					console.log("云函数addUser调用成功，", res);
					context.dispatch("getAllStudentsData");
					context.dispatch("getAllTeachersData");
				},
				fail: (err) => {
					console.log("云函数addUser调用失败，", err);
				},
			});
		},

		// 修改用户信息
		updateUser(context, editInfo) {
			console.log("manageInfo.js中拿到editInfo为", editInfo);
			this._vm.c1.callFunction({
				name: "updateUser", //调用的云函数名字
				data: { ...editInfo },
				success: (res) => {
					console.log("云函数updateUser调用成功，", res);
					context.dispatch("getAllStudentsData");
					context.dispatch("getAllTeachersData");
				},
				fail: (err) => {
					console.log("云函数updateUser调用失败，", err);
				},
			});
		},

		// 获取所有课程信息
		getAllCoursesData(context, value) {
			this._vm.c1.callFunction({
				name: "getAllCoursesData", //调用的云函数名字
				success: (res) => {
					console.log("云函数getAllCoursesData调用成功，", res);
					context.state.coursesData = res.result.data;
				},
				fail: (err) => {
					console.log("云函数getAllCoursesData调用失败，", err);
				},
			});
		},

		// 获取所有表单信息
		getAllFormsData(context, value) {
			this._vm.c1.callFunction({
				name: "getAllFormsData", //调用的云函数名字
				success: (res) => {
					console.log("云函数getAllFormsData调用成功，", res);
					context.state.formsData = res.result.data;
				},
				fail: (err) => {
					console.log("云函数getAllFormsData调用失败，", err);
				},
			});
		},

		// 添加课程
		addCourse(context, form) {
			console.log("manageInfo.js中拿到form（课程）为", form);
			this._vm.c1.callFunction({
				name: "addCourse", //调用的云函数名字
				data: { form },
				success: (res) => {
					console.log("云函数addCourse调用成功，", res);
					context.dispatch("getAllCoursesData");
				},
				fail: (err) => {
					console.log("云函数addCourse调用失败，", err);
				},
			});
		},

		// 修改课程信息
		// 【bug：只能修改基本信息，不能修改人。。。】
		updateCourse(context, form) {
			console.log("manageInfo.js中拿到form（修改课程信息）为", form);
			this._vm.c1.callFunction({
				name: "updateCourse", //调用的云函数名字
				data: { form },
				success: (res) => {
					console.log("云函数updateCourse调用成功，", res);
					context.dispatch("getAllCoursesData");
				},
				fail: (err) => {
					console.log("云函数updateCourse调用失败，", err);
				},
			});
		},
	},
	mutations: {
		// 获取某一个用户的课程的信息（不需要发送请求了）
		getUserCoursesData(state, user) {
			state.userCoursesData = [];
			console.log("state.userCoursesData是", state.userCoursesData);
			if (user.userType === "XS") {
				state.coursesData.forEach((element) => {
					if (
						user.studentInfo.coursesLearn.includes(element.courseId)
					) {
						// 这里追加了一个属性courseType，用于区分这门课是学生评价、教师自评还是教学督导
						// 还追加了一个属性isRank，用于注明是否已评价
						let isRank = "否";
						user.studentInfo.coursesLearnObjects.forEach((item) => {
							if (
								item.courseId === element.courseId &&
								item.rate > 0
							) {
								isRank = "是";
							}
						});
						state.userCoursesData.push({
							rankType: "学生评价",
							isRank,
							...element,
						});
					}
				});
			} else {
				state.coursesData.forEach((element) => {
					if (
						user.teacherInfo.coursesTeach.includes(element.courseId)
					) {
						let isRank = "否";
						user.teacherInfo.coursesTeachObjects.forEach((item) => {
							if (
								item.courseId === element.courseId &&
								item.rate > 0
							) {
								isRank = "是";
							}
						});
						state.userCoursesData.push({
							rankType: "教师自评",
							isRank,
							...element,
						});
					}
				});
				state.coursesData.forEach((element) => {
					if (
						user.teacherInfo.coursesSupervise.includes(
							element.courseId
						)
					) {
						let isRank = "否";
						user.teacherInfo.coursesSuperviseObjects.forEach(
							(item) => {
								if (
									item.courseId === element.courseId &&
									item.rate > 0
								) {
									isRank = "是";
								}
							}
						);
						state.userCoursesData.push({
							rankType: "教学督导",
							isRank,
							...element,
						});
					}
				});
			}
			for (var i = 0; i < state.userCoursesData.length; i++) {
				state.teachersData.forEach((teacherObject) => {
					if (
						teacherObject.userId ===
						state.userCoursesData[i].teacher.userId
					) {
						state.userCoursesData[i].teacher = {
							name: teacherObject.userName,
							no: teacherObject.teacherInfo.no,
							...state.userCoursesData[i].teacher,
						};
					}
				});
			}
			console.log("得到的userCoursesData有：", state.userCoursesData);
		},
	},
	state: {
		studentsData: [],
		teachersData: [],
		coursesData: [],
		formsData: [],
		userCoursesData: [],
	},
	getters: {},
};
