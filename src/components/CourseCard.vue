<template>
	<el-card :body-style="{ padding: '0px' }" class="card">
		<div class="divImg">
			<div class="divMsg">
				<h3>{{ courseName }}</h3>
				<span v-for="(c, index) in classes" :key="index">
					{{ c }}
				</span>
				<br />
				教师：张三
			</div>
			<img :src="pictureUrl" class="image" />
		</div>
	</el-card>
</template>

<script>
export default {
	name: "CourseCard",
	props: ["courseName", "classes", "teacherId", "pictureUrl"],
	mounted() {
		// console.log("coursecard  mounted了", this.pictureUrl);
	},
};
</script>

<style scoped>
.image {
	width: 100%;
	position: absolute;
	opacity: 0.1;
	z-index: 1;
}
.card {
	position: relative;
	height: 120px;
}
.divImg {
	height: 70px;
}
.divMsg {
	position: absolute;
	z-index: 2;
	padding-left: 20px;
	width: 100%;
}
</style>
