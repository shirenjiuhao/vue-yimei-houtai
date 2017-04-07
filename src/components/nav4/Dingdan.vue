<template>
	<el-table :data="users" border style="width: 100%" v-loading="listLoading">
	<el-table-column prop="orderid" label="订单ID" width="100">
    </el-table-column>
      <el-table-column prop="orderno" label="订单编号" width="180"> </el-table-column>
    <el-table-column prop="doctorname" label="所属医生" width="100">
    </el-table-column>
    <el-table-column prop="schemename" label="所属方案" width="100">
    </el-table-column>
    <el-table-column prop="amount" label="应付金额" width="100">
    </el-table-column>
    <el-table-column prop="payment" label="已付金额" width="100">
    </el-table-column>
    <el-table-column prop="ctime" label="支付时间" min-width="100">
    </el-table-column>
    <!-- <el-table-column prop="address" label="支付" :formatter="formatter">
    </el-table-column> -->
    <!-- <el-table-column prop="tag" label="状态" width="100" 
      :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
      :filter-method="filterTag">
      <template scope="scope">
        <el-tag
          :type="scope.row.tag === '家' ? 'primary' : 'success'"
          close-transition>{{scope.row.tag}}</el-tag>
      </template>
    </el-table-column> -->
  </el-table>
</template>
<script>
	import axios from 'axios'
	export default {
	    data() {
	      return {
	        users: [{
	          date: '2016-05-02',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄',
	          tag: '家'
	        }, {
	          date: '2016-05-04',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1517 弄',
	          tag: '公司'
	        }, {
	          date: '2016-05-01',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1519 弄',
	          tag: '家'
	        }, {
	          date: '2016-05-03',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1516 弄',
	          tag: '公司'
	        }],
	        listLoading:false,
	      }
	    },
	    methods: {
	      //请求数据
	      getUsers(){
	      	this.listLoading = true;
	      	axios({
	      		url: "/api/beta/order/counselor/list",
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
	      		this.listLoading = false;
	      		console.log(res.data);
	      		this.users = res.data.list;
	      	})
	      },
	      formatter(row, column) {
	        return row.address;
	      },
	      filterTag(value, row) {
	        return row.tag === value;
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
<style scoped lang='less'></style>