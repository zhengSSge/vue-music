import {playMode} from 'common/js/config'

// 存放数据
const state = {
  singer: {}, // 歌手歌曲详情
  playing: false, // 播放/暂停
  fullScreen: false, // 播放器展开/收起
  playlist: [], // 控制歌曲
  sequenceList: [], // 顺序列表数据
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  disc: [] // 排行数据
}

export default state
