<template>
	<el-container>
		<el-header>
			<el-input
				placeholder="搜索用户"
				prefix-icon="el-icon-search"
				v-model="searchMsg"
				class="add"
				size="medium"
				style="width: 200px"
			>
			</el-input>
			<el-button
				type="primary"
				icon="el-icon-circle-plus-outline"
				size="medium"
				class="add"
				@click="dialogFormVisible = true"
			>
				添加用户
			</el-button>
			<!-- 表单写在template末尾吧 -->
		</el-header>
		<el-tabs v-model="activeName">
			<el-tab-pane label="学生用户" name="first">
				<el-table
					:data="showStudentsData"
					border
					style="width: 100%"
					highlight-current-row
				>
					<el-table-column prop="userName" label="姓名">
					</el-table-column>
					<el-table-column prop="studentInfo.no" label="学号">
					</el-table-column>
					<el-table-column prop="faculty" label="院系">
					</el-table-column>
					<el-table-column prop="major" label="专业">
					</el-table-column>
					<el-table-column prop="studentInfo.className" label="班级">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="160">
						<template slot-scope="scope">
							<el-button
								@click="handleClick(scope.row)"
								type="text"
								size="small"
							>
								用户信息
							</el-button>
							<el-button
								@click="handleClickRank(scope.row)"
								type="text"
								size="small"
							>
								评教记录
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div style="margin-top: 10px">
					<el-pagination
						style="text-align: center"
						background
						layout="prev, pager, next"
						:total="studentsData.length"
						:page-size="pageSize"
						:current-page="currentPage"
						@prev-click="prevClick"
						@next-click="nextClick"
						@current-change="currentChange"
					>
					</el-pagination>
				</div>
			</el-tab-pane>
			<el-tab-pane label="教师用户" name="second">
				<el-table
					:data="showTeachersData"
					border
					style="width: 100%"
					highlight-current-row
				>
					<el-table-column prop="userName" label="姓名">
					</el-table-column>
					<el-table-column prop="teacherInfo.no" label="教工号">
					</el-table-column>
					<el-table-column prop="faculty" label="院系">
					</el-table-column>
					<el-table-column prop="major" label="专业" width="200px">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="160">
						<template slot-scope="scope">
							<el-button
								@click="handleClick(scope.row)"
								type="text"
								size="small"
							>
								用户信息
							</el-button>
							<el-button
								@click="handleClickRank(scope.row)"
								type="text"
								size="small"
							>
								评教记录
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div style="margin-top: 10px">
					<el-pagination
						style="text-align: center"
						background
						layout="prev, pager, next"
						:total="teachersData.length"
						:page-size="pageSize"
						:current-page="currentPage2"
						@prev-click="prevClick2"
						@next-click="nextClick2"
						@current-change="currentChange2"
					>
					</el-pagination>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 添加用户的对话框 -->
		<el-dialog title="添加用户" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="姓名" :label-width="formLabelWidth">
					<el-input
						v-model="form.userName"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="用户类型" :label-width="formLabelWidth">
					<el-radio-group v-model="form.userType" size="medium">
						<el-radio border label="XS">学生</el-radio>
						<el-radio border label="JS">教师</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item
					v-show="form.userType === 'XS'"
					label="学号"
					:label-width="formLabelWidth"
				>
					<el-input
						v-model="form.studentInfo.no"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item
					v-show="form.userType === 'JS'"
					label="教工号"
					:label-width="formLabelWidth"
				>
					<el-input
						v-model="form.teacherInfo.no"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="院系" :label-width="formLabelWidth">
					<el-input
						v-model="form.faculty"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="专业" :label-width="formLabelWidth">
					<el-input
						v-model="form.major"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item
					v-show="form.userType === 'XS'"
					label="班级"
					:label-width="formLabelWidth"
				>
					<el-input
						v-model="form.studentInfo.className"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="手机号" :label-width="formLabelWidth">
					<el-input
						v-model="form.phoneNumber"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="邮箱" :label-width="formLabelWidth">
					<el-input
						v-model="form.email"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleAdd"> 确 定 </el-button>
			</div>
		</el-dialog>
		<!-- 修改用户信息的对话框 -->
		<el-dialog
			title="用户信息"
			:visible.sync="dialogFormVisible2"
			:before-close="handleClose"
			width="900px"
		>
			<el-descriptions
				class="margin-top"
				:column="3"
				size="small"
				border
				title="基本信息"
			>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-user"></i>
						姓名
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.userName"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>{{ editInfo.userName }}</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-mobile-phone"></i>
						{{ editInfo.userType === "XS" ? "学号" : "教工号" }}
					</template>
					<div v-if="isEditting">
						<el-input
							v-if="editInfo.userType === 'XS'"
							placeholder="请输入内容"
							v-model="editInfo.studentInfo.no"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
						<el-input
							v-else
							placeholder="请输入内容"
							v-model="editInfo.teacherInfo.no"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						<span v-if="editInfo.userType === 'XS'">
							{{ studentNo }}
						</span>
						<span v-else>
							{{ teacherNo }}
						</span>
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-location-outline"></i>
						班级
					</template>
					<div v-if="isEditting && editInfo.userType === 'XS'">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.studentInfo.className"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						<span v-if="editInfo.userType === 'XS'">
							{{ editInfo.studentInfo.className }}
						</span>
						<span v-else>无</span>
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-tickets"></i>
						学校
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.school"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						{{ editInfo.school }}
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						院系
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.faculty"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						{{ editInfo.faculty }}
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						专业
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.major"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						{{ editInfo.major }}
					</div>
				</el-descriptions-item>
			</el-descriptions>
			<el-descriptions
				class="margin-top"
				:column="3"
				size="small"
				border
				title="账号信息"
				style="margin-top: 20px"
			>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						uid
					</template>
					{{ editInfo.userId }}
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						手机号
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.phoneNumber"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						{{ editInfo.phoneNumber }}
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						所属角色
					</template>
					<el-tag v-if="editInfo.userType == 'XS'" size="small">
						学生
					</el-tag>
					<el-tag v-else-if="editInfo.userType == 'JS'" size="small">
						教师
					</el-tag>
					<el-tag v-else size="small"> 管理员 </el-tag>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						邮箱
					</template>
					<div v-if="isEditting">
						<el-input
							placeholder="请输入内容"
							v-model="editInfo.email"
							clearable
							class="input"
							size="small"
							style="width: 170px"
						>
						</el-input>
					</div>
					<div v-else>
						{{ editInfo.email }}
					</div>
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						绑定微信
					</template>
					飞翔的企鹅
				</el-descriptions-item>
				<el-descriptions-item>
					<template slot="label">
						<i class="el-icon-office-building"></i>
						绑定QQ
					</template>
					飞翔的QQ
				</el-descriptions-item>
			</el-descriptions>
			<div slot="footer" class="dialog-footer">
				<el-button
					plain
					type="primary"
					@click="handleEdit"
					v-show="!isEditting"
					>编 辑</el-button
				>
				<el-button
					plain
					type="primary"
					v-show="isEditting"
					@click="isEditting = false"
				>
					取 消
				</el-button>
				<el-button
					type="primary"
					v-show="isEditting"
					@click="handleSave"
				>
					保 存
				</el-button>
			</div>
		</el-dialog>
		<!-- 查看用户评教信息的对话框 -->
		<el-dialog title="评教信息" :visible.sync="dialogFormVisible3">
			<el-table :data="userCoursesData" style="width: 100%">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form
							label-position="left"
							inline
							class="demo-table-expand"
						>
							<el-form-item label="课程名称">
								<span>{{ props.row.courseName }}</span>
							</el-form-item>
							<el-form-item label="课程ID">
								<span>{{ props.row.courseId }}</span>
							</el-form-item>
							<el-form-item label="任课教师">
								<span>{{ props.row.teacher.name }}</span>
							</el-form-item>
							<el-form-item label="教工号">
								<span>{{ props.row.teacher.no }}</span>
							</el-form-item>
							<el-form-item label="教学班组成">
								<span>{{ props.row.classes }}</span>
							</el-form-item>
							<el-form-item label="学期">
								<span>{{ props.row.time.term }}</span>
							</el-form-item>
							<el-form-item label="上课时间">
								<span
									>{{ props.row.time.week }}
									{{ props.row.time.day }}</span
								>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column label="课程名称" prop="courseName">
				</el-table-column>
				<el-table-column label="课程ID" prop="courseId">
				</el-table-column>
				<el-table-column label="任课教师" prop="teacher.name">
				</el-table-column>
				<el-table-column label="教工号" prop="teacher.no">
				</el-table-column>
				<el-table-column
					label="类型"
					prop="rankType"
					:filters="[
						{ text: '学生评价', value: '学生评价' },
						{ text: '教师自评', value: '教师自评' },
						{ text: '教学督导', value: '教学督导' },
					]"
					:filter-method="filterRankType"
				>
				</el-table-column>
				<el-table-column
					label="是否评教"
					prop="isRank"
					:filters="[
						{ text: '是', value: '是' },
						{ text: '否', value: '否' },
					]"
					:filter-method="filterIsRank"
				>
					<template slot-scope="scope">
						<el-tag
							:type="
								scope.row.isRank === '是' ? 'success' : 'danger'
							"
							disable-transitions
						>
							{{ scope.row.isRank }}
						</el-tag>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogFormVisible3 = false">
					关 闭
				</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import { nanoid } from "nanoid";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
	name: "ManageUsers",
	data() {
		return {
			activeName: "first", // “学生用户”或“教师用户”
			searchMsg: "",

			pageSize: 10, // 学生教师共用的

			// 学生页的分页器
			currentPage: 1,

			// 教师页的分页器
			currentPage2: 1,

			// “添加用户”的对话框是否可见
			dialogFormVisible: false,

			// “修改用户信息”的对话框是否可见
			dialogFormVisible2: false,

			// “评教记录”的对话框是否可见
			dialogFormVisible3: false,

			// 存储目前正在修改的用户信息
			editInfo: {},

			// 是否正在编辑
			isEditting: false,

			form: {
				userId: "",
				userName: "",
				userType: "",
				phoneNumber: "",
				email: "",
				password: "123456",
				school: "华北电力大学",
				faculty: "",
				major: "",
				avatarUrl:
					"https://6d79-my-environment-7g940fk3627d95fb-1312393850.tcb.qcloud.la/%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png",
				studentInfo: {
					className: "",
					no: "",
					coursesLearn: [],
					coursesLearnObjects: [],
				},
				teacherInfo: {
					no: "",
					coursesTeach: [],
					coursesTeachObjects: [],
					coursesSupervise: [],
					coursesSuperviseObjects: [],
				},
			},
			formLabelWidth: "120px",
		};
	},
	methods: {
		// 学生页的分页器
		prevClick() {
			this.currentPage--;
		},
		nextClick() {
			this.currentPage++;
		},
		currentChange(val) {
			this.currentPage = val;
		},

		// 教师页的分页器
		prevClick2() {
			this.currentPage2--;
		},
		nextClick2() {
			this.currentPage2++;
		},
		currentChange2(val) {
			this.currentPage2 = val;
		},

		// 点击“用户信息”
		handleClick(row) {
			console.log("点击了用户信息，row是:", row);
			this.editInfo = row;
			this.dialogFormVisible2 = true;
		},

		// 点击“评教记录”
		handleClickRank(row) {
			console.log("点击了评教记录，row是：", row);
			this.editInfo = row;
			this.dialogFormVisible3 = true;
			this.getUserCoursesData(row);
		},

		// 点击“确定”添加用户
		handleAdd() {
			this.form.userId = "xs_" + nanoid();
			console.log(this.form);
			this.addUser(this.form);
			this.dialogFormVisible = false;
		},

		// 点击编辑用户
		handleEdit() {
			this.isEditting = true;
		},

		// 点击关闭编辑用户对话框
		handleClose(done) {
			this.isEditting = false;
			done();
		},

		// 点击保存
		handleSave() {
			// this.dialogFormVisible2 = false;
			this.isEditting = false;
			this.updateUser(this.editInfo);
		},

		// 筛选是否评教
		filterIsRank(value, row) {
			console.log("value是", value);
			console.log("row是", row);
			return row.isRank === value;
		},

		// 筛选评教类型
		filterRankType(value, row) {
			console.log("value是", value);
			console.log("row是", row);
			return row.rankType === value;
		},

		...mapActions("manageInfoOptions", [
			"getAllStudentsData",
			"getAllTeachersData",
			"getAllCoursesData",
			"addUser",
			"updateUser",
		]),
		...mapMutations("manageInfoOptions", ["getUserCoursesData"]),
	},
	computed: {
		// 要展示在表格中的学生用户信息
		showStudentsData() {
			return this.studentsData.slice(
				(this.currentPage - 1) * this.pageSize,
				this.currentPage * this.pageSize
			);
		},

		// 要展示在表格中的教师用户信息
		showTeachersData() {
			return this.teachersData.slice(
				(this.currentPage2 - 1) * this.pageSize,
				this.currentPage2 * this.pageSize
			);
		},

		// 很奇怪。。。试一试
		teacherNo() {
			let teacherInfo = this.editInfo.teacherInfo;
			teacherInfo ??= {};
			return teacherInfo.no;
		},

		studentNo() {
			let studentInfo = this.editInfo.studentInfo;
			studentInfo ??= {};
			return studentInfo.no;
		},

		...mapState("manageInfoOptions", [
			"studentsData",
			"teachersData",
			"coursesData",
			"userCoursesData",
		]),
	},
	mounted() {
		// for (var i = 0; i < 1000; i++) {
		// 	this.studentsData.push({
		// 		userName: i + "",
		// 		faculty: "",
		// 		major: "",
		// 		"studentInfo.className": "",
		// 		phoneNumber: "",
		// 		"studentInfo.no": "",
		// 	});
		// }
		this.getAllStudentsData();
		this.getAllTeachersData();
		this.getAllCoursesData();
	},
};
</script>

<style>
.add {
	float: right;
	margin-left: 10px;
}
.demo-table-expand {
	font-size: 0;
}
.demo-table-expand label {
	width: 90px;
	color: #99a9bf;
}
.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}
</style>
