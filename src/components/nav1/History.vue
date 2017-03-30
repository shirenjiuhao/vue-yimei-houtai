<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-top:10px;padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				 <el-form-item>
					<el-date-picker
				      v-model="filters.firsttime"
				      type="date"
				      placeholder="选择日期"
				      >
				    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getUsers">查询</el-button>
				</el-form-item> 
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
				<el-table-column prop="firsttime" label="会话开始时间" width="150" sortable>
				</el-table-column>
				<el-table-column prop="consumername" label="用户名" width="130" sortable>
				</el-table-column>
				<el-table-column prop="tel" label="手机号" width="130" sortable>
				</el-table-column>
				<el-table-column prop="address" label="用户IP地址" width="130" sortable>
				</el-table-column>
				<el-table-column prop="devicetype" label="服务医生" min-width="100" sortable>
				</el-table-column>
				<el-table-column prop="page" label="来源页面" min-width="100" sortable></el-table-column>
				<el-table-column prop="status" label="状态" min-width="80" sortable>
				</el-table-column>
			<el-table-column label="操作" width="90">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
					<!-- <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import axios from 'axios'
	import util from '../../api/util.js'
	
	export default {
		data() {
			return {
				filters: {
					firsttime: ''
				},
				users: [],
				totalPage:0,
				currentPage: 1,
				pageSize: 10,
				listURL:'api/beta/counseling/list.aspx?status=1',
				Authorization:'',
				listLoading: false,
			}
		},
		methods: {
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				/*this.filters.firsttime = (!this.filters.firsttime || this.filters.firsttime == '') ? '' : util.formatDate.format(new Date(this.filters.firsttime), 'yyyy-MM-dd');*/
				let para = {
					stime: this.filters.firsttime,
					pageNumber: this.currentPage,
					pageSize: this.pageSize,
					//name: this.filters.name
				}
				axios({
					url: this.listURL,
					type: 'get',
					data: para,
					transformRequest: [function (data) {
	                // Do whatever you want to transform the data
		                let ret = ''
		                for (let it in data) {
		                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
		                }
		                return ret
		             }],
					headers:{
							Authorization:this.Authorization,
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(res => {
					console.log(res);
					this.totalPage = res.data.data.pager.recordCount;
					this.currentPage = res.data.data.pager.pageNumber;
					this.users = res.data.data.list;
					this.listLoading = false;
				}).catch(err => {
					this.listLoading = false;
				})
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				let id = row.id;
				this.$router.push({ path: `/history/${id}`});
			}
		},
		mounted() {
			var userInfo = localStorage.getItem('COUNNAME');
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
				//console.log(userInfo)
				this.Authorization = `MEDCOS#${userInfo.sessionKey}`;
				this.getUsers();
			}
		}
	}
</script>

<style scoped>
	
</style>