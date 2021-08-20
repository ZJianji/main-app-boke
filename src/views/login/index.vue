<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">博客后台系统</h3>
      </div>

      <el-form-item prop="loginNums">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginNums"
          v-model="loginForm.loginNums"
          placeholder="请输入管理员账号"
          name="loginNums"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>

        <el-input
          :key="loginPwdType"
          ref="loginPwd"
          v-model="loginForm.loginPwd"
          :type="loginPwdType"
          placeholder="请输入密码"
          name="loginPwd"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="loginPwdType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <div class="verification-box">
        <el-form-item prop="verify" class="verification-input">
          <span class="svg-container">
            <svg-icon icon-class="nested" />
          </span>
          <el-input
            ref="verify"
            v-model="loginForm.verify"
            placeholder="请输验证码"
            name="verify"
            type="text"
            tabindex="3"
            auto-complete="on"
          />
        </el-form-item>
        <div 
        class="verification-imgs" 
        v-html="loginForm.svg"
        @click="getCaptchaFunc"
        ></div>
      </div>

      <el-checkbox v-model="loginForm.checked" class="checked">7天内免登录</el-checkbox>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
import { getCaptcha } from "@/api/verify";
export default {
  name: "Login",
  created () {
    this.getCaptchaFunc();
  },
  data() {
    const validateLoginNums = (rule, value, callback) => {
      if (!value) {
        callback(new Error("登录账号不能为空!"));
      } else {
        callback();
      }
    };
    const validateLoginPwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不少于6位数！"));
      } else {
        callback();
      }
    };
    const validateVerify = (rule, value, callback) => {
     if (!value) {
        callback(new Error("验证码不能为空!"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginNums: "",
        loginPwd: "",
        verify: "",
        checked: true,
        svg: ""
      },
      loginRules: {
        loginNums: [
          { required: true, trigger: "blur", validator: validateLoginNums },
        ],
        loginPwd: [
          { required: true, trigger: "blur", validator: validateLoginPwd },
        ],
        verify: [
          { required: true, trigger: "blur", validator: validateVerify },
        ],
      },
      loading: false,
      loginPwdType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.loginPwdType === "password") {
        this.loginPwdType = "";
      } else {
        this.loginPwdType = "password";
      }
      this.$nextTick(() => {
        this.$refs.loginPwd.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //获取验证码
    getCaptchaFunc() {
      console.log("aaa")
      getCaptcha().then( res => {
        this.loginForm.svg = res;
        console.log(res)
      })
    }
  },
};
</script>

<style lang="scss" >
.verification-box {
  display: flex;
  .verification-input {
    width: 70%;
  }
  .verification-imgs {
    width: 200px;
    height: 54px;
    margin-left: 15px;
  }
}

/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .checked{
    margin-bottom: 10px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
