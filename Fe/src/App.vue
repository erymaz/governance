<template>
  <div class="">
    <div class="">
      <!-- HEADER -->
      <div class="sticky-header pb-4">
        <HeaderComponent />
      </div>

      <!-- Body -->
      <div class="content flex justify-center">
        <router-view />
      </div>

      <!-- FOOTER -->
      <FooterComponent />
    </div>

    <CastVoteModal />
    <ProposalConfirmModal />
    <SelectStrategyModal />
    <ExtendProposalPeriodModal />
    <SelectVotingSystemModal />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from './stores/user'
import HeaderComponent from '@/components/layouts/Header.vue'
import FooterComponent from '@/components/layouts/Footer.vue'
import CastVoteModal from '@/components/modals/CastVoteModal.vue'
import ProposalConfirmModal from '@/components/modals/ProposalConfirmModal.vue'
import SelectStrategyModal from '@/components/modals/SelectStrategyModal.vue'
import ExtendProposalPeriodModal from '@/components/modals/ExtendProposalPeriodModal.vue'
import SelectVotingSystemModal from '@/components/modals/SelectVotingSystemModal.vue'

const user = useUserStore()
user.reconnect()
</script>

<style>
.no-overflow {
  overflow-x: hidden !important;
}

.sticky-header {
  position: fixed;
  width: 100%;
  top: 0;
  background-color: #fff;
  z-index: 999;
}

.content {
  margin-top: 87px;
  min-height: calc(100vh - 165px);
}
</style>
