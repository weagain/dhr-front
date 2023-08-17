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
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-num') }}</h4>
                <p class="text-white">#{{ currentRound.number }}</p>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="info">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-participant') }}</h4>
                <p class="text-white">{{ currentRound.participants.length }}</p>
                <p v-for="(item, index) in currentRound.participants" :key="index" class="text-white">{{ item }}</p>
              </va-card-content>
            </va-card>
            <va-card class="col-span-12 sm:col-span-4 mb-8" color="danger">
              <va-card-content>
                <h4 class="va-h4 m-1 text-white">{{ t('round-info.round-prize') }}</h4>
                <p class="text-white">{{ web3.utils.fromWei(currentRound.prize, 'ether') }} ETH</p>
                <va-card-actions align="right">
                  <va-button @click="handleInvite">Invite to Earn</va-button>
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
              <td>{{ hr.number }}</td>
              <td>{{ hr.users.length }}</td>
              <td>{{ hr.winners }}</td>
              <td>{{ hr.prize }}</td>
              <td>{{ hr.wincode }}</td>
              <td>
                <va-badge :text="getRoundText(hr.number)" :color="getRoundColor(hr.number)" />
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
  const connector = new WalletConnectConnector({
    options: {
      projectId: projectId,
    },
  })

  const { t } = useI18n()
  const { confirm } = useModal()
  const { init } = useToast()
  const { colors } = useColors()
  const route = useRoute()
  const web3 = new Web3()

  function getRoundText(round: number) {
    if (round == currentRound.number) {
      return 'Running'
    }
    return 'Done'
  }

  function getRoundColor(round: number) {
    if (round == currentRound.number) {
      return 'info'
    }
    return 'success'
  }

  let currentRound = reactive({
    number: 0,
    participants: [''],
    prize: 0,
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
  let currentNetwork: NetModel = {
    chainId: 0,
    chainName: '',
    chainSymbol: '',
    textColor: '',
    color: '',
    contractAddr: '',
    contractAbi: emp,
  }

  interface RoundInfo {
    index: number
    users: string[]
    prize: number
    winners: string[]
    wincode: number
  }
  onMounted(async () => {
    for (const e of supportNetworks) {
      if (e.chainId == getNetwork().chain?.id) {
        currentNetwork = e
        break
      }
    }

    if (currentNetwork.chainId > 0) {
      handleCurrentRound(currentNetwork.chainId)
    }
  })

  watch([() => currentRound.number], async ([r]) => {
    const data: any[] = []
    for (let i = r; i > 0; i--) {
      const hisRound = await handlePastRound(i)
      const hisRound0 = hisRound as unknown as RoundInfo
      data.push({
        number: hisRound0.index,
        winners: hisRound0.winners,
        users: hisRound0.users,
        prize: web3.utils.fromWei(hisRound0.prize, 'ether') + ' ETH',
        wincode: hisRound0.wincode,
      })
      historyRounds.splice(0, historyRounds.length, ...data)
    }
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
        handleCurrentRound(chainId)
      } catch (e) {
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
      await navigator.clipboard.writeText('https://chaingam.fenus.xyz/dhr/index/' + getAccount().address)
      console.log('Text copied to clipboard')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleCurrentRound = async (chainId: number) => {
    supportNetworks.forEach((e: NetModel) => {
      if (e.chainId == chainId && e.contractAddr != '') {
        readContract({
          address: `0x${e.contractAddr.slice(2)}`,
          abi: e.contractAbi,
          functionName: 'currentRoundInfo',
          account: getAccount().address,
          args: [],
        }).then((v: any) => {
          currentRound.number = v.index
          currentRound.participants = v.users
          currentRound.prize = v.prize
        })
      }
    })
  }

  const handlePastRound = async (round: number) => {
    if (currentNetwork) {
      const hisRounds = await readContract({
        address: `0x${currentNetwork.contractAddr.slice(2)}`,
        abi: currentNetwork.contractAbi,
        functionName: 'historyRoundInfo',
        args: [round],
      })
      return hisRounds
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
        address: `0x${currentNetwork.contractAddr.slice(2)}`,
        abi: currentNetwork.contractAbi,
        functionName: 'enjoy',
        args: [inviter],
        value: BigInt(web3.utils.toWei('0.01', 'ether')),
      })

      const { hash } = await writeContract(config)
      const receipt = await waitForTransaction({ hash })
      if (receipt.status == 'success') {
        init({ message: 'Success', color: 'success' })
        handleCurrentRound(currentNetwork.chainId)
      } else {
        init({ message: 'Fail', color: 'danger' })
      }
    } catch (e) {
      init({ message: 'Had joined or settling, Please try later', color: 'danger' })
    }
    submitPlace.value = false
  }

  const handleInvite = () => {
    let backUri = encodeURIComponent('https://https://chaingam.fenus.xyz/dhr/index?w=' + getAccount().address)
    let content = "I'm spinning the wheel of fate hash. Come join me and win a prize! \n"
    content += '#DestinyHashRing #DHR\n'
    content += '📍Click to join & win money\n'
    let text = encodeURIComponent(content)

    //window.open(`https://twitter.com/intent/tweet?text=${text}&url=${backUri}`)
    window.open(`https://twitter.com/intent/tweet?url=${backUri}&text=${text}`)
  }
</script>

<style lang="scss" scoped></style>
