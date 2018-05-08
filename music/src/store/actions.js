// 异步I/O操作
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveStorage } from 'common/js/cache'

/**
 * 匹配歌曲对应index
 * @param list
 * @param song
 * @returns {number|*}
 */
function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 顺序列表
  commit(types.SET_PLAYLIST, list) // 控制歌曲
  // 随机播放 if
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index) // 歌曲索引
  commit(types.SET_FULL_SCREEN, true) // 播放器展开/收起
  commit(types.SET_PLAYING_STATE, true) // 播放/暂停
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  // 添加slice()返回副本 currentIndex值类型不报错
  let playlist = state.playlist.slice() // 歌曲数据
  let sequenceList = state.sequenceList.slice() // 当前播放顺序列表数据
  let currentIndex = state.currentIndex // 当前播放索引

  // 获取当前播放歌曲 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let pdIndex = findIndex(playlist, song)
  // 要插入的位置是当前歌曲的下一个 所以++
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)

  // 如果已经包含了这首歌
  if (pdIndex > -1) {
    // 第一种情况 如果当前插入索引 大于 列表索引 (插入到原歌曲的后面)
    if (currentIndex > pdIndex) {
      // 原歌曲在前面直接删除
      playlist.splice(pdIndex, 1)
      // 少了一条数据 所以--
      currentIndex--
    } else {
      // 因为在原索引之前插入了一条数据 原索引+1 所以删除时+1  [1, +1 3, 4:+1 ]
      playlist.splice(pdIndex + 1, 1)
    }
  }

  // 当前播放顺序列表数据
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveStorage(query))
}
