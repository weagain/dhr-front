import crypto from 'crypto'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ResponseObj, TradePair, TradeProxy, OpenedOrder } from './req'

const txbitOUri = 'https://api.txbit.io/'

interface TxbitRes {
  success: string
  message: string
  result: any[]
}

class Txbit implements TradeProxy {
  private api_url: string
  private api_key: string
  private api_secret: string

  constructor(api_key: string, api_secret: string) {
    this.api_url = '/txbit/'
    this.api_key = api_key
    this.api_secret = api_secret
  }

  public getRandomArbitrary(min: number, max: number, precision: number): string {
    // const random = Math.random() * (max - min) + min
    // return parseFloat(Number(random).toFixed(precision))
    const random = Number(Math.random() * 10 ** precision * (max - min) + min * 10 ** precision)
    return (random / 10 ** precision).toFixed(precision)
  }

  private hmacSha512(key: string, text: string): string {
    const hmac = crypto.createHmac('sha512', key)
    hmac.update(text)
    return hmac.digest('hex').toUpperCase()
  }

  public async getOrderBook(): Promise<any> {
    const nonce = Date.now()
    let uri = this.api_url + 'api/public/getorderbook?market=FREN/USDT&type=both'
    uri += '&apikey=' + this.api_key + '&nonce=' + nonce

    try {
      const v = await axios.get(uri)

      const response: TxbitRes = v.data
      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async getMyAllBalances(): Promise<ResponseObj> {
    const cusUri = 'api/account/getbalances'

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce
    const sign = this.hmacSha512(this.api_secret, computeSignUri)

    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce
    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      if (v.status != 200) {
        return new Promise((resolve, reject) => {
          resolve(this.makeResponse(false, v.statusText, null))
        })
      }
      const response: TxbitRes = v.data
      if (!response.success) {
        return new Promise((resolve, reject) => {
          resolve(this.makeResponse(false, response.message, null))
        })
      }
      return new Promise((resolve, reject) => {
        const data = []
        for (let i = 0; i < response.result.length; i++) {
          const p = {
            coin: response.result[i].Currency,
            availableAmount: response.result[i].Available,
            lockedAmount: response.result[i].Balance - response.result[i].Available,
          }
          data.push(p)
        }
        resolve(this.makeResponse(true, 'success', data))
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async getMyCurrencyBalances(symbol: string): Promise<ResponseObj> {
    const cusUri = 'api/account/getbalance'
    const cusParam = '&currency=' + symbol

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)

    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data
      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async getAccountOrder(orderUuid: string): Promise<ResponseObj> {
    const cusUri = 'api/account/getorder'
    const cusParam = '&uuid=' + orderUuid

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)
    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam

    // 发送 GET 请求
    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data
      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async setLimitSellOrder(price: string, quantity: string, market: string): Promise<ResponseObj> {
    const cusUri = 'api/market/selllimit'
    const cusParam = '&quantity=' + quantity + '&rate=' + price + '&market=' + market

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)
    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam

    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data
      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async setLimitBuyOrder(price: string, quantity: string, market: string): Promise<ResponseObj> {
    const cusUri = 'api/market/buylimit'
    const cusParam = '&quantity=' + quantity + '&rate=' + price + '&market=' + market

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)
    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam

    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data
      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async cancelMyOrder(orderUuid: string): Promise<ResponseObj> {
    const cusUri = 'api/market/cancel'
    const cusParam = '&uuid=' + orderUuid

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)
    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam

    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data

      return new Promise((resolve, reject) => {
        if (response.success) {
          resolve(this.makeResponse(true, response.message, null))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async getMyMarketOrders(marketPair: string): Promise<ResponseObj> {
    const cusUri = 'api/market/getopenorders'
    const cusParam = '&market=' + marketPair

    const nonce = Math.floor(Date.now() / 1000)
    const computeSignUri = txbitOUri + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam
    const sign = this.hmacSha512(this.api_secret, computeSignUri)
    const uri = this.api_url + cusUri + '?apikey=' + this.api_key + '&nonce=' + nonce + cusParam

    try {
      const v = await axios.get(uri, {
        headers: {
          apisign: sign,
        },
      })
      const response: TxbitRes = v.data

      return new Promise((resolve, reject) => {
        if (response.success) {
          const data = []
          for (let i = 0; i < response.result.length; i++) {
            const p: OpenedOrder = {
              id: response.result[i].OrderUuid,
              time: response.result[i].Opened,
              price: Number(response.result[i].Limit),
              type: response.result[i].OrderType == 'LIMIT_SELL' ? 'sell' : 'buy',
              totalQuantity: Number(response.result[i].Quantity),
              remainQuantity: Number(response.result[i].QuantityRemaining),
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, response.message, data))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  public async getMarkets(): Promise<ResponseObj> {
    const uri = this.api_url + 'api/public/getmarketsummaries'
    try {
      const v = await axios.get(uri)
      // return response.data
      const response: TxbitRes = v.data

      return new Promise((resolve, reject) => {
        if (response.success) {
          const data = []
          for (let i = 0; i < response.result.length; i++) {
            const p: TradePair = {
              pairName: response.result[i].MarketName,
              pairCode: response.result[i].MarketName,
              amountPrecision: 0,
              tradePrecision: 0,
              amountLowest: 0,
              tradeLowest: 0,
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, response.message, data))
        } else {
          resolve(this.makeResponse(false, response.message, null))
        }
      })
    } catch (e) {
      const ea: AxiosError = e as AxiosError
      const errMsg = JSON.parse(ea.request.response)
      if (!errMsg.msg) {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, 'network error', null))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(this.makeResponse(false, errMsg.msg, null))
        })
      }
    }
  }

  private makeResponse(success: boolean, message: string, data: any): ResponseObj {
    const r: ResponseObj = {
      success: success,
      message: message,
      data: data,
    }
    return r
  }
}

export default Txbit
