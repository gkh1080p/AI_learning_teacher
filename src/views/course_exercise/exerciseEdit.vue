<template>
    <el-dialog title="编辑题目信息" :visible.sync="visible" width="600px" @close="handleClose">
        <el-form :model="form" label-width="100px">
            <el-form-item label="题目内容">
                <el-input type="textarea" v-model="form.title" />
            </el-form-item>

            <el-form-item label="选项 A">
                <el-input v-model="form.aoption" />
            </el-form-item>

            <el-form-item label="选项 B">
                <el-input v-model="form.boption" />
            </el-form-item>

            <el-form-item label="选项 C">
                <el-input v-model="form.coption" />
            </el-form-item>

            <el-form-item label="选项 D">
                <el-input v-model="form.doption" />
            </el-form-item>

            <el-form-item label="是否多选">
                <el-radio-group v-model="form.type">
                    <el-radio :label="'single'">否</el-radio>
                    <el-radio :label="'multiple'">是</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="正确答案">
                <el-checkbox-group v-if="form.type == 'multiple'" v-model="form.correctAnswer">
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
            <el-form-item label="分值">
                <el-input v-model="form.score" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确认</el-button>
        </template>
    </el-dialog>
</template>

<script>
import {updateQuestion,getQuestionDetail} from '@/api/exercise' 
export default {
    name: 'EditQuestionDialog',
    props: {
        visible: Boolean,
        questionId: [String, Number],
        course_id: [String, Number]
    },
    data() {
        return {
            form: {
                title: '',
                aOption: '',
                bOption: '',
                cOption: '',
                dOption: '',
                type: null,
                correctAnswer: null,
                difficulty: null,
                score: null,
                courseId: this.course_id,
                id: this.questionId
            }
        }
    },
    watch: {
        visible(val) {
            if (val && this.questionId) {
                this.fetchQuestionDetail()
            }
        },
        'form.type'(newVal) {
            if (newVal === 'multiple') {
                // 切换为多选时，确保 correctAnswer 是数组
                if (!Array.isArray(this.form.correctAnswer)) {
                    this.form.correctAnswer = this.form.correctAnswer
                        ? [this.form.correctAnswer]
                        : [];
                }
            } else {
                // 切换为单选时，只保留第一个答案
                if (Array.isArray(this.form.correctAnswer)) {
                    this.form.correctAnswer = this.form.correctAnswer[0] || null;
                }
            }
        }
    },
    methods: {
        fetchQuestionDetail() {
            
            getQuestionDetail(this.questionId).then(resp => {
                this.form = resp.data
                this.form.correctAnswer = this.form.type === 'multiple'
                    ? this.form.correctAnswer.split(',')
                    : this.form.correctAnswer
            })
        },
        handleClose() {
            this.$emit('update:visible', false)
        },
        handleSubmit() {
            const payload = {
                ...this.form,
                correctAnswer: this.form.type === 'multiple'
                    ? this.form.correctAnswer.filter(ans => ans !== undefined).join(',')
                    : this.form.correctAnswer,
                courseId: this.form.courseId,
                id: this.questionId
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
