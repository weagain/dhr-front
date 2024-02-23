<script setup lang="ts">
  import {
    prepareWriteContract,
    getAccount,
    fetchBalance,
    writeContract,
    waitForTransaction,
    readContract,
    getNetwork,
    switchNetwork,
    watchNetwork,
  } from '@wagmi/core'
  import { Web3 } from 'web3'
  import { validator } from 'web3-validator'
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useForm, useModal, useToast, useColors } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useGlobalStore } from '../../stores/global-store'
  import { supportNetworks, NetModel } from '../../data/chains/dhrContract'
  import RoundAnimate from '../../components/roundAnimate/index.vue'
  import Loading from '../../components/icons/Loading.vue'
  import Copy from '../../components/icons/Copy.vue'
  import TwitterX from '../../components/icons/TwitterX.vue'
  import { wagmiConfig, projectId, chains, w3mconnectors } from '../../wagmi'

  import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
  const connector = new WalletConnectConnector({
    options: {
      projectId: projectId,
    },
  })

  interface RoundInfo {
    index: number | bigint
    number: number
    winners: string[]
    prize: number
    wincode: number
    users: string[]
  }

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()
  const { colors } = useColors()
  const authStore = useGlobalStore()
  const route = useRoute()
  const web3 = new Web3()
  const copyText = ref<string>('Invitation link')

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

  let historyRounds = reactive({
    list: [
      {
        index: 0,
        number: 0,
        winners: [''],
        prize: '',
        wincode: '',
        users: [''],
      },
    ],
  })

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
        // 邀请 chainid 在允许网络内
        if (e.chainId.toString() == route.params.chain.toString()) {
          // await handleSwithNetwork(e.chainId);
        }
      }
      if (e.chainId == getNetwork().chain?.id) {
        currentNetwork.value = e
        authStore.setCurrentNetwork(e)
        break
      }
    }

    if (currentNetwork.value.chainId > 0) {
      handleCurrentRound(currentNetwork.value.chainId)
    }
  })

  watch([() => currentRound.number], async ([r]) => {
    handleAllPastRound(BigInt(r))
  })

  const unwatch = watchNetwork((network) => {
    let selChain = 0
    if (!network.chain) return
    supportNetworks.forEach((e) => {
      if (e.chainId == network.chain?.id) {
        selChain = e.chainId
        return
      }
    })
    if (selChain == 0) {
      init({ message: 'unsupport network', color: 'warning' })
      // switch
      handleSwithNetwork(supportNetworks[0].chainId)
      authStore.setCurrentNetwork(null)
    } else {
      console.log('network >>>> >>>', network)
      // 初始化
      historyRounds.list = [
        {
          index: 0,
          number: 0,
          winners: [''],
          prize: '',
          wincode: '',
          users: [''],
        },
      ]
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
            authStore.setCurrentNetwork(currentNetwork.value)
            handleCurrentRound(chainId)
          }
        }
      } catch (e) {
        console.log('switch network error:', e)
        init({ message: 'refuse to change network', color: 'warning' })
      }
    }
  }

  const copyInviteUrl = async () => {
    if (!getAccount().address) {
      init({ message: 'Please Connect Wallet First', color: 'warning' })
      return
    }
    try {
      const currentWallet: string = getAccount().address as string
      const requestChain: string = route.params.chain as string
      const currentChain: string = getNetwork().chain?.id?.toString() || ''
      let uri: string =
        'https://hash.bid/turntable/index/' + currentWallet + '/' + (requestChain ? requestChain : currentChain)
      console.log('uri:', uri)
      await navigator.clipboard.writeText(uri)
      copyText.value = 'Copyed'
      setTimeout(() => {
        copyText.value = 'Invitation link'
      }, 2000)
      console.log('Text copied to clipboard')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleBidValue = async (chainId: number) => {
    const _bidValue = await readContract({
      address: `0x${authStore.getCurrentNetwork?.contractAddr.slice(2)}`,
      abi: authStore.getCurrentNetwork?.contractAbi || [],
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
            init({ message: 'Network Error, please refresh page', color: 'warning' })
          })
      }
    })
  }

  const handlePastRound = async (round: number) => {
    if (currentNetwork.value) {
      const hisRounds = await readContract({
        address: `0x${authStore.getCurrentNetwork?.contractAddr.slice(2)}`,
        abi: authStore.getCurrentNetwork?.contractAbi || [],
        functionName: 'historyRoundInfo',
        chainId: authStore.getCurrentNetwork?.chainId,
        args: [round],
      })
      return hisRounds
    }
  }

  const handleAllPastRound = async (currentRoundNumber: bigint) => {
    const data: any[] = []
    if (currentRoundNumber == 1n) return
    for (let i = Number(currentRoundNumber - 1n); i > 0; i--) {
      const hisRound = await handlePastRound(i)
      const hisRound0 = hisRound as unknown as RoundInfo
      const prizeString = hisRound0.prize.toString()
      data.push({
        index: hisRound0.index,
        winners: hisRound0.winners,
        users: hisRound0.users,
        prize:
          (prizeString == '0' ? '0' : web3.utils.fromWei(prizeString, 'ether')) +
          ' ' +
          authStore.getCurrentNetwork?.chainSymbol,
        wincode: hisRound0.wincode,
      })
      historyRounds.list.splice(0, historyRounds.list.length, ...data)
    }
  }

  const handlePlaceBid = async () => {
    submitPlace.value = true
    let inviter = '0x0000000000000000000000000000000000000000'

    let address = getAccount().address
    if (!address) {
      submitPlace.value = false
      return init({ message: 'Please connect the wallet.', color: 'danger' })
    }

    // 检测金额够不够
    let balance = await fetchBalance({
      address: address,
      chainId: authStore.getCurrentNetwork?.chainId,
    })

    if (balance.formatted < web3.utils.fromWei(currentRound.bidValue, 'ether')) {
      submitPlace.value = false
      return init({ message: 'The amount is not enough.', color: 'danger' })
    }

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
      submitPlace.value = false
    } catch (e: any) {
      submitPlace.value = false
      init({ message: e.message, color: 'danger' })
    }
  }

  const handleInvite = () => {
    let backUri = encodeURIComponent('https://https://hash.bid/turntable/index?w=' + getAccount().address)
    let content = "I'm spinning the wheel of hash. Come join me and win a prize! \n"
    content += '#DestinyHashRing #DHR #HashWorld\n'
    content += '📍Click to join & win money\n'
    let text = encodeURIComponent(content)

    //window.open(`https://twitter.com/intent/tweet?text=${text}&url=${backUri}`)
    window.open(`https://twitter.com/intent/tweet?url=${backUri}&text=${text}`)
  }
