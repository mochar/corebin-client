import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home'
import Overview from '../views/Overview'
import Compare from '../views/Compare'
import Refine from '../views/Refine'
import Help from '../views/Help'

Vue.use(Router)

export default new Router({
	mode: 'hash',
	routes: [
		{
			path: '/',
			component: Home
		},
		{
			path: '/overview',
			component: Overview
		},
		{
			path: '/compare',
			component: Compare
		},
		{
			path: '/refine',
			component: Refine
		},
		{
			path: '/help',
			component: Help
		},
	]
})
