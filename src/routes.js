import Login from './components/Login.vue'//登录
import NotFound from './components/404.vue'//404页面
import Home from './components/Home.vue'//主要页面
import Now from './components/nav1/Now.vue'//当前会话
import History from './components/nav1/History.vue'//当前会话
import AddHospital from './components/nav2/AddHospital.vue'//新增医院
import EditHospital from './components/nav2/EditHospital.vue'//编辑医院
import AddDoctor from './components/nav3/AddDoctor.vue'//新增医生
import EditDoctor from './components/nav3/EditDoctor.vue'//编辑医生
import Dialog from './components/nav1/Dialog.vue'//聊天窗口
import Dingdan from './components/nav4/Dingdan.vue'//订单中心
import Dialog2 from './components/nav1/Dialog2.vue'

let routes = [
	{
		path:'/login',
		component: Login,
		name:'',
		hidden: true
	},
	{
		path:'/404',
		component:NotFound,
		name:'',
		hidden: true
	},
	{
		path:'/',
		component:Home,
		name:'会话中心',
		children:[
			{ path:'/now',component:Now,name:'当前会话'},
			// { path:'/history',component:History,name:'历史会话'},
			{ path:'/now/:id',component:Dialog,name:'会话窗口', hidden: true},
			// { path:'/history/:id',component:Dialog2,name:'会话历史', hidden: true},
			/*{ path:'/dingdan',component:Dingdan,name:'订单中心'}*/
		]
	},
	{
		path:'/',
		component:Home,
		name:'订单中心',
		children:[
			{ path:'/dingdan',component:Dingdan,name:'订单列表'}
		]
	},
	/*{
		path:'/',
		component:Home,
		name:'聊天',
		//hidden: true,
		children:[
			{ path:'/addHospital',component:AddHospital,name:'新增医院'},
			{ path:'/editHospital',component:EditHospital,name:'编辑医院'}
		]
	},
	{
		path:'/',
		component:Home,
		name:'医生',
		children:[
			{ path:'/addDoctor',component:AddDoctor,name:'新增医生'},
			{ path:'/editDoctor',component:EditDoctor,name:'编辑医生'}
		]
	},*/
	{
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
]

export default routes;