<script setup lang="ts">
  import {
    getAccount,
    getBalance,
    writeContract,
    waitForTransactionReceipt,
    readContract,
    getChainId,
    switchChain,
    watchAccount,
    type WriteContractParameters,
    type ReadContractParameters,
  } from '@wagmi/core'
  import { Web3 } from 'web3'
  import { validator } from 'web3-validator'
  import { ref, reactive, watch, onMounted } from 'vue'
  import { useToast } from 'vuestic-ui'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'
  import { useGlobalStore } from '../../stores/global-store'
  import { supportNetworks, NetModel } from '../../data/chains/dhrContract'
  import { config } from '../../wagmi'
  import RoundAnimate from '../../components/roundAnimate/index.vue'
  import Loading from '../../components/icons/Loading.vue'
  import Copy from '../../components/icons/Copy.vue'
  import TwitterX from '../../components/icons/TwitterX.vue'

  interface RoundInfo {
    index: number | bigint
    number: number
    winners: string[]
    prize: number
    wincode: number
    users: string[]
  }

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

  const { t } = useI18n()
  const { init } = useToast()
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

  // onMounted
  onMounted(async () => {
    // roundinfo
    // getCurrentRound()
  })

  watch([() => currentRound.number], async ([r]) => {
    getAllPastRound(BigInt(r))
  })

  watchAccount(config, {
    onChange(data) {
      // 未连接钱包
      if (!data.isConnected) {
        return
      }

      console.log('>>>>>>data.chainId', data.chainId)

      // 连接了钱包
      authStore.setUserAddress(data.address)
      authStore.setUserChainId(data.chainId)

      getCurrentRound()
    },
  })

  const handleSwithNetwork = async (chain: Network) => {
    try {
      await switchChain(config, {
        chainId: chain.chainId,
      })
      authStore.setCurrentNetwork(chain)
    } catch (err) {
      if (err?.name == 'UserRejectedRequestError') {
        return init({ message: 'User rejected the request.', color: 'warning' })
      }
    }
  }

  // 没有匹配上全局 network
  const getCurrentSupportNetwork = (chainId: number) => {
    return supportNetworks.find((sc) => sc.chainId === chainId) || null
  }

  // getCurrentRound
  const getCurrentRound = () => {
    let chain = getCurrentSupportNetwork(authStore.getUserChainId)
    authStore.setCurrentNetwork(chain)

    if (!chain) {
      return (submitPlace.value = false)
    }

    submitPlace.value = true
    readContract(config, {
      address: `0x${chain.contractAddr.slice(2)}`,
      abi: chain.contractAbi,
      functionName: 'currentRoundInfo',
      account: getAccount(config).address,
      chainId: chain.chainId,
      args: [],
    })
      .then(async (v: any) => {
        currentRound.number = v.index
        currentRound.participants = v.users
        currentRound.prize = v.prize
        currentRound.roundProcess = (v.users.length * 100) / 16
        const bidvalue = await getBidValue()
        currentRound.bidValue = Number(bidvalue)
        submitPlace.value = false
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
        getAllPastRound(v.index)
      })
      .catch(() => {
        submitPlace.value = false
      })
  }

  // getBidValue (获取投注金额
  const getBidValue = () => {
    return new Promise((resolve, reject) => {
      readContract(config, {
        address: `0x${authStore.getCurrentNetwork?.contractAddr.slice(2)}`,
        abi: authStore.getCurrentNetwork?.contractAbi || [],
        functionName: 'betCost',
        account: getAccount(config).address,
        chainId: authStore.getCurrentNetwork?.chainId,
      } as ReadContractParameters)
        .then((_bidValue) => {
          resolve(_bidValue)
        })
        .catch((e) => {
          reject(e)
        })
    })
  }

  // get history
  const getAllPastRound = async (currentRoundNumber: bigint) => {
    const data: any[] = []
    for (let i = Number(currentRoundNumber); i > 0; i--) {
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

  const copyInviteUrl = async () => {
    if (!getAccount(config).address) {
      init({ message: 'Please Connect Wallet First', color: 'warning' })
      return
    }
    try {
      const currentWallet: string = getAccount(config).address as string
      const requestChain: string = route.params.chain as string
      const currentChain: string = getChainId(config).toString() || ''
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

  const handlePastRound = async (round: number) => {
    if (currentNetwork.value) {
      const hisRounds = await readContract(config, {
        address: `0x${authStore.getCurrentNetwork?.contractAddr.slice(2)}`,
        abi: authStore.getCurrentNetwork?.contractAbi || [],
        functionName: 'historyRoundInfo',
        chainId: authStore.getCurrentNetwork?.chainId,
        args: [round],
      })
      return hisRounds
    }
  }

  const handlePlaceBid = async () => {
    if (submitPlace.value) return

    submitPlace.value = true
    let inviter = '0x0000000000000000000000000000000000000000'

    let address = authStore.getUserAddress
    if (!address) {
      submitPlace.value = false
      return init({ message: 'Please connect the wallet.', color: 'warning' })
    }

    // 检查用户连接的 chainid 是否是支持网络中的一个
    let schain = supportNetworks.find((sc) => sc.chainId === authStore.getUserChainId)
    if (!schain) {
      // request switch network
      return handleSwithNetwork(supportNetworks[0])
    }

    // 检测金额够不够
    let balance = await getBalance(config, {
      address: address,
    })
    if (balance.formatted < web3.utils.fromWei(currentRound.bidValue, 'ether')) {
      submitPlace.value = false
      return init({ message: 'The amount is not enough.', color: 'warning' })
    }

    if (route.params.address && !validator.validate(['address'], [route.params.address], { silent: true })) {
      inviter = route.params.address as string
    }
    try {
      const hash = await writeContract(config, {
        abi: authStore.getCurrentNetwork.contractAbi,
        address: `0x${authStore.getCurrentNetwork.contractAddr.slice(2)}`,
        functionName: 'enjoy',
        args: [inviter],
        value: BigInt(currentRound.bidValue),
      } as WriteContractParameters)

      const receipt = await waitForTransactionReceipt(config, { hash })
      if (receipt.status == 'success') {
        init({ message: 'Success', color: 'success' })
        getCurrentRound()
      } else {
        init({ message: 'Fail', color: 'danger' })
      }
      submitPlace.value = false
    } catch (e: any) {
      console.log('e::::::', e, e.name)
      submitPlace.value = false
      if (e.name == 'UserRejectedRequestError' || e.name == 'TransactionExecutionError') {
        return init({ message: 'User rejected the request.', color: 'warning' })
      }
      if (e.name == 'AbiFunctionNotFoundError') {
        return init({ message: 'Function "enjoy" not found on ABI.', color: 'warning' })
      }
      if (e.name == 'ContractFunctionExecutionError') {
        return init({ message: e.message.split('Contract Call')[0], color: 'warning' })
      }
      init({ message: e.message, color: 'danger' })
    }
  }

  const handleInvite = () => {
    let backUri = encodeURIComponent('https://hash.bid/turntable/index?w=' + getAccount(config).address)
    let content = "I'm spinning the wheel of hash. Come join me and win a prize! \n"
    content += '#DestinyHashRing #DHR #HashWorld\n'
    content += '📍Click to join & win money\n'
    let text = encodeURIComponent(content)

    //window.open(`https://twitter.com/intent/tweet?text=${text}&url=${backUri}`)
    window.open(`https://twitter.com/intent/tweet?url=${backUri}&text=${text}`)
  }

  const handleGotoTx = (address: string) => {
    window.open(`https://www.oklink.com/cn/dis/address/${address}`)
  }
</script>

<template>
  <div class="turn-container">
    <section class="text-center">
      <h1 class="text-5xl font-otb uppercase text-main">{{ t('nav.message') }}</h1>
      <section class="text-white flex items-center justify-center gap-x-8 my-4">
        <button class="flex items-center" @click="copyInviteUrl">
          <Copy class="text-main text-xl" /><span class="ml-2 font-otr underline">{{ copyText }}</span>
        </button>
        <button class="flex items-center" @click="handleInvite">
          <TwitterX class="text-main" /><span class="ml-2 font-otr underline">Tweet to Earn</span>
        </button>
      </section>
      <!-- <p class="text-white font-cpl py-2 leading-[1.2] mx-auto max-w-[80%]">
        {{ t('round-info.details-1') }} {{ t('round-info.details-2') }} {{ t('round-info.details-3') }}
        {{ t('round-info.details-4') }} {{ t('round-info.details-5') }} {{ t('round-info.details-6') }}
        {{ t('round-info.details-7') }} {{ t('round-info.details-8') }}
      </p> -->
      <div class="max-w-[50%] text-white leading-[1.2] mx-auto text-left mt-2">
        <p class="font-cpl">{{ t('round-info.details-1') }}</p>
        <p class="font-cpl">{{ t('round-info.details-2') }}</p>
        <p class="font-cpl">{{ t('round-info.details-3') }}</p>
        <p class="font-cpl">{{ t('round-info.details-4') }}</p>
        <p class="font-cpl">{{ t('round-info.details-5') }}</p>
        <p class="font-cpl">{{ t('round-info.details-6') }}</p>
        <p class="font-cpl">{{ t('round-info.details-7') }}</p>
        <p class="font-cpl">{{ t('round-info.details-8') }}</p>
      </div>
    </section>

    <section class="flex w-full">
      <section class="px-4 flex-1">
        <!-- round-prize -->
        <div class="migration-wrapper md:max-w-[60%]">
          <div class="migration-inner">
            <h2 class="text-xl md:text-2xl font-otb uppercase text-main">
              {{ t('round-info.round-prize') }} / {{ t('round-info.round-bid') }}
            </h2>
            <div class="flex flex-col md:flex-row gap-x-4 md:items-center justify-between">
              <h2 class="text-xl font-otsb uppercase text-white running px-3 py-1 mt-2 inline-block">
                {{ web3.utils.fromWei(currentRound.prize, 'ether') }} {{ authStore.getCurrentNetwork?.chainSymbol }} /
                {{ web3.utils.fromWei(currentRound.bidValue, 'ether') }} {{ authStore.getCurrentNetwork?.chainSymbol }}
              </h2>
              <button
                class="submit-button relative z-20 font-otb mt-4 md:mt-0"
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
            <div class="flex md:items-start justify-between flex-col md:flex-row">
              <h2 class="text-xl font-otsb uppercase text-white running px-3 py-1 inline-block">
                #{{ currentRound.number }}
              </h2>
              <RoundAnimate class="mt-8 md:mt-0" />
            </div>
          </div>
        </div>
        <!-- participant -->
        <div class="migration-wrapper md:max-w-[60%]">
          <div class="migration-inner">
            <h2 class="text-xl pt-4 pb-2 md:text-2xl flex gap-x-8 flex-col md:flex-row">
              <span class="font-otb uppercase text-main"
                >{{ t('round-info.round-participant') }} - {{ currentRound.participants.length }}</span
              >
              <button class="flex items-center text-main" @click="copyInviteUrl">
                <Copy class="text-xl" /><span class="ml-2 text-white font-otr underline text-base">{{ copyText }}</span>
              </button>
            </h2>
            <div v-if="currentRound.participants?.length > 0" class="text-white flex items-center flex-wrap">
              <p
                v-for="(item, index) in currentRound.participants"
                :key="index"
                class="text-sm break-all md:text-sm font-otr running participant my-1 inline-block"
              >
                {{ item.replace(/^(\w{8}).*(\w{8})$/, '$1*********$2') }}
              </p>
            </div>
            <div v-else class="text-white">- -</div>
          </div>
        </div>
      </section>
    </section>

    <table class="va-table mt-8 va-table--striped va-table--hoverable w-full">
      <thead>
        <tr class="text-xs md:text-base">
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
          <td>
            <span v-if="hr.winners?.length == 0">
              <span v-if="currentRound.number != hr.index">-No Winner-</span>
              <span v-else>-Running-</span>
            </span>
            <span v-else>
              <span
                v-for="(item, index) in hr.winners"
                :key="index"
                class="mr-1 underline cursor-pointer"
                @click="handleGotoTx(item)"
                >{{ item.replace(/^(\w{5}).*(\w{4})$/, '$1****$2') }}</span
              >
            </span>
          </td>
          <td class="text-xs md:text-base">{{ hr.prize }}</td>
          <td class="text-xs md:text-base">{{ hr.wincode }}</td>
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
  .participant {
    width: 260px;
    text-align: center;
  }

  .migration-wrapper {
    margin: 20px auto 0;
    overflow: hidden;
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
