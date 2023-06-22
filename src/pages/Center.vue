<template>
	<el-container>
		<el-header>
			<Banner
				:avatarUrl="myInfo.avatarUrl"
				:userType="myInfo.userType"
				pageUrl="/center"
				:school="myInfo.school"
			></Banner>
		</el-header>
		<el-main>
			<el-row>
				<el-col :span="3" style="opacity: 0">1</el-col>
				<el-col :span="18">
					<el-container>
						<el-header>
							<el-input
								placeholder="搜索课程"
								prefix-icon="el-icon-search"
								v-model="searchMsg"
								class="add search"
								size="medium"
							>
							</el-input>
						</el-header>
					</el-container>
					<el-tabs v-model="activeName">
						<el-tab-pane
							v-if="
								myInfo.userType == 'XS' &&
								myInfo.studentInfo.coursesLearn.length > 0
							"
							label="所学课程"
							name="first"
						>
							<el-collapse v-model="activeNames1">
								<el-collapse-item
									v-for="(
										term, index
									) in courseDetail.courseLearnDetail"
									:key="index"
									:title="term.term"
									:name="index"
								>
									<el-row>
										<div
											v-for="(
												c, index2
											) in term.courseDetail"
											:key="index2"
										>
											<router-link
												:to="{
													// 若携带params参数，此处只能用name，用path会报错。（query参数没事）
													name: '课程详情',
													params: {
														courseDetail: c,
													},
												}"
											>
												<CourseCard
													class="courseCard"
													:courseName="c.courseName"
													:classes="c.classes"
													:teacherId="c.teacherId"
													:pictureUrl="c.pictureUrl"
												/>
											</router-link>
										</div>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</el-tab-pane>
						<el-tab-pane
							v-if="
								myInfo.userType == 'JS' &&
								myInfo.teacherInfo.coursesTeach.length > 0
							"
							label="所教课程"
							name="second"
						>
							<el-collapse v-model="activeNames2">
								<el-collapse-item
									v-for="(
										term, index
									) in courseDetail.courseTeachDetail"
									:key="index"
									:title="term.term"
									:name="index"
								>
									<el-row>
										<div
											v-for="(
												c, index2
											) in term.courseDetail"
											:key="index2"
										>
											<router-link
												:to="{
													// 若携带params参数，此处只能用name，用path会报错。（query参数没事）
													name: '课程详情',
													params: {
														courseDetail: c,
													},
												}"
											>
												<CourseCard
													class="courseCard"
													:courseName="c.courseName"
													:classes="c.classes"
													:teacherId="c.teacherId"
													:pictureUrl="c.pictureUrl"
												/>
											</router-link>
										</div>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</el-tab-pane>
						<el-tab-pane
							v-if="
								myInfo.userType == 'JS' &&
								myInfo.teacherInfo.coursesSupervise.length > 0
							"
							label="督导课程"
							name="third"
						>
							<el-collapse v-model="activeNames3">
								<el-collapse-item
									v-for="(
										term, index
									) in courseDetail.courseSuperviseDetail"
									:key="index"
									:title="term.term"
									:name="index"
								>
									<el-row>
										<div
											v-for="(
												c, index2
											) in term.courseDetail"
											:key="index2"
										>
											<router-link
												:to="{
													// 若携带params参数，此处只能用name，用path会报错。（query参数没事）
													name: '课程详情',
													params: {
														courseDetail: c,
													},
												}"
											>
												<CourseCard
													class="courseCard"
													:courseName="c.courseName"
													:classes="c.classes"
													:teacherId="c.teacherId"
													:pictureUrl="c.pictureUrl"
												/>
											</router-link>
										</div>
									</el-row>
								</el-collapse-item>
							</el-collapse>
						</el-tab-pane>
					</el-tabs>
				</el-col>
				<el-col :span="3"></el-col>
			</el-row>
		</el-main>
		<el-footer style="opacity: 0"> Footer </el-footer>
	</el-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import CourseCard from "@/components/CourseCard.vue";
import Banner from "@/components/Banner.vue";
export default {
	name: "Center",
	data() {
		return {
			activeName: "", // “所学课程”、“所教课程”、“督导课程”的active
			searchMsg: "",
			activeNames1: [0], // “所学课程”展开的学期
			activeNames2: [0], // “所教课程”展开的学期
			activeNames3: [0], // “督导课程”展开的学期
			terms: [],
		};
	},
	computed: {
		...mapState("userInfoOptions", ["myInfo", "loginState"]),
		...mapState("courseInfoOptions", ["courseDetail"]),
	},
	methods: {
		...mapActions("courseInfoOptions", ["getCourseDetail"]),
	},
	mounted() {
		console.log("center组件已mounted");
		console.log("loginState为：", this.loginState);
		console.log("center组件中的myInfo为", this.myInfo);

		// 检查登录状态
		if (!this.loginState.isLogin) {
			this.$message({
				showClose: true,
				message: "请先登录",
				type: "warning",
			});
			this.$router.replace({
				name: "登录",
			});
			return;
		}

		// 若为管理员，则跳转到/manager页面
		if (this.myInfo.userType === "GLY") {
			this.$router.replace({
				name: "管理用户",
				params: {
					myInfo: this.myInfo,
				},
			});
			return;
		}

		// 加载课程信息
		let coursesLearn = [];
		let coursesTeach = [];
		let coursesSupervise = [];
		if (this.myInfo.userType === "XS") {
			coursesLearn = this.myInfo.studentInfo.coursesLearn;
		} else {
			coursesTeach = this.myInfo.teacherInfo.coursesTeach;
			coursesSupervise = this.myInfo.teacherInfo.coursesSupervise;
		}
		console.log(
			"center组件中传入的三个课程参数为：",
			coursesLearn,
			coursesTeach,
			coursesSupervise
		);
		this.getCourseDetail({
			coursesLearn,
			coursesTeach,
			coursesSupervise,
		}).then((res) => {
			console.log("get后的detail为", this.courseDetail);
		});

		// 激活课程tab
		if (this.myInfo.userType === "XS") {
			this.activeName = "first";
		} else if (this.myInfo.teacherInfo.coursesTeach.length > 0) {
			this.activeName = "second";
		} else if (this.myInfo.teacherInfo.coursesSupervise.length > 0) {
			this.activeName = "third";
		}
	},
	components: { CourseCard, Banner },
};
</script>

<style scoped>
.add {
	float: right;
	margin-left: 10px;
}

.search {
	width: 200px;
}

.courseCard {
	width: 23%;
	float: left;
	margin-right: 15px;
	margin-top: 15px;
}
</style>
