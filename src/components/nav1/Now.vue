<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-top:10px;padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				 <el-form-item label='当前时间'>
					<el-date-picker
				      v-model="filters.firsttime"
				      type="date"
				      placeholder="选择日期"
				      :picker-options="pickerOptions0">
				    </el-date-picker>
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
				<el-table-column prop="devicetype" label="来源终端" width="115" sortable>
				</el-table-column>
				<el-table-column prop="address" label="用户IP地址" width="130" sortable>
				</el-table-column>
				<el-table-column prop="page" label="来源页面" min-width="100" sortable></el-table-column>
				<el-table-column prop="status" label="状态" min-width="80" sortable>
				</el-table-column>
			<el-table-column label="操作" width="90">
				<template scope="scope">
					<!-- <el-badge :value="3" :max="99" class="item">
					  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">回复</el-button>
					</el-badge> -->
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">进入</el-button>
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
	export default {
		data() {
			return {
				filters: {
					firsttime: new Date()
				},
				sysUserName:'',
				users: [],
				totalPage:0,//总记录数
				currentPage: 0,//当前页
				pageSize: 10,//每页显示多少
				nowDate: getShowDate(),//获取当前时间
				listURL:'/api/beta/counseling/list.aspx?status=1',//请求url 当前会话列表
				Authorization:'',//设置请求
				listLoading: false,
				activeName: 'first',//默认选项卡

				pickerOptions0: {//时间选择
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
			}
		},
		methods: {
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				//this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				axios({
					url: this.listURL,
					type: 'get',
					data: '',
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
					this.listLoading = false;
					//this.totalPage = res.data.data.pager.recordCount;
					this.currentPage = res.data.data.pager.pageNumber;
					this.pageSize = res.data.data.pager.pageSize;
					//let list = res.data.data.list;
					//let list = listUsers(res.data.data.list);
					this.users = listUsers(res.data.data.list);;
					this.totalPage = this.users.length
				}).catch(err => {
					this.listLoading = false;
				})
			},
			handleEdit (index, row) {
				let id = row.id;
				this.$router.push({ path: `/now/${id}`});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.username || '';
				//this.sysUserAvatar =  || '';
			}
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
.item{margin-top: 10px;
  margin-right: 40px;}
</style>