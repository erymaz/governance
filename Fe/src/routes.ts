import Home from './pages/Home.vue'
import Community from './pages/Community.vue'
import ProposalDetails from './pages/ProposalDetails.vue'
import StrategyDetails from './pages/StrategyDetails.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/communities/:communityId', component: Community },
  { path: '/communities/:communityId/proposals/:proposalId', component: ProposalDetails },
  { path: '/strategies/:name', component: StrategyDetails },

  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
