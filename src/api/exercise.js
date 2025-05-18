import request from '@/utils/request'

const api_prefix = '/api/teacher/question'
// 获取习题列表信息
export function getQuestionList(data) {
    return request({
        url: `${api_prefix}/list/${data.courseId}`,
        method: 'get',
        params: {
            type: data.type,
            difficulty: data.difficulty,
            minScore: data.minScore,
            maxScore: data.maxScore,
        }
    })
}

// 上传接口
export function uploadQuestion(data) {
    return request({
        url: `${api_prefix}/import`,
        method: 'post',
        data
    })
}
//修改习题
export function updateQuestion(data) {
    return request({
        url: `${api_prefix}/update`,
        method: 'post',
        data
    })
}

// 删除习题
export function deleteQuestion(id) {
    return request({
        url: `${api_prefix}/delete/${id}`,
        method: 'post',
    })
}
// 获取习题详情
export function getQuestionDetail(id) {
    return request({
        url: `${api_prefix}/detail/${id}`,
        method: 'get',
    })
}