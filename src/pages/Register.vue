<template>
	<el-row>
		<el-col :span="15">
			<router-link to="/login">
				<el-image
					class="logo"
					style="width: 300px; height: 50px"
					:src="require('../assets/img/logo_melody.png')"
					fit="cover"
				>
				</el-image>
			</router-link>

			<el-image
				class="logo"
				style="width: 700px; height: 430px"
				:src="require('../assets/img/login.png')"
				fit="cover"
			>
			</el-image>
		</el-col>
		<el-col :span="9">
			<el-card class="box-card">
				<h2>高校注册</h2>

				<el-input
					placeholder="请输入邮箱/手机号"
					v-model="userInfo.account"
					clearable
					ref="userInfo.account"
				>
				</el-input>
				<el-input
					placeholder="请输入密码"
					v-model="userInfo.password"
					show-password
					class="inputPsw"
					@blur="checkPsw"
					ref="password"
				></el-input>
				<el-input
					placeholder="请再次输入密码确认"
					v-model="userInfo.confPassword"
					show-password
					class="inputPsw"
					@blur="checkPsw"
					ref="confPassword"
				></el-input>
				<div
					v-show="showWarning"
					style="font-size: x-small; color: red"
				>
					两次输入的密码不一致！
				</div>
				<el-input
					placeholder="您的姓名"
					v-model="userInfo.userName"
					clearable
					class="inputPsw"
					ref="userName"
				>
				</el-input>
				<h4>院校信息</h4>
				<el-select
					v-model="userInfo.provinceValue"
					filterable
					placeholder="请选择 省级行政区"
					ref="provinceValue"
				>
					<el-option
						v-for="item in provinceOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-select
					v-model="userInfo.cityValue"
					filterable
					placeholder="请选择 地级行政区"
					class="inputPsw"
					ref="cityValue"
				>
					<el-option
						v-for="item in cityOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-select
					v-model="userInfo.schoolValue"
					filterable
					placeholder="请选择 院校"
					class="inputPsw"
					ref="schoolValue"
				>
					<el-option
						v-for="item in schoolOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					>
					</el-option>
				</el-select>
				<el-button type="primary" class="login" @click="handleRegister">
					注册
				</el-button>
			</el-card>
		</el-col>
	</el-row>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from "vuex";
export default {
	name: "Register",
	data() {
		return {
			userInfo: {
				account: "", // 输入的账号
				password: "", // 输入的密码
				confPassword: "", // 输入的二次密码
				userName: "", // 输入的姓名
				provinceValue: "", // 选择的省
				cityValue: "", // 选择的地
				schoolValue: "", // 选择的院校
			},
			showWarning: false, // 是否弹出“两次输入密码不一致”警示条
		};
	},
	methods: {
		handleClick(tab, event) {
			console.log(tab, event);
		},
		handleRegister() {
			if (this.userInfo.account === "") {
				this.$message({
					showClose: true,
					message: "请输入邮箱/手机号",
					type: "error",
				});
				this.$refs.account.focus();
				return;
			}
			if (this.userInfo.password === "") {
				this.$message({
					showClose: true,
					message: "请输入密码",
					type: "error",
				});
				this.$refs.password.focus();
				return;
			}
			if (this.userInfo.confPassword === "") {
				this.$message({
					showClose: true,
					message: "请再次输入密码",
					type: "error",
				});
				this.$refs.confPassword.focus();
				return;
			}
			if (this.userInfo.userName === "") {
				this.$message({
					showClose: true,
					message: "请输入您的姓名",
					type: "error",
				});
				this.$refs.userName.focus();
				return;
			}
			if (this.userInfo.provinceValue === "") {
				this.$message({
					showClose: true,
					message: "请选择 省级行政区",
					type: "error",
				});
				this.$refs.provinceValue.focus();
				return;
			}
			if (this.userInfo.cityValue === "") {
				this.$message({
					showClose: true,
					message: "请选择 地级行政区",
					type: "error",
				});
				this.$refs.cityValue.focus();
				return;
			}
			if (this.userInfo.schoolValue === "") {
				this.$message({
					showClose: true,
					message: "请选择 院校",
					type: "error",
				});
				this.$refs.schoolValue.focus();
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
			if (this.register(userInfo)) {
				this.$router.replace({
					name: "个人中心",
				});
			}
		},
		checkPsw() {
			if (
				this.userInfo.password === "" ||
				this.userInfo.confPassword === ""
			) {
				this.showWarning = false;
				return;
			}
			this.showWarning =
				this.userInfo.password != this.userInfo.confPassword;
		},
		...mapMutations("universityInfoOptions", [
			"getProvinceOptions",
			"getCityOptions",
			"getSchoolOptions",
		]),
		...mapActions("userInfoOptions", ["register"]),
	},
	computed: {
		...mapState("universityInfoOptions", [
			"provinceOptions",
			"cityOptions",
			"schoolOptions",
		]),
	},
	watch: {
		"userInfo.provinceValue"(newValue, oldValue) {
			this.userInfo.cityValue = "";
			this.getCityOptions(newValue);
		},
		"userInfo.cityValue"(newValue, oldValue) {
			this.userInfo.schoolValue = "";
			this.getSchoolOptions(newValue);
		},
	},
	mounted() {
		this.getProvinceOptions();
	},
};
</script>

<style scoped>
.logo {
	margin-top: 50px;
	margin-left: 50px;
}
/* html {
	background-color: #f8f9fa;
} */
.box-card {
	margin-top: 50px;
	width: 320px;
	/* text-align: center; */
}

h2 {
	text-align: center;
	margin-top: 0;
}

.inputPsw,
.auto_and_forgot,
.address {
	margin-top: 15px;
	font-size: small;
}
.login {
	margin-top: 15px;
	text-align: center;
	width: 100%;
}
.forgot,
.address {
	float: right;
}
.router-link-active {
	text-decoration: none;
}
a {
	text-decoration: none;
	/* color: rgb(170, 170, 170); */
}
.inputCode {
	width: 70%;
}
.getCode {
	margin-top: 15px;
	width: 27%;
	float: right;
	font-size: xx-small;
	padding: 13px 0px 13px 0;
}
.scanCode {
	width: 280px;
	height: 280px;
	background-color: rgb(231, 231, 231);
}
</style>
