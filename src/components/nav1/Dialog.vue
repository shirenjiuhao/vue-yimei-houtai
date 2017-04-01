<template>
	<section>
	 	<section id='now-dialog'>
	 		<el-col :span="14" style='border-right:1px solid #d1dbe5'>
				<div class='dialog_header'>
					<el-button @click.native='backUpPage'>返回</el-button>
					<span>医美</span>
					<select seleted='1' placeholder="请选择" class='new-select'>
					    <option
					      v-for="item in options"
					      :key='item.key'
					      :label="item.name"
					      :value="item.key">
					    </option>
					 </select>
				</div>
			  	<div id='dialog_chat'>
			  		<!-- <Message></Message> -->   
	            </div>
	            <div class='dialog_foot'>
	            	<el-input style='width:80%;' v-model='a'
					  type="text" id="info_text" size='large'
					  placeholder="请输入内容 Enter发送消息" autofocus="autofocus"
					  @keyup.native='onKeyup'
					  >
					</el-input>
					<div id='chose'>
						<input type="file" id="image" name='file' @change='handleAvatarSuccess'/>
						<i class='el-icon-plus'></i>
					</div>
					<el-button @click.native='sendMessageText' :loading='editLoading'>发送</el-button>
	            </div>
			</el-col>
			<el-col :span="10">
				<el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="用户信息" name="first">
						<div class="window_right_msg">
			                <div><i class="window_right_icon"></i>个人信息</div>
			                <div>姓名：{{toUser.consumerName || '正在加载'}}</div>
			                <div>手机号：{{toUser.tel || '正在加载'}}</div>
			                <div>IP地址：{{toUser.address || '正在加载'}}</div>
			                <div>来源页面：{{toUser.page || '正在加载'}}</div>
			            </div>
					</el-tab-pane>
				    <el-tab-pane label="制定方案" name="second">
						<section id='progess'>
							<el-card id='progessInfo' class="box-card" v-for="o in progess" :key='o.id'>
							    <div>项目名称：{{o.name}}</div>
							    <div>使用部位：{{o.body}}</div>
							    <div>治疗时长：{{o.curetime}}</div>
							    <div>技术理念：{{o.idea}}</div>
							    <div>治疗效果：{{o.effect}}</div>
							    <div>项目优势：{{o.advantage}}</div>
							    <div>项目金额：￥{{o.amount}}</div>
							    <div>优惠金额：￥{{o.discount}}</div>
							</el-card>
				            <div class="window_right_msg1">
				                <el-button size="large" icon='plus' @click.native='addProgess'>添加方案</el-button>
				            </div>
				            <div class="window_right_msg1">
				                <div class="window_right_price">
				                    <span style='color: #20a0ff'>总价：￥{{orderPrice}}</span>
				                    <el-button size="small" @click.native='sendMessageInfo'>确认方案</el-button>
				                </div>
				            </div>
						</section>
					</el-tab-pane>
					<el-tab-pane label="方案列表" name="third">
						<section class='progessList'>
							<el-card class='box-card' v-for="item in AllProgess" :key='item.id'>
							<div v-for='o in item.items' style='border-bottom:1px solid #d1dbe5'>
								<div>项目名称：{{o.name}}</div>
							    <div>使用部位：{{o.body}}</div>
							    <div>治疗时长：{{o.curetime}}</div>
							    <div>技术理念：{{o.idea}}</div>
							    <div>治疗效果：{{o.effect}}</div>
							    <div>项目优势：{{o.advantage}}</div>
							    <div>项目金额：￥{{o.amount}}</div>
							    <div>优惠金额：￥{{o.discount}}</div>
							</div>
							</el-card>
						</section>
					</el-tab-pane>
				  </el-tabs>
			</el-col> 
	 	</section>
		<!--添加方案-->
		<el-dialog title="添加方案" v-model="addFormVisible" :close-on-click-modal="false"  style='padding-bottom:10px;'>
			<el-form :model="addForm" name='addForm' :rules='addFormRules' ref="addForm"  :inline='true'>
				<el-form-item label="医生列表" label-width="100px" prop='doctorId'>
			      <el-select v-model="addForm.doctorId" placeholder="请选择医生">
				    <el-option :key='item.id'
				      v-for="item in doctors"
				      :label="item.name"
				      :value="item.id">
				    </el-option>
				  </el-select>
			    </el-form-item>
			    <el-form-item label="项目名称" label-width="100px" prop='name'>
			      <el-input v-model="addForm.name" class='myInput' placeholder="请输入项目名称" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="使用部位" label-width="100px" prop='body'>
			      <el-input v-model='addForm.body' class='myInput' placeholder="请输入使用部位" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="治疗时长" label-width="100px" prop='curetime'>
			      <el-input v-model='addForm.curetime' class='myInput' placeholder="请输入治疗时长" auto-complete="off"></el-input>
			    </el-form-item>
			     <el-form-item label="技术理念" label-width="100px" prop='idea'>
			      <el-input v-model='addForm.idea' class='myInput' placeholder="请输入技术理念" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="治疗效果" label-width="100px" prop='effect'>
			      <el-input v-model='addForm.effect' class='myInput' placeholder="请输入治疗效果" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="项目优势" label-width="100px" prop='advantage'>
			      <el-input v-model='addForm.advantage' class='myInput' placeholder="请输入项目优势" auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="项目金额" label-width="100px" prop='amount'>
			      <el-input v-model='addForm.amount' type='number' placeholder="请输入项目金额" class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="优惠金额" label-width="100px" prop='discount'>
			      <el-input v-model='addForm.discount' type='number' placeholder="请输入优惠金额" class='myInput' auto-complete="off"></el-input>
			    </el-form-item>
		    </el-form>
		    <div slot="footer" class="dialog-footer">
			    <el-button @click.native="addFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确 定</el-button>
		    </div>
		</el-dialog>
	</section>
