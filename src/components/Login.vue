<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api.js'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'test1',
          checkPass: '123456',
          channel:'WEB'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit2(ev) {
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.logining = true;
            let loginParams = { 
              username: this.ruleForm2.account, 
              password: this.ruleForm2.checkPass,
              channel: this.ruleForm2.channel
            };
            requestLogin(loginParams).then(res => {
              console.log(res)
              this.logining = false;
              if (res.status != 200) {
                this.$notify({
                  title: '错误',
                  message: res.message,
                  type: 'error'
                });
              } else {
                let userInfo = res.data
                var signIn = {
                    apiUrl: WebIM.config.apiURL,
                    user: res.data.counselor.uno,
                    pwd: res.data.counselor.easemobPwd,
                    appKey: WebIM.config.appkey,
                    success: function (token) {
                        //alert('登陆成功');
                        //console.log(token)
                         //var token = token.access_token;
                         //WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
                    },
                    error: function(err){
                      //console.log(err)
                    }
                };
                sessionStorage.setItem('user', JSON.stringify(loginParams));
                localStorage.setItem('COUNNAME', JSON.stringify(userInfo))
                this.$router.push({ path: '/now' });
                conn.open(signIn);
               }   
            }).catch((err) =>{
              //console.log(err)
              this.logining = false;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style  scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin-bottom: 20px;
    background-color: #F9FAFC;
    margin: 180px auto;
    border: 2px solid #8492A6;
    width: 350px;
    padding: 35px 35px 15px 35px;
    
  }
  .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
</style>