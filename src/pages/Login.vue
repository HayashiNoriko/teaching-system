<template>
	<el-row>
		<el-col :span="15">
			<router-link to="/home">
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
				<h2>登录</h2>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="密码登录" name="first">
						<el-input
							placeholder="请输入邮箱/手机号"
							v-model="userInfo.account"
							clearable
							ref="account"
						>
						</el-input>
						<el-input
							placeholder="请输入密码"
							v-model="userInfo.password"
							show-password
							class="inputPsw"
							ref="password"
						></el-input>
						<div class="auto_and_forgot">
							<el-checkbox v-model="autoLogin">
								下次自动登录
							</el-checkbox>
						</div>
						<el-button
							type="primary"
							class="login"
							@click="handleLogin"
							v-loading.fullscreen.lock="fullscreenLoading"
						>
							登录
						</el-button>
					</el-tab-pane>
					<el-tab-pane label="手机短信登录" name="second">
						<el-input
							placeholder="请输入手机号"
							v-model="userInfo.account"
							clearable
							ref="account2"
						>
						</el-input>
						<el-input
							placeholder="请输入验证码"
							v-model="userInfo.verifyCode"
							class="inputCode inputPsw"
							ref="verifyCode"
						></el-input>
						<el-button type="primary" class="getCode"
							>发送验证码</el-button
						>
						<div class="auto_and_forgot">
							<el-checkbox v-model="autoLogin">
								下次自动登录
							</el-checkbox>
							<router-link to="/forgot" class="forgot">
								忘记密码？
							</router-link>
						</div>
						<el-button
							type="primary"
							class="login"
							@click="handleLogin"
							>登录</el-button
						>
					</el-tab-pane>
					<el-tab-pane label="微信登录" name="third">
						<div class="scanCode">二维码展示区</div>
					</el-tab-pane>
					<router-link to="/register" class="address">
						高校注册
					</router-link>
				</el-tabs>
			</el-card>
		</el-col>
	</el-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
	name: "Login",
	data() {
		return {
			activeName: "first",
			userInfo: {
				account: "",
				password: "",
				verifyCode: "",
			},
			autoLogin: false,
			fullscreenLoading: false,
		};
	},
	methods: {
		handleClick(tab, event) {
			// console.log(tab, event);
		},
		handleLogin() {
			// 检测输入的值是否合法（不为空即可）
			switch (this.activeName) {
				case "first":
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
					break;
				case "second":
					if (this.userInfo.account === "") {
						this.$message({
							showClose: true,
							message: "请输入手机号",
							type: "error",
						});
						this.$refs.account2.focus();
						return;
					}
					console.log(this.userInfo.verifyCode);
					if (this.userInfo.verifyCode === "") {
						this.$message({
							showClose: true,
							message: "请输入验证码",
							type: "error",
						});
						this.$refs.verifyCode.focus();
						return;
					}
					break;
				case "third":
					break;
				default:
					break;
			}
			this.fullscreenLoading = true;
			this.login({
				activeName: this.activeName,
				...this.userInfo,
			});
			// 8秒后，自动关闭全屏loading
			setTimeout(() => {
				if (this.fullscreenLoading) {
					this.fullscreenLoading = false;
					this.$message({
						showClose: true,
						message: "网络连接超时，请稍后再试",
						type: "error",
					});
				}
			}, 8000);
		},
		...mapActions("userInfoOptions", ["login"]),
	},
	computed: {
		...mapState("userInfoOptions", ["loginState"]),
	},
	watch: {
		loginState(newValue, oldValue) {
			console.log("loginState值从", oldValue, "变为", newValue, "了");
			if (newValue.isLogin) {
				this.fullscreenLoading = false;
				console.log("要跳转了");
				this.$message({
					message: "登录成功",
					type: "success",
				});
				this.$router.replace({
					name: "个人中心",
				});
			} else {
				this.fullscreenLoading = false;
				this.$message({
					showClose: true,
					message: newValue.msg,
					type: "error",
				});
			}
		},
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
