<!-- 步骤2 ： 创建章节并上传视频 -->
<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" size="small" @click="openAddChapterDialog">新建章节</el-button>
      <div style="float: right;height: 32px;line-height: 32px">
        <i class="el-icon-loading" />
        正在更新课程《{{ course.title }}》
      </div>
    </div>
    <el-collapse :accordion="true" @change="change">
      <el-collapse-item v-for="c of chapters" :key="c.id" :name="c.id" class="chapter-head">
        <template slot="title">
          <div class="sort">{{ c.sort }}</div>
          <div class="title">{{ c.title }}</div>
          <div class="ctrl">
            <el-button size="mini" type="primary" icon="el-icon-upload" @click.stop="openUploadVideoDialog(c)">视频
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-upload" @click.stop="openUploadDocumentDialog(c)">讲义
            </el-button>
            <el-button size="mini" type="success" @click.stop="openUpdateChapterDialog(c)">修改</el-button>
            <el-button size="mini" type="danger" @click.stop="openDeleteChapterDialog(c)">删除</el-button>
          </div>
        </template>
        <!-- 视频列表 -->
        <div class="table-section">
          <div class="table-title">
            <i class="el-icon-video-camera"></i>
            <span>视频列表</span>
          </div>
          <el-table :key="tableRefreshIndex" :data="chapterIdVideoMap[c.id]" tooltip-effect="dark"
            :header-cell-style="{ fontWeight: 'normal', color: '#666' }" style="font-size: 13px">
            <el-table-column type="index" />
            <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column prop="size" label="大小" width="120">
              <template slot-scope="scope">{{ bytesToSize(scope.row.size) }}</template>
            </el-table-column>
            <!-- <el-table-column prop="sort" label="排序" width="80" align="center" /> -->
            <!-- <el-table-column prop="sort" label="免费收看" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.free" style="color: #21BA45">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column> -->
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openUpdateVideoDialogVisible(scope.row)">修改</el-button>
                <el-popconfirm style="margin-left: 10px" placement="top-end" confirm-button-text="确定"
                  cancel-button-text="取消" icon="el-icon-info" icon-color="red" :title="`你要永久删除视频[${scope.row.title}]吗？`"
                  @confirm="deleteVideo(scope.row)">
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 讲义列表 -->
        <div class="table-section">
          <div class="table-title">
            <i class="el-icon-document"></i>
            <span>讲义列表</span>
          </div>
          <el-table :key="'document_' + tableRefreshIndex" :data="chapterIdDocumentMap[c.id]" tooltip-effect="dark"
            :header-cell-style="{ fontWeight: 'normal', color: '#666' }" style="font-size: 13px">
            <el-table-column type="index" />
            <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
            <!-- <el-table-column prop="size" label="大小" width="120">
              <template slot-scope="scope">{{ bytesToSize(scope.row.size) }}</template>
            </el-table-column> -->
            <el-table-column label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="openUpdateDocumentDialogVisible(scope.row)">修改</el-button>
                <el-popconfirm style="margin-left: 10px" placement="top-end" confirm-button-text="确定"
                  cancel-button-text="取消" icon="el-icon-info" icon-color="red" :title="`你要永久删除讲义[${scope.row.title}]吗？`"
                  @confirm="deleteDocument(scope.row)">
                  <el-button slot="reference" type="danger" size="mini">删除</el-button>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 新建章节 -->
    <el-dialog title="新建章节" :visible.sync="addChapterDialogVisible" destroy-on-close width="30vw"
      :close-on-click-modal="false">
      <el-form :model="addOrUpdateChapter" size="small" label-width="100px">
        <el-form-item label="章节名称：">
          <el-input v-model="addOrUpdateChapter.title" />
        </el-form-item>
        <el-form-item label="排　　序：">
          <el-input-number v-model="addOrUpdateChapter.sort" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="createChapter">确 认</el-button>
        <el-button size="small" @click="addChapterDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改章节信息 -->
    <el-dialog title="修改章节信息" :visible.sync="updateChapterDialogVisible" destroy-on-close width="30vw"
      :close-on-click-modal="false">
      <el-form :model="addOrUpdateChapter" size="small" label-width="100px">
        <el-form-item label="章节名称：">
          <el-input v-model="addOrUpdateChapter.title" />
        </el-form-item>
        <el-form-item label="排　　序：">
          <el-input-number v-model="addOrUpdateChapter.sort" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateChapter">确 认</el-button>
        <el-button size="small" @click="updateChapterDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除章节 -->
    <el-dialog title="删除章节" :visible.sync="deleteChapterDialogVisible" destroy-on-close width="30vw">
      <div style="color: red">该操作将会连带删除章节下的所有视频</div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="deleteChapter">确 认</el-button>
        <el-button size="small" @click="deleteChapterDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 上传视频 -->
    <el-dialog :title.sync="uploadVideoDialogTitle" :visible.sync="uploadVideoDialogVisible" destroy-on-close
      width="30vw" :close-on-click-modal="false" :before-close="uploadDialogBeforeClose">
      <v-upload-video ref="UploadVideo" />
    </el-dialog>
    <!-- 上传讲义 -->
    <el-dialog :title.sync="uploadDocumentDialogTitle" :visible.sync="uploadDocumentDialogVisible" destroy-on-close
      width="30vw" :close-on-click-modal="false" :before-close="uploadDocumentDialogBeforeClose">
      <v-upload-document ref="UploadDocument" />
    </el-dialog>
    <!-- 修改视频信息 -->
    <el-dialog title="修改视频信息" :visible.sync="updateVideoDialogVisible" destroy-on-close width="30vw">
      <el-form :model="updateVideoData" size="small" label-width="100px">
        <el-form-item label="视频名称：">
          <el-input v-model="updateVideoData.title" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="updateVideoData.sort" style="width: 100%" />
        </el-form-item>
        <!-- <el-form-item label="免费观看：">
          <el-radio-group v-model="updateVideoData.free">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateVideo">确 认</el-button>
        <el-button size="small" @click="updateVideoDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改讲义对话框 -->
    <el-dialog title="修改讲义信息" :visible.sync="updateDocumentDialogVisible" destroy-on-close width="30vw">
      <el-form :model="updateDocumentData" size="small" label-width="100px">
        <el-form-item label="讲义名称：">
          <el-input v-model="updateDocumentData.title" />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input-number v-model="updateDocumentData.sort" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="updateDocument">确 认</el-button>
        <el-button size="small" @click="updateDocumentDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 章节相关接口
