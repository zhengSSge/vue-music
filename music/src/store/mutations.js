// 把数据存入state
import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) { // 存歌手
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) { // 播放/暂停
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) { // 播放器展开/收起
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) { // 控制歌曲
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) { // 顺序列表
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) { // 播放模式
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) { // 歌曲索引
    state.currentIndex = index
  },
  [types.SET_DISC](state, index) { // 排行数据
    state.disc = index
  }
}

export default mutations
