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
						<select seleted='1' placeholder="请选择" class='new-select'>
						    <option
						      v-for="item in options"
						      :key='item.key'
						      :label="item.name"
						      :value="item.key">
						    </option>
						 </select>
						 <span class='dialog_use' v-cloak>转接至：{{sysUserName}}</span>
					</div>
					<div class="window-chat-time">
		                    <div>{{nowDate}} 用户进入</div>
		                    <div>由<span style='color:#58B7FF'>{{sysUserName}}</span>接待</div>
		                </div>
				  	<div id='dialog_chat'>
				  		<!-- <Message></Message> -->   
		            </div>
		            <div class='dialog_foot'>
		            	<el-input style='width:80%;' v-model='a'
						  type="text" id="info_text" size='large'
						  placeholder="请输入内容 同时按住Ctrl+Enter发送消息"
						  @keyup.native='onKeyup'
						  >
						</el-input>
						<div id='chose'>
							<input type="file" id="image" name='file' @change='handleAvatarSuccess'/>
							<i class='el-icon-plus'></i>
						</div>
						<el-button @click.native='sendMessageText'>发送</el-button>
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
						                <el-button size="large" icon='plus' @click.native='addProgess'>添加方案</el-button>
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
		</el-dialog>

		<!--添加方案-->
		<el-dialog title="添加方案" v-model="addFormVisible" :close-on-click-modal="false"  style='padding-bottom:10px;'>
			<el-form :model="addForm" name='addForm'>
			    <el-form-item label="名称" label-width="80px">
			      <el-input v-model="addForm.name" class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="功效" label-width="80px">
			      <el-input v-model='addForm.desp.gongxiao' class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="规格" label-width="80px">
			      <el-input v-model='addForm.desp.guige' class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
			     <el-form-item label="价格" label-width="80px">
			      <el-input v-model='addForm.cPrice' type='number' class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="数量" label-width="80px">
			      <el-input v-model='addForm.num' type='number' class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
		    </div>
		</el-dialog>
	</section>
</template>

