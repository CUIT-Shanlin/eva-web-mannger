import request from '@/utils/request.js'

export function login (user){
    return request(
        {
            url: '/login',
            method: 'POST',
            data: user
        }
    )
}