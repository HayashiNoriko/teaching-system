export default {
	namespaced: true,
	actions: {
		getCourseDetail(
			context,
			{ coursesLearn, coursesTeach, coursesSupervise }
		) {
			console.log(
				"courseInfo中接收到的的三个课程参数为：",
				coursesLearn,
				coursesTeach,
				coursesSupervise
			);
			this._vm.c1.callFunction({
				name: "getCourseDetail", //调用的云函数名字
				data: { courses: coursesLearn },
				success: (res) => {
					console.log(
						"成功调用云函数getCourseDetail，获取courseLearnDetail",
						res
					);
					context.commit("sortTerm", {
						originalCourses: res.result.data,
						type: "learn",
					});
				},
				fail: (err) => {
					console.log(
						"失败调用云函数getCourseDetail，获取courseLearnDetail",
						err
					);
					context._vm.$message({
						showClose: true,
						message: "网络连接失败",
						type: "warning",
					});
				},
			});
			this._vm.c1.callFunction({
				name: "getCourseDetail", //调用的云函数名字
				data: { courses: coursesTeach },
				success: (res) => {
					console.log(
						"成功调用云函数getCourseDetail，获取courseTeachDetail",
						res
					);
					context.commit("sortTerm", {
						originalCourses: res.result.data,
						type: "teach",
					});
				},
				fail: (err) => {
					console.log(
						"失败调用云函数getCourseDetail，获取courseTeachDetail",
						err
					);
					context._vm.$message({
						showClose: true,
						message: "网络连接失败",
						type: "warning",
					});
				},
			});
			this._vm.c1.callFunction({
				name: "getCourseDetail", //调用的云函数名字
				data: { courses: coursesSupervise },
				success: (res) => {
					console.log(
						"成功调用云函数getCourseDetail，获取courseSuperviseDetail",
						res
					);
					context.commit("sortTerm", {
						originalCourses: res.result.data,
						type: "supervise",
					});
				},
				fail: (err) => {
					console.log(
						"失败调用云函数getCourseDetail，获取courseSuperviseDetail",
						err
					);
					context._vm.$message({
						showClose: true,
						message: "网络连接失败",
						type: "warning",
					});
				},
			});
		},
		getTeacherName(context, userId) {
			console.log("拿到的userId是", userId);
			this._vm.c1.callFunction({
				name: "getTeacherName",
				data: { userId },
				success: (res) => {
					console.log("云函数getTeacherName调用成功", res);
					console.log("教师姓名为：", res.result.data[0].userName);
					context.state.teacherName = res.result.data[0].userName;
				},
				fail: (err) => {
					console.log("云函数getTeacherName调用失败", err);
				},
			});
		},
	},
	mutations: {
		sortTerm(state, { originalCourses, type }) {
			console.log("originalCourses为", originalCourses);
			let terms = [];
			let termIds = [];
			originalCourses.forEach((course) => {
				if (!terms.includes(course.time.term)) {
					terms.push(course.time.term);
					termIds.push(course.time.termId);
				}
			});
			console.log("terms有：", terms);
			console.log("termIds有：", termIds);
			let result = [];
			result = terms.map((term, index) => {
				return { term, termId: termIds[index], courseDetail: [] };
			});
			console.log("初步整理出term的result为：", result);
			result.forEach((item) => {
				originalCourses.forEach((course) => {
					if (item.term === course.time.term) {
						item.courseDetail.push(course);
					}
				});
			});
			result.sort((a, b) => b.termId - a.termId);
			console.log("整理完成，并按termId从新到旧排序的result为", result);
			switch (type) {
				case "learn":
					state.courseDetail.courseLearnDetail = result;
					break;
				case "teach":
					state.courseDetail.courseTeachDetail = result;
					break;
				case "supervise":
					state.courseDetail.courseSuperviseDetail = result;
					break;
				default:
					break;
			}
			console.log(
				type + "型的课程整理完毕，输出一下所有的：",
				state.courseDetail
			);
			// return result;
		},
	},
	state: {
		// terms: [],
		courseDetail: {
			courseLearnDetail: [],
			courseTeachDetail: [],
			courseSuperviseDetail: [],
		},
		teacherName: "",
	},
	getters: {},
};
