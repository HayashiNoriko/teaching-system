<template>
	<router-view />
</template>

<script>
export default {
	name: "App",
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
	},
	created() {},
};
</script>

<style>
.loginRegister {
	height: 60px;
	float: right;
	line-height: 60px;
	margin: 0;
}
</style>