</template>
<script>
	import axios from 'axios'
	import '../../css/now.css'
	export default {
		data() {
			return {
				filters: {
					firsttime: new Date()
				},
				sysUserName:'',
				//users: [],
				a:'',//发送消息的model
				imageUrl: '',//发送图片的Url
				nowDate: getShowDate(),//获取当前时间
				userInfo:'',//当前用户信息
				Authorization:'',//设置请求头
				listLoading: false,
				usersUno:'',//发送者环信ID
				toUser:[],//接收者信息
				options:[{name:'当前对话',key:1}],
				activeName: 'first',//默认选项卡
				lishi:[{firsttime:'2017-03-17'},{firsttime:'2017-03-17'}],
				doctors:[],//医生列表
				progess:[],//项目方案详情
				chatInfo:[],//聊天记录
				MoreInfoMessage:[],
				orderPrice:'',//总价
				AllProgess:[],//所有方案记录		

				pickerOptions0: {//时间选择
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        },
		        //发送交互状态
				editLoading: false,

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					doctorId: [
						{ required: true, message: '请选择医生', trigger: 'change', type: "number" }
					],
					name:[
						{ required: true, message: '请输入项目名称', trigger: 'blur' }
					],
					body:[
						{ required: true, message: '请输入使用部位', trigger: 'blur' }
					],
					curetime:[
						{ required: true, message: '请输入治疗时长', trigger: 'blur' }
					],
					idea:[
						{ required: true, message: '请输入技术理念', trigger: 'blur' }
					],
					effect:[
						{ required: true, message: '请输入治疗效果', trigger: 'blur' }
					],
					advantage:[
						{ required: true, message: '请输入项目优势', trigger: 'blur' }
					],
					amount:[
						{ required: true, message: '请输入项目金额', trigger: 'blur' }
					],
					discount:[
						{ required: true, message: '请输入优惠金额', trigger: 'blur' }
					],
				},
				//新增界面数据
				addForm:{
					//id:1,//方案子项目
					//schemeId:'',//方案ID
					doctorId:'',//医生ID
					name:'',//项目名称
					body:'',//使用部位
					curetime:'',//治疗时长
					idea:'',//技术理念
					effect:'',//治疗效果
					advantage:'',//项目优势
					amount:'',//项目金额
					discount:'',//优惠金额
				}
			}
		},
		methods: {
			//返回上一页
			backUpPage(){
				window.history.go(-1)
			},
			//上传图片
			handleAvatarSuccess() {
				let file = $('#image')[0].files[0];
				if(file) return true
		    },
			//发送消息
			onKeyup (e) {//键盘发送
				let messages = this.a;
	            if (e.keyCode === 13 && messages !='') {
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
					        sendPrivateImg(_this.imageUrl,_this.toUser.consumerUno)
					        //sendPrivateImg(imgSrc,this.toUser.consumerUno)
			            	let obj = $('#image')[0]; 
		            		obj.outerHTML = obj.outerHTML;
					    } 
						let imgSrc = this.imageUrl;
						//console.log(this.imageUrl)
						console.log(imgSrc + '已经获取到图片')
		            }
		            if(messages !=''){
		            	console.log('准备发送文字')
		            	sendPrivateText(messages,this.toUser.consumerUno)
		            }
	            }
	        },
	        //发送文本
			sendMessageText(){
				this.editLoading = true;
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
				        sendPrivateImg(_this.imageUrl,_this.toUser.consumerUno);
		            	let obj = $('#image')[0]; 
		            	obj.outerHTML = obj.outerHTML;
				    } 
					let imgSrc = this.imageUrl;
					//console.log(this.imageUrl)
					this.editLoading = false;
					//console.log(imgSrc + '已经获取到图片')
	            }
	            let messages = this.a;
	            if(messages !== ''){
	            	this.a='';
	            	console.log('准备发送文字')
	            	sendPrivateText(messages,this.toUser.consumerUno);
	            }
	            this.editLoading = false;
			},
			//发送方案
			sendMessageInfo(){
				console.log('准备发送方案')
				//console.log($('#progessInfo')[0])
				console.log(this.progess)
				if(this.progess){
					//sendPrivateInfo(this.progess,this.toUser.consumerUno);
					let para = {
						schemeId: this.progess[0].schemeId
					}
					axios({
						url:'/api/beta/scheme/counselor/push.aspx',
						method:'post',
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
						console.log(res.data);
						let time = getShowDate();
					    msgShow('sender','info','messages',time);
					    msgScrollTop();
					})
				}else{
					alert('请添加方案')
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
					method: 'get',
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
					//console.log(this.chatInfo);
					this.filterInfo(this.chatInfo);
					msgScrollTop();
					this.getDangqianMsg();
					msgScrollTop();
				}).catch(err => {
					console.log(err)
				})
			},
			//生成聊天记录
			filterInfo(msg) {
				//获取历史聊天
				for(let i = msg.length-1;i >= 0;i--){
					if(msg[i].fromuno == this.usersUno){
		                if(msg[i].msgtype == 1 && msg[i].msg){
		                	msgShow('sender','text',msg[i].msg,msg[i].ctime);
		                }
						if(msg[i].msgtype == 2 && msg[i].msg){
							msgShow('sender','img',msg[i].msg,msg[i].ctime);
						}
						if(msg[i].msgtype == 3 && msg[i].msg){
							// msgShow('sender','info','已推送订单',msg[i].ctime);
						}
					}else{
		                if(msg[i].msgtype == 1 && msg[i].msg){
		                	msgShow('receiver','text',msg[i].msg,msg[i].ctime);
		                }
						if(msg[i].msgtype == 2 && msg[i].msg){
							msgShow('receiver','img',msg[i].msg,msg[i].ctime);
						}
					}
				}
			},
			//获取当前聊天记录
			getDangqianMsg(){
				this.MoreInfoMessage = JSON.parse(sessionStorage.getItem(this.toUser.consumerUno));
				let jsadsadjsald = sessionStorage.getItem(this.toUser.consumerUno)
				if(jsadsadjsald){
					let InfoMsg = this.MoreInfoMessage;
					console.log(InfoMsg)
					for(let i in InfoMsg){
						//console.log(i)
						if(InfoMsg[i].ext.msgType){
							if(InfoMsg[i].to != this.usersUno){
				                if(InfoMsg[i].ext.msgType == 1){
				                	msgShow('sender','text',InfoMsg[i].msg,InfoMsg[i].ext.time);
				                }
				                if(InfoMsg[i].ext.msgType == 2){
				                	msgShow('sender','img',InfoMsg[i].ext.imgSrc,InfoMsg[i].ext.time);
				                }
				                if(InfoMsg[i].ext.msgType == 3){
				                }
							}else{
				                if(InfoMsg[i].ext.msgType != 2){
				                	msgShow('receiver','text',InfoMsg[i].data,InfoMsg[i].ext.time);
				                }else{
				                	msgShow('receiver','img',InfoMsg[i].ext.imgSrc,InfoMsg[i].ext.time);
				                }
							}
						}
					}
				}
			},
			//切换选项卡
			handleClick(tab, event) {
		        //console.log(tab, event);
		    },
			//获取医生列表
			getDoctor(){
				let para = {
					hospitalId: this.toUser.hospitalId
				};
				axios({
					url: '/api/beta/doctor/list.aspx',
					method: 'get',
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
					console.log(res)
					this.doctors = res.data.data.list;
				})
			},
			//加载聊天界面数据
			handleEdit () {
				//console.log(this.$route.params);
				this.progess = JSON.parse(sessionStorage.getItem(this.toUser.consumerId))
				//console.log(this.progess)
				this.getPrice(this.progess);
				
				let id = this.$route.params.id;
				//console.log(id)
				axios({
					url: `/api/beta/counseling/info.aspx?id=${id}`,
					method: 'get',
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
					this.getPrice(this.progess);
					this.infoMessage();
				})
			},
			//获取方案列表
			getAllProgess(){
				axios({
					url:'/api/beta/scheme/counselor/list.aspx',
					method:'get',
					data:'',
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
				}).then(res =>{
					//console.log(res.data);
					this.AllProgess = res.data.data.list
				})
			},
			//显示新增方案界面
			addProgess () {
				this.addFormVisible = true;
				this.getDoctor();
			},
			//获取总价
			getPrice(e){
				let oop = 0;
				for(let i in e){
					//console.log(i)
					oop += (e[i].amount - e[i].discount)
					//console.log(oop)
				}
				this.orderPrice = oop;
			},
			//新增方案
			addSubmit (e) {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							let params = {
								counselorId: this.userInfo.counselor.id,
								hospitalId: this.toUser.hospitalId,
								consumerId: this.toUser.consumerId,
								reserveTime: this.nowDate,
								doctorId: this.addForm.doctorId,
								items:[para]
							};
							//console.log(para)
							params = JSON.stringify(params)
							axios({
								url:'/api/beta/scheme/counselor/createByJson.aspx',
								method: 'post',
								data: params,
								headers:{
										Authorization:this.Authorization,
										/*'Content-Type': 'application/x-www-form-urlencoded'*/
										/*'Content-Type':'multipart/form-data'*/
										'Content-Type':'application/Body-raw'
									}
							}).then((res) => {
								console.log(res)
								this.addLoading = false;
								if(res.data.status == 200){
									this.$notify({
										title: '成功',
										message: '提交成功',
										type: 'success'
									});
								}else{
									this.$notify({
										title: '失败',
										message: '提交成功',
										type: 'error'
									});
								}
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								//let schemeId = res.data.data.id ;
								this.progess = res.data.data.items;
								this.getPrice(this.progess);
								sessionStorage.setItem(this.toUser.consumerId, JSON.stringify(this.progess))
								this.getAllProgess();
							}).catch(err => {
								this.addLoading = false;
							})
						});
					}
				});
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
				this.userInfo = JSON.parse(userInfo);
				//console.log(userInfo)
				this.Authorization = `MEDCOS#${this.userInfo.sessionKey}`;
				this.usersUno = this.userInfo.counselor.uno;
				this.handleEdit()
				this.getAllProgess();
			}
		}
	}
</script>
<style scoped lang='less'>
.myInput{width:218px;}
#chose{position: absolute;top:10px;right:18px;}
#image{width:25px;position: absolute;top:0;right:-6px;opacity: 0;}
.box-card{border: none}
.progessList{
    height: 360px; overflow-y:scroll;
}
.window_right_icon{
	background: url('../../assets/wode.png') no-repeat;
	background-size:100%;
}
</style>