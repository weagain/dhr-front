import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
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

    interface AppState {
      isSidebarMinimized: boolean
      userName: string
      userAddress: string
      userChainId: number
      _currentNetwork: Network | null
    }

    const initialState: AppState = {
      isSidebarMinimized: false,
      userName: 'Vasili S',
      userAddress: '', // 钱包地址
      userChainId: 0, // 链 ID
      _currentNetwork: null,
    }

    return initialState
  },

  getters: {
    getUserAddress: (state) => state.userAddress,
    getUserChainId: (state) => state.userChainId,
    getCurrentNetwork: (state) => state._currentNetwork,
  },

  actions: {
    toggleSidebar() {
      this.isSidebarMinimized = !this.isSidebarMinimized
    },

    changeUserName(userName: string) {
      this.userName = userName
    },

    setUserAddress(address: string) {
      this.userAddress = address
    },

    setUserChainId(address: number) {
      this.userChainId = address
    },

    setCurrentNetwork(chain: object) {
      this._currentNetwork = chain
    },
  },
})
