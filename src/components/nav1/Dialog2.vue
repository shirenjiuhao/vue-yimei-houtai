
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
	            	会话已结束
	            </div>
			</el-col>
			<el-col :span="10">
				<el-tabs v-model="activeName" @tab-click="handleClick">
				    <el-tab-pane label="用户信息" name="first">
						<template>
							<div class="window_right_msg">
				                <div><i class="window_right_icon"></i>个人信息</div>
				                <div>姓名：{{toUser.consumerName || '正在加载'}}</div>
				                <div>手机号：{{toUser.tel || '正在加载'}}</div>
				                <div>IP地址：{{toUser.address || '正在加载'}}</div>
				                <div>来源页面：{{toUser.page || '正在加载'}}</div>
				            </div>
						</template>
					</el-tab-pane>
					<el-tab-pane label="方案列表" name="second">
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
				nowDate: getShowDate(),//获取当前时间
				userInfo:'',//当前用户信息
				Authorization:'',//设置请求头
				listLoading: false,
				usersUno:'',//发送者环信ID
				toUser:[],//接收者信息
				options:[{name:'已结束',key:1}],
				activeName: 'first',//默认选项卡
				lishi:[{firsttime:'2017-03-17'},{firsttime:'2017-03-17'}],
				chatInfo:[],//聊天记录
				AllProgess:[],//所有方案记录		
				pickerOptions0: {//时间选择
		          disabledDate(time) {
		            return time.getTime() < Date.now() - 8.64e7;
		          }
		        }
			}
		},
		methods: {
			//返回上一页
			backUpPage(){
				window.history.go(-1)
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
							msgShow('sender','info','已推送订单',msg[i].ctime);
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
			//切换选项卡
			handleClick(tab, event) {
		        //console.log(tab, event);
		    },
			//加载聊天界面数据
			handleEdit () {
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
				this.handleEdit();
				this.getAllProgess();
			}
		}
	}
</script>
<style scoped lang='less'>
.myInput{width:218px;}
#chose{position: absolute;top:10px;right:18px;}
#image{width:25px;position: absolute;top:0;right:-6px;opacity: 0;}
#progess{height: 412px; overflow-y:scroll;}
.box-card{border: none}
.progessList{
    height: 378px; overflow-y:scroll;
}
.dialog_foot{
	display: flex; justify-content: center;align-items:center;height:60px;
}
</style>