<script>
	import axios from 'axios'
	import $ from 'jquery'
	import '../../css/now.css'
	//import Message from './chat/message.vue'
	export default {
		//components:{ Message },
		data() {
			return {
				filters: {
					firsttime: new Date()
				},
				sysUserName:'',
				users: [],
				a:'',
				imageUrl: '',
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
				nowDate: getShowDate(),
				listURL:'api/beta/counseling/list.aspx?status=1',//请求url
				Authorization:`MEDCOS#${this.$router.params.sessionKey}`,//设置请求
				listLoading: false,
				usersUno:this.$router.params.counselor.uno,//发送者环信ID
				toUser:'',
				options:[{name:'当前对话',key:1},{name:'无效对话',key:2}],
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
				
				//编辑界面数据
				editForm: {
					
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addForm:{
					name:'',
					cPrice:'',
					num:'',
					desp:{
						guige:'',
						gongxiao:''
					}
				}
				//新增界面数据
			}
		},
		methods: {
			//上传图片
			handleAvatarSuccess() {
				let file = $('#image')[0].files[0];
				if(file) return true
		      },
			//发送消息
			onKeyup (e) {
				let messages = this.a;
	            if (e.ctrlKey && e.keyCode === 13 && messages.length) {
	            	this.a = '';
	                if(this.handleAvatarSuccess()){
	                	let file = $('#image')[0].files[0];
						var reader = new FileReader();  
					    //将文件以Data URL形式读入页面  
					    reader.readAsDataURL(file);
					    var _this = this;  
					    reader.onload = function(e){  
					        //显示文件
					        _this.imageUrl = e.target.result;
					        //sendPrivateImg(_this.imageUrl,_this.toUser.consumerUno)
					    } 
						let imgSrc = this.imageUrl;
						//console.log(this.imageUrl)
						console.log(imgSrc + '已经获取到图片')
		            	sendPrivateImg(imgSrc,this.toUser.consumerUno)
		            	let obj = $('#image')[0]; 
	            		obj.outerHTML = obj.outerHTML;
	            		this.imageUrl = '';
		            }
		            if(messages !=''){
		            	console.log('准备发送文字')
		            	sendPrivateText(messages,this.toUser.consumerUno)
		            }
	            }
	        },
			sendMessageText(){
	            if(this.handleAvatarSuccess()){
	            	console.log('准备发送图片')
	            	let file = $('#image')[0].files[0];
					var reader = new FileReader();  
				    //将文件以Data URL形式读入页面  
				    reader.readAsDataURL(file);
				    var _this = this;  
				    reader.onloadend = function(e){  
				        //显示文件
				        _this.imageUrl = e.target.result;
				        
				    } 
					let imgSrc = this.imageUrl;
					//console.log(this.imageUrl)
					console.log(imgSrc + '已经获取到图片')
					sendPrivateImg(imgSrc,this.toUser.consumerUno)
	            	let obj = $('#image')[0]; 
	            	obj.outerHTML = obj.outerHTML;
	            }
	            let messages = this.a;
	            if(messages !== ''){
	            	console.log('准备发送文字')
	            	sendPrivateText(messages,this.toUser.consumerUno)
	            	this.a='';
	            }
			},
			//加载聊天数据
			infoMessage(){

				let info = {
	            	fromUno:this.usersUno,//this.toUser.consumerUno
	            	toUno:this.toUser.consumerUno,
	            	pageNumber:1,
	            	pageSize:20
	            }
	            let ret = ''
                for (let it in info) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(info[it]) + '&'
                }
	            //console.log(ret);
	            axios({//请求本地服务器
					url: `/api/beta/easemob/chat/list.aspx?${ret}`,
					type: 'get',
					data: '',
					/*transformRequest: [function (data) {
	                // Do whatever you want to transform the data
	                let ret = ''
	                for (let it in data) {
	                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
	                }
	                return ret
	              }],*/
					headers:{
							Authorization:this.Authorization,
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(res => {
					//console.log(res);
					this.chatInfo = res.data.list
					this.filter(this.chatInfo);
					msgScrollTop();
				}).catch(err => {
					console.log(err)
				})
			},
			filter(msg) {
				//console.log(111)
				for(let i = msg.length-1;i > 0;i--){
					if(msg[i].fromuno == this.usersUno){
		                if(msg[i].msgtype == 0){
		                	msgShow('sender','text',msg[i].msg,msg[i].ctime);
		                }
						if(msg[i].msgtype == 1){
							msgShow('receiver','img',msg[i].msg,msg[i].ctime);
						}
					}else{
		                if(msg[i].msgtype == 0){
		                	msgShow('receiver','text',msg[i].msg,msg[i].ctime);
		                }
						if(msg[i].msgtype == 1){
							msgShow('receiver','img',msg[i].msg,msg[i].ctime);
						}
					}
				}
			},
			handleClick(tab, event) {
		        //console.log(tab, event);
		      },
			//分页展示
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getUsers();
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
					//console.log(res);
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
				//this.editForm = Object.assign({}, row);
				$("#dialog_chat").empty();
				let id = row.id;
				//console.log(id)
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
							'Content-Type': 'application/x-www-form-urlencoded'
						}
				}).then(res => {
					console.log(res)
					this.toUser = res.data.data.counseling;
					this.infoMessage();
				})
			},
			//显示新增界面
			addProgess: function () {
				this.addFormVisible = true;
			},
			//编辑
			
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
			//console.log('---------11111-----------1111--------------------')
			//console.log(this.$store.state)
		}
	}
</script>

<style scoped>
/* 聊天窗口*/
.myInput{width:218px;}
#chose{position: absolute;top:10px;right:8px;}
#image{width:25px;position: absolute;top:0;right:-6px;opacity: 0}
</style>