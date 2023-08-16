import crypto from 'crypto'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { TradeProxy, TradePair, ResponseObj, OpenedOrder } from './req'

// const api_url = 'https://www.swftc.info'

interface SwftRes {
  resCode: string
  resMsg: string
  resMsgEn: string
  data: any
}

interface OrderContent {
  createTime: string
  orderId: string
  price: number
  totalAmt: number
  successAmt: number
  type: string
}
interface OrderResult {
  pageContent: OrderContent[]
}

class Swft implements TradeProxy {
  private api_url: string
  private api_key: string
  private api_secret: string

  constructor(api_key: string, api_secret: string) {
    this.api_url = '/swft/'
    this.api_key = api_key
    this.api_secret = api_secret
  }

  public getRandomArbitrary(min: number, max: number, precision: number): string {
    const random = Number(Math.random() * 10 ** precision * (max - min) + min * 10 ** precision)
    return (random / 10 ** precision).toFixed(precision)
  }

  private calculateHMAC(key: string, data: string): string {
    const hmac = crypto.createHmac('sha256', key)
    hmac.update(data)
    return hmac.digest('hex')
  }

  public async setLimitSellOrder(price: string, quantity: string, market: string) {
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      tradePair: market,
      type: 'sell',
      amount: quantity,
      price: price,
      sign: '',
    }

    let sign =
      'amount=' +
      quantity +
      '&channelId=' +
      this.api_key +
      '&price=' +
      price +
      '&timestamp=' +
      map.timestamp +
      '&tradePair=' +
      map.tradePair +
      '&type=' +
      map.type
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/trade'

    try {
      const response = await axios.post(uri, map)

      return response.data
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

  public async setLimitBuyOrder(price: string, quantity: string, market: string) {
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      tradePair: market,
      type: 'buy',
      amount: quantity,
      price: price,
      sign: '',
    }

    let sign =
      'amount=' +
      quantity +
      '&channelId=' +
      this.api_key +
      '&price=' +
      price +
      '&timestamp=' +
      map.timestamp +
      '&tradePair=' +
      map.tradePair +
      '&type=' +
      map.type
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/trade'

    try {
      const response = await axios.post(uri, map)
      return response.data
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

  public async getAccountOrder(orderUuid: string) {
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      orderId: orderUuid,
      sign: '',
    }

    let sign = 'channelId=' + this.api_key + '&orderId=' + map.orderId + '&timestamp=' + map.timestamp
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/orders'

    try {
      const response = await axios.post(uri, map)
      return response.data
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
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      sign: '',
    }

    let sign = 'channelId=' + this.api_key + '&timestamp=' + map.timestamp
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/accountsByCode/' + symbol

    try {
      const response = await axios.post(uri, map)
      return response.data
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
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      sign: '',
    }

    let sign = 'channelId=' + this.api_key + '&timestamp=' + map.timestamp
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/accounts'

    try {
      const v = await axios.post(uri, map)
      if (v.status != 200) {
        return new Promise((resolve, reject) => {
          resolve(this.makeResponse(false, v.statusText, null))
        })
      }
      const response = v.data
      if (response.resCode != 800) {
        return new Promise((resolve, reject) => {
          resolve(this.makeResponse(false, response.resCode + ':' + response.resMsg, null))
        })
      }
      return new Promise((resolve, reject) => {
        const data = []
        for (let i = 0; i < response.data.length; i++) {
          const p = {
            coin: response.data[i].coinCode,
            availableAmount: response.data[i].availableAmount,
            lockedAmount: response.data[i].freezeAmount,
          }
          data.push(p)
        }
        resolve(this.makeResponse(true, response.resMsg, data))
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
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      orderId: orderUuid,
      sign: '',
    }

    let sign = 'channelId=' + this.api_key + '&orderId=' + map.orderId + '&timestamp=' + map.timestamp
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/cancel'

    try {
      const v = await axios.post(uri, map)
      const response: SwftRes = v.data
      return new Promise((resolve, reject) => {
        if (response.resCode == '800') {
          resolve(this.makeResponse(true, response.resMsg, null))
        } else {
          resolve(this.makeResponse(false, response.resMsg, null))
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
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      tradePair: marketPair,
      pageNo: 1,
      pageSize: 1000,
      sign: '',
    }

    let sign =
      'channelId=' +
      this.api_key +
      '&pageNo=' +
      map.pageNo +
      '&pageSize=' +
      map.pageSize +
      '&timestamp=' +
      map.timestamp +
      '&tradePair=' +
      map.tradePair
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/openOrders'

    try {
      const v = await axios.post(uri, map)
      const response: SwftRes = v.data
      return new Promise((resolve, reject) => {
        if (response.resCode == '800') {
          const data = []
          const dataPg: OrderResult = response.data as OrderResult
          for (let i = 0; i < dataPg.pageContent.length; i++) {
            const p: OpenedOrder = {
              id: dataPg.pageContent[i].orderId,
              time: dataPg.pageContent[i].createTime,
              price: Number(dataPg.pageContent[i].price),
              type: dataPg.pageContent[i].type,
              totalQuantity: Number(dataPg.pageContent[i].totalAmt),
              remainQuantity: Number(dataPg.pageContent[i].totalAmt) - Number(dataPg.pageContent[i].successAmt),
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, response.resMsg, data))
        } else {
          resolve(this.makeResponse(false, response.resMsg, null))
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
    const map = {
      channelId: this.api_key,
      timestamp: new Date().getTime(),
      sign: '',
    }
    let sign = 'channelId=' + this.api_key + '&timestamp=' + map.timestamp
    sign = sign + '&secret=' + this.api_secret
    sign = this.calculateHMAC(this.api_secret, sign).toUpperCase()
    map.sign = sign

    const uri = this.api_url + '/marketApi/loadPair'
    try {
      const v = await axios.post(uri, map)
      const response: SwftRes = v.data
      return new Promise((resolve, reject) => {
        if (response.resCode == '800') {
          const data = []
          for (let i = 0; i < response.data.length; i++) {
            const p: TradePair = {
              pairName: response.data[i].tradePair,
              pairCode: response.data[i].tradePair,
              amountPrecision: response.data[i].tradeNumAccuracy,
              tradePrecision: response.data[i].tradePriceAccuracy,
              amountLowest: Number(response.data[i].allowCoinLow),
              tradeLowest: Number(response.data[i].allowTradeLow),
            }
            data.push(p)
          }
          resolve(this.makeResponse(true, response.resMsg, data))
        } else {
          resolve(this.makeResponse(false, response.resMsg, null))
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

  // private method
  private makeResponse(success: boolean, message: string, data: any): ResponseObj {
    const r: ResponseObj = {
      success: success,
      message: message,
      data: data,
    }
    return r
  }
}

export default Swft
