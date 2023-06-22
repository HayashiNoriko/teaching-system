export default {
	namespaced: true,
	actions: {},
	mutations: {
		getProvinceOptions(state, value) {
			fetch("/json/all_uni.json")
				.then((res) => res.json()) // 这是一个Promise，因此还要继续then
				.then((res) => {
					let unis = res;
					let allProvinces = [];
					unis.forEach((uni) => {
						let province = uni.province;
						if (!allProvinces.includes(province)) {
							allProvinces.push(province);
						}
					});
					console.log("即将保存 provinceOptions");
					state.provinceOptions = allProvinces.map((item) => {
						return { value: item, label: item };
					});
					console.log(state.provinceOptions);
				});
		},
		getCityOptions(state, value) {
			console.log("provinceValue是", value);
			fetch("/json/all_uni.json")
				.then((res) => res.json()) // 这是一个Promise，因此还要继续then
				.then((res) => {
					let unis = res;
					let allCities = [];
					unis.forEach((uni) => {
						if (uni.province === value) {
							if (!allCities.includes(uni.city)) {
								allCities.push(uni.city);
							}
						}
					});
					console.log("allCities为", allCities);
					console.log("即将保存 cityOptions");
					state.cityOptions = allCities.map((item) => {
						return { value: item, label: item };
					});
					console.log(state.cityOptions);
				});
		},
		getSchoolOptions(state, value) {
			console.log("cityValue是", value);
			fetch("/json/all_uni.json")
				.then((res) => res.json()) // 这是一个Promise，因此还要继续then
				.then((res) => {
					let unis = res;
					let allSchools = [];
					unis.forEach((uni) => {
						if (uni.city === value) {
							if (!allSchools.includes(uni.name)) {
								allSchools.push(uni.name);
							}
						}
					});
					console.log("allSchools为", allSchools);
					console.log("即将保存 schoolOptions");
					state.schoolOptions = allSchools.map((item) => {
						return { value: item, label: item };
					});
					console.log(state.schoolOptions);
				});
		},
	},
	state: {
		provinceOptions: [],
		cityOptions: [],
		schoolOptions: [],
	},
	getters: {
		// getters里面只能处理一些简单的逻辑，发请求还是写在mutation里，然后用它修改state，然后再在页面中mapState。。。。。
		// 刚刚试了直接在getters里发请求，然后在页面中mapgetters，失败了。
	},
};
