import request from '@/utils/request'
const api_prefix = '/api/teacher/material'

//获取章节材料
export function list(chapterId) {
    return request({
        url: `${api_prefix}/list/${chapterId}`,
        method: 'get'
    })
}

export const uploaddocumentUrl = `${process.env.VUE_APP_BASE_API}${api_prefix}/create`

// 上传
export function createIt(data) {
    return request({
        url: `${api_prefix}/create`,
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}
//更新
export function updateIt(data) {
    return request({
        url: `${api_prefix}/update`,
        method: 'post',
        data
    })
}

// 删除
export function deleteIt(videoId) {
    return request({
        url: `${api_prefix}/delete/${videoId}`,
        method: 'post'
    })
}


