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
				<!-- <el-form-item>
					<el-button type="primary" @click="getUsers">查询</el-button>
				</el-form-item> 
				<el-form-item style='float:right'>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item> -->
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
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">进入</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="totalPage" style="float:right;">
			</el-pagination>
		</el-col>
		<!--对话界面-->
		<el-dialog title="聊天窗口" v-model="editFormVisible" :close-on-click-modal="false"  style='padding-bottom:10px;'>
		 	<section id='now-dialog'>
		 		<el-col :span="14" style='border-right:1px solid #d1dbe5'>
					<div class='dialog_header'>
						<span>医美</span>
						<el-select v-model="status" placeholder="请选择" class='new-select' style='border:none'>
						    <el-option
						      v-for="item in options"
						      :key='item.key'
						      :label="item.name"
						      :value="item.key">
						    </el-option>
						 </el-select>
						 <span class='dialog_use' v-cloak>转接至：{{sysUserName}}</span>
					</div>
				  	<div class='dialog_chat'>
		                <div class="window-chat-time">
		                    <div>01-09 15:03 用户进入</div>
		                    <div>由心理美容01接待</div>
		                </div>
		                <div class="window-chat-txt">
		                    <img src="../../assets/logo.png" alt="正在加载"/>
		                    <div class="window-chat-txt-left">
		                        您好我是您的专属咨询师，您好我是您的专属咨询师,
		                    </div>
		                </div>
		                <div class="window-chat-txt">
		                    <div class="window-chat-txt-right">
		                        您好我是您的专属咨询师，您好我是您的专属咨询师
		                    </div>
		                    <img src="../../assets/logo.png" alt="正在加载"/>
		                </div>
		            </div>
		            <div class='dialog_foot'>
		            	<el-input
						  type="textarea"
						  :autosize="{ minRows: 2, maxRows: 5}"
						  placeholder="请输入内容"
						  >
						</el-input>
		            </div>
				</el-col>
				<el-col :span="10">
					<el-tabs v-model="activeName" @tab-click="handleClick">
					    <el-tab-pane label="用户信息" name="first">
							<template>
								<div class="window_right_msg">
					                <div><i class="window_right_icon"></i>个人信息</div>
					                <div>姓名：1498</div>
					                <div>手机号：13634982345</div>
					                <div>IP地址：北京</div>
					                <div>来源页面：李敏页面详情</div>
					            </div>
					            <div class="window_right_msg">
					                <div><i class="window_right_icon"></i>历史记录</div>
					                <div style="color:#999;margin-top: 50px;margin-bottom: 50px;">暂无数据记录</div>
					            </div>
							</template>
						</el-tab-pane>
					    <el-tab-pane label="制定方案" name="second">
							<template>
								<section id='progess'>
									<div class="window_right_msg1">
					                <div>名称：润白眼玻尿酸1M</div>
					                <div>手机号：13634982345</div>
					                <div>治疗时长：10分钟</div>
					                <div>技术理念：李敏页面详情</div>
					                <div>治疗效果：李敏页面详情</div>
					                <div>项目优势：李敏页面详情</div>
					                <div>价格：李敏页面详情</div>
					            </div>
					            <div class="window_right_msg1">
					                <div class="window_right_btn">
					                    <span>+</span>添加方案
					                </div>
					            </div>
					            <div class="window_right_msg1">
					                <div class="window_right_price">
					                    <span>总价：￥148.00</span>
					                    <button>确认方案</button>
					                </div>
					            </div>
								</section>
							</template>
						</el-tab-pane>
					  </el-tabs>
				</el-col> 
		 	</section>

			<!-- <el-form :model="editForm" label-width="80px" :rules='editFormRules' ref="editForm"  name='editForm' action="/momingtang/web/backCourse/updateCourse" enctype='multipart/form-data' id='editForm' method='post'
			>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div> -->
		</el-dialog>
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
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
				listURL:'api/beta/counseling/list.aspx?status=1',
				Authorization:`MEDCOS#${this.$router.params.sessionKey}`,
				listLoading: false,
				status:1,
				options:[{name:'有效对话',key:1},{name:'无效对话',key:2}],
				activeName: 'first',

				pickerOptions0: {//时间选择
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },


				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					/*sName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]*/
				},
				//编辑界面数据
				editForm: {
					sid: 0,
				    sName: "",
				    cover: "",
				    sdetailsPic: "",
				    businessHours: "",
				    address: "",
				    province: "",
				    city: "",
				    attribution:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					/*province: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],
					city: [
						{ required: true, message: '请选择省份', trigger: 'blur' }
					],*/
					sName: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//新增界面数据
			}
		},
		methods: {
			handleClick(tab, event) {
		        console.log(tab, event);
		      },
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				/*let para = {
					status:this.status,
					currentPage: this.currentPage,
					pageSize: this.pageSize,
					//name: this.filters.name
				}*/
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
					this.totalPage = res.data.data.pager.recordCount;
					this.currentPage = res.data.data.pager.pageNumber;
					this.pageSize = res.data.data.pager.pageSize;
					this.users = res.data.data.list;
					this.listLoading = false;
				}).catch(err => {
					this.listLoading = false;
				})
			},
			//删除
			/*handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					let para = { sid: row.sid };
					$.ajax({
						url: '/momingtang/web/backSchool/deleteSchool',
						type: 'POST',
						data: para,
					})
					.done(function(res) {
						console.log("success-----单个删除");
						this.listLoading = false;
						NProgress.done();
						console.log(res)
						if(res.status == 1){
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$notify({
								title: '失败',
								message: '删除失败',
								type: 'error'
							});
							this.getUsers();
						}
					}.bind(this));
				}).catch(() => {

				});
			},*/
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			/*handleAdd: function () {
				this.addFormVisible = true;
			},*/
			//编辑
			editSubmit: function () {
				/*this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								NProgress.done();
								this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});*/
			},
			//新增
			addSubmit: function (e) {
				/*this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							NProgress.start();
							let para = Object.assign({}, this.addForm);
							/*para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								NProgress.done();
								this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});*/
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.username || '';
				//this.sysUserAvatar =  || '';
			}
			this.getUsers();
		}
	}
