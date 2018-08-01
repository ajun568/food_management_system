<template>
	<div>
		<div class="login-bg">
			<ul class="bubble">
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
			<div class="login-form">
				<!-- 这里没有对两个表单进行合并，但不想改了 -->
				<div class="total-body login-body" v-if="islogin">
					<div class="return-login"></div>
					<div class="register-circle" @click="toRegister">
						<i class="iconfont">&#xe628;</i>
					</div>
					<h1 class="title" :style="loginStyle">LOGIN</h1>
					<form>
						<div class="input-style">
							<input type="text" v-model="loginUsername" required="required">
							<label>Username</label>
							<div class="underline"></div>
						</div>
						<div class="input-style">
							<input type="password" v-model="loginPassword" required="required">
							<label>Password</label>
							<div class="underline"></div>
						</div>
						<div class="button" @click="login"><span>LOGIN</span></div>
						<p class="foot-info">Welcome to yijun's system</p>
					</form>
				</div>
				<div class="total-body register-body" v-else>
					<div class="return-login"></div>
					<div class="register-circle" @click="toRegister"></div>
					<div class="close" @click="toLogin">
						<i class="iconfont">&#xe72c;</i>
					</div>
					<h1 class="title">REGISTER</h1>
					<form>
						<div class="input-style">
							<input type="text" v-model="registerUsername" required="required">
							<label>Username</label>
							<div class="underline"></div>
						</div>
						<div class="input-style">
							<input type="password" v-model="registerPassword" required="required">
							<label>Password</label>
							<div class="underline"></div>
						</div>
						<div class="input-style">
							<input type="password" v-model="registerRepassword" required="required">
							<label>Repeat Password</label>
							<div class="underline"></div>
						</div>
						<div class="button" @click="register"><span>REGISTER</span></div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	export default {
		data() {
			return {
				//切换注册登录标识
				islogin: true,

				//login
				loginUsername: '',
				loginPassword: '',
				loginStyle: {
					opacity: 1
				},

				//register
				registerUsername: '',
				registerPassword: '',
				registerRepassword: '',
			}
		},

		methods: {
			//切换页面
			toRegister() {
				this.clearLoginForm()
				this.loginStyle.opacity = 0
				this.islogin = false
			},

			toLogin() {
				this.clearRegisterForm()
				this.islogin = true
				//和css配合解决注册切登录走动画时的闪一下的bug
				setTimeout(() => {
					this.loginStyle.opacity = 1
				},400)
			},

			//清空表单
			clearLoginForm() {
				this.loginUsername = ''
				this.loginPassword = ''
			},

			clearRegisterForm() {
				this.registerUsername = ''
				this.registerPassword = ''
				this.registerRepassword = ''
			},

			//登录，注册
			login() {
				if(this.loginUsername == '') {
					this.$MyMessage.error('用户名不能为空')
				}
				else if(this.loginPassword == '') {
					this.$MyMessage.error('密码不能为空')
				}
				else {
					this.$ajax.post('user/login', {
		        username: this.loginUsername,
						password: md5(this.loginPassword)
		      }).then(e => {
		      	if(e.data.message == 'success') {
		      		this.$MyMessage.success('登录成功')
		      		sessionStorage.setItem('token',e.data.result.userInfo.id)
		      		// sessionStorage.setItem('token',e.data.result.id)
		      		this.$router.push({name:'Home'})
		      	}
		      }).catch(e => {})
	    	}
			},

			register() {
				if(this.registerUsername == '') {
					this.$MyMessage.error('用户名不能为空')
				}
				else if(this.registerPassword == ''){
					this.$MyMessage.error('密码不能为空')
				}else if(this.registerPassword != this.registerRepassword) {
					this.$MyMessage.error('两次密码不一致')
				}else {
					this.$ajax.post('user/register',{
						username: this.registerUsername,
						password: md5(this.registerPassword)
					}).then(e => {
						if(e.data.message=='success') {
							this.$MyMessage.success('注册成功')
						}else {
							this.$MyMessage.error(e.data.message)
						}
					}).catch(e => {})
				}
			},
		},
	}
</script>

