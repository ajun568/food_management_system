<template>
	<transition name="fade">
		<div class="message" :class="`${type}-message`" v-show="show">
			<span>{{message}}</span>
		</div>
	</transition>
</template>

<script>
	import { typeMap } from 'util/map.js'
	export default {
		name: 'v-message',

		data() {
			return {
				show: false,
				message: '这里是一段关于消息的描述',
				timer: null,
				type: typeMap['info']
			}
		},

		mounted() {
			this.startTime()
		},

		methods: {
			startTime() {
				this.show = true
				if(this.timer) {
					clearTimeout(this.timer)
				}else {
					this.timer = setTimeout(() => {
						this.show = false
					}, 3000)
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.message {
		width: 280px;
		padding: 10px;
		text-align: center;
		color: #fff;
		position: fixed;
		top: 10px;
		left: 50%;
		z-index: 101;
		margin-left: -150px;
		box-shadow: 1px 1px 5px #333;
	}

	.info-message {
		background-color: #35b3ff;
	}

	.success-message {
		background-color: #5cb85c;
	}

	.warning-message {
		background-color: #ff8e05;
	}

	.error-message {
		background-color: #d84c31;
	}

	.fade-enter-active {
		animation: shake 1s infinite;
	}

	.fade-leave-active {
		animation: fadeOut 1s;
	}

	@keyframes shake {
	  0%, 100% {
	    transform: translateX(0);
	  }

	  10%, 30%, 50%, 70%, 90% {
	    transform: translateX(-10px);
	  }

	  20%, 40%, 60%, 80% {
	    transform: translateX(10px);
	  }
	}

	@keyframes fadeOut {
	  0% {
	    opacity: 1;
	  }

	  100% {
	    opacity: 0;
	  }
	}
</style>