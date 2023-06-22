<template>
	<el-menu
		:default-active="activeIndex"
		class="el-menu-demo"
		mode="horizontal"
		router
	>
		<el-menu-item>
			<router-link to="/login">
				<el-image
					class="logo"
					style="width: 300px; height: 50px"
					:src="require('../assets/img/logo_melody.png')"
					fit="cover"
				>
				</el-image>
			</router-link>
		</el-menu-item>
		<el-menu-item v-if="userType === 'GLY'" index="/manager/manageUsers">
			管理员后台
		</el-menu-item>
		<el-menu-item v-else index="/center"> 我的课程 </el-menu-item>

		<div class="loginRegister">
			<router-link to="/user">
				<el-avatar size="medium" :src="avatarUrl" class="avatar" />
			</router-link>
		</div>
	</el-menu>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "Banner",
	data() {
		return {
			activeIndex: this.pageUrl, // 顶部导航栏的active
		};
	},
	computed: {
		// ...mapGetters("userInfoOptions", ["avatarUrl", "courseIds", "terms"]),
	},
	props: ["pageUrl", "avatarUrl", "userType", "school"],
};
</script>

<style scoped>
.loginRegister {
	text-align: center;
	display: table;
}
.avatar {
	/* display: table-cell; */
	vertical-align: middle;
}
</style>
