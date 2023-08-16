import crypto from 'crypto'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ResponseObj, TradePair, TradeProxy, OpenedOrder } from './req'

const txbitOUri = 'https://api.coinw.com/'

const apikey = '068a707f-a5e6-4cc6-87cb-26f0bf1bf54d'
const apisec = 'EVP9GUCLICYMWDKV5YCMNTQZ7VYIXUAYOQXZ'

interface CoinwRes {
  code: string
  msg: string
  data: any[]
}

class CoinW {
  private api_url: string
  private api_key: string
  private api_secret: string

  constructor(api_key: string, api_secret: string) {
    this.api_url = '/coinw/'
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

  private makeResponse(success: boolean, message: string, data: any): ResponseObj {
    const r: ResponseObj = {
      success: success,
      message: message,
      data: data,
    }
    return r
  }
}

export default CoinW
