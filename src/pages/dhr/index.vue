<template>
  <div class="w-full">
    <div class="w-full grid grid-cols-12 gap-6">
      <va-card class="col-span-12 sm:col-span-4">
        <va-card-title> {{ t('round-info.introduction') }} </va-card-title>
        <va-card-content>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-1') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-2') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-3') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-4') }}
          </p>
        </va-card-content>
      </va-card>

      <va-card class="col-span-12 sm:col-span-4">
        <va-card-content>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-5') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-6') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-7') }}
          </p>
          <p class="rich-theme-card-text">
            {{ t('round-info.details-8') }}
          </p>
          <div class="mt-4">
            <va-button color="primary" @click="copyInviteUrl">
              {{ t('round-info.invite-button') }}
            </va-button>
          </div>
        </va-card-content>
      </va-card>

      <va-card class="col-span-12 sm:col-span-4">
        <va-card-title>{{ t('round-info.support-chains') }}</va-card-title>
        <va-card-content class="h-full flex flex-col justify-center">
          <va-button
            v-for="(info, idx) in supportNetworks"
            :key="idx"
            size="large"
            :text-color="info.textColor"
            :color="info.color"
            class="mr-3 mb-2"
            @click="handleSwithNetwork(info.chainId)"
            >{{ info.chainName }}</va-button
          >
        </va-card-content>
      </va-card>
    </div>

    <va-card class="col-span-12" style="margin-top: 25px">
      <va-card-title>{{ t('round-info.current') }}</va-card-title>
      <va-card-content>
        <div class="col-span-12 lg:col-span-6 flex flex-wrap">
          <div class="w-full pb-6 grid grid-cols-12 gap-6">
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="success">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-num') }} - #{{ currentRound.number }}</h4>
                <va-progress-circle
                  :model-value="currentRound.roundProcess"
                  :thickness="0.2"
                  size="large"
                  color="#ffffff"
                  align="right"
                >
                  {{ currentRound.roundProcess + '%' }}
                </va-progress-circle>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="info">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">
                  {{ t('round-info.round-participant') }} - {{ currentRound.participants.length }}
                </h4>
                <p v-for="(item, index) in currentRound.participants" :key="index" class="text-white">{{ item }}</p>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="danger">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">
                  {{ t('round-info.round-prize') }} / {{ t('round-info.round-bid') }}
                </h4>
                <p class="text-white">
                  {{ web3.utils.fromWei(currentRound.prize, 'ether') }} {{ currentNetwork.coin }} /
                  {{ web3.utils.fromWei(currentRound.bidValue, 'ether') }} {{ currentNetwork.coin }}
                </p>
                <va-card-actions align="right">
                  <va-button @click="handleInvite">Tweet to Earn</va-button>
                  <va-button :loading="submitPlace" :disable="submitPlace" @click="handlePlaceBid">Place Joy</va-button>
                </va-card-actions>
              </va-card-content>
            </va-card>
          </div>
        </div>
      </va-card-content>
    </va-card>

    <va-card class="col-span-12" style="margin-top: 25px">
      <va-card-title>{{ t('tables.stripedHoverable') }}</va-card-title>
      <va-card-content class="overflow-auto">
        <table class="va-table va-table--striped va-table--hoverable w-full">
          <thead>
            <tr>
              <th>Round</th>
              <th>Users</th>
              <th>Winner</th>
              <th>Prize</th>
              <th>WinCode</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="hr in historyRounds" :key="hr.id">
              <td>{{ hr.index }}</td>
              <td>{{ hr.users.length }}</td>
              <td>{{ hr.winners }}</td>
              <td>{{ hr.prize }}</td>
              <td>{{ hr.wincode }}</td>
              <td>
                <va-badge :text="getRoundText(hr)" :color="getRoundColor(hr)" />
              </td>
            </tr>
          </tbody>
        </table>
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
    watchNetwork,
    watchAccount,
    getConfig,
  } from '@wagmi/core'
  import { Web3 } from 'web3'
  import { validator } from 'web3-validator'
  import { ref, reactive, watch, watchEffect, onMounted } from 'vue'
  import { useForm, useModal, useToast, useColors } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { supportNetworks, NetModel } from '../../data/chains/dhrContract'

  import { EthereumClient } from '@web3modal/ethereum'
  import { Web3Modal } from '@web3modal/html'
  import { nextTick } from 'vue'
  import { wagmiConfig, projectId, chains, w3mconnectors } from '../../wagmi'

  import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
  import { setTimeout } from 'node:timers/promises'
  const connector = new WalletConnectConnector({
    options: {
      projectId: projectId,
    },
  })

  interface RoundInfo {
    index: number
    users: string[]
    prize: number
    winners: string[]
    wincode: number
  }

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()
  const { colors } = useColors()
  const route = useRoute()
  const web3 = new Web3()

  function getRoundText(round: RoundInfo) {
    if (round.index == currentRound.number) {
      return 'Running'
    } else if (round.winners.length == 0) {
      return 'Jackpot'
    }
    return 'Done'
  }

  function getRoundColor(round: RoundInfo) {
    if (round.index == currentRound.number) {
      return 'info'
    } else if (round.winners.length == 0) {
      return 'danger'
    }
    return 'success'
  }

  let currentRound = reactive({
    number: 0,
    participants: [''],
    prize: 0,
    roundProcess: 0,
    bidValue: 0,
  })

  let historyRounds = reactive([
    {
      number: 0,
      winners: [''],
      prize: '',
      wincode: '',
      users: [''],
    },
  ])

  let submitPlace = ref(false)
  let emp: any[] = []
  let currentNetwork = ref({
    chainId: 0,
    chainName: '',
    chainSymbol: '',
    coin: '',
    textColor: '',
    color: '',
    contractAddr: '',
    contractAbi: emp,
  })

  onMounted(async () => {
    for (const e of supportNetworks) {
      if (route.params.chain) {
        console.log('e.chainId==chain', e.chainId.toString() == route.params.chain.toString())
        if (e.chainId.toString() == route.params.chain.toString()) {
          // await handleSwithNetwork(e.chainId);
        }
      } else {
        if (e.chainId == getNetwork().chain?.id) {
          currentNetwork.value = e
          break
        }
      }
    }

    if (currentNetwork.value.chainId > 0) {
      handleCurrentRound(currentNetwork.value.chainId)
    }
  })

  watch([() => currentRound.number], async ([r]) => {
    handleAllPastRound(r)
  })

  const unwatch = watchNetwork((network) => {
    let selChain = 0
    supportNetworks.forEach((e) => {
      if (e.chainId == network.chain?.id) {
        selChain = e.chainId
        return
      }
    })
    if (selChain == 0) {
      init({ message: 'unsupport network', color: 'danger' })
      // switch
      handleSwithNetwork(supportNetworks[0].chainId)
    } else {
      handleCurrentRound(selChain)
    }
  })

  const handleSwithNetwork = async (chainId: number) => {
    if (chainId != getNetwork().chain?.id) {
      try {
        const network = await switchNetwork({
          chainId: chainId,
        })
        for (let e of supportNetworks) {
          if (e.chainId == chainId) {
            currentNetwork.value = e
            handleCurrentRound(chainId)
          }
        }
      } catch (e) {
        console.log('switch network error:', e)
        init({ message: 'refuse to change network', color: 'danger' })
      }
    }
  }

  const copyInviteUrl = async () => {
    if (!getAccount().address) {
      init({ message: 'Please Connect Wallet First', color: 'danger' })
      return
    }
    try {
      const currentWallet: string = getAccount().address as string
      const requestChain: string = route.params.chain as string
      const currentChain: string = getNetwork().chain?.id?.toString() || ''
      let uri: string =
        'https://hash.bid/dhr/index/' + currentWallet + '/' + (requestChain ? requestChain : currentChain)
      console.log('uri:', uri)
      await navigator.clipboard.writeText(uri)
      console.log('Text copied to clipboard')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleBidValue = async (chainId: number) => {
    const _bidValue = await readContract({
      address: `0x${currentNetwork.value.contractAddr.slice(2)}`,
      abi: currentNetwork.value.contractAbi,
      functionName: 'betCost',
      account: getAccount().address,
      chainId: chainId,
      args: [],
    })
    return _bidValue
  }

  const handleCurrentRound = async (chainId: number) => {
    supportNetworks.forEach((e: NetModel) => {
      if (e.chainId == chainId && e.contractAddr != '') {
        submitPlace.value = true
        readContract({
          address: `0x${e.contractAddr.slice(2)}`,
          abi: e.contractAbi,
          functionName: 'currentRoundInfo',
          account: getAccount().address,
          chainId: chainId,
          args: [],
        })
          .then((v: any) => {
            currentRound.number = v.index
            currentRound.participants = v.users
            currentRound.prize = v.prize
            currentRound.roundProcess = (v.users.length * 100) / 16
            handleBidValue(chainId).then((b) => {
              currentRound.bidValue = Number(b)
            })
            submitPlace.value = false
            handleAllPastRound(v.index)
          })
          .catch((e: any) => {
            submitPlace.value = false
            init({ message: 'Network Error, please refresh page', color: 'danger' })
          })
      }
    })
  }

  const handlePastRound = async (round: number) => {
    if (currentNetwork.value) {
      const hisRounds = await readContract({
        address: `0x${currentNetwork.value.contractAddr.slice(2)}`,
        abi: currentNetwork.value.contractAbi,
        functionName: 'historyRoundInfo',
        chainId: currentNetwork.value.chainId,
        args: [round],
      })
      return hisRounds
    }
  }

  const handleAllPastRound = async (currentRoundNumber: number) => {
    const data: any[] = []
    for (let i = currentRoundNumber; i > 0; i--) {
      const hisRound = await handlePastRound(i)
      const hisRound0 = hisRound as unknown as RoundInfo
      data.push({
        index: hisRound0.index,
        winners: hisRound0.winners,
        users: hisRound0.users,
        prize: web3.utils.fromWei(hisRound0.prize, 'ether') + ' ' + currentNetwork.value.coin,
        wincode: hisRound0.wincode,
      })
      historyRounds.splice(0, historyRounds.length, ...data)
    }
  }

  const handlePlaceBid = async () => {
    submitPlace.value = true
    let inviter = '0x0000000000000000000000000000000000000000'

    if (route.params.address && !validator.validate(['address'], [route.params.address], { silent: true })) {
      inviter = route.params.address as string
    }
    try {
      const { request: config } = await prepareWriteContract({
        address: `0x${currentNetwork.value.contractAddr.slice(2)}`,
        abi: currentNetwork.value.contractAbi,
        functionName: 'enjoy',
        args: [inviter],
        value: BigInt(currentRound.bidValue),
      })

      const { hash } = await writeContract(config)
      const receipt = await waitForTransaction({ hash })
      if (receipt.status == 'success') {
        init({ message: 'Success', color: 'success' })
        handleCurrentRound(currentNetwork.value.chainId)
      } else {
        init({ message: 'Fail', color: 'danger' })
      }
    } catch (e) {
      console.log('e', e)
      init({ message: 'Had joined or settling or Reverted By Errors, Please re-try', color: 'danger' })
    }
    submitPlace.value = false
  }

  const handleInvite = () => {
    let backUri = encodeURIComponent('https://https://hash.bid/dhr/index?w=' + getAccount().address)
    let content = "I'm spinning the wheel of hash. Come join me and win a prize! \n"
    content += '#DestinyHashRing #DHR #HashWorld\n'
    content += '📍Click to join & win money\n'
    let text = encodeURIComponent(content)

    //window.open(`https://twitter.com/intent/tweet?text=${text}&url=${backUri}`)
    window.open(`https://twitter.com/intent/tweet?url=${backUri}&text=${text}`)
  }
</script>

<style lang="scss" scoped></style>
