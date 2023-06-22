<template>
	<el-container>
		<el-header>
			<el-input
				placeholder="搜索表单"
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
				添加表单
			</el-button>
		</el-header>
		<el-table
			:data="showFormsData"
			border
			style="width: 100%"
			highlight-current-row
		>
			<el-table-column prop="formName" label="表单名"> </el-table-column>
			<el-table-column prop="formId" label="表单id"> </el-table-column>

			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button
						@click="handleClick(scope.row)"
						type="text"
						size="small"
					>
						查看
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="margin-top: 10px">
			<el-pagination
				style="text-align: center"
				background
				layout="prev, pager, next"
				:total="formsData.length"
				:page-size="pageSize"
				:current-page="currentPage"
				@prev-click="prevClick"
				@next-click="nextClick"
				@current-change="currentChange"
			>
			</el-pagination>
		</div>
	</el-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
	name: "ManageForms",
	data() {
		return {
			// 搜索表单的字符串
			searchMsg: "",
			// 添加表单对话框
			dialogFormVisible: false,
			pageSize: 10,
			currentPage: 1,
		};
	},
	computed: {
		showFormsData() {
			return this.formsData.slice(
				(this.currentPage - 1) * this.pageSize,
				this.currentPage * this.pageSize
			);
		},

		...mapState("manageInfoOptions", ["formsData"]),
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
			console.log("点击了row：", row);
		},
		...mapActions("manageInfoOptions", ["getAllFormsData"]),
	},
	mounted() {
		this.getAllFormsData();
	},
};
</script>

<style></style>
