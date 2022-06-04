export default {
    candleInfoUrl: (start = 0, end = 0, limit: number = 0, page: number = 1) => `/candleinfo?start=${start}&end=${end}&limit=${limit}&page=${page}`,
    fastPaperUrl: (start = 0, end = 0, limit: number = 0, page: number = 1, transfer = '') => `/fastpaper?start=${start}&end=${end}&limit=${limit}&page=${page}&transfer=${transfer}`,
    tradeUrl: (key: number, start = 0, end = 0, limit: number = 0, page: number = 1, sort = 'timestamp', asc = 1, trades = 0) =>
        `/trades?start=${start}&end=${end}&key=${key}&limit=${limit}&page=${page}&sort=${sort}&asc=${asc}&trades=${trades}`,
    newTradeUrl: (start = 0, end = 0, limit: number = 0, page: number = 1) => `/newtrades?start=${start}&end=${end}&limit=${limit}&page=${page}`,
    findTradeUrl: (key: number, trade_order = 1) => `/findtrade?key=${key}&trade_order=${trade_order}`,
    infoUrl: () => '/info',
    indicatorUrl: () => '/indicator'
}