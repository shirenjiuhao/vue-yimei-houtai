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
		 	<section id='now-dialog' :data='doctorInfo'>
		 		<el-col :span="14" style='border-right:1px solid #d1dbe5'>
					<div class='dialog_header'>
						<span>医美</span>
						<select seleted='1' placeholder="请选择" class='new-select'>
						    <option
						      v-for="item in options"
						      :key='item.key'
						      :label="item.name"
						      :value="item.key">
						    </option>
						 </select>
						 <span class='dialog_use' v-cloak>转接至：{{doctorInfo.doctorName}}</span>
					</div>
				  	<div class='dialog_chat'>
		                <div class="window-chat-time">
		                    <div>{{doctorInfo.reserveTime}} 用户进入</div>
		                    <div>{{doctorInfo.doctorName}}</div>
		                </div>
		                <div class="window-chat-txt">
		                    <img src="../../assets/logo.png" alt="正在加载"/>
		                    <div class="window-chat-txt-left">
		                        您好我是您的烦着，您好我是您的专属咨询师,
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
		            	<el-input style='width:80%;' v-model='a'
						  type="textarea" id="info_text"
						  :autosize="{ minRows: 2, maxRows: 5}"
						  placeholder="请输入内容"
						  >
						</el-input>
						<el-button @click.native='sendPrivateText'>发送</el-button>
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
					                <el-card class="box-card">
									  <div v-for="o in lishi">
									    {{'列表内容 ' + o.firsttime }}
									  </div>
									</el-card>
					            </div>
							</template>
						</el-tab-pane>
					    <el-tab-pane label="制定方案" name="second">
							<template>
								<section id='progess'>
									<el-card class="box-card">
									  <div v-for="o in progess">
									    {{o}}
									  </div>
									</el-card>
						            <div class="window_right_msg1">
						                <el-button size="large" icon='plus'>添加方案</el-button>
						            </div>
						            <div class="window_right_msg1">
						                <div class="window_right_price">
						                    <span>总价：￥148.00</span>
						                    <el-button size="small">确认方案</el-button>
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
	import $ from 'jquery'
	import '../../css/now.css'
	import '../chat/src/mainChat.js'
	
	export default {
		data() {
			return {
				filters: {
					firsttime: new Date()
				},
				sysUserName:'',
				users: [],
				infoMsg:{},
				doctorInfo:{},
				a:'',
				fromto:'',
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
				listURL:'api/beta/counseling/list.aspx?status=1',
				Authorization:`MEDCOS#${this.$router.params.sessionKey}`,
				listLoading: false,
				status:1,
				options:[{name:'有效对话',key:1},{name:'无效对话',key:2}],
				activeName: 'first',
				lishi:[{firsttime:'2017-03-17'},{firsttime:'2017-03-17'}],
				progess:['名称：润白眼玻尿酸1M',
						'手机号：13634982345',
						'治疗时长：10分钟',
						'技术理念：李敏页面详情',
						'治疗效果：李敏页面详情',
						'项目优势：李敏页面详情',
						'价格：李敏页面详情'
						],
				chatInfo:[],		

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
			//发送消息
			sendPrivateText(){
				//console.log(this.editForm)
				//console.log(this.$router.params.counselor.uno)
				let mestype='' ,content='';
				let messages = this.a;
				if (messages == '') {
	                return false
	            }
	            this.a = '';
	            let id = conn.getUniqueId();                 // 生成本地消息id
	            let msg = new WebIM.message('txt', id);      // 创建文本消息
	            msg.set({
	                msg: messages,                  // 消息内容
	                to: this.infoMsg.consumerUno,                          // 接收消息对象（用户id）
	                roomType: false,
	                success: function (id, serverMsgId) {
	                    console.log('send private text Success');
	                    console.log(msg)
	                    mestype = msg.type;
	                    content = msg.val;
	                    switch(mestype){
	                    	case 'txt':
	                    	$('.dialog_chat').append('<div class="window-chat-txt">' + 
			    			'<div class="window-chat-txt-right"> '+
			    						msg.value +'</div>'+
			    					'<img src="/src/assets/logo.png" alt="正在加载"/>'+
							'</div>')
							break;
	                    }
	                    
	                }
	            });
	            msg.body.chatType = 'singleChat';
	            conn.send(msg.body);
	            let info = {
	            	fromUno:this.$router.params.counselor.uno,
	            	toUno:this.editForm.consumername,
	            	messageType:1,
	            	content:content
	            }
	            axios({//存入本地服务器
					url: '/api/beta/easemob/chat/list.aspx',
					type: 'post',
					data: info,
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
				}).catch(err => {
					this.listLoading = false;
				})
			},
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
					this.listLoading = false;
					this.totalPage = res.data.data.pager.recordCount;
					this.currentPage = res.data.data.pager.pageNumber;
					this.pageSize = res.data.data.pager.pageSize;
					this.users = res.data.data.list;
				}).catch(err => {
					this.listLoading = false;
				})
			},
			
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				window.open('/src/chat/index.html');
				this.editForm = Object.assign({}, row);
				console.log(row);
				let id=row.id
				axios({
					url: `/api/beta/counseling/info.aspx?id=${id}`,
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
							'Content-Type': 'application/json'
						}
				}).then(res => {
					console.log(res);
					if(res.data.status == 200){
						this.infoMsg = res.data.data.counseling;	
						//this.doctorInfo = res.data.data.scheme
					}else{

					}
				}).catch(err => {
					
				})
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

<style scoped lang='less'>
/* 聊天窗口*/

</style>