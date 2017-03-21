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
				  	<div class='dialog_chat'>
				  		<!-- <Message></Message> -->
		                 <div class="window-chat-time">
		                    <div>01-09 15:03 用户进入</div>
		                    <div>由心理美容01接待</div>
		                </div>
		                <!-- <div class="window-chat-txt">
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
		                </div>  -->
		                <div class="window-chat-time">
		                    <div>2017-01-09 15:03:22</div>
		                </div>
		                <div class='sendImg'><img src="../../assets/logo.png" alt="">
		                	<img class='touxiang' src="../../assets/1.jpg" alt="正在加载"/>
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
				totalPage:0,
				currentPage: 0,
				pageSize: 10,
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
			//发送消息
			sendPrivateText(){
				let messages = this.a;
				let mestype='' ,content='';
				if (messages == '') {
	                return false
	            }
	            this.a = '';
	            let id = conn.getUniqueId();                 // 生成本地消息id
	            let msg = new WebIM.message('txt', id);      // 创建文本消息
	            msg.set({
	                msg: messages,                  // 消息内容
	                to: this.toUser.consumerUno,             // 接收消息对象（用户id）
	                roomType: false,
	                success: function (id, serverMsgId) {
	                    console.log('send private text Success');
	                    console.log(msg)
	                    mestype = msg.type;
	                    content = msg.value;
	                    let date =  new Date();
	                    let day = date.getDate() > 10 ? '0'+ date.getDate() : date.getDate();
	                    let month = date.getMonth() >10 ? '0' + date.getMonth() :date.getMonth();
	                    let hour = date.getHours() >10 ?'0'+date.getHours() : date.getHours();
	                    let minutes = date.getMinutes() >10 ?'0'+date.getMinutes():date.getMinutes();
	                    let seconds = date.getSeconds() >10 ?'0'+date.getSeconds():date.getSeconds()
	                    let string = date.getFullYear()+'-'+month+1 +'-'+ day +' '+ hour + ':' + minutes + ':' + seconds ;
	                    $('.dialog_chat').append('<div class="window-chat-time">'+
		                    '<div>'+ string +'</div>'+
		                '</div>');
	                    $('.dialog_chat').append('<div class="window-chat-txt">' + 
						    '<div class="window-chat-txt-right"> '+
						    msg.value +'</div>'+
						    '<img src="/src/assets/logo.png" alt="正在加载"/>'+
						'</div>');
						$('.dialog_chat').scrollTop = $('.dialog_chat').scrollHeight - $('.dialog_chat').clientHeight;
	                }
	            });
	            msg.body.chatType = 'singleChat';
	            conn.send(msg.body);
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
	                return ret
	            console.log(info);
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
					console.log(res);
					this.chatInfo = res.data.list
					this.filter(this.chatInfo);
				}).catch(err => {
					console.log(err)
				})
			},
			filter(msg) {
				//console.log(111)
				for(let i=0;i< msg.length ;i++){
					if(msg[i].touno == this.usersUno){
						$('.dialog_chat').append('<div class="window-chat-time">'+
		                    '<div>'+ msg[i].ctime+'</div>'+
		                '</div>');
		                if(msg[i].msgtype == 0){
		                	$('.dialog_chat').append('<div class="window-chat-txt">'+
							    '<img src="/src/assets/logo.png" alt="正在加载"/>'+
							    '<div class="window-chat-txt-left">' +
							    msg[i].msg +'</div>'+
							'</div>')
		                }
						if(msg[i].msgtype == 1){
							$('.dialog_chat').append('<div class="window-chat-txt">'+
							    '<img src="/src/assets/logo.png" alt="正在加载"/>'+
							    '<div class="window-chat-txt-left">' +
							    msg[i].msg +'</div>'+
							'</div>')
						}
					}else{
						$('.dialog_chat').append('<div class="window-chat-time">'+
		                    '<div>'+ msg[i].ctime+'</div>'+
		                '</div>');
		                $('.dialog_chat').append('<div class="window-chat-txt">' + 
						    '<div class="window-chat-txt-right"> '+
						    msg[i].msg +'</div>'+
						    '<img src="/src/assets/logo.png" alt="正在加载"/>'+
						'</div>')
					}
				}
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
				//this.editForm = Object.assign({}, row);
				let id = row.id;
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
</style>