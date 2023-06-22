<template>
	<el-container>
		<el-header>
			<el-menu
				:default-active="activeIndex"
				class="el-menu-demo"
				mode="horizontal"
				@select="handleSelect"
			>
				<el-menu-item>
					<el-image
						class="logo"
						style="width: 200px; height: 50px"
						:src="require('../assets/img/logo_melody.png')"
						fit="cover"
					>
					</el-image>
				</el-menu-item>
				<el-menu-item index="1">首页</el-menu-item>
				<el-menu-item index="2">产品功能</el-menu-item>
				<el-menu-item index="3">处理中心</el-menu-item>
				<el-menu-item index="4">高校合作</el-menu-item>
				<div class="loginRegister">
					<el-button type="primary" @click="handleLogin">
						登录
					</el-button>
					<el-button type="primary" plain @click="handleRegister">
						高校注册
					</el-button>
				</div>
			</el-menu>
		</el-header>
		<el-main>
			<h2>调用微信云数据库</h2>
			<button @click="getData">点击调用微信云数据库</button>
		</el-main>
		<el-footer>Footer</el-footer>
	</el-container>
</template>

<script>
import { mapMutations } from "vuex";
export default {
	name: "Home",
	data() {
		return {
			activeIndex: "1",
		};
	},
	methods: {
		handleSelect() {},
		handleLogin() {
			this.$router.push({
				name: "登录",
			});
		},
		handleRegister() {
			this.$router.push({
				name: "注册",
			});
		},
		...mapMutations("cloudInfoOptions", ["getData"]),
	},
	computed: {},
	created() {
		// 获取数据
	},
};
</script>

<style scoped>
.loginRegister {
	height: 60px;
	float: right;
	line-height: 60px;
	margin: 0;
}
</style>
