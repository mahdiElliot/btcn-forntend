export default {
    candleInfoUrl: (limit: number = 0, page: number = 1) => `/candleinfo?limit=${limit}&page=${page}`,
    fastPaperUrl: (limit: number = 0, page: number = 1, transfer = '') => `/fastpaper?limit=${limit}&page=${page}&transfer=${transfer}`
}