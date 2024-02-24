<script setup lang="ts">
  import NetworkDropdown from './dropdowns/NetworkDropdown.vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import { getAccount, getChainId } from '@wagmi/core'
  import { nextTick, watch } from 'vue'
  import { config } from '../../../wagmi'
  import { useWeb3ModalState } from '@web3modal/wagmi/vue'

  const GlobalStore = useGlobalStore()
  const state = useWeb3ModalState()
  // w3m 的弹窗
  watch(
    () => state.open,
    async (val) => {
      console.log('val', val)
      if (!val) {
        const account = getAccount(config)
        const chainId = getChainId(config)

        if (!open) {
          GlobalStore.setUserAddress(account.address)
          GlobalStore.setUserChainId(chainId)
        }
      }
    },
  )

  // 页面刷新，渲染完成之后
  nextTick(() => {
    // 查看是否自动了链接了钱包，并全局赋值
    const account = getAccount(config)
    const chainId = getChainId(config)

    if (!account.address) {
      return GlobalStore.setUserAddress('')
    }

    if (!chainId) {
      return GlobalStore.setUserChainId(0)
    }

    GlobalStore.setUserChainId(chainId)
    GlobalStore.setUserAddress(account.address)
    // // 读取全局 address 地址
    console.log('读取全局 address 地址::', GlobalStore.userAddress, ' chainid:', GlobalStore.userChainId)
  })

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
  <div class="app-navbar-actions">
    <!-- <settings-dropdown class="app-navbar-actions__item" /> -->
    <NetworkDropdown />
    <w3m-account-button balance="hide" />
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
  }
</style>
