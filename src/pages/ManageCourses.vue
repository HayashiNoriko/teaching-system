<template>
	<el-container>
		<el-header>
			<el-input
				placeholder="搜索课程"
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
				添加课程
			</el-button>
			<!-- 添加课程的表单写在template末尾吧 -->
		</el-header>
		<el-table
			:data="showCoursesData"
			border
			style="width: 100%"
			highlight-current-row
		>
			<el-table-column prop="courseName" label="课程名">
			</el-table-column>
			<el-table-column prop="courseId" label="课程号"> </el-table-column>
			<el-table-column prop="teacher.name" label="任课教师">
			</el-table-column>
			<el-table-column prop="teacher.no" label="教工号">
			</el-table-column>
			<el-table-column label="教学班组成">
				<template slot-scope="scope">
					<span
						v-for="(c, index) in scope.row.classes"
						:key="index"
						style="font-size: small"
					>
						{{ c }}
					</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						@click="handleClick(scope.row)"
						type="text"
						size="small"
					>
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 10px">
			<el-pagination
				style="text-align: center"
				background
				layout="prev, pager, next"
				:total="coursesData.length"
				:page-size="pageSize"
				:current-page="currentPage"
				@prev-click="prevClick"
				@next-click="nextClick"
				@current-change="currentChange"
			>
			</el-pagination>
		</div>

		<!-- 添加课程的对话框 -->
		<el-dialog title="添加课程" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="课程名" :label-width="formLabelWidth">
					<el-input
						v-model="form.courseName"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="任课教师" :label-width="formLabelWidth">
					<el-input
						v-model="inputNo"
						autocomplete="off"
						style="width: 200px"
						placeholder="请输入教工号"
						@blur="checkNo"
						ref="inputNo"
					></el-input>
				</el-form-item>
				<el-form-item label="教学班组成" :label-width="formLabelWidth">
					<el-tag
						:key="class1"
						v-for="class1 in form.classes"
						closable
						:disable-transitions="false"
						@close="handleClose(class1)"
					>
						{{ class1 }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model="inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput"
					>
						+ 添加班级
					</el-button>
				</el-form-item>
				<el-form-item label="督导员" :label-width="formLabelWidth">
					<el-tag
						:key="ddy.userId"
						v-for="ddy in form.ddys"
						closable
						:disable-transitions="false"
						@close="handleClose2(ddy)"
					>
						{{ getTeacherName(ddy.userId) }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible2"
						v-model="inputValue2"
						ref="saveTagInput2"
						size="small"
						@keyup.enter.native="handleInputConfirm2"
						@blur="handleInputConfirm2"
						style="width: 90px"
						placeholder="请输入教工号"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput2"
					>
						+ 添加督导员
					</el-button>
				</el-form-item>
				<el-form-item label="选课学生" :label-width="formLabelWidth">
					<el-tag
						:key="student.userId"
						v-for="student in form.students"
						closable
						:disable-transitions="false"
						@close="handleClose3(student)"
					>
						{{ getStudentName(student.userId) }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible3"
						v-model="inputValue3"
						ref="saveTagInput3"
						size="small"
						@keyup.enter.native="handleInputConfirm3"
						@blur="handleInputConfirm3"
						style="width: 90px"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput3"
					>
						+ 添加学生
					</el-button>
				</el-form-item>
				<el-form-item label="上课时间" :label-width="formLabelWidth">
					<el-select
						v-model="form.time.term"
						placeholder="请选择学期"
						style="width: 200px"
						@change="saveTerm(form.time.term)"
					>
						<el-option
							v-for="item in terms"
							:key="item.termId"
							:label="item.termName"
							:value="item.termName"
						>
						</el-option>
					</el-select>
					<br />
					<el-select
						v-model="startWeek"
						placeholder="起始"
						style="width: 90px"
						@change="saveWeek"
					>
						<el-option
							v-for="item in weeks"
							:key="item"
							:label="item"
							:value="item"
							:disabled="item > endWeek"
						>
						</el-option>
					</el-select>
					周 ~
					<el-select
						v-model="endWeek"
						placeholder="结束"
						style="width: 90px"
						@change="saveWeek"
					>
						<el-option
							v-for="item in weeks"
							:key="item"
							:label="item"
							:value="item"
							:disabled="item < startWeek"
						>
						</el-option>
					</el-select>
					周
					<br />
					具体时间
					<el-tag
						:key="d"
						v-for="d in form.time.day"
						closable
						:disable-transitions="false"
						@close="handleClose4(d)"
					>
						{{ d }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible4"
						v-model="inputValue4"
						ref="saveTagInput4"
						size="small"
						@keyup.enter.native="handleInputConfirm4"
						@blur="handleInputConfirm4"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput4"
					>
						+ 添加具体时间
					</el-button>
				</el-form-item>
				<el-form-item
					label="学生评价表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formId"
						size="small"
						@blur="checkForm(form.formId)"
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label="教师自评表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formJsId"
						size="small"
						@blur="checkForm(form.formJsId)"
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label="教学督导表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formDdyId"
						size="small"
						@blur="checkForm(form.formDdyId)"
					>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleAdd"> 确 定 </el-button>
			</div>
		</el-dialog>

		<!-- 编辑课程的对话框 -->
		<el-dialog title="编辑课程" :visible.sync="dialogFormVisible2">
			<el-form :model="form">
				<el-form-item label="课程名" :label-width="formLabelWidth">
					<el-input
						v-model="form.courseName"
						autocomplete="off"
						style="width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item label="任课教师" :label-width="formLabelWidth">
					<el-input
						v-model="inputNo"
						autocomplete="off"
						style="width: 200px"
						placeholder="请输入教工号"
						@blur="checkNo"
						ref="inputNo"
					></el-input>
				</el-form-item>
				<el-form-item label="教学班组成" :label-width="formLabelWidth">
					<el-tag
						:key="class1"
						v-for="class1 in form.classes"
						closable
						:disable-transitions="false"
						@close="handleClose(class1)"
					>
						{{ class1 }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible"
						v-model="inputValue"
						ref="saveTagInput"
						size="small"
						@keyup.enter.native="handleInputConfirm"
						@blur="handleInputConfirm"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput"
					>
						+ 添加班级
					</el-button>
				</el-form-item>
				<el-form-item label="督导员" :label-width="formLabelWidth">
					<el-tag
						:key="ddy.userId"
						v-for="ddy in form.ddys"
						closable
						:disable-transitions="false"
						@close="handleClose2(ddy)"
					>
						{{ getTeacherName(ddy.userId) }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible2"
						v-model="inputValue2"
						ref="saveTagInput2"
						size="small"
						@keyup.enter.native="handleInputConfirm2"
						@blur="handleInputConfirm2"
						style="width: 90px"
						placeholder="请输入教工号"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput2"
					>
						+ 添加督导员
					</el-button>
				</el-form-item>
				<el-form-item label="选课学生" :label-width="formLabelWidth">
					<el-tag
						:key="student.userId"
						v-for="student in form.students"
						closable
						:disable-transitions="false"
						@close="handleClose3(student)"
					>
						{{ getStudentName(student.userId) }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible3"
						v-model="inputValue3"
						ref="saveTagInput3"
						size="small"
						@keyup.enter.native="handleInputConfirm3"
						@blur="handleInputConfirm3"
						style="width: 90px"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput3"
					>
						+ 添加学生
					</el-button>
				</el-form-item>
				<el-form-item label="上课时间" :label-width="formLabelWidth">
					<el-select
						v-model="form.time.term"
						placeholder="请选择学期"
						style="width: 200px"
						@change="saveTerm(form.time.term)"
					>
						<el-option
							v-for="item in terms"
							:key="item.termId"
							:label="item.termName"
							:value="item.termName"
						>
						</el-option>
					</el-select>
					<br />
					<el-select
						v-model="startWeek"
						placeholder="起始"
						style="width: 90px"
						@change="saveWeek"
					>
						<el-option
							v-for="item in weeks"
							:key="item"
							:label="item"
							:value="item"
							:disabled="item > endWeek"
						>
						</el-option>
					</el-select>
					周 ~
					<el-select
						v-model="endWeek"
						placeholder="结束"
						style="width: 90px"
						@change="saveWeek"
					>
						<el-option
							v-for="item in weeks"
							:key="item"
							:label="item"
							:value="item"
							:disabled="item < startWeek"
						>
						</el-option>
					</el-select>
					周
					<br />
					具体时间
					<el-tag
						:key="d"
						v-for="d in form.time.day"
						closable
						:disable-transitions="false"
						@close="handleClose4(d)"
					>
						{{ d }}
					</el-tag>
					<el-input
						class="input-new-tag"
						v-if="inputVisible4"
						v-model="inputValue4"
						ref="saveTagInput4"
						size="small"
						@keyup.enter.native="handleInputConfirm4"
						@blur="handleInputConfirm4"
					>
					</el-input>
					<el-button
						v-else
						class="button-new-tag"
						size="small"
						@click="showInput4"
					>
						+ 添加具体时间
					</el-button>
				</el-form-item>
				<el-form-item
					label="学生评价表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formId"
						size="small"
						@blur="checkForm(form.formId)"
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label="教师自评表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formJsId"
						size="small"
						@blur="checkForm(form.formJsId)"
					>
					</el-input>
				</el-form-item>
				<el-form-item
					label="教学督导表单"
					:label-width="formLabelWidth"
				>
					<el-input
						class="input-new-tag"
						v-model="form.formDdyId"
						size="small"
						@blur="checkForm(form.formDdyId)"
					>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible2 = false">取 消</el-button>
				<el-button type="primary" @click="handleUpdate">
					确 定
				</el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import { nanoid } from "nanoid";
import { mapState, mapActions } from "vuex";
export default {
	name: "ManageCourses",
	data() {
		return {
			// 搜索课程的字符串
			searchMsg: "",
			// 添加课程对话框
			dialogFormVisible: false,
			pageSize: 10,
			currentPage: 1,
			formLabelWidth: "120px",

			// 编辑课程的对话框
			dialogFormVisible2: false,

			// 添加课程的表单信息
			form: {
				courseId: "",
				courseName: "",
				classes: [],
				ddys: [],
				students: [],
				teacher: {
					userId: "",
					rate: 0,
					rateText: null,
					rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				},
				pictureUrl:
					"https://6d79-my-environment-7g940fk3627d95fb-1312393850.tcb.qcloud.la/%E8%AF%BE%E7%A8%8B%E5%9B%BE%E7%89%87/java%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1.jpg",
				time: {
					day: [],
					term: "",
					termId: "",
					week: "",
				},
				formId: "f_nanoid",
				formDdyId: "f_ddy",
				formJsId: "f_self",
			},

			// 添加教师时，输入的教工号，要把它转化为教师的userId然后放到form.teacher.userId里。。。这个设计我真是太傻逼了
			inputNo: "",

			// 标签（添加教学班组成）相关的一些属性
			inputVisible: false,
			inputValue: "",
			// 标签（添加督导员）相关的一些属性
			inputVisible2: false,
			inputValue2: "",
			// 标签（添加选课学生）相关的一些属性
			inputVisible3: false,
			inputValue3: "",
			// 标签（添加上课日）相关的一些属性
			inputVisible4: false,
			inputValue4: "",

			// 上课时间选择
			weeks: [
				1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
				19, 20,
			],
			startWeek: 1,
			endWeek: 20,
			terms: [
				{ termId: 191, termName: "2019-2020 第一学期" },
				{ termId: 192, termName: "2019-2020 第二学期" },
				{ termId: 201, termName: "2020-2021 第一学期" },
				{ termId: 202, termName: "2020-2021 第二学期" },
				{ termId: 211, termName: "2021-2022 第一学期" },
				{ termId: 212, termName: "2021-2022 第二学期" },
			],

			// 添加的表单是否存在（默认是我输入的那三个，所以默认为true；若修改，则会onblur，然后遍历检查是否存在）
			formIsExist: true,
		};
	},
	computed: {
		showCoursesData() {
			let sliceCourses = this.coursesData.slice(
				(this.currentPage - 1) * this.pageSize,
				this.currentPage * this.pageSize
			);
			for (var i = 0; i < sliceCourses.length; i++) {
				this.teachersData.forEach((teacherObject) => {
					if (
						teacherObject.userId === sliceCourses[i].teacher.userId
					) {
						sliceCourses[i].teacher = {
							name: teacherObject.userName,
							no: teacherObject.teacherInfo.no,
							...sliceCourses[i].teacher,
						};
					}
				});
			}
			console.log("看一看sliceCourses", sliceCourses);
			return sliceCourses;
		},

		...mapState("manageInfoOptions", [
			"coursesData",
			"teachersData",
			"studentsData",
			"formsData",
		]),
	},
	methods: {
		prevClick() {
			this.currentPage--;
		},
		nextClick() {
			this.currentPage++;
		},
		currentChange(val) {
			this.currentPage = val;
		},
		handleClick(row) {
			console.log("点击了“编辑”，row是", row);
			this.form = row;
			this.dialogFormVisible2 = true;
			let userId = this.form.teacher.userId;
			this.teachersData.forEach((item) => {
				if (item.userId === userId) {
					this.inputNo = item.teacherInfo.no;
				}
			});
		},

		handleAdd() {
			console.log("点击了添加课程");
			if (!this.formIsExist) {
				this.$message.error("输入的表单id不存在，请重新输入");
				return;
			}
			if (!this.form.courseName) {
				this.$message.error("请输入课程名");
				return;
			}
			if (!this.form.teacher.userId) {
				this.$message.error("请输入任课教师工号");
				return;
			}
			this.form.courseId = "c_" + nanoid();
			console.log("加好了nanoid的form是", this.form);
			// 第一步：为courses集合添加一条课程记录
			this.addCourse(this.form);
			// 第二步：修改users中的记录，包括学生、教师本人、督导员的信息。这里全部重新上传，但其实只增加了一些课程信息。
			// 首先修改学生信息吧
			this.form.students.forEach((item) => {
				this.studentsData.forEach((studentObject) => {
					if (studentObject.userId === item.userId) {
						let newStudent = studentObject;
						newStudent.studentInfo.coursesLearn.push(
							this.form.courseId
						);
						newStudent.studentInfo.coursesLearnObjects.push({
							courseId: this.form.courseId,
							rate: 0,
							rateText: null,
							rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						});
						this.updateUser(newStudent);
					}
				});
			});
			// 然后修改教师信息
			let newTeacher = {};
			this.teachersData.forEach((item) => {
				if (item.userId === this.form.teacher.userId) {
					newTeacher = item;
				}
			});
			newTeacher.teacherInfo.coursesTeach.push(this.form.courseId);
			newTeacher.teacherInfo.coursesTeachObjects.push({
				courseId: this.form.courseId,
				rate: 0,
				rateText: null,
				rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			});
			this.updateUser(newTeacher);
			// 最后修改督导员信息
			this.form.ddys.forEach((item) => {
				this.teachersData.forEach((teacherObject) => {
					if (teacherObject.userId === item.userId) {
						let newTeacher = teacherObject;
						newTeacher.teacherInfo.coursesSupervise.push(
							this.form.courseId
						);
						newTeacher.teacherInfo.coursesSuperviseObjects.push({
							courseId: this.form.courseId,
							rate: 0,
							rateText: null,
							rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						});
						this.updateUser(newTeacher);
					}
				});
			});
		},

		// 标签（添加教学班组成）相关的一些方法
		handleClose(tag) {
			this.form.classes.splice(this.form.classes.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick((_) => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			// 检查是否重复
			let chongfu = false;
			this.form.classes.forEach((item) => {
				if (item === inputValue) {
					this.$message({
						message: "该班级已存在，请勿重复添加",
						type: "warning",
					});
					chongfu = true;
				}
			});
			if (chongfu) {
				return;
			}
			this.studentsData.forEach((item) => {
				if (item.studentInfo.className === inputValue) {
					this.form.students.push({
						userId: item.userId,
						rate: 0,
						rateText: null,
						rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					});
				}
			});
			if (inputValue) {
				this.form.classes.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = "";
		},

		// 标签（添加督导员）相关的一些方法
		handleClose2(tag) {
			this.form.ddys.splice(this.form.ddys.indexOf(tag), 1);
		},
		showInput2() {
			this.inputVisible2 = true;
			this.$nextTick((_) => {
				this.$refs.saveTagInput2.$refs.input.focus();
			});
		},
		handleInputConfirm2() {
			let inputValue = this.inputValue2;
			if (inputValue) {
				let userId = "";
				this.teachersData.forEach((item) => {
					if (item.teacherInfo.no === inputValue) {
						userId = item.userId;
					}
				});
				if (userId === "") {
					this.$message.error("输入的教工号不存在");
					return;
				}
				// 检查是否重复
				let chongfu = false;
				this.form.ddys.forEach((item) => {
					if (item.userId === userId) {
						this.$message({
							message: "该督导员已存在，请勿重复添加",
							type: "warning",
						});
						chongfu = true;
					}
				});
				if (chongfu) {
					return;
				}
				this.form.ddys.push({
					userId,
					rate: 0,
					rateText: null,
					rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				});
			}
			this.inputVisible2 = false;
			this.inputValue2 = "";
		},
		// 通过userId获取教师姓名及教工号（拼凑成一个字符串）
		getTeacherName(userId) {
			let userNameAndNo = "";
			this.teachersData.forEach((item) => {
				if (item.userId === userId) {
					userNameAndNo =
						item.userName + "(" + item.teacherInfo.no + ")";
				}
			});
			return userNameAndNo;
		},

		checkNo() {
			let userId = "";
			this.teachersData.forEach((item) => {
				if (item.teacherInfo.no === this.inputNo) {
					userId = item.userId;
				}
			});
			if (userId === "") {
				this.$message.error("输入的教工号不存在");
				this.$refs.inputNo.focus();
				return;
			}
			this.form.teacher.userId = userId;
		},

		// 标签（添加选课学生）相关的一些方法
		handleClose3(tag) {
			this.form.students.splice(this.form.students.indexOf(tag), 1);
		},
		showInput3() {
			this.inputVisible3 = true;
			this.$nextTick((_) => {
				this.$refs.saveTagInput3.$refs.input.focus();
			});
		},
		handleInputConfirm3() {
			let inputValue = this.inputValue3;
			if (inputValue) {
				let userId = "";
				this.studentsData.forEach((item) => {
					if (item.studentInfo.no === inputValue) {
						userId = item.userId;
					}
				});
				if (userId === "") {
					this.$message.error("输入的学号不存在");
					return;
				}
				// 检查是否重复
				let chongfu = false;
				this.form.students.forEach((item) => {
					if (item.userId === userId) {
						this.$message({
							message: "该生已存在，请勿重复添加",
							type: "warning",
						});
						chongfu = true;
					}
				});
				if (chongfu) {
					return;
				}
				this.form.students.push({
					userId,
					rate: 0,
					rateText: null,
					rateValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				});
			}
			this.inputVisible3 = false;
			this.inputValue3 = "";
		},
		// 通过userId获取学生姓名及学号（拼凑成一个字符串）
		getStudentName(userId) {
			let userNameAndNo = "";
			this.studentsData.forEach((item) => {
				if (item.userId === userId) {
					userNameAndNo =
						item.userName + "(" + item.studentInfo.no + ")";
				}
			});
			return userNameAndNo;
		},
		// 保存选择的周
		saveWeek() {
			this.form.time.week = this.startWeek + "-" + this.endWeek + "周";
		},
		// 保存选择的学期（id）
		saveTerm(termName) {
			console.log(termName);
			this.terms.forEach((item) => {
				if (item.termName === termName) {
					this.form.time.termId = item.termId;
				}
			});
		},
		// 标签（添加上课日）相关的一些方法
		handleClose4(tag) {
			this.form.time.day.splice(this.form.time.day.indexOf(tag), 1);
		},
		showInput4() {
			this.inputVisible4 = true;
			this.$nextTick((_) => {
				this.$refs.saveTagInput4.$refs.input.focus();
			});
		},
		handleInputConfirm4() {
			let inputValue = this.inputValue4;
			// 检查是否重复
			let chongfu = false;
			this.form.time.day.forEach((item) => {
				if (item === inputValue) {
					this.$message({
						message: "该时间已存在，请勿重复添加",
						type: "warning",
					});
					chongfu = true;
				}
			});
			if (chongfu) {
				return;
			}
			if (inputValue) {
				this.form.time.day.push(inputValue);
			}
			this.inputVisible4 = false;
			this.inputValue4 = "";
		},

		// 添加课程时，检查表单是否存在
		checkForm(formId) {
			let isExist = false;
			this.formsData.forEach((item) => {
				if (item.formId === formId) {
					isExist = true;
				}
			});
			if (!isExist) {
				this.$message.error("输入的表单不存在");
				this.formIsExist = false;
			}
		},
		// 提交编辑课程
		handleUpdate() {
			console.log("点击了确定，编辑课程");
		},
		...mapActions("manageInfoOptions", [
			"getAllCoursesData",
			"getAllTeachersData",
			"getAllStudentsData",
			"getAllFormsData",
			"addCourse",
			"updateUser",
		]),
	},
	mounted() {
		this.getAllCoursesData();
		this.getAllTeachersData();
		this.getAllStudentsData();
		this.getAllFormsData();
	},
};
</script>

<style scoped>
.el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
