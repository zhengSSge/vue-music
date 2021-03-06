/**
 * 打乱数据经典写法
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

/**
 * 节流函数
 * @param func
 * @param delay
 * @returns {Function}
 */
export function debounce (func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearInterval(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
