<template>
  <div class="app-navbar-actions">
    <color-dropdown class="app-navbar-actions__item" />
    <settings-dropdown class="app-navbar-actions__item" />
    <language-dropdown class="app-navbar-actions__item" />
    <w3m-core-button class="w3m-core-button"></w3m-core-button>
  </div>
</template>

<script setup lang="ts">
  import LanguageDropdown from './dropdowns/LanguageDropdown.vue'
  import ColorDropdown from './dropdowns/ColorDropdown.vue'
  import { useGlobalStore } from '../../../stores/global-store'
  import { EthereumClient } from '@web3modal/ethereum'
  import { Web3Modal } from '@web3modal/html'
  import { getAccount, getNetwork, signMessage, disconnect } from '@wagmi/core'
  import { nextTick } from 'vue'
  import { wagmiConfig, projectId, chains, w3mconnectors } from '../../../wagmi'

  const GlobalStore = useGlobalStore()

  const ethereumClient = new EthereumClient(wagmiConfig, chains)
  const web3modal = new Web3Modal({ projectId }, ethereumClient)

  // 弹窗是否打开
  web3modal.subscribeModal(({ open }) => {
    const account = getAccount()
    const network = getNetwork()

    if (!open) {
      GlobalStore.setUserAddress(account.address ? account.address : '')
      GlobalStore.setUserChainId(network.chain ? network.chain.id : 0)
    }
  })

  // 页面刷新，渲染完成之后
  nextTick(() => {
    // 查看是否自动了链接了钱包，并全局赋值
    const account = getAccount()
    const network = getNetwork()

    if (!account.address) {
      return GlobalStore.setUserAddress('')
    }

    if (!network.chain) {
      return GlobalStore.setUserChainId(0)
    }

    GlobalStore.setUserChainId(network.chain.id)
    GlobalStore.setUserAddress(account.address)
    // 读取全局 address 地址
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
