<template>
    <div class="app-container">
        <div class="search-box">
            <el-form ref="searchParamsForm" :inline="true" :model="searchParams" size="small">
                <el-form-item label="课程名称：" prop="title">
                    <el-input v-model="searchParams.title" placeholder="输入课程名称搜索" />
                </el-form-item>
                <el-form-item label="课程分类：" prop="subjectId">
                    <el-cascader v-model="searchParams.subjectId" :options="subjectOptions"
                        :props="{ expandTrigger: 'hover', value: 'id', label: 'title' }" :clearable="true"
                        :filterable="true" placeholder="请选择课程分类" @change="subjectOptionsChange" />
                </el-form-item>
                <el-form-item label="课程上架状态" prop="enable">
                    <el-select v-model="searchParams.enable" style="width: 130px">
                        <el-option label="已上架" value="true" />
                        <el-option label="未上架" value="false" />
                    </el-select>
                </el-form-item>
                <el-form-item label="课程审核状态：" prop="status">
                    <el-select v-model="searchParams.status" style="width: 130px">
                        <el-option label="已发布" value="PUBLISH" />
                        <el-option label="待审核" value="AUDITING" />
                        <el-option label="驳回" value="TURN_DOWN" />
                        <el-option label="草稿" value="DRAFT" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getList">查 询</el-button>
                    <el-button @click="resetSearchParams('searchParamsForm')">重 置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table ref="listTable" v-loading="tableDataLoading" :data="listData" tooltip-effect="dark"
                :header-cell-style="{ fontWeight: 'normal', color: '#666' }">
                <el-table-column type="index" />
                <el-table-column prop="title" label="封面" width="130">
                    <template slot-scope="scope">
                        <el-image style="width: 100px; height: 48px" :src="encodeOssFileUri(scope.row.cover)"
                            fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="名称" show-tooltip-when-overflow />
                <el-table-column prop="subjectId" label="分类" show-tooltip-when-overflow>
                    <template slot-scope="scope">
                        {{ getDetailsSubject(scope.row.subjectParent) }}
                    </template>
                </el-table-column>
                <el-table-column prop="lessonNum" label="总课时" width="100" />
                <el-table-column prop="status" label="课程状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enable" type="success" size="small">上架</el-tag>
                        <el-tag v-if="!scope.row.enable" type="danger" size="small">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="审核状态" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status.indexOf('AUDITING') !== -1" type="" size="small">待审核</el-tag>
                        <el-tag v-else-if="scope.row.status === 'DRAFT'" type="info" size="small">草稿</el-tag>
                        <el-tag v-else-if="scope.row.status === 'PUBLISH'" type="success" size="small">已发布</el-tag>
                        <el-tag v-else-if="scope.row.status === 'TURN_DOWN'" type="danger" size="small">不通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-plus"
                            @click="handleUpload(scope.row)">上传</el-button>
                        <el-button type="success" size="mini" icon="el-icon-view"
                            @click="showView(scope.row)">查看习题</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination background :page-sizes="[10, 20, 30, 40, 50]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size.sync="searchParams.pageSize"
                :current-page.sync="searchParams.current" @size-change="getList" @current-change="getList" />
        </div>
        <!-- 弹窗组件 -->
        <upload-excel-dialog :visible.sync="uploadDialogVisible" :course-id="currentUploadCourseId"
            @upload="submitUpload" />
    </div>
</template>

<script>

import { list } from '@/api/course'
import UploadExcelDialog from '@/views/course_exercise/exerciseUpload'
import { getSubject } from '@/api/subject'
import { encodeOssFileUri } from '@/utils'
import {uploadQuestion} from '@/api/exercise'
export default {
    name: 'EduCourseist',
    components: {
        UploadExcelDialog
    },
    data() {
        return {
            searchParams: {
                current: 1,
                pageSize: 10,
                teacherId: null,
                subjectId: null,
                title: '',
                free: null,
                status: 'PUBLISH', // 显示通过审核的
                enable: null
            },
            total: 0,
            listData: [],
            tableDataLoading: false,
            currentOperationData: null,
            // 分类选项
            subjectOptions: [],
            // 弹窗控制
            uploadDialogVisible: false,
            currentUploadCourseId: null
        }
    },
    created() {
        this.getList()
        this.getSubject()
    },
    methods: {
        resetSearchParams(formName) {
            this.$refs[formName].resetFields()
            this.searchParams.current = 1
            this.getList()
        },
        encodeOssFileUri(ossUri) {
            return encodeOssFileUri(ossUri)
        },
        getDetailsSubject(subjectParent) {
            let subject = ''
            let parent = subjectParent
            while (parent) {
                subject = `${parent.title} > ${subject}`
                parent = parent.parent
            }
            return subject.substring(0, subject.length - 3)
        },
        getSubject() {
            getSubject().then(resp => {
                this.subjectOptions = resp.data
            })
        },
        subjectOptionsChange(val) {
            const arr = val
            if (!!arr || arr.length > 0) {
                this.searchParams.subjectId = arr[arr.length - 1]
            }
        },
        // 获取列表信息
        getList() {
            this.tableDataLoading = true
            list(this.searchParams).then(resp => {
                this.total = resp.data.total
                this.listData = resp.data.list
                this.tableDataLoading = false
            })
        },
        handleUpload(row) {
            this.currentUploadCourseId = row.id
            this.uploadDialogVisible = true
        },
        submitUpload(formData) {
            console.log('formData', formData)
            uploadQuestion(formData).then(() => {
                this.$message.success('上传成功')
                this.getList()
            }).catch(() => {
                this.$message.error('上传失败')
            })
            // uploadExcelApi(formData).then(() => {
            //     this.$message.success('上传成功')
            //     this.getList()
            // }).catch(() => {
            //     this.$message.error('上传失败')
            // })
        },
        showView(row) {
            console.log('row', row)
            this.$router.push({
                name: 'exerciseView',
                params: { id: row.id }
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>