import {
  list as listChapter,
  createIt as createChapter,
  updateIt as updateChapter,
  deleteIt as deleteChapter
} from '@/api/chapter_tmp'
// 视频相关接口
import {
  list as listVideo,
  updateIt as updateVideo,
  deleteIt as deleteVideo
} from '@/api/video_tmp'
//讲义相关接口
import {
  list as listDocument,
  updateIt as updateDocument,
  deleteIt as deleteDocument
} from '@/api/document_tmp'

// 改为空实现或mock数据
// 修改mock函数，移除对this的依赖
// const listDocument = (chapterId) => {
//   // 使用固定mock数据（不再依赖this.chapters）
//   const mockTemplates = [
//     {
//       title: '软件工程课程讲义.pdf',
//       size: 1024 * 2450,
//       type: 'pdf'
//     },
//     {
//       title: '教学PPT.pptx',
//       size: 1024 * 5870,
//       type: 'pptx'
//     }
//   ]

//   const documents = mockTemplates.map((item, index) => ({
//     id: `doc_${chapterId}_${index}`,
//     title: item.title,
//     size: item.size,
//     chapterId: chapterId,
//     sort: index + 1,
//     url: `/documents/${chapterId}_${index}.${item.type}`
//   }))

//   return Promise.resolve({
//     data: documents,
//     message: 'success'
//   })
// }

// const updateDocument = (data) => {
//   console.log('模拟更新讲义:', data)
//   return Promise.resolve({
//     message: '讲义更新成功',
//     data: {
//       ...data,
//       updatedAt: new Date().toISOString()
//     }
//   })
// }

// const deleteDocument = (id) => {
//   console.log('模拟删除讲义:', id)
//   return Promise.resolve({
//     message: `讲义[ID:${id}]删除成功`,
//     code: 200
//   })
// }
import { bytesToSize } from '@/utils'

