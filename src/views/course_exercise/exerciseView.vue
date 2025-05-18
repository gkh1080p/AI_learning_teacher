<template>
    <div class="exercise-table-wrapper">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="filterParams" class="search-form" size="small" @submit.native.prevent>
            <el-form-item label="题目">
                <el-input v-model="filterParams.title" placeholder="请输入题目关键字" clearable />
            </el-form-item>
            <el-form-item label="是否多选">
                <el-select v-model="filterParams.type" placeholder="请选择" clearable>
                    <el-option label="是" value="multiple" />
                    <el-option label="否" value="single" />
                </el-select>
            </el-form-item>
            <el-form-item label="分值范围">
                <el-input-number v-model="filterParams.minScore" :min="0" placeholder="起始分值" />
                <span style="margin: 0 5px;">-</span>
                <el-input-number v-model="filterParams.maxScore" :min="0" placeholder="终止分值" />
            </el-form-item>
            <el-form-item label="难度">
                <el-select v-model="filterParams.difficulty" placeholder="请选择难度" clearable>
                    <el-option label="简单" value="easy" />
                    <el-option label="中等" value="medium" />
                    <el-option label="困难" value="hard" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchData">查询</el-button>
                <el-button @click="resetFilter">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格 -->
        <el-table :data="tableData" border stripe highlight-current-row style="width: 100%">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="title" label="题目" min-width="180" />
            <el-table-column prop="aoption" label="选项A" min-width="120" />
            <el-table-column prop="boption" label="选项B" min-width="120" />
            <el-table-column prop="coption" label="选项C" min-width="120" />
            <el-table-column prop="doption" label="选项D" min-width="120" />
            <el-table-column prop="type" label="是否多选" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.type === 'multiple' ? 'success' : 'info'" size="mini">
                        {{ scope.row.type === 'multiple' ? '是' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="correctAnswer" label="正确答案" width="100" align="center" />
            <el-table-column prop="difficulty" label="难度" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="getDifficultyTagType(scope.row.difficulty)" size="mini">
                        {{ getDifficultyValue(scope.row.difficulty) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="score" label="分值" min-width="50" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
                        style="margin-right: 8px">修改</el-button>
                    <el-popconfirm title="确定要删除这条题目吗？" confirmButtonText="确定" cancelButtonText="取消"
                        icon="el-icon-warning" iconColor="red" @confirm="handleDelete(scope.row)">
                        <el-button slot="reference" size="mini" type="danger">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <EditQuestionDialog :visible.sync="editVisible" :questionId="currentQuestionId"
            :course_id="searchParams.courseId" @submit="handleUpdateSubmit" />
    </div>

</template>

<script>

import { getQuestionList, updateQuestion, deleteQuestion } from '@/api/exercise'
import EditQuestionDialog from '@/views/course_exercise/exerciseEdit'
export default {
    name: 'ExerciseTable',
    components: {
        EditQuestionDialog
    },
    data() {
        return {
            tableData: [],
            tableDataLoading: false,
            searchParams: {
                courseId: null
            },
            // 修改弹窗
            editVisible: false,
            // 修改传入id
            currentQuestionId: null,
            // 查询参数
            filterParams: {
                title: '',
                type: '',
                scoreMin: null,
                scoreMax: null,
                difficulty: ''
            },

        }
    },
    watch: {
        '$route.params.id': {
            immediate: true,
            handler(newId) {
                console.log('watcher triggered', newId)
                if (newId) {
                    this.searchParams.courseId = newId
                    this.fetchData()
                }
            }
        }
    },
    methods: {
        fetchData() {
            this.tableDataLoading = true
            const queryParams = {
                courseId: this.searchParams.courseId,
                title: this.filterParams.title || undefined,
                type: this.filterParams.type || undefined,
                difficulty: this.filterParams.difficulty || undefined,
                scoreMin: this.filterParams.minScore,
                scoreMax: this.filterParams.maxScore
            }
            getQuestionList(queryParams).then(resp => {
                this.tableData = resp.data || []
                this.tableDataLoading = false
            }).catch(() => {
                this.tableDataLoading = false
            })
        },

        getDifficultyTagType(difficulty) {
            switch (difficulty) {
                case 'easy': return 'success'
                case 'medium': return 'warning'
                case 'hard': return 'danger'
                default: return 'info'
            }
        },
        getDifficultyValue(difficulty) {
            switch (difficulty) {
                case 'easy': return '简单'
                case 'medium': return '中等'
                case 'hard': return '困难'
                default: return '未知'
            }
        },
        handleEdit(row) {
            // 编辑逻辑
            this.currentQuestionId = row.id
            this.editVisible = true
        },
        handleUpdateSubmit(updatedData) {
            // 提交表单数据给后端
            console.log('更新数据', updatedData)
            updateQuestion(updatedData).then(() => {
                this.$message.success('更新成功')
                this.editVisible = false
                this.fetchData() // 刷新数据
            }).catch(() => {
                this.$message.error('更新失败')
            })

        },
        handleDelete(row) {
            // 删除逻辑
            console.log('删除题目', row)
            deleteQuestion(row.id).then(() => {
                this.$message.success('删除成功')
                this.fetchData() // 刷新数据
            }).catch(() => {
                this.$message.error('删除失败')
            })
        },
        handleSizeChange(size) {
            this.pagination.pageSize = size
            this.fetchData()
        },
        // 重置搜索条件
        resetFilter() {
            this.filterParams = {
                title: '',
                type: '',
                scoreMin: null,
                scoreMax: null,
                difficulty: ''
            }
            this.fetchData()
        }

    },
    mounted() {
        const id = this.$route.params.id
        if (id) {
            this.searchParams.courseId = id
            this.fetchData()
        }
    }
}
</script>
<style scoped>
.exercise-table-wrapper {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>