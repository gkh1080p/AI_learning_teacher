<template>
    <el-dialog title="上传习题表格" :visible.sync="visible" width="500px" @close="handleClose" class="upload-dialog">
        <div class="upload-container">
            <el-upload class="upload-box" ref="upload" drag action="" :http-request="uploadExcel" :show-file-list="true"
                :auto-upload="false" accept=".xlsx,.xls" :file-list="fileList" :on-change="handleFileChange">
                <i class="el-icon-upload upload-icon" />
                <div class="upload-text">
                    拖拽文件到这里，或 <em>点击选择文件</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                    只支持 Excel 文件（.xlsx / .xls）
                </div>
            </el-upload>
        </div>

        <template #footer>
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm">确 认</el-button>
        </template>
    </el-dialog>
</template>

<script>

export default {
    name: 'UploadExcelDialog',
    props: {
        visible: Boolean,
        courseId: [String, Number]
    },
    data() {
        return {
            fileList: []
        }
    },
    methods: {
        handleFileChange(file, fileList) {
            const rawFile = file.raw
            const isExcel = rawFile.type === 'application/vnd.ms-excel' ||
                rawFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

            if (!isExcel) {
                this.$message.error('只能上传 Excel 文件（.xlsx 或 .xls）')
                this.fileList = []
                return
            }

            // 正确添加 Excel 文件
            this.fileList = [{
                name: rawFile.name,
                url: '',
                raw: rawFile
            }]
        },
        handleClose() {
            this.fileList = []
            this.$refs.upload && this.$refs.upload.clearFiles()
            this.$emit('update:visible', false)
        },
        handleConfirm() {
            console.log('fileList', this.fileList)
            if (!this.fileList.length) {
                this.$message.warning('请先选择 Excel 文件')
                return
            }

            const formData = new FormData()
            formData.append('file', this.fileList[0].raw)
            formData.append('course_id', this.courseId)
            console.log('formData', formData)
            this.$emit('upload', formData)
            this.handleClose()
        },
        uploadExcel() {
            // 阻止自动上传，改为手动
        }
    }
}
</script>

<style scoped>
.upload-dialog ::v-deep .el-dialog__header {
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 10px;
}

.upload-container {
    padding: 20px 10px;
}

.upload-box {
    width: 100%;
    border: 2px dashed #dcdfe6;
    border-radius: 6px;
    padding: 40px 20px;
    text-align: center;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease;
}

.upload-box:hover {
    border-color: #409eff;
}

.upload-icon {
    font-size: 40px;
    color: #409eff;
    margin-bottom: 10px;
}

.upload-text {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
}

.el-upload__tip {
    font-size: 12px;
    color: #909399;
    margin-top: 5px;
}
</style>
