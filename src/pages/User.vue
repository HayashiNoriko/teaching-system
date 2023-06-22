<template>
	<el-container>
		<el-header>
			<Banner
				:avatarUrl="myInfo.avatarUrl"
				:userType="myInfo.userType"
				:school="myInfo.school"
			></Banner>
		</el-header>
		<el-main class="main">
			<el-row>
				<el-col :span="2" style="opacity: 0">1</el-col>
				<el-col :span="19">
					<el-container style="height: 1000px">
						<el-header><h2>个人信息设置</h2></el-header>
						<el-tabs
							:tab-position="tabPosition"
							style="height: 500px"
							class="tabs"
						>
							<el-tab-pane label="基础信息" class="tabpane-basic">
								<el-descriptions
									class="margin-top"
									title="基础信息"
									:column="3"
									:size="size"
									border
								>
									<template slot="extra">
										<el-button
											v-show="!isReviseBasicInfo"
											type="primary"
											size="small"
											@click="isReviseBasicInfo = true"
										>
											修改
										</el-button>
										<el-button
											v-show="isReviseBasicInfo"
											plain
											type="primary"
											size="small"
											@click="handleCancel"
											class="btnCancel"
										>
											取消
										</el-button>
										<el-dialog
											title="提示"
											:visible.sync="dialogVisible"
											width="30%"
										>
											<span>将不会保存您的修改</span>
											<span
												slot="footer"
												class="dialog-footer"
											>
												<el-button
													@click="
														dialogVisible = false
													"
												>
													返回修改
												</el-button>
												<el-button
													type="primary"
													@click="
														dialogVisible = false;
														isReviseBasicInfo = false;
													"
												>
													确定
												</el-button>
											</span>
										</el-dialog>
										<el-button
											v-show="isReviseBasicInfo"
											type="primary"
											size="small"
											@click="submitUpdate"
										>
											保存
										</el-button>
									</template>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-user"></i>
											姓名
										</template>
										<div v-if="isReviseBasicInfo">
											<el-input
												placeholder="请输入内容"
												v-model="inputInfo.name"
												clearable
												class="inputName"
											>
											</el-input>
										</div>
										<div v-else>{{ myInfo.userName }}</div>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-mobile-phone"></i>
											<span
												v-if="myInfo.userType == 'XS'"
											>
												学号
											</span>
											<span v-else> 教工号 </span>
										</template>
										<div v-if="isReviseBasicInfo">
											<el-input
												placeholder="请输入内容"
												v-model="inputInfo.no"
												clearable
												class="input"
											>
											</el-input>
										</div>
										<div v-else>
											<span
												v-if="myInfo.userType == 'XS'"
											>
												{{ myInfo.studentInfo.no }}
											</span>
											<span v-else>
												{{ myInfo.teacherInfo.no }}
											</span>
										</div>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i
												class="el-icon-location-outline"
											></i>
											班级
										</template>
										<span v-if="myInfo.userType == 'XS'">
											<el-tag size="small">
												{{
													myInfo.studentInfo.className
												}}
											</el-tag>
										</span>
										<span v-else>无</span>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-tickets"></i>
											学校
										</template>
										{{ myInfo.school }}
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i
												class="el-icon-office-building"
											/>
											院系
										</template>
										<div v-if="isReviseBasicInfo">
											<el-input
												placeholder="请输入内容"
												v-model="inputInfo.faculty"
												clearable
												class="input"
											>
											</el-input>
										</div>
										<div v-else>
											{{ myInfo.faculty }}
										</div>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i
												class="el-icon-office-building"
											/>
											专业
										</template>
										<div v-if="isReviseBasicInfo">
											<el-input
												placeholder="请输入内容"
												v-model="inputInfo.major"
												clearable
												class="input"
											>
											</el-input>
										</div>
										<div v-else>
											{{ myInfo.major }}
										</div>
									</el-descriptions-item>
								</el-descriptions>
								<el-descriptions
									class="margin-top"
									title="头像"
									:column="1"
									:size="size"
									border
									style="margin-top: 20px"
								>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-user"></i>
											点击修改头像
										</template>
										<el-upload
											class="avatar-uploader"
											action="https://jsonplaceholder.typicode.com/posts/"
											:show-file-list="false"
											:on-success="handleAvatarSuccess"
											:before-upload="beforeAvatarUpload"
										>
											<img
												v-if="imageUrl"
												:src="imageUrl"
												class="avatar"
											/>
											<i
												v-else
												class="el-icon-plus avatar-uploader-icon"
											></i>
										</el-upload>
									</el-descriptions-item>
								</el-descriptions>
							</el-tab-pane>
							<el-tab-pane label="账号设置">
								<el-descriptions
									class="margin-top"
									title="账号设置"
									:column="2"
									:size="size"
									border
								>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-user"></i>
											uid
										</template>
										{{ myInfo.userId }}
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-mobile-phone"></i>
											手机号
										</template>
										{{ myInfo.phoneNumber }}
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i
												class="el-icon-location-outline"
											></i>
											所属角色
										</template>

										<el-tag
											v-if="myInfo.userType == 'XS'"
											size="small"
										>
											学生
										</el-tag>
										<el-tag
											v-else-if="myInfo.userType == 'JS'"
											size="small"
										>
											教师
										</el-tag>
										<el-tag v-else size="small">
											管理员
										</el-tag>
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-tickets"></i>
											密码
										</template>
										{{ "*".repeat(myInfo.password.length) }}
										<el-button
											type="text"
											@click="dialogFormVisible = true"
											style="
												float: right;
												font-size: x-small;
											"
										>
											修改密码
										</el-button>
										<el-dialog
											title="修改密码"
											:visible.sync="dialogFormVisible"
										>
											<el-form :model="passwordForm">
												<el-form-item
													label="原密码"
													:label-width="
														formLabelWidth
													"
												>
													<el-input
														v-model="
															passwordForm.oldPassword
														"
														autocomplete="off"
														ref="oldPassword"
														show-password
													>
													</el-input>
												</el-form-item>
												<el-form-item
													label="新密码"
													:label-width="
														formLabelWidth
													"
													ref="newPassword"
												>
													<el-input
														v-model="
															passwordForm.newPassword
														"
														@blur="checkPsw"
														autocomplete="off"
														show-password
													>
													</el-input>
												</el-form-item>
												<el-form-item
													label="再次输入新密码"
													:label-width="
														formLabelWidth
													"
												>
													<el-input
														v-model="
															passwordForm.confNewPassword
														"
														@blur="checkPsw"
														autocomplete="off"
														ref="confNewPassword"
														show-password
													>
													</el-input>
												</el-form-item>
												<div
													v-show="showWarning"
													style="
														font-size: x-small;
														color: red;
													"
												>
													两次输入的密码不一致！
												</div>
											</el-form>
											<div
												slot="footer"
												class="dialog-footer"
											>
												<el-button
													@click="
														dialogFormVisible = false
													"
													>取 消</el-button
												>
												<el-button
													type="primary"
													@click="submitPassword"
												>
													确 定
												</el-button>
											</div>
										</el-dialog>
									</el-descriptions-item>
								</el-descriptions>
							</el-tab-pane>
							<el-tab-pane label="第三方账号绑定">
								<el-descriptions
									class="margin-top"
									title="第三方账号绑定"
									:column="1"
									:size="size"
									border
								>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-user"></i>
											邮箱绑定
										</template>
										{{ myInfo.email }}
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-mobile-phone"></i>
											微信绑定
										</template>
										飞翔的企鹅
									</el-descriptions-item>
									<el-descriptions-item>
										<template slot="label">
											<i class="el-icon-mobile-phone"></i>
											QQ绑定
										</template>
										飞翔的企鹅
									</el-descriptions-item>
								</el-descriptions>
							</el-tab-pane>
						</el-tabs>
					</el-container>
				</el-col>
				<el-col :span="3" style="opacity: 0">1</el-col>
			</el-row>
		</el-main>
		<!-- <el-footer>Footer</el-footer> -->
	</el-container>
