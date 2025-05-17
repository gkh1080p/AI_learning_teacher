<template>
    <div class="exercise-table-wrapper">
        <el-table :data="tableData" border stripe highlight-current-row style="width: 100%">
             <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="title" label="题目" min-width="180" />
            <el-table-column prop="optionA" label="选项A" min-width="120" />
            <el-table-column prop="optionB" label="选项B" min-width="120" />
            <el-table-column prop="optionC" label="选项C" min-width="120" />
            <el-table-column prop="optionD" label="选项D" min-width="120" />
            <el-table-column prop="multiple" label="是否多选" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.multiple ? 'success' : 'info'" size="mini">
                        {{ scope.row.multiple ? '是' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="answer" label="正确答案" width="100" align="center" />
            <el-table-column prop="difficulty" label="难度" width="100" align="center">
                <template slot-scope="scope">
                    <el-tag :type="getDifficultyTagType(scope.row.difficulty)" size="mini">
                        {{ scope.row.difficulty }}
                    </el-tag>
                </template>
            </el-table-column>
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
        <div style="text-align: right; margin-top: 20px;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagination.pageNum" :page-size="pagination.pageSize" :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" />
        </div>
        <EditQuestionDialog :visible.sync="editVisible" :questionId="currentQuestionId" @submit="handleUpdateSubmit" />
    </div>
    
</template>

<script>
// 假设你封装的 API 方法是这样引入的：
// import { list } from '@/api/exercise'  // 路径按你项目结构改
import EditQuestionDialog from '@/views/course_exercise/exerciseEdit' // 假设你有一个编辑题目的组件
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
            pagination: {
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            // 修改弹窗
            editVisible: false,
            // 修改传入id
            currentQuestionId: null
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
            this.tableData = [
                {
                    id: 1,
                    title: '以下哪个是 JavaScript 框架？',
                    optionA: 'Vue',
                    optionB: 'HTML',
                    optionC: 'CSS',
                    optionD: 'Photoshop',
                    multiple: false,
                    answer: 'A',
                    difficulty: '中等'
                },
                {
                    id: 2,
                    title: '哪个国家的首都是东京？',
                    optionA: '日本',
                    optionB: '中国',
                    optionC: '韩国',
                    optionD: '泰国',
                    multiple: false,
                    answer: 'A',
                    difficulty: '简单'
                },
                {
                    id: 3,
                    title: '下列哪些是前端框架？请选择所有符合的选项。',
                    optionA: 'React',
                    optionB: 'Spring Boot',
                    optionC: 'Vue',
                    optionD: 'Angular',
                    multiple: true,
                    answer: 'A,C,D',
                    difficulty: '较难'
                },
                {
                    id: 4,
                    title: '请选择以下描述正确的一项：JavaScript 是一种轻量级、解释型的编程语言，常用于开发网页交互功能。',
                    optionA: 'JavaScript 是后端语言',
                    optionB: 'JavaScript 只能用于 Node.js',
                    optionC: 'JavaScript 是网页开发中的重要语言',
                    optionD: 'JavaScript 无法操作 DOM 元素',
                    multiple: false,
                    answer: 'C',
                    difficulty: '中等'
                },
                {
                    id: 5,
                    title: '以下哪些属于 HTTP 状态码中表示重定向的类型？',
                    optionA: '200 OK',
                    optionB: '301 Moved Permanently',
                    optionC: '302 Found',
                    optionD: '404 Not Found',
                    multiple: true,
                    answer: 'B,C',
                    difficulty: '中等'
                },
                {
                    id: 6,
                    title: '“前端工程化”通常包含哪些内容？请选择所有正确的选项。',
                    optionA: '模块化开发与构建工具链的使用',
                    optionB: '仅仅是 UI 组件设计',
                    optionC: '使用自动化构建工具，如 Webpack、Vite',
                    optionD: '代码规范化与自动部署流程',
                    multiple: true,
                    answer: 'A,C,D',
                    difficulty: '困难'
                },
                {
                    id: 7,
                    title: '下面哪个是 CSS 的功能？',
                    optionA: '定义网页的结构',
                    optionB: '控制网页的样式和布局',
                    optionC: '处理服务器端逻辑',
                    optionD: '存储数据库信息',
                    multiple: false,
                    answer: 'B',
                    difficulty: '简单'
                },
                {
                    id: 8,
                    title: '请判断以下说法是否正确：在 HTML 中，<div> 元素通常用于作为通用容器。该元素本身不具备语义，常被用于布局。',
                    optionA: '正确，该元素是通用容器',
                    optionB: '错误，<div> 是语义化元素',
                    optionC: '错误，<div> 只能用来显示图片',
                    optionD: '正确，<div> 元素能自动实现响应式设计',
                    multiple: false,
                    answer: 'A',
                    difficulty: '中等'
                },
                {
                    id: 9,
                    title: '题干较长：假设你正在开发一个响应式网页应用程序，以下哪个选项最有可能用于实现媒体查询功能以适配不同设备尺寸？',
                    optionA: '@media (max-width: 768px)',
                    optionB: '.media-query-class',
                    optionC: '<meta name="viewport">',
                    optionD: 'window.innerWidth()',
                    multiple: false,
                    answer: 'A',
                    difficulty: '中等'
                },
                {
                    id: 10,
                    title: '以下哪个选项不是 JavaScript 的数据类型？',
                    optionA: 'String',
                    optionB: 'Number',
                    optionC: 'Undefined',
                    optionD: 'Character',
                    multiple: false,
                    answer: 'D',
                    difficulty: '简单'
                },
            ]
            this.pagination.total = this.tableData.length
            const params = {
                courseId: this.searchParams.courseId, // 假设你已经在 data 或 props 中定义了 courseId
                pageNum: this.pagination.pageNum,
                pageSize: this.pagination.pageSize
            }
            //   list(params).then(resp => {
            //     this.tableData = resp.data.list || []
            //     this.tableDataLoading = false
            //   }).catch(() => {
            //     this.tableData = []
            //     this.tableDataLoading = false
            //   })
        },

        getDifficultyTagType(difficulty) {
            switch (difficulty) {
                case '简单': return 'success'
                case '中等': return 'warning'
                case '困难': return 'danger'
                default: return 'info'
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
            // this.$axios.post('/api/question/update', updatedData).then(() => {
            //     this.$message.success('更新成功')
            //     this.editVisible = false
            // })
        },
        handleDelete(row) {
            // 删除逻辑
            console.log('删除题目', row)
        },
        handleSizeChange(size) {
            this.pagination.pageSize = size
            this.fetchData()
        },
        handleCurrentChange(page) {
            this.pagination.pageNum = page
            this.fetchData()
        },
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