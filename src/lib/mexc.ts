import crypto from 'crypto'
import axios, { Axios, AxiosError, AxiosResponse } from 'axios'
import { ResponseObj, TradePair, TradeProxy, OpenedOrder } from './req'

// const mexcOUri = 'https://api.mexc.com/'

interface MexcRes {
  code: number
  msg: string
  timestamp: number
  data: any[]
}

interface MexcExchangeInfo {
  timezone: string
  serverTime: number
  rateLimits: any[]
  exchangeFilters: any[]
  symbols: any[]
}
interface MexcAccount {
  accountType: string
  balances: any[]
  buyerCommission: number
  canDeposit: boolean
  canTrade: boolean
  canWithdraw: boolean
  makerCommission: number
  permissions: any[]
  sellerCommission: number
  takerCommission: number
  updateTime: string
}

interface MexcOrder {
  symbol: string
  orderId: number
  orderListId: number
  clientOrderId: string
  price: string
  origQty: string
  executedQty: string
  cummulativeQuoteQty: string
  status: string
  timeInForce: string
  type: string
  side: string
  stopPrice: string
  icebergQty: string
  time: number
  updateTime: number
  isWorkin: boolean
  origQuoteOrderQty: string
}

class Mexc implements TradeProxy {
  private api_url: string
  private api_key: string
  private api_secret: string

  constructor(api_key: string, api_secret: string) {
    this.api_url = '/mexc/'
    this.api_key = api_key
    this.api_secret = api_secret
  }

  public getRandomArbitrary(min: number, max: number, precision: number): string {
    const random = Number(Math.random() * 10 ** precision * (max - min) + min * 10 ** precision)
    return (random / 10 ** precision).toFixed(precision)
  }

  private hmacSha256(key: string, text: string): string {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(text)
    return hmac.digest('hex')
  }