</template>

<script>
import Banner from "@/components/Banner.vue";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
	name: "User",
	data() {
		return {
			activeIndex: "1",
			tabPosition: "left",
			size: "",
			isReviseBasicInfo: false,
			dialogVisible: false, // 取消修改提示框
			dialogFormVisible: false, // 修改密码详情框
			imageUrl: "", // 上传头像的路径
			inputInfo: {
				name: "",
				no: "",
				faculty: "",
				major: "",
			},
			passwordForm: {
				oldPassword: "",
				newPassword: "",
				confNewPassword: "",
			},
			formLabelWidth: "120px", // 修改密码表单的宽度
			showWarning: false, // 是否弹出“两次输入密码不一致”警示条
		};
	},
	computed: {
		...mapState("userInfoOptions", [
			"myInfo",
			"loginState",
			"passwordState",
			"myInfoState",
		]),
		// inputInfo() {
		// 	let name = this.myInfo.userName;
		// 	let no =
		// 		this.myInfo.userType === "XS"
		// 			? this.myInfo.studentInfo.no
		// 			: this.myInfo.teacherInfo.no;
		// 	let faculty = this.myInfo.faculty;
		// 	let major = this.myInfo.major;
		// 	return { name, no, faculty, major };
		// },
		// 上述办法失效。。。。。。。。。。。。。。。。。。。又出现了页面不刷新的情况
	},
	methods: {
		handleCancel() {
			this.dialogVisible = true;
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === "image/jpeg";
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error("上传头像图片只能是 JPG 格式!");
			}
			if (!isLt2M) {
				this.$message.error("上传头像图片大小不能超过 2MB!");
			}
			return isJPG && isLt2M;
		},
		submitUpdate() {
			console.log("点击了提交修改信息");
			this.isReviseBasicInfo = false;

			this.updateUserInfo({
				userId: this.myInfo.userId,
				userType: this.myInfo.userType,
				...this.inputInfo,
			});
		},
		checkPsw() {
			console.log("进入checkPsw");
			if (
				this.passwordForm.newPassword === "" ||
				this.passwordForm.confNewPassword === ""
			) {
				this.showWarning = false;
				return;
			}
			this.showWarning =
				this.passwordForm.newPassword !=
				this.passwordForm.confNewPassword;
		},
		submitPassword() {
			console.log("点击了确定修改密码");
			console.log("目前修改密码表单里的参数有：", this.passwordForm);
			if (this.passwordForm.oldPassword === "") {
				this.$message({
					showClose: true,
					message: "请输入原密码",
					type: "warning",
				});
				this.$refs.oldPassword.focus();
				return;
			}
			if (this.passwordForm.newPassword === "") {
				this.$message({
					showClose: true,
					message: "请输入新密码",
					type: "warning",
				});
				this.$refs.newPassword.focus();
				return;
			}
			if (this.passwordForm.confNewPassword === "") {
				this.$message({
					showClose: true,
					message: "请再次输入新密码",
					type: "warning",
				});
				this.$refs.confNewPassword.focus();
				return;
			}
			if (this.showWarning) {
				this.$message({
					showClose: true,
					message: "两次输入的密码不一致，请重新输入",
					type: "error",
				});
				this.$refs.confPassword.focus();
				return;
			}
			this.updatePassword({
				userId: this.myInfo.userId,
				oldPassword: this.passwordForm.oldPassword,
				newPassword: this.passwordForm.newPassword,
			});
			this.dialogFormVisible = false;
		},
		...mapActions("userInfoOptions", ["updateUserInfo", "updatePassword"]),
	},
	components: { Banner },
	mounted() {
		let name = this.myInfo.userName;
		let no =
			this.myInfo.userType === "XS"
				? this.myInfo.studentInfo.no
				: this.myInfo.teacherInfo.no;
		let faculty = this.myInfo.faculty;
		let major = this.myInfo.major;
		this.inputInfo = { name, no, faculty, major };
	},
	watch: {
		// myInfo: {
		// 	handler() {
		// 		console.log("myInfo改变了，强刷页面");
		// 		this.$forceUpdate();
		// 	},
		// 	deep: true,
		// },
		// 不奏效！。。。。。。。。。。。。。。。。。。。
		passwordState(newValue, oldValue) {
			console.log(
				"passwordState改变，被监视到了，旧新值分别为",
				oldValue,
				newValue
			);
			if (newValue.msg === "ok") {
				this.$message({
					showClose: true,
					message: "修改密码成功",
					type: "success",
				});
			} else if (newValue.msg === "no") {
				this.$message({
					showClose: true,
					message: "修改密码失败，原密码错误",
					type: "error",
				});
			}
			// this.passwordState.msg = "waiting...";
		},
		myInfoState(newValue, oldValue) {
			console.log(
				"myInfoState改变，被监视到了，旧新值分别为",
				oldValue,
				newValue
			);
			if (newValue.msg === "ok") {
				this.$message({
					showClose: true,
					message: "个人信息修改成功",
					type: "success",
				});
			} else if (newValue.msg === "no") {
				this.$message({
					showClose: true,
					message: "个人信息修改失败",
					type: "error",
				});
			}
		},
	},
};
</script>

<style scoped>
.tabs {
	margin-top: 15px;
	height: 1000px;
}
/* .main {
	height: 1000px;
} */
.tabpane-basic {
	height: 1000px;
}
.margin-top {
	margin-left: 15px;
}
.input {
	width: 150px;
}

.inputName {
	width: 100px;
}
.btnCancel {
	margin-right: 10px;
}
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}
.avatar-uploader .el-upload:hover {
	border-color: #409eff;
}
.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
}
.avatar {
	width: 178px;
	height: 178px;
	display: block;
}
.router-link-active {
	text-decoration: none;
}
</style>
