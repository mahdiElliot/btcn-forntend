export default {
    candleInfoUrl: (start = 0, end = 0, limit: number = 0, page: number = 1) => `/candleinfo?start=${start}&end=${end}&limit=${limit}&page=${page}`,
    fastPaperUrl: (start=0, end=0, limit: number = 0, page: number = 1, transfer = '') => `/fastpaper?start=${start}&end=${end}&limit=${limit}&page=${page}&transfer=${transfer}`,
    tradeUrl: (start = 0, end = 0, limit: number = 0, page: number = 1) => `/trades?start=${start}&end=${end}&limit=${limit}&page=${page}`
}