</script>

<style scoped>
/* 聊天窗口*/
#now-dialog{
	margin-top: -20px;color: #666
}
.el-dialog--small{width:66%;}
/* 对话框头部 */
#now-dialog .dialog_header{font-size:18px;color:#58B7FF;line-height: 41px;border-bottom:1px solid #d1dbe5}
.dialog_header .dialog_use{float: right;font-size: 14px;margin-right: 20px;}
#now-dialog .new-select{width:108px;font-size:12px;}
/* 聊天界面 */
.dialog_chat{overflow-y:scroll;height:250px;padding:10px;}
.window-chat-time{text-align: center;}
.window-chat-txt{
    position:relative;display:flex;margin-top:1rem;
}
.window-chat-txt img{display:block;width:50px;height:50px;border-radius: 50%;}
.window-chat-txt div{display: flex;flex:1;justify-content: center;align-items: center;border-radius: 1rem;position: relative;background:#c1c1c1;padding:5px;}
.window-chat-txt .window-chat-txt-right{margin-right: 20px;}
.window-chat-txt .window-chat-txt-left{margin-left: 20px;}
.window-chat-txt-right:after{
    content:'';position: absolute;top:1.3rem;right:-1.3rem;
    border-width: 8px;border-style:dashed dashed dashed solid;border-color: transparent transparent transparent #c1c1c1;
}
.window-chat-txt-left:before{
    content:'';position: absolute;top:1.3rem;left:-1.3rem;
    border-width: 8px;border-style:dashed solid dashed dashed;border-color: transparent #c1c1c1 transparent transparent;
}
.window_right_info{border-left:0.08rem solid #c1c1c1;height: 326px;background: #fff}
.window_right_msg{padding-top: 10px;padding-left:40px;position:relative;line-height:2;height:160px;}
.window_right_icon{position: absolute;width:15px;height:15px;background-color:red;top:10px;left:20px;}
/**/
.window_right_msg1{padding: 10px;
    position: relative;
    line-height: 2;}
.window_right_btn{display: flex;justify-content: center;align-items: center;border:1px solid #c1c1c1;
    cursor: pointer;}
.window_right_btn span{font-size: 2rem;position: relative;top:-2px;}
.window_right_price{height: 48px;display: flex;justify-content: space-around;align-items: center}
.window_right_price button{background-color:lightskyblue;padding:3px;color:#fff;cursor: pointer}
#progess{height: 340px; overflow-y:scroll;}
</style>