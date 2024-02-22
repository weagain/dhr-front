<script setup lang="ts">
  import { supportNetworks } from '../../../../data/chains/dhrContract'
  import { useGlobalStore } from '../../../../stores/global-store'
  import { switchNetwork } from '@wagmi/core'
  import { useToast } from 'vuestic-ui'

  const authStore = useGlobalStore()
  const { init } = useToast()

  interface Network {
    chainId: number | string
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
    } catch (err) {
      console.log('err:', err)
      init({ message: 'unsupport network', color: 'danger' })
    }
  }
</script>

<template>
  <va-dropdown class="language-dropdown" stick-to-edges>
    <template #anchor>
      <VaButton preset="secondary" border-color="primary">{{ authStore.getCurrentNetwork?.chainName }}</VaButton>
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
</style>
