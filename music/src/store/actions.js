// 放异步操作
import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 顺序列表
  commit(types.SET_PLAYLIST, list) // 控制歌曲
  commit(types.SET_CURRENT_INDEX, index) // 歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 播放器展开/收起
  commit(types.SET_PLAYING_STATE, true) // 播放/暂停
}
