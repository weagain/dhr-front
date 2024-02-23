<script setup lang="ts">
  import { supportNetworks } from '../../../../data/chains/dhrContract'
  import { useGlobalStore } from '../../../../stores/global-store'
  import { switchNetwork, ConnectorNotFoundError } from '@wagmi/core'
  import { useToast } from 'vuestic-ui'

  const authStore = useGlobalStore()
  const { init } = useToast()

  interface Network {
    chainId: number
    chainName: string
    chainSymbol: string
    coin: string
    textColor: string
    color: string
    contractAddr: string
    contractAbi: any[]
  }

  const handleSelect = async (item: Network) => {
    try {
      if (authStore.getCurrentNetwork?.chainId != item.chainId) {
        await switchNetwork({
          chainId: Number(item.chainId),
        })
        authStore.setCurrentNetwork(item)
      }
    } catch (e: any) {
      console.log('err:', e)
      // 处理 ConnectorNotFoundError 错误
      if (e instanceof ConnectorNotFoundError) {
        init({ message: 'Please connect your wallet', color: 'warning' })
      } else {
        init({ message: e.message || 'Unknown error', color: 'warning' })
      }
    }
  }
</script>

<template>
  <va-dropdown class="language-dropdown" stick-to-edges>
    <template #anchor>
      <div class="migration-wrapper">
        <div class="migration-inner">{{ authStore.getCurrentNetwork?.chainName || 'Network Error' }}</div>
      </div>
      <VaButton preset="secondary" border-color="primary">{{
        authStore.getCurrentNetwork?.chainName || 'Network Error'
      }}</VaButton>
    </template>

    <va-dropdown-content class="language-dropdown__content pl-8 pr-8 pt-2 pb-2">
      <div
        v-for="(item, index) in supportNetworks"
        :key="index"
        class="py-3 cursor-pointer network-item"
        @click="handleSelect(item)"
      >
        {{ item.chainName }}
      </div>
    </va-dropdown-content>
  </va-dropdown>
</template>

<style lang="scss" scoped>
  .network-item {
    &:hover {
      color: #b4b400;
    }
  }

  .migration-wrapper {
    padding: 1px;
    clip-path: polygon(100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px, 12px 0);
    background: #fcfc03;
    border-radius: 3px;
    color: #fcfc03;

    .migration-inner {
      // height: 218px;
      padding: 10px 20px;
      border-radius: 3px;
      clip-path: polygon(100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px, 12px 0);
      background: black;
    }
  }
</style>
