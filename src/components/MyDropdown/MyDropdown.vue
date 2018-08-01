<template>
	<div>
		<div 
			class="mydropdown-style"
			:style="myDropdownStyle"
			@click="mydropdownOpen"
			@mouseenter="mydropdownOpen"
			@mouseleave="mydropdownLeave">
			<slot name="title">我的工作台</slot>
			<i 
				class="iconfont" 
				aria-hidden="true"
				:style="iconfontStyle"
				v-html="iconStatus ? upIcon : downIcon">
			</i>
			<div class="open-body" :style="openBodyStyle">
				<div 
					v-for="(item,index) in openItemArr" 
					class="open-item"
					@click="openItemClick(item,index)">
					<i 
						class="iconfont" 
						aria-hidden="true" 
						v-if="item.icon"
						v-html="item.icon"></i>{{item.title ? item.title : item}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		//展开项item
		openItemArr: { 
			type: Array, 
			default: () => [] 
		},

		//样式篇
		myDropdownWidth: {
			type: [String, Number],
			default: 150
		},

		myDropdownHeight: {
			type: [String, Number],
			default: 60
		},

		myDropdownColor: {
			type: String,
			default: "#fff"
		},

		myDropdownBackground: {
			type: String,
			default: "#283143"
		},

		myDropdownFontsize: {
			type: [String, Number],
			default: 16
		},

		myDropdownBackgroundOpen: {
			type: String,
			default: "#273843"
		},

		iconfontBottom: {
			type: [String, Number],
			default: -2
		},

		iconfontLeft: {
			type: [String, Number],
			default: 115
		},

		openBodyColor: {
			type: String,
			default: "#000"
		},

		openBodyBackground: {
			type: String,
			default: "#fff"
		},
	},
	
	data() {
		return {
			//上下图标切换
			iconStatus: 0,
			upIcon: '&#xe601;',
			downIcon: '&#xe602;',

			//下拉框样式
			myDropdownStyle: {
				position: 'relative',
				width: this.myDropdownWidth + 'px',
				height: this.myDropdownHeight + 'px',
				lineHeight: this.myDropdownHeight + 'px',
				color: this.myDropdownColor,
				background: this.myDropdownBackground,
				fontSize: this.myDropdownFontsize + 'px',
			},

			//up&down icon style
			iconfontStyle: {
				position: 'absolute',
				bottom: this.iconfontBottom + 'px',
				left: this.iconfontLeft + 'px',
			},

			//下拉框item样式
			openBodyStyle: {
				display: 'none',
				color: this.openBodyColor,
				background: this.openBodyBackground,
				width: this.myDropdownWidth + 'px',
				boxShadow: '0 0 10px ' + this.myDropdownBackground,
			},
		}
	},

	mounted() {
		
	},

	methods: {
		//触发下拉框
		mydropdownOpen() {
			var that = this
			that.myDropdownStyle.background = that.myDropdownBackgroundOpen

			setTimeout(function() {
        that.iconStatus = 1
				that.openBodyStyle.display = 'block'
      }, 500)
		},

		//离开下拉框
		mydropdownLeave() {
			var that = this
			that.myDropdownStyle.background = that.myDropdownBackground

			setTimeout(function() {
				that.iconStatus = 0
				that.openBodyStyle.display = 'none'
			}, 500)
		},

		//点击下拉框item
		openItemClick(item,index) {
			this.$emit('openItemClick', item, index)
		}
	},
}
</script>

<style lang="less" scoped>
	* {
		text-align: center;
	}
	
	.mydropdown-style {
		z-index: 100;
		cursor: pointer;
		transition: background .5s;
		-webkit-transition: background .5s;

		.open-item {
			height: 30px;
			line-height: 30px;
		}

		.open-item:hover {
			background: #ccc;
		}
	}
</style>