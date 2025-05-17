<template>
    <el-dialog title="编辑题目信息" :visible.sync="visible" width="600px" @close="handleClose">
        <el-form :model="form" label-width="100px">
            <el-form-item label="题目内容">
                <el-input type="textarea" v-model="form.question" />
            </el-form-item>

            <el-form-item label="选项 A">
                <el-input v-model="form.optionA" />
            </el-form-item>

            <el-form-item label="选项 B">
                <el-input v-model="form.optionB" />
            </el-form-item>

            <el-form-item label="选项 C">
                <el-input v-model="form.optionC" />
            </el-form-item>

            <el-form-item label="选项 D">
                <el-input v-model="form.optionD" />
            </el-form-item>

            <el-form-item label="是否多选">
                <el-radio-group v-model="form.isMultiple">
                    <el-radio :label="false">否</el-radio>
                    <el-radio :label="true">是</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="正确答案">
                <el-checkbox-group v-if="form.isMultiple" v-model="form.correctAnswer">
                    <el-checkbox label="A" />
                    <el-checkbox label="B" />
                    <el-checkbox label="C" />
                    <el-checkbox label="D" />
                </el-checkbox-group>

                <el-radio-group v-else v-model="form.correctAnswer">
                    <el-radio label="A" />
                    <el-radio label="B" />
                    <el-radio label="C" />
                    <el-radio label="D" />
                </el-radio-group>
            </el-form-item>

            <el-form-item label="难度等级">
                <el-select v-model="form.difficulty" placeholder="请选择难度">
                    <el-option label="简单" value="easy" />
                    <el-option label="中等" value="medium" />
                    <el-option label="困难" value="hard" />
                </el-select>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script>
export default {
    name: 'EditQuestionDialog',
    props: {
        visible: Boolean,
        questionId: [String, Number]
    },
    data() {
        return {
            form: {
                question: '',
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                isMultiple: false,
                correctAnswer: [],
                difficulty: ''
            }
        }
    },
    watch: {
        visible(val) {
            if (val && this.questionId) {
                this.fetchQuestionDetail()
            }
        }
    },
    methods: {
        fetchQuestionDetail() {
            // 模拟请求
            // 实际使用时请替换为你的 axios 请求
            // this.$axios.get(`/api/question/${this.questionId}`).then(res => {
            //   const data = res.data
            const data = {
                question: '以下哪个是 JavaScript 框架？',
                optionA: 'Vue',
                optionB: 'HTML',
                optionC: 'CSS',
                optionD: 'Photoshop',
                isMultiple: false,
                correctAnswer: [],
                difficulty: '中等'
            }

            this.form = {
                question: data.question,
                optionA: data.optionA,
                optionB: data.optionB,
                optionC: data.optionC,
                optionD: data.optionD,
                isMultiple: data.isMultiple,
                correctAnswer: data.isMultiple ? [...data.correctAnswer] : [data.correctAnswer[0]],
                difficulty: data.difficulty
            }
            // }).catch(err => {
            //   this.$message.error('获取题目详情失败')
            // })
        },
        handleClose() {
            this.$emit('update:visible', false)
        },
        handleSubmit() {
            const payload = {
                ...this.form,
                correctAnswer: this.form.isMultiple
                    ? this.form.correctAnswer.filter(ans => ans !== undefined)
                    : [this.form.correctAnswer]
            }
            console.log('提交的数据:', payload)
            this.$emit('submit', payload)
            this.handleClose()
        }
    }
}
</script>

<style scoped>
.el-form-item {
    margin-bottom: 20px;
}
</style>
