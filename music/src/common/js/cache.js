import storage from 'good-storage'

const SEARCH_KEY = '__search__' // 缓存名称
const SEARCH_MAX_LEN = 15 // 缓存上限

function insertArray (arr, val, compare, maxLen) {
  // 查看有没有重复数据
  const index = arr.findIndex(compare)
  // 如果是第一条数据无需操作
  if (index === 0) {
    return
  }
  // 如果数组中有 删除掉
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 新插入的记录永远插入到最前面
  arr.unshift(val)
  // 如果数据大于maxLen 从最后开始删除
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

/**
 * 本地存储
 * @param query
 * @returns {*}
 */
export function saveStorage (query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    // 遍历的是arr
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

/**
 * 读取本地存储数据
 * @returns {*}
 */
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
