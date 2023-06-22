<template>
	<el-container>
		<el-header>
			<Banner
				:avatarUrl="myInfo.avatarUrl"
				:userType="myInfo.userType"
			></Banner>
		</el-header>
		<el-main>
			<el-row>
				<el-col :span="3" style="opacity: 0"> 1 </el-col>
				<el-col :span="20">
					<el-breadcrumb separator-class="el-icon-arrow-right">
						<el-breadcrumb-item to="/center">
							我的课程
						</el-breadcrumb-item>
						<el-breadcrumb-item to="/center">
							{{ courseDetail.time.term }}
						</el-breadcrumb-item>
						<el-breadcrumb-item>
							{{ courseDetail.courseName }}
						</el-breadcrumb-item>
					</el-breadcrumb>
					<el-container>
						<div class="cards">
							<el-card class="box-card">
								<div slot="header" class="clearfix">
									<div style="font-size: large">
										当前评价课程：{{
											courseDetail.courseName
										}}
									</div>
									<div>评价类型：{{ rateType }}</div>
								</div>
								<div class="text item">
									任课老师：{{ teacherName }}
								</div>
								<div class="text item">
									上课时间：<br />
									【{{ courseDetail.time.week }}】
									<span
										v-for="(d, index) in courseDetail.time
											.day"
										:key="index"
									>
										{{ d }}
									</span>
								</div>
								<div class="text item">
									教学班组成：
									<span
										v-for="(
											c, index
										) in courseDetail.classes"
										:key="index"
									>
										{{ c }}
									</span>
								</div>
								<div class="text item">
									选课人数：{{ courseDetail.students.length }}
								</div>
								<div
									v-if="disabled"
									class="textBig item"
									style="color: #67c23a"
								>
									<i class="el-icon-check"></i>
									已完成评价
								</div>
								<div
									v-else
									class="textBig item"
									style="color: #e6a23c"
								>
									<i class="el-icon-edit"></i>
									等待评价
								</div>
							</el-card>
							<el-card
								class="box-card"
								style="height: 300px"
								v-if="rateType === '教师自评'"
							>
								<div slot="header" class="clearfix">
									<div style="font-size: large">
										课程评价详情
									</div>
								</div>
								<div>
									学生评价进度
									<el-button
										type="text"
										@click="dialogFormVisible1 = true"
									>
										查看详细报告
									</el-button>
									<el-progress
										:percentage="
											(doneStudentNumber /
												courseDetail.students.length) *
											100
										"
									></el-progress>
								</div>
								<br />
								<div v-if="courseDetail.ddys.length">
									督导员评价进度
									<el-button
										type="text"
										@click="dialogFormVisible2 = true"
									>
										查看详细报告
									</el-button>
									<el-progress
										:percentage="
											(doneDdyNumber /
												courseDetail.ddys.length) *
											100
										"
									></el-progress>
								</div>
								<br />
								<div>
									综合评判结果：
									<span
										v-if="
											doneStudentNumber ==
												courseDetail.students.length &&
											doneDdyNumber ==
												courseDetail.ddys.length &&
											isRate
										"
										style="color: red"
									>
										{{ finalResult }}
									</span>
									<span v-else>
										评分尚未完成，无法查看结果
									</span>
								</div>
							</el-card>
						</div>
						<div class="divTable">
							<el-table
								v-for="(f, index) in form.formText"
								:key="index"
								:data="f.questions"
								class="tablee"
							>
								<el-table-column
									prop="questionStr"
									:label="f.type"
									width="400px"
								>
								</el-table-column>
								<el-table-column label="" prop="questionId">
									<template slot-scope="scope">
										<el-rate
											v-model="
												rateValues[
													scope.row.questionId - 1
												]
											"
											:colors="colors"
											:disabled="disabled"
										>
										</el-rate>
									</template>
								</el-table-column>
							</el-table>
							<el-table :data="hello" class="tablee">
								<el-table-column label="评语">
									<textarea
										v-model="rateText"
										placeholder="请输入评语（300字以内）"
										:disabled="disabled"
									/>
								</el-table-column>
							</el-table>
							<div class="submitBtn">
								<span
									v-show="disabled"
									style="font-size: small; color: gray"
								>
									您已于{{ submitTime }}提交了评价
								</span>
								<el-button
									type="primary"
									round
									@click="submit"
									:disabled="disabled"
								>
									提交评价
								</el-button>
							</div>
						</div>
					</el-container>
				</el-col>
				<el-col :span="1" style="opacity: 0">1</el-col>
			</el-row>
		</el-main>
		<!-- 详细报告~~~学生 -->
		<el-dialog title="学生评价详细报告" :visible.sync="dialogFormVisible1">
			<div v-for="f in showStudentForm.formText" :key="f.type">
				<h3>{{ f.type }}</h3>
				<div
					v-for="q in f.questions"
					:key="q.questionId"
					style="margin-top: 20px; margin-left: 10px"
				>
					<span>{{ q.questionStr }}</span>
					<br />
					<div style="margin-left: 10px">
						<div style="margin-top: 10px">
							<span style="float: left">1星</span>
							<el-progress
								:percentage="
									sum(countRankStudent[q.questionId - 1]) == 0
										? 0
										: (countRankStudent[
												q.questionId - 1
										  ][0] /
												sum(
													countRankStudent[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">2星</span>
							<el-progress
								:percentage="
									sum(countRankStudent[q.questionId - 1]) == 0
										? 0
										: (countRankStudent[
												q.questionId - 1
										  ][1] /
												sum(
													countRankStudent[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">3星</span>
							<el-progress
								:percentage="
									sum(countRankStudent[q.questionId - 1]) == 0
										? 0
										: (countRankStudent[
												q.questionId - 1
										  ][2] /
												sum(
													countRankStudent[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">4星</span>
							<el-progress
								:percentage="
									sum(countRankStudent[q.questionId - 1]) == 0
										? 0
										: (countRankStudent[
												q.questionId - 1
										  ][3] /
												sum(
													countRankStudent[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">5星</span>
							<el-progress
								:percentage="
									sum(countRankStudent[q.questionId - 1]) == 0
										? 0
										: (countRankStudent[
												q.questionId - 1
										  ][4] /
												sum(
													countRankStudent[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
					</div>
				</div>
			</div>
			<h3>学生文本评论</h3>
			<span v-if="!rateTextStudent.length">暂无评论……</span>
			<div v-for="(t, index) in rateTextStudent" :key="index">
				{{ index + 1 }}. {{ t }}
			</div>
		</el-dialog>
		<!-- 详细报告~~~督导员 -->
		<el-dialog title="教学督导详细报告" :visible.sync="dialogFormVisible2">
			<div v-for="f in showDdyForm.formText" :key="f.type">
				<h3>{{ f.type }}</h3>
				<div
					v-for="q in f.questions"
					:key="q.questionId"
					style="margin-top: 20px; margin-left: 10px"
				>
					<span>{{ q.questionStr }}</span>
					<br />
					<div style="margin-left: 10px">
						<div style="margin-top: 10px">
							<span style="float: left">1星</span>
							<el-progress
								:percentage="
									sum(countRankDdy[q.questionId - 1]) == 0
										? 0
										: (countRankDdy[q.questionId - 1][0] /
												sum(
													countRankDdy[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">2星</span>
							<el-progress
								:percentage="
									sum(countRankDdy[q.questionId - 1]) == 0
										? 0
										: (countRankDdy[q.questionId - 1][1] /
												sum(
													countRankDdy[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">3星</span>
							<el-progress
								:percentage="
									sum(countRankDdy[q.questionId - 1]) == 0
										? 0
										: (countRankDdy[q.questionId - 1][2] /
												sum(
													countRankDdy[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">4星</span>
							<el-progress
								:percentage="
									sum(countRankDdy[q.questionId - 1]) == 0
										? 0
										: (countRankDdy[q.questionId - 1][3] /
												sum(
													countRankDdy[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
						<div style="margin-top: 10px">
							<span style="float: left">5星</span>
							<el-progress
								:percentage="
									sum(countRankDdy[q.questionId - 1]) == 0
										? 0
										: (countRankDdy[q.questionId - 1][4] /
												sum(
													countRankDdy[
														q.questionId - 1
													]
												)) *
										  100
								"
								style="width: 300px; float: left"
							></el-progress>
						</div>
						<br />
					</div>
				</div>
			</div>
			<h3>督导员文本评论</h3>
			<span v-if="!rateTextDdy.length">暂无评论……</span>
			<div v-for="(t, index) in rateTextDdy" :key="index">
				{{ index + 1 }}. {{ t }}
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Banner from "@/components/Banner.vue";
export default {
	name: "CourseDetail",
	data() {
		return {
			activeIndex: "1",
			active: 0,
			// value: 1,
			iconClasses: [
				"icon-rate-face-1",
				"icon-rate-face-2",
				"icon-rate-face-3",
			],
			rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
			rateText: "",
			hello: [{ hi: "1234567" }], // 不要删除这一行
			disabled: false, // 是否禁用评分（当数据库中已有评分数据时，我们设置为true，禁用）
			submitTime: "", // 提交时间

			// 详细报告的对话框是否可见
			dialogFormVisible1: false,
			dialogFormVisible2: false,

			// 用户本人是否已评价
			isRate: false,
		};
	},
	computed: {
		courseDetail() {
			return this.$route.params.courseDetail;
		},
		// 评价类型分为：学生评价、教师自评、教学督导
		rateType() {
			if (this.myInfo.userType === "XS") {
				return "学生评价";
			}
			let courseId = this.courseDetail.courseId;
			if (this.myInfo.teacherInfo.coursesTeach.includes(courseId)) {
				return "教师自评";
			} else if (
				this.myInfo.teacherInfo.coursesSupervise.includes(courseId)
			) {
				return "教学督导";
			}
		},
		// 已评价学生数
		doneStudentNumber() {
			let n = 0;
			this.courseDetail.students.forEach((item) => {
				if (item.rate > 0) {
					n++;
				}
			});
			return n;
		},
		// 已评价督导员数
		doneDdyNumber() {
			let n = 0;
			this.courseDetail.ddys.forEach((item) => {
				if (item.rate > 0) {
					n++;
				}
			});
			return n;
		},

		// 查看详细报告时，展示的学生评价表单
		showStudentForm() {
			let result = {};
			this.forms.forEach((item) => {
				if (item.formId === this.courseDetail.formId) {
					result = item;
				}
			});
			return result;
		},
		// 查看详细报告时，展示的教学督导表单
		showDdyForm() {
			let result = {};
			this.forms.forEach((item) => {
				if (item.formId === this.courseDetail.formDdyId) {
					result = item;
				}
			});
			return result;
		},

		// 学生评分计数
		countRankStudent() {
			// 这是二维数组
			console.log(
				"this.courseDetail.students是undefined吗？",
				this.courseDetail.students
			);
			let resultAll = [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			];
			for (var i = 0; i < this.courseDetail.students.length; i++) {
				for (
					var j = 0;
					j < this.courseDetail.students[i].rateValues.length;
					j++
				) {
					for (let star = 1; star <= 5; star++) {
						if (
							this.courseDetail.students[i].rateValues[j] === star
						) {
							resultAll[j][star - 1]++;
						}
					}
				}
			}
			console.log("resultAll为", resultAll);
			return resultAll;
		},

		// 学生文本评论
		rateTextStudent() {
			let result = [];
			this.courseDetail.students.forEach((item) => {
				if (item.rateText) {
					result.push(item.rateText);
				}
			});
			return result;
		},

		// 督导员评分计数
		countRankDdy() {
			// 这是二维数组
			console.log(
				"this.courseDetail.ddys是undefined吗？",
				this.courseDetail.ddys
			);
			let resultAll = [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			];
			for (var i = 0; i < this.courseDetail.ddys.length; i++) {
				for (
					var j = 0;
					j < this.courseDetail.ddys[i].rateValues.length;
					j++
				) {
					for (let star = 1; star <= 5; star++) {
						if (this.courseDetail.ddys[i].rateValues[j] === star) {
							resultAll[j][star - 1]++;
						}
					}
				}
			}
			console.log("resultAll(ddys)为", resultAll);
			return resultAll;
		},
		// 督导员文本评论
		rateTextDdy() {
			let result = [];
			this.courseDetail.ddys.forEach((item) => {
				if (item.rateText) {
					result.push(item.rateText);
				}
			});
			return result;
		},
		// 综合评判结果
		// 使用模糊综合评价！！！！！！！！！
		finalResult() {
			// 先计算学生的：
			// 每一题，对1星2星3星4星5星的隶属度，也就是多少比例人投了1星，多少比例人投了2星……以此类推
			let starsStudentAll = [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			];
			for (var i = 0; i < this.countRankStudent.length; i++) {
				for (var j = 0; j < 5; j++) {
					starsStudentAll[i][j] =
						this.countRankStudent[i][j] /
						this.courseDetail.students.length;
				}
			}
			// 取出权重集
			let weights = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.showStudentForm.formText.forEach((item) => {
				item.questions.forEach((q) => {
					weights[q.questionId - 1] = q.weight;
				});
			});
			console.log("学生评价的权重集", weights);

			// 计算每个星星的隶属度（也就是把每一题每一星的隶属度乘以权重然后加起来）
			let starsStudents = [0, 0, 0, 0, 0];
			for (var i = 0; i < starsStudents.length; i++) {
				for (var j = 0; j < starsStudentAll.length; j++) {
					starsStudents[i] += starsStudentAll[j][i] * weights[j];
				}
			}
			console.log("学生的星星隶属度", starsStudents);

			// 再计算督导员的：
			// 每一题，对1星2星3星4星5星的隶属度，也就是多少比例人投了1星，多少比例人投了2星……以此类推
			let starsDdyAll = [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			];
			for (var i = 0; i < this.countRankDdy.length; i++) {
				for (var j = 0; j < 5; j++) {
					starsDdyAll[i][j] =
						this.countRankDdy[i][j] / this.courseDetail.ddys.length;
				}
			}
			console.log("督导员详细隶属度starsDdyAll", starsDdyAll);

			// 取出督导员的权重集
			let weightsDdy = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.showDdyForm.formText.forEach((item) => {
				item.questions.forEach((q) => {
					weightsDdy[q.questionId - 1] = q.weight;
				});
			});
			console.log("教学督导评价的权重集", weightsDdy);

			// 计算每个星星的隶属度（也就是把每一题每一星的隶属度乘以权重然后加起来）
			let starsDdy = [0, 0, 0, 0, 0];
			for (var i = 0; i < starsDdy.length; i++) {
				for (var j = 0; j < starsDdyAll.length; j++) {
					starsDdy[i] += starsDdyAll[j][i] * weightsDdy[j];
				}
			}
			console.log("督导员的星星隶属度", starsDdy);

			// 最后算一下教师自评的
			let starsJsAll = [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			];
			for (var i = 0; i < starsJsAll.length; i++) {
				starsJsAll[i][this.rateValues[i] - 1] = 1;
			}
			console.log("教师自评详细隶属度starsJsAll", starsJsAll);

			// 取出教师自评的权重集
			let weightsJs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			this.form.formText.forEach((item) => {
				item.questions.forEach((q) => {
					weightsJs[q.questionId - 1] = q.weight;
				});
			});
			console.log("教师自评评价的权重集", weightsJs);

			// 计算每个星星的隶属度（也就是把每一题每一星的隶属度乘以权重然后加起来）
			let starsJs = [0, 0, 0, 0, 0];
			for (var i = 0; i < starsJs.length; i++) {
				for (var j = 0; j < starsJsAll.length; j++) {
					starsJs[i] += starsJsAll[j][i] * weightsJs[j];
				}
			}
			console.log("教师自评的星星隶属度", starsJs);

			// 在论文中，我们根据专家意见，得出学生评价、教师自评、教学督导三者的权重分别为0.4、0.3、0.3
			let weightStudent = 0.4;
			let weightJs = 0.3;
			let weightDdy = 0.3;
			let starsFinal = [0, 0, 0, 0, 0];
			for (var i = 0; i < starsFinal.length; i++) {
				starsFinal[i] += starsStudents[i] * weightStudent;
				starsFinal[i] += starsJs[i] * weightJs;
				starsFinal[i] += starsDdy[i] * weightDdy;
			}
			console.log("starsFinal为", starsFinal);
			let max = Math.max(...starsFinal);
			console.log("最大值为：", max);
			let index = starsFinal.indexOf(max);
			console.log("最大值的数组下标为：" + index);
			switch (index) {
				case 0:
					return "很差";
				case 1:
					return "较差";
				case 2:
					return "中等";
				case 3:
					return "较好";
				case 4:
					return "好";
			}
		},
		...mapGetters("userInfoOptions", ["avatarUrl", "courseIds", "terms"]), // 回头删了
		...mapState("userInfoOptions", ["myInfo", "loginState"]),
		...mapState("formInfoOptions", ["form", "formState", "forms"]),
		...mapState("courseInfoOptions", ["teacherName"]),
	},
	methods: {
		handleEdit() {},
		submit() {
			console.log("用户点击了submit");

			if (this.rateValues.includes(0)) {
				this.$message({
					showClose: true,
					message: "评分未填写完整",
					type: "warning",
				});
				return;
			}

			// 提交时间
			let submitTime = new Date().toLocaleString();
			this.submitTime = submitTime;

			// 注意：需要判断userType，然后传入对应的studentInfo或teacherInfo
			if (this.myInfo.userType === "XS") {
				this.submitRate({
					rateValues: this.rateValues,
					rateText: this.rateText,
					userId: this.myInfo.userId,
					userType: this.myInfo.userType,
					courseId: this.courseDetail.courseId,
					studentOrTeacherInfo: this.myInfo.studentInfo,
					submitTime,
					students: this.courseDetail.students,
					teacher: this.courseDetail.teacher,
					ddys: this.courseDetail.ddys,
				});
			} else {
				this.submitRate({
					rateValues: this.rateValues,
					rateText: this.rateText,
					userId: this.myInfo.userId,
					userType: this.myInfo.userType,
					courseId: this.courseDetail.courseId,
					studentOrTeacherInfo: this.myInfo.teacherInfo,
					submitTime,
					students: this.courseDetail.students,
					teacher: this.courseDetail.teacher,
					ddys: this.courseDetail.ddys,
				});
			}
		},
		// 数组求和。。。。。
		sum(arr) {
			var s = 0;
			for (var i = arr.length - 1; i >= 0; i--) {
				s += arr[i];
			}
			return s;
		},
		...mapActions("formInfoOptions", [
			"getForm",
			"submitRate",
			"getAllForms",
		]),
		...mapActions("courseInfoOptions", ["getTeacherName"]),
	},
	components: { Banner },
	activated() {
		console.log("进入activated");
	},
	mounted() {
		console.log(
			"进入coursedetail页，检查一下从路由传入的参数，courseDetail有：",
			this.$route.params.courseDetail
		);
		console.log(
			"再检查一下userInfo传来的参数：",
			this.myInfo,
			this.loginState
		);
		console.log("再检查一下rateValues", this.rateValues);

		// 获取教师姓名，自动存入store里，然后我就能调用{{ teacherName }}了
		this.getTeacherName(this.courseDetail.teacher.userId);
		this.getAllForms();

		// 获取问题表单
		// 学生获取学生的表单formId，教师本人获取formJsId，督导员获取督导员的表单formDdyId
		// 这是学生
		if (this.myInfo.userType == "XS") {
			this.getForm(this.courseDetail.formId);
		} else if (this.myInfo.userId === this.courseDetail.teacher.userId) {
			// 这是教师本人的情况
			this.getForm(this.courseDetail.formJsId);
		} else {
			// 这是督导员的情况
			this.getForm(this.courseDetail.formDdyId);
		}

		// // 判断是否已评分，若已评分，则锁定页面
		// // 同样也是分学生和教师两种情况
		let courseList = [];
		if (this.myInfo.userType == "XS") {
			courseList = this.myInfo.studentInfo.coursesLearnObjects;
		} else {
			// 把所教的和所督导的课程合并起来一起计算得了。
			courseList = [
				...this.myInfo.teacherInfo.coursesTeachObjects,
				...this.myInfo.teacherInfo.coursesSuperviseObjects,
			];
		}
		console.log("courseList是：", courseList);
		courseList.forEach((item) => {
			if (item.courseId === this.courseDetail.courseId && item.rate > 0) {
				console.log("检测到课程已评价，要锁定页面");
				console.log("item.courseId:", item.courseId);
				console.log("item.rate:", item.rate);
				this.rateValues = item.rateValues;
				this.rateText = item.rateText;
				this.disabled = true;
				// this.submit = null;
				this.submitTime = item.submitTime;
				this.isRate = true;
				this.$forceUpdate();
			}
		});
	},
	watch: {
		formState(newValue, oldValue) {
			console.log("监视到formState改变，旧新值为", oldValue, newValue);
			if (newValue.isSubmit) {
				this.$message({
					showClose: true,
					message: "提交成功",
					type: "success",
				});
				// this.$forceUpdate();
				// 这个强刷好像没啥用
				this.disabled = true;
				this.submit = function () {};
			} else if (!newValue.isSubmit && newValue.msg == "no") {
				this.$message({
					showClose: true,
					message: "提交失败，请稍后再试",
					type: "error",
				});
			}
		},
	},
	// props: [""],
};
</script>

<style scoped>
.steps,
.divCourseMsg {
	margin-top: 30px;
}
.text {
	font-size: 14px;
}
.textBig {
	font-size: 20px;
	text-align: center;
	font-weight: bold;
}

.item {
	margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}
.clearfix:after {
	clear: both;
}
.box-card {
	margin-top: 30px;
	/* width: 30%; */
	height: 350px;
}
.divTable {
	float: right;
	width: 60%;
	margin-left: 30px;
	margin-top: 30px;
}
textarea {
	outline-style: none;
	border: 1px solid #c0c4cc;
	border-radius: 5px;
	width: 100%;
	height: 100px;
	padding: 0;
	padding: 10px 15px;
	box-sizing: border-box;
}

textarea:focus {
	border-color: #409eff;
	outline: 0;
	-webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), #409eff;
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), #409eff;
}
.submitBtn {
	float: right;
	margin-top: 10px;
}
.cards {
	width: 30%;
}
</style>