  public async getOrderBook(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.makeResponse(false, 'unsupport', null))
    })
  }

  public async getAccountOrder(orderUuid: string) {
    return new Promise((resolve, reject) => {
      resolve(this.makeResponse(false, 'unsupport', null))
    })
  }

  public async setLimitSellOrder(price: string, quantity: string, market: string) {
    const cusUri = this.api_url + 'api/v3/order'
    const timestamp = Date.now()
    const computeSignUri =
      'timestamp=' +
      timestamp +
      '&symbol=' +
      market +
      '&side=SELL' +
      '&type=LIMIT' +
      '&quantity=' +
      quantity +
      '&price=' +
      price
    const sign = this.hmacSha256(this.api_secret, computeSignUri)
    const uri = cusUri
    const params =
      'timestamp=' +
      timestamp +
      '&symbol=' +
      market +
      '&side=SELL' +
      '&type=LIMIT' +
      '&quantity=' +
      quantity +
      '&price=' +
      price +
      '&signature=' +
      sign

    try {
      const v = await axios.post(
        uri + '?' + params,
        {},
        {
          headers: {
            'X-MEXC-APIKEY': this.api_key,
            'Content-Type': 'application/json',
          },
        },
      )
      return new Promise((resolve, reject) => {
        resolve(this.makeResponse(false, 'network error', null))
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
    const cusUri = this.api_url + 'api/v3/order'
    const timestamp = Date.now()
    const computeSignUri =
      'timestamp=' +
      timestamp +
      '&symbol=' +
      market +
      '&side=BUY' +
      '&type=LIMIT' +
      '&quantity=' +
      quantity +
      '&price=' +
      price
    const sign = this.hmacSha256(this.api_secret, computeSignUri)
    const uri = cusUri
    const params =
      'timestamp=' +
      timestamp +
      '&symbol=' +
      market +
      '&side=BUY' +
      '&type=LIMIT' +
      '&quantity=' +
      quantity +
      '&price=' +
      price +
      '&signature=' +
      sign

    try {
      const v = await axios.post(
        uri + '?' + params,
        {},
        {
          headers: {
            'X-MEXC-APIKEY': this.api_key,
            'Content-Type': 'application/json',
          },
        },
      )
      return new Promise((resolve, reject) => {
        resolve(this.makeResponse(false, 'network error', null))
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

  public async cancelMyOrder(orderUuid: string, pair: string): Promise<ResponseObj> {
    // const cusUri = 'api/v3/order'
    // const timestamp = Date.now()
    // const computeSignUri = 'timestamp=' + timestamp + '&symbol=' + pair + '&orderId=' + orderUuid
    // const sign = this.hmacSha256(this.api_secret, computeSignUri)
    // const uri = cusUri + '?timestamp=' + timestamp + '&symbol=' + pair + '&orderId=' + orderUuid + '&signature=' + sign

    // try {
    //   const v = await axios.delete(uri, {
    //     headers: {
    //       'X-MEXC-APIKEY': this.api_key,
    //       'Content-Type': 'application/json',
    //     },
    //   })
    //   console.log("这里输出", v)
    //   const response = v.data
    //   console.log("取消订单返回", response)

    //   return new Promise((resolve, reject) => {
    //     if (response.success) {
    //       resolve(this.makeResponse(true, response.message, null))
    //     } else {
    //       resolve(this.makeResponse(false, response.message, null))
    //     }
    //   })
    // } catch (e) {
    //   return new Promise((resolve, reject) => {
    //     resolve(this.makeResponse(false, 'network error', null))
    //   })
    // }
    return new Promise((resolve, reject) => {
      resolve(this.makeResponse(false, 'unsupport this operation', null))
    })
  }

  public async getMyMarketOrders(marketPair: string): Promise<ResponseObj> {
    const cusUri = this.api_url + 'api/v3/openOrders'
    const timestamp = Date.now()
    const computeSignUri = 'symbol=' + marketPair + '&timestamp=' + timestamp
    const sign = this.hmacSha256(this.api_secret, computeSignUri)
    const uri = cusUri + '?' + computeSignUri + '&signature=' + sign

    try {
      const v = await axios.get(uri, {
        headers: {
          'X-MEXC-APIKEY': this.api_key,
          'Content-Type': 'application/json',
        },
      })

      const response: MexcOrder[] = v.data

      return new Promise((resolve, reject) => {
        if (response) {
          const data = []
          for (let i = 0; i < response.length; i++) {
            const p: OpenedOrder = {
              id: response[i].orderId + '',
              time: response[i].time + '',
              price: Number(response[i].price),
              type: response[i].side,
              totalQuantity: Number(response[i].origQty),
              remainQuantity: Number(response[i].origQty) - Number(response[i].executedQty),
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, 'success', data))
        } else {
          resolve(this.makeResponse(false, 'fail', null))
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

  public async getMyCurrencyBalances(symbol: string): Promise<ResponseObj> {
    const v = await this.getMyAllBalances()
    if (v.success) {
      return new Promise((resolve, reject) => {
        if (v.data) {
          const arry: any[] = v.data as any[]
          for (let i = 0; i < arry.length; i++) {
            if (arry[i].asset == symbol) {
              resolve(this.makeResponse(true, 'success', arry[i]))
              break
            }
          }
        }
      })
    } else {
      return v
    }
  }

  public async getMyAllBalances(): Promise<ResponseObj> {
    const cusUri = this.api_url + 'api/v3/account'
    const timestamp = Date.now()
    const computeSignUri = 'timestamp=' + timestamp
    const sign = this.hmacSha256(this.api_secret, computeSignUri)
    const uri = cusUri + '?timestamp=' + timestamp + '&signature=' + sign

    try {
      const v = await axios.get(uri, {
        headers: {
          'X-MEXC-APIKEY': this.api_key,
          'Content-Type': 'application/json',
        },
      })
      if (v.status != 200) {
        return new Promise((resolve, reject) => {
          resolve(this.makeResponse(false, v.statusText, null))
        })
      }
      const response: MexcAccount = v.data
      return new Promise((resolve, reject) => {
        if (response) {
          const data: any[] = []
          for (let i = 0; i < response.balances.length; i++) {
            const p = {
              coin: response.balances[i].asset,
              availableAmount: response.balances[i].free,
              lockedAmount: response.balances[i].locked,
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, 'success', data))
        } else {
          resolve(this.makeResponse(false, 'fail', null))
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
    const cusUri = this.api_url + 'api/v3/exchangeInfo'
    const timestamp = Date.now()
    const computeSignUri = 'timestamp=' + timestamp
    const sign = this.hmacSha256(this.api_secret, computeSignUri)
    const uri = cusUri + '?timestamp=' + timestamp + '&signature=' + sign
    try {
      const v = await axios.get(cusUri, {
        headers: {
          'X-MEXC-APIKEY': this.api_key,
          'Content-Type': 'application/json',
        },
      })
      const response: MexcExchangeInfo = v.data

      return new Promise((resolve, reject) => {
        if (response) {
          const data: any[] = []
          for (let i = 0; i < response.symbols.length; i++) {
            const p: TradePair = {
              pairName: response.symbols[i].baseAsset + '/' + response.symbols[i].quoteAsset,
              pairCode: response.symbols[i].symbol,
              amountPrecision: response.symbols[i].baseAssetPrecision,
              tradePrecision: response.symbols[i].quoteAssetPrecision,
              amountLowest: response.symbols[i].baseSizePrecision,
              tradeLowest: response.symbols[i].quoteAmountPrecision,
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, 'success', data))
        } else {
          resolve(this.makeResponse(false, 'fail', null))
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

export default Mexc
