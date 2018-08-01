<template>
	<div>
		<NavBar></NavBar>
		<SideBar></SideBar>
		<router-view/>
	</div>
</template>

<script>
	import NavBar from 'components/NavMenu/NavBar'
	import SideBar from 'components/Sidebar/Sidebar'
	export default {
		components: {
			NavBar,
			SideBar
		}
	}
</script>