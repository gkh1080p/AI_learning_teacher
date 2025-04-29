<template>
    <div>
      <el-upload
        ref="upload"
        drag
        :action="uploaddocumentUrl"
        multiple
        :before-upload="beforeUpload"
        :headers="headers"
        :data="data"
        :auto-upload="true"
        :on-success="uploadSucceed"
        accept=".pdf, .doc, .docx"
        :limit="100"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">自动上传，仅接受.pdf、.doc、.docx格式文档，单个文件大小不能超过100MB</div>
      </el-upload>
    </div>
  </template>
  
  <script>
  //后期更改
  import { uploaddocumentUrl } from '@/api/document_tmp'
  import store from '@/store'
  
  export default {
    name: 'UploadNote',
    data() {
      return {
        data: {
          courseId: null,
          chapterId: null
        },
        uploaddocumentUrl: uploaddocumentUrl,
        headers: { 'X-Token': store.getters.token || '' }
      }
    },
    methods: {
      setData(data) {
        this.data = { ...data }
      },
      beforeUpload(file) {
        const isLt100MB = file.size / 1024 / 1024 < 100
        if (!isLt100MB) {
          this.$message.warning('上传的讲义文件大小请不要超过100MB')
          this.removeFile(file, this.$refs.upload.uploadFiles)
          return false
        }
      },
      removeFile(file, fileList) {
        fileList.splice(fileList.indexOf(file), 1)
      },
      uploadSucceed(response, file, fileList) {
        if (response.status === 200) {
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
        this.removeFile(file, fileList)
      }
    }
  }
  </script>
  
  <style lang="scss">
  .el-upload, .el-upload-dragger {
    width: 100%;
  }
  </style>
  