<style lang="less" scoped>
	* {
		text-align: center;
	}

	.login-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background: #066abd;
	  background: linear-gradient(to bottom right, #066ABD 0%, #0B1644 100%);

	  .bubble {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			overflow: hidden;

	  	li {
	  		position: absolute;
	  		bottom: -160px;
	  		width: 40px;
	  		height: 40px;
	  		background-color: fade(White, 15%);

	  		display: block;
	  		animation: bubble 20s infinite;
	  		animation-timing-function: linear;

	  		&:nth-child(1) {
					left: 10%;
	  		}

	  		&:nth-child(2) {
					left: 20%;
					width: 80px;
					height: 80px;
					animation-duration: 12s;
					animation-delay: 2s;
	  		}

	  		&:nth-child(3) {
					left: 25%;
					animation-delay: 4s;
	  		}

	  		&:nth-child(4) {
	  			left: 27%;
	  			width: 10px;
	  			height: 10px;
	  			background-color: fade(White, 30%);
	  			animation-duration: 35s;
	  			animation-delay: 2s;
	  		}

	  		&:nth-child(5) {
					left: 32%;
					width: 160px;
					height: 160px;
					animation-delay: 7s;
	  		}

	  		&:nth-child(6) {
					left: 40%;
	  			width: 60px;
	  			height: 60px;
					background-color: fade(White, 25%);
					animation-duration: 22s;
	  		}

	  		&:nth-child(7) {
					left: 55%;
					width: 20px;
					height: 20px;
					animation-duration: 35s;
					animation-delay: 2s;
	  		}

	  		&:nth-child(8) {
					left: 70%;
	  		}

	  		&:nth-child(9) {
					left: 80%;
					width: 120px;
					height: 120px;
					background-color: fade(White, 20%);
					animation-delay: 3s;
	  		}

	  		&:nth-child(10) {
					left: 90%;
					width: 160px;
					height: 160px;
					animation-delay: 11s;
	  		}
	  	}
	  }

	  .login-form {
	  	position: relative;
	  	margin: 0 auto;
	  	width: 1200px;
	  	height: 100%;

	  	.total-body {
	  		position: absolute;
	  		top: 50%;
	  		left: 50%;
	  		z-index: 2;
	  		margin-top: -300px;
	  		margin-left: -230px;
	  		width: 460px;
	  		// height: 440px;
	  		padding-top: 60px;
	  		padding-bottom: 40px;
	  		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
	  		border-radius: 5px;

  			.return-login {
					position: absolute;
					top: 0;
					left: 0;
					width: 0%;
					height: 100%;
					background: rgba(40, 57, 101, .8);
					z-index: 0;
				}

	  		.title {
	  			font-size: 32px;
	  			line-height: 52px;
	  			font-weight: 600;
	  			padding: 10px 0 10px 50px;
	  			text-align: left;
	  		}

	  		.register-circle {
	  			position: absolute;
	  			top: 40px;
	  			right: -70px;
	  			width: 140px;
	  			height: 140px;
	  			background: rgba(6, 98, 235, .8);
	  			border-radius: 50%;
	  			cursor: pointer;

	  			.iconfont {
	  				font-size: 60px;
	  				color: rgba(255, 255, 255, .8);
	  				text-align: center;
	  				line-height: 140px;
	  			}
	  		}

	  		.input-style {
	  			position: relative;
					margin: 0 60px 50px;

					input {
						//这里的position:relative可以解决z-index失效问题
						position: relative;
						width: 100%;
						height: 60px;
						border: 0;
						outline: none;
						background: none;
						font-size: 24px;
						font-weight: 400;
						color: #fff;
						z-index: 3;
					}

					label {
						position: absolute;
						top: 0;
						left: 0;
						font-size: 24px;
						line-height: 60px;
						font-weight: 300;
						transition: .2s ease;
					}

					.underline {
						position: absolute;
						left: 0;
						bottom: 0;
						width: 100%;
						height: 1px;
					}

					.underline::before,
					.underline::after {
						content: ' ';
						position: absolute;
						width: 0;
						height: 2px;
						transition: .2s ease;
					}

					.underline::before {
						left: 50%;
					}

					.underline::after {
						right: 50%;
					}

					//这里兄弟选择器是必要的
					input:focus~label,
					input:valid~label {
						color: #9d9d9d;
						transform: translate(-12%, -50%) scale(.75);
					}

					input:focus~.underline::before,
					input:focus~.underline::after {
						width: 50%;
					}
	  		}

	  		.button {
	  			position: relative;
	  			width: 236px;
	  			height: 64px;
	  			margin: 0 auto;
	  			color: #757575;
	  			font-size: 30px;
	  			line-height: 64px;
	  			border: 2px solid #757575;
	  			cursor: pointer;
	  			transition: all .4s;

	  			span::before {
		  			content: ' ';
		  			position: absolute;
		  			top: 0;
		  			left: 0;
		  			width: 0;
		  			height: 100%;
		  			background: #0662eb;
		  			z-index: -1;
		  			transition: all .4s cubic-bezier(0.42, 0, 0.58, 1);
		  		}
	  		}

	  		.button:hover {
	  			color: #fff;
	  			border-color: #fff;
	  			transition: all .4s;

	  			span::before {
						width: 100%;
	  			}
	  		}

	  		.foot-info {
	  			text-align: center;
	  			color: rgba(117, 117, 117, .6);
	  			font-size: 25px;
	  			line-height: 25px;
	  			padding-top: 50px;
	  		}
	  	}

	  	.login-body {
	  		//还原时候的动画
				.return-login {
					width: 100%;
					z-index: -1;
					transition: .5s ease;
				}

	  		.title {
					border-left: 5px solid #0662eb;
	  			color: #0662eb;
	  			//特别蠢的解决注册到登录闪一下的bug
	  			transition: opacity 10s;
	  		}

	  		.input-style {
	  			label {
						color: #757575;
	  			}

	  			.underline {
		  			background: #757575;
		  		}

		  		.underline::before,
					.underline::after {
						background: #0662eb;
					}
	  		}
	  	}

	  	.register-body {
	  		height: 500px;
	  		overflow: hidden;
	  		transition: all .5s ease;

	  		.register-circle {
	  			transform: scale(10);
	  			transition: transform .5s ease;
	  			z-index: -1;
	  		}

	  		.close {
	  			position: absolute;
	  			top: 74px;
	  			right: 60px;
	  			cursor: pointer;

	  			.iconfont {
	  				color: #fff;
	  				font-size: 40px;
	  				line-height: 40px;
	  			}
	  		}

	  		.title {
	  			border-left: 5px solid #ddd;
	  			color: #ddd;
	  		}

	  		.input-style {
	  			label {
	  				color: #aaa;
	  			}

	  			.underline {
		  			background: #aaa;
		  		}

		  		.underline::before,
					.underline::after {
						background: #ddd;
					}
	  		}

	  		.button {
					color: #aaa;
					border-color: #aaa;
				}
	  	}
	  }
	}

	@keyframes bubble {
		0% {
			transform: translateY(0);
		}
		100% {
			bottom: 100%;
			transform: translateY(-700px) rotate(600deg);
		}
	}
</style>