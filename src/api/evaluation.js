import request from '@/utils/request.js'
import { getSemesterId } from '@/utils/service/semesterUtil';


/**
 * 获取评教任务完成情况
 * @returns 
 */
export function getEvaSituation(){
    return request({
        url: `/evaluate/task/situation?semId=${getSemesterId()}`
    })
}