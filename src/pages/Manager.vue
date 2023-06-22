<template>
	<el-container>
		<el-header>
			<Banner
				:avatarUrl="myInfo.avatarUrl"
				:userType="myInfo.userType"
				pageUrl="/manager/manageUsers"
				:school="myInfo.school"
			></Banner>
		</el-header>
		<el-main>
			<el-row>
				<el-col :span="4">
					<el-menu
						default-active="/manager/manageUsers"
						class="el-menu-vertical-demo"
						router
					>
						<el-menu-item index="/manager/manageUsers">
							<i class="el-icon-setting"></i>
							<span slot="title">用户管理</span>
						</el-menu-item>
						<el-menu-item index="/manager/manageCourses">
							<i class="el-icon-menu"></i>
							<span slot="title">课程管理</span>
						</el-menu-item>
						<el-menu-item index="/manager/manageForms">
							<i class="el-icon-menu"></i>
							<span slot="title">评估表单管理</span>
						</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="1" style="opacity: 0">1</el-col>
				<el-col :span="16">
					<router-view></router-view>
				</el-col>
				<el-col :span="3"></el-col>
			</el-row>
		</el-main>
		<el-footer style="opacity: 0"> Footer </el-footer>
	</el-container>
</template>

<script>
import { mapState } from "vuex";
import Banner from "@/components/Banner.vue";
export default {
	name: "Manager",
	computed: {
		...mapState("userInfoOptions", ["myInfo"]),
	},
	components: { Banner },
};
</script>

<style></style>
