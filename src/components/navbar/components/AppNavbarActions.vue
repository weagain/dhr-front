<script setup lang="ts">
  import NetworkDropdown from './dropdowns/NetworkDropdown.vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import { getAccount, getChainId, disconnect } from '@wagmi/core'
  import { nextTick, watch } from 'vue'
  import { config } from '../../../wagmi'
  import { useWeb3ModalState, useWeb3Modal } from '@web3modal/wagmi/vue'
  import Logout from '../../icons/Logout.vue'
  import Fire from '../../../components/icons/Fire.vue'

  const GlobalStore = useGlobalStore()
  const state = useWeb3ModalState()
  const modal = useWeb3Modal()

  const connectWallet = () => {
    if (!GlobalStore.getUserAddress) {
      modal.open()
    }
  }

  const handleLogout = () => {
    disconnect(config)
    GlobalStore.setUserChainId('')
    GlobalStore.setUserAddress('')
    GlobalStore.setCurrentNetwork(null)
  }

  withDefaults(
    defineProps<{
      userName?: string
      isTopBar?: boolean
    }>(),
    {
      userName: '',
      isTopBar: false,
    },
  )

  defineEmits<{
    (e: 'update:isTopBar', isTopBar: boolean): void
  }>()
</script>

<template>
  <div class="app-navbar-actions gap-x-4">
    <!-- <settings-dropdown class="app-navbar-actions__item" /> -->
    <div class="migration-wrapper">
      <div class="migration-inner gap-x-1"><Fire /> <span>HB Points: 0</span></div>
    </div>

    <NetworkDropdown />
    <div v-if="GlobalStore.getUserAddress" class="gap-x-4 flex items-center">
      <span class="text-base text-white font-otr">{{
        GlobalStore.getUserAddress.replace(/^(\w{6}).*(\w{4})$/, '$1****$2')
      }}</span>
      <Logout class="text-white cursor-pointer" @click="handleLogout" />
    </div>
    <div v-else>
      <VaButton round @click="connectWallet"> Connect </VaButton>
    </div>
  </div>
</template>

<style lang="scss">
  .app-navbar-actions {
    display: flex;
    align-items: center;

    .va-dropdown__anchor {
      color: var(--va-primary);
      fill: var(--va-primary);
    }

    &__item {
      padding: 0;
      margin-left: 0.6rem;
      margin-right: 0.6rem;

      svg {
        height: 24px;
      }

      &:last-of-type {
        margin-right: 0;
      }

      &--profile {
        display: flex;
        justify-content: center;
        margin: auto 0 auto 1.25rem;
      }

      .va-dropdown-content {
        background-color: var(--va-white);
      }

      @media screen and (max-width: 640px) {
        margin-right: 0;

        &:first-of-type {
          margin-left: 0;
        }

        &--profile {
          position: absolute;
          right: 0.75rem;
          top: 1.25rem;
          height: fit-content;
          margin: auto;
        }
      }
    }

    .w3m-core-button {
      margin-left: 1.25rem;
    }

    .migration-wrapper {
      padding: 1px;
      clip-path: polygon(100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px, 12px 0);
      background: white;
      border-radius: 3px;
      color: white;

      .migration-inner {
        display: flex;
        align-items: center;
        // height: 218px;
        padding: 10px 20px;
        border-radius: 3px;
        clip-path: polygon(100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px, 12px 0);
        background: black;
      }
    }
  }
</style>
