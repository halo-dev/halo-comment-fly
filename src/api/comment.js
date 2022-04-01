import service from '@/utils/service'

const baseUrl = '/api/content'

const commentApi = {}

commentApi.createComment = (target, comment) => {
    return service({
        url: `${baseUrl}/${target}/comments`,
        method: 'post',
        data: comment
    })
}

// eslint-disable-next-line no-unused-vars
commentApi.listComments = (target, targetId, view = 'tree_view', pagination) => {
    return service({
        url: `${baseUrl}/${target}/${targetId}/comments/${view}`,
        // url: 'http://localhost:8090/api/content/posts/1/comments/tree_view',
        params: pagination,
        method: 'get'
    })
}

export default commentApi