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
			redirect: '/home'
		},
		{
			path: '/home',
			component: Home
		},
		{
			path: '/overview',
			component: Overview,
			beforeEnter: (to, from, next) => {
				const fromHasInstance = from.matched.length > 0
				if (fromHasInstance && from.matched[0].instances.default.$store.state.binSet) next()
				else next(fromHasInstance ? false : next('/home'))
			}
		},
		{
			path: '/compare',
			component: Compare,
			beforeEnter: (to, from, next) => {
				const fromHasInstance = from.matched.length > 0
				if (fromHasInstance && from.matched[0].instances.default.$store.state.binSet) next()
				else next(fromHasInstance ? false : next('/home'))
			}
		},
		{
			path: '/refine',
			component: Refine,
			beforeEnter: (to, from, next) => {
				const fromHasInstance = from.matched.length > 0
				if (fromHasInstance && from.matched[0].instances.default.$store.state.binSet) next()
				else next(fromHasInstance ? false : next('/home'))
			}
		},
		{
			path: '/help',
			component: Help
		},
	]
})
