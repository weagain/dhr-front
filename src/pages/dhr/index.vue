<template>
  <div class="w-full">
    <va-card class="col-span-12">
      <va-card-title>{{ t('round-info.current') }}</va-card-title>
      <va-card-content>
        <div class="col-span-12 lg:col-span-6 flex flex-wrap">
          <div class="w-full pb-6 grid grid-cols-12 gap-6">
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="success">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-num') }}</h4>
                <p class="text-white">#123456</p>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="info">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-participant') }}</h4>
                <p class="text-white">11</p>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="danger">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-cost') }}</h4>
                <p class="text-white">11</p>
                <va-card-actions align="right">
                    <va-button>Invite to Earn</va-button>
                    <va-button>Place Joy</va-button>
                </va-card-actions>
              </va-card-content>
            </va-card>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <va-card class="col-span-12" style="margin-top: 25px">
      <va-card-title>{{ t('round-info.past') }}</va-card-title>
      <va-card-content>
        <va-data-table :fields="fields" :items="users" no-pagination>
          <template #marker="props">
            <va-icon name="fa fa-circle" :color="props.rowData.color" size="8px" />
          </template>

          <template #actions="props">
            <va-button preset="plain" small color="gray" class="m-0" @click="alert(props.rowData)">
              {{ t('tables.edit') }}
            </va-button>

            <va-button preset="plain" small color="danger" class="m-0">
              {{ t('tables.delete') }}
            </va-button>
          </template>
        </va-data-table>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import {
    prepareWriteContract,
    getAccount,
    writeContract,
    waitForTransaction,
    connect,
    erc20ABI,
    readContract,
    getNetwork,
    switchNetwork,
  } from '@wagmi/core'
  import { Web3 } from 'web3'
  import { ref, reactive, watch, watchEffect } from 'vue'
  import { useForm, useModal, useToast, useColors } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()
  const { colors } = useColors()

  const crossTokenABI = [
    {
      inputs: [
        { internalType: 'uint256', name: '_betCost', type: 'uint256' },
        { internalType: 'address', name: '_devTreater', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'round', type: 'uint256' },
        { indexed: true, internalType: 'address', name: 'user', type: 'address' },
        { indexed: true, internalType: 'address', name: 'inviter', type: 'address' },
        { indexed: false, internalType: 'uint256', name: 'seq', type: 'uint256' },
      ],
      name: 'RoundJoin',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: 'uint256', name: 'round', type: 'uint256' },
        { indexed: false, internalType: 'uint256', name: 'count', type: 'uint256' },
        { indexed: false, internalType: 'address[]', name: 'users', type: 'address[]' },
      ],
      name: 'RoundWinner',
      type: 'event',
    },
    {
      inputs: [],
      name: 'INVITE_SHARE',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'ROUND_COUNT',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'ROUND_FEE',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'betCost',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'currentRound',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'devTreater',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'address', name: '', type: 'address' },
      ],
      name: 'roundPartInviter',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'address', name: '', type: 'address' },
      ],
      name: 'roundPartVerifyer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      name: 'roundParticipants',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      name: 'roundPrize',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [],
      name: 'roundSettling',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    {
      inputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'uint256', name: '', type: 'uint256' },
      ],
      name: 'roundWinner',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
      constant: true,
    },
    { stateMutability: 'payable', type: 'receive', payable: true },
    {
      inputs: [{ internalType: 'address', name: '_inviter', type: 'address' }],
      name: 'enjoy',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
      payable: true,
    },
  ]
  const crossTokenAddr = '0xEE3a47205388819C4b5E94865b34f3156F91a120'

  let users = reactive([
    {
      RoundNumber: '1',
      Winners: 'Ashley',
      Prize: '5 ETH',
      Action: 'Ashley Mcdaniel'
    }
  ])
</script>

<style lang="scss" scoped>
  
</style>
