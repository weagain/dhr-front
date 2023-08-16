export interface TradeProxy {
  getRandomArbitrary(min: number, max: number, precision: number): string
  setLimitSellOrder(price: string, quantity: string, market: string): any
  setLimitBuyOrder(price: string, quantity: string, market: string): any
  getMyMarketOrders(marketPair: string): any
  cancelMyOrder(orderUuid: string, pair?: string): any
  getAccountOrder(orderUuid: string): any
  getMyCurrencyBalances(symbol: string): any
  getMyAllBalances(): any
  getMarkets(): any
}

// response obj
export interface ResponseObj {
  success: boolean
  message: string
  data: object
}

export interface TradePair {
  pairName: string
  pairCode: string
  amountPrecision: number
  tradePrecision: number
  amountLowest: number
  tradeLowest: number
}

export interface OpenedOrder {
  id: string
  time: string
  price: number
  type: string
  totalQuantity: number
  remainQuantity: number
}