export default {
  name: 'CreateSubjectAndUpload',
  components: {
    'v-upload-video': () => import('@/views/course_update/upload'),
    'v-upload-document': () => import('@/views/course_update/upload_document')
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['course'],
  data() {
    return {
      chapters: [],
      // 章节id与视频列表映射<chapterId,[...videos]>
      chapterIdVideoMap: {},
      addOrUpdateChapter: { title: '', sort: 0 },
      updateVideoData: { title: '', sort: 0, free: true },
      // 章节id与讲义列表映射
      chapterIdDocumentMap: {},
      addOrUpdateChapter: { title: '', sort: 0 },
      updateVideoData: { title: '', sort: 0, free: true },
      //修改讲义数据
      updateDocumentData: { title: '', sort: 0 },
      // 对话框
      addChapterDialogVisible: false,
      updateChapterDialogVisible: false,
      deleteChapterDialogVisible: false,
      tableRefreshIndex: 0,
      // 上传视频
      uploadVideoDialogVisible: false,
      uploadVideoDialogTitle: '',
      // 更新视频
      updateVideoDialogVisible: false,
      // 上传讲义
      uploadDocumentDialogVisible: false,
      uploadDocumentDialogTitle: '',
      // 更新讲义
      updateDocumentDialogVisible: false

    }
  },
  created() {
    this.getChapterList()
  },
  methods: {
    // 字节转换
    bytesToSize(bytes) {
      return bytesToSize(bytes)
    },
    getChapterList() {
      listChapter(this.course.id).then(resp => {
        this.chapters = resp.data || []
        // 使用Vue.set确保响应式,保证列表展示
        this.chapters.forEach(c => {
          this.$set(this.chapterIdVideoMap, c.id, [])
          this.$set(this.chapterIdDocumentMap, c.id, [])
        })
        // 默认加载第一个章节的数据
        if (this.chapters.length > 0) {
          console.log('默认加载第一个章节的数据:', this.chapters[0])
          this.change(this.chapters[0].courseId )
        }
      }).catch(error => {
        console.error('获取章节失败:', error)
        this.$message.error('获取章节数据失败')
      })
    },
    openAddChapterDialog() {
      this.addOrUpdateChapter = { title: '', sort: 0 }
      this.addChapterDialogVisible = true
    },
    openUpdateChapterDialog(curData) {
      this.addOrUpdateChapter = { ...curData }
      this.updateChapterDialogVisible = true
    },
    openDeleteChapterDialog(curData) {
      this.addOrUpdateChapter = { ...curData }
      this.deleteChapterDialogVisible = true
    },
    // 上传视频
    openUploadVideoDialog(curData) {
      this.uploadVideoDialogTitle = `上传视频至章节[${curData.title}]`
      this.uploadVideoDialogVisible = true
      const data = { courseId: this.course.id, chapterId: curData.id }
      setTimeout(function () {
        this.$refs.UploadVideo.setData(data)
      }.bind(this), 100)
    },
    // 上传讲义
    openUploadDocumentDialog(curData) {
      this.uploadDocumentDialogTitle = `上传讲义至章节[${curData.title}]`
      this.uploadDocumentDialogVisible = true
      const data = { courseId: this.course.id, chapterId: curData.id }
      setTimeout(() => {
        this.$refs.UploadDocument.setData(data)
      }, 100)
    },
    // 上传讲义对话框关闭时更新信息
    uploadDocumentDialogBeforeClose(done) {
      this.change(this.$refs.UploadDocument.data.chapterId)
      done()
    },
    openUpdateVideoDialogVisible(curData) {
      this.updateVideoDialogVisible = true
      this.updateVideoData = { ...curData }
    },
    // 新建章节
    createChapter() {
      this.addOrUpdateChapter.courseId = this.course.id
      createChapter(this.addOrUpdateChapter).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.addChapterDialogVisible = false
      })
    },
    // 修改章节
    updateChapter() {
      this.addOrUpdateChapter.courseId = this.course.id
      updateChapter(this.addOrUpdateChapter).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.updateChapterDialogVisible = false
      })
    },
    // 删除章节
    deleteChapter() {
      deleteChapter(this.addOrUpdateChapter.id).then(resp => {
        this.$message.success(resp.message)
        this.getChapterList()
        this.deleteChapterDialogVisible = false
      })
    },
    // 章节切换时加载视频和讲义数据
    change(id) {
      if (id) {
        // 获取章节视频信息
        listVideo(id).then(resp => {
          this.chapterIdVideoMap[id] = resp.data
        })
        // 获取章节讲义信息
        listDocument(id).then(resp => {
          this.chapterIdDocumentMap[id] = resp.data
        })
        ++this.tableRefreshIndex
      }
    },
    // 上传对话框关闭时更新信息
    uploadDialogBeforeClose(done) {
      this.change(this.$refs.UploadVideo.data.chapterId)
      done()
    },
    // 删除视频
    deleteVideo(curData) {
      deleteVideo(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.change(curData.chapterId)
      })
    },
    // 更新视频
    updateVideo() {
      updateVideo(this.updateVideoData).then(resp => {
        this.$message.success(resp.message)
        this.change(this.updateVideoData.chapterId)
        this.updateVideoDialogVisible = false
      })
    },
    // 打开修改讲义对话框
    openUpdateDocumentDialogVisible(curData) {
      this.updateDocumentDialogVisible = true
      this.updateDocumentData = { ...curData }
    },
    // 更新讲义
    updateDocument() {
      updateDocument(this.updateDocumentData).then(resp => {
        this.$message.success(resp.message)
        this.change(this.updateDocumentData.chapterId)
        this.updateDocumentDialogVisible = false
      })
    },
    // 删除讲义
    deleteDocument(curData) {
      deleteDocument(curData.id).then(resp => {
        this.$message.success(resp.message)
        this.change(curData.chapterId)
      })
    },
  }
}
</script>

<style scoped lang="scss">
.table-section {
  margin-bottom: 30px;

  .table-title {
    font-size: 15px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    i {
      margin-right: 8px;
      color: #409EFF;
    }
  }
}

.chapter-head {
  .sort {
    width: 7%;
    font-size: 15px;
  }

  .title {
    width: 50%;
    font-size: 15px;
  }

  .ctrl {
    width: 43%;
    text-align: right;

    .el-button:last-child {
      margin-right: 12px;
    }
  }
}
</style>