</script>

<template>
  <div class="turn-container">
    <section class="text-center">
      <h1 class="text-5xl font-otb uppercase text-main">{{ t('nav.message') }}</h1>
      <p class="text-white font-cpl py-2 leading-[1.2] mx-auto max-w-[80%]">
        {{ t('round-info.details-1') }} {{ t('round-info.details-2') }} {{ t('round-info.details-3') }}
        {{ t('round-info.details-4') }} {{ t('round-info.details-5') }} {{ t('round-info.details-6') }}
        {{ t('round-info.details-7') }} {{ t('round-info.details-8') }}
      </p>
    </section>

    <section class="text-white flex items-center justify-center gap-x-8 my-4">
      <button class="flex items-center" @click="copyInviteUrl">
        <Copy class="text-main text-xl" /><span class="ml-2 font-otr underline">{{ copyText }}</span>
      </button>
      <button class="flex items-center" @click="handleInvite">
        <TwitterX class="text-main" /><span class="ml-2 font-otr underline">Tweet to Earn</span>
      </button>
    </section>

    <section class="flex w-full">
      <section class="px-4 flex-1">
        <!-- round-prize -->
        <div class="migration-wrapper">
          <div class="migration-inner">
            <h2 class="text-xl md:text-2xl font-otb uppercase text-main">
              {{ t('round-info.round-prize') }} / {{ t('round-info.round-bid') }}
            </h2>
            <div class="flex gap-x-4 items-center justify-between">
              <h2 class="text-xl font-otsb uppercase text-white running px-3 py-1 mt-2 inline-block">
                {{ web3.utils.fromWei(currentRound.prize, 'ether') }} {{ authStore.getCurrentNetwork?.chainSymbol }} /
                {{ web3.utils.fromWei(currentRound.bidValue, 'ether') }} {{ authStore.getCurrentNetwork?.chainSymbol }}
              </h2>
              <button
                class="submit-button relative z-20 font-otb"
                :loading="submitPlace"
                :disable="submitPlace"
                @click="handlePlaceBid"
              >
                <Loading v-if="submitPlace" />
                Place Joy
              </button>
            </div>

            <!-- round-num -->
            <h2 class="text-xl py-2 mt-2 md:text-2xl font-otb uppercase text-main">{{ t('round-info.round-num') }}</h2>
            <div class="flex items-start justify-between">
              <h2 class="text-xl font-otsb uppercase text-white running px-3 py-1 inline-block">
                #{{ currentRound.number }}
              </h2>
              <RoundAnimate />
            </div>
          </div>
        </div>
        <!-- participant -->
        <div class="migration-wrapper">
          <div class="migration-inner">
            <h2 class="text-xl pt-4 pb-2 md:text-2xl flex gap-x-8">
              <span class="font-otb uppercase text-main"
                >{{ t('round-info.round-participant') }} - {{ currentRound.participants.length }}</span
              >
              <button class="flex items-center text-main" @click="copyInviteUrl">
                <Copy class="text-xl" /><span class="ml-2 text-white font-otr underline text-base">{{ copyText }}</span>
              </button>
            </h2>
            <div v-if="currentRound.participants?.length > 0" class="text-white">
              <p
                v-for="(item, index) in currentRound.participants"
                :key="index"
                class="text-sm font-otr running m-1 inline-block"
              >
                {{ item }}
              </p>
            </div>
            <div v-else class="text-white">- -</div>
          </div>
        </div>
      </section>
    </section>

    <table class="va-table mt-8 va-table--striped va-table--hoverable w-full">
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
        <tr v-for="(hr, index) in historyRounds.list" :key="index">
          <td>{{ hr.index }}</td>
          <td>{{ hr.users.length }}</td>
          <td>{{ hr.winners?.length > 0 ? hr.winners : '-No Winner-' }}</td>
          <td>{{ hr.prize }}</td>
          <td>{{ hr.wincode }}</td>
          <td>
            <va-badge :text="getRoundText(hr)" :color="getRoundColor(hr)" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  .running {
    border: 1px dashed white;
  }

  .migration-wrapper {
    max-width: 60%;
    margin: 20px auto 0;
    // height: 220px;
    padding: 1px;
    clip-path: polygon(100% 0, 100% calc(100% - 56px), calc(100% - 56px) 100%, 0 100%, 0 32px, 32px 0);
    background: #fcfc03;
    border-radius: 3px;

    .migration-inner {
      // height: 218px;
      padding: 20px 40px;
      border-radius: 3px;
      clip-path: polygon(100% 0, 100% calc(100% - 56px), calc(100% - 56px) 100%, 0 100%, 0 32px, 32px 0);
      background: black;
    }
  }

  .submit-button {
    background: #fcfc03;
    width: 200px;
    font-size: 16px;
    padding: 10px 0;
    color: black;
    border-radius: 6px;
    clip-path: polygon(20px 0, 100% 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 0 50%);
    transition: all 0.3s;

    &:hover {
      background: white;
    }

    &[disabled] {
      cursor: not-allowed;
    }
  }

  .va-table {
    th {
      font-family: 'Orbitron-SemiBold';
      color: #fcfc03;
    }

    tr {
    }

    td {
      background-color: black !important;
      color: white;
    }
  }
</style>
