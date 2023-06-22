export default {
	namespaced: true,
	actions: {
		getForm(context, formId) {
			this._vm.c1.callFunction({
				name: "getForm", //调用的云函数名字
				data: { formId },
				success: (res) => {
					console.log("调用云函数getForm成功了，", res);
					if (res.result.data.length === 0) {
						console.log("未查询到任何form");
						context._vm.$message({
							showClose: true,
							message: "网络连接失败",
							type: "warning",
						});
						return;
					}
					context.state.form = res.result.data[0];
					console.log("formInfo中拿到的form为", context.state.form);
				},
				fail: (err) => {
					console.log("调用云函数getForm失败了，", err);
				},
			});
		},
		submitRate(
			context,
			{
				rateValues,
				rateText,
				userId,
				userType,
				courseId,
				studentOrTeacherInfo,
				submitTime,
				students,
				teacher,
				ddys,
			}
		) {
			// 计算总分
			let rate = 0;
			// console.log("看看context.state.form里有啥不", context.state.form);
			context.state.form.formText.forEach((item) => {
				item.questions.forEach((q) => {
					// console.log(
					// 	"rateValues[q.questionId - 1]为",
					// 	rateValues[q.questionId - 1]
					// );
					// console.log("q.weight为", q.weight);
					rate += (rateValues[q.questionId - 1] * 100 * q.weight) / 5;
				});
			});
			console.log("rate总分为：", rate);

			// 判断，为学生时，修改studentOrTeacherInfo下的coursesLearnObjects
			// 为教师时，修改studentOrTeacherInfo下的coursesTeachObjects和coursesSuperviseObjects
			if (userType === "XS") {
				for (
					var i = 0;
					i < studentOrTeacherInfo.coursesLearnObjects.length;
					i++
				) {
					if (
						studentOrTeacherInfo.coursesLearnObjects[i].courseId ===
						courseId
					) {
						studentOrTeacherInfo.coursesLearnObjects[i] = {
							courseId,
							rate,
							rateText,
							rateValues,
							submitTime,
						};
					}
				}
			} else {
				for (
					var i = 0;
					i < studentOrTeacherInfo.coursesTeachObjects.length;
					i++
				) {
					if (
						studentOrTeacherInfo.coursesTeachObjects[i].courseId ===
						courseId
					) {
						studentOrTeacherInfo.coursesTeachObjects[i] = {
							courseId,
							rate,
							rateText,
							rateValues,
							submitTime,
						};
					}
				}
				for (
					var i = 0;
					i < studentOrTeacherInfo.coursesSuperviseObjects.length;
					i++
				) {
					if (
						studentOrTeacherInfo.coursesSuperviseObjects[i]
							.courseId === courseId
					) {
						studentOrTeacherInfo.coursesSuperviseObjects[i] = {
							courseId,
							rate,
							rateText,
							rateValues,
							submitTime,
						};
					}
				}
			}

			console.log(
				"调用云函数submitRate之前，看一看参数",
				userId,
				studentOrTeacherInfo
			);

			// 需要修改两个表
			// 第一，通过云函数submitRate，修改users表
			this._vm.c1.callFunction({
				name: "submitRate",
				data: { userId, userType, studentOrTeacherInfo },
				success: (res) => {
					console.log("云函数submitRate调用成功", res);
					// 第二，通过另外一个云函数submitRateCourses，修改courses表
					// 方法：在CourseDetail页面里面，我们不是能拿到该course数据，然后把students、teacher、ddys都拿出来，然后对比当前的userId，修改其rate、rateText、submitTime（这个字段我还没在数据库里加入）就行了
					console.log(
						"修改前的students、teacher、ddys、userId",
						students,
						teacher,
						ddys,
						userId
					);
					// 别用forEach了，好像不能改变原数组
					for (var i = 0; i < students.length; i++) {
						if (students[i].userId === userId) {
							console.log("进入if students[i].userId === userId");
							students[i] = {
								userId,
								rate,
								rateText,
								submitTime,
								rateValues,
							};
						}
					}

					if (teacher.userId === userId) {
						teacher = {
							userId,
							rate,
							rateText,
							submitTime,
							rateValues,
						};
					}

					for (var i = 0; i < ddys.length; i++) {
						if (ddys[i].userId === userId) {
							ddys[i] = {
								userId,
								rate,
								rateText,
								submitTime,
								rateValues,
							};
						}
					}
					console.log(
						"修改后的students、teacher、ddys",
						students,
						teacher,
						ddys
					);

					this._vm.c1.callFunction({
						name: "submitRateCourses",
						data: { courseId, students, teacher, ddys },
						success: (res) => {
							console.log("云函数submitRateCourses调用成功", res);
							if (res.result.stats.updated === 0) {
								console.log("未更新任何数据");
								context.state.formState = {
									isSubmit: false,
									msg: "no",
								};
							} else {
								console.log("课程资料更改成功");
								context.state.formState = {
									isSubmit: true,
									msg: "ok",
								};
							}
						},
						fail: (err) => {
							console.log("云函数submitRateCourses调用失败", err);
							context.state.formState = {
								isSubmit: false,
								msg: "no",
							};
						},
					});
				},
				fail: (err) => {
					console.log("云函数submitRate调用失败", err);
					context.state.formState = { isSubmit: false, msg: "no" };
				},
			});
		},
		getAllForms(context, value) {
			this._vm.c1.callFunction({
				name: "getAllForms", //调用的云函数名字
				success: (res) => {
					console.log("调用云函数getAllForms成功了，", res);
					context.state.forms = res.result.data;
					console.log("allForms为", context.state.forms);
				},
				fail: (err) => {
					console.log("调用云函数getAllForms失败了，", err);
				},
			});
		},
	},
	mutations: {},
	state: {
		form: { formId: "", formText: [], formName: "" },
		formState: { isSubmit: false, msg: "waiting..." },
		forms: [],
	},
	getters: {},
};
