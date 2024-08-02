<template>
    <div class="userAllSty">
        <PageTitle content="用户列表"/>
        <div class="funBar">
            <form class="iptBar" @submit.prevent="show">
                <input v-model="keyword" placeholder="请输入姓名或用户名" />
                <button class="iconfont btnIco" >&#xe602;</button>
            </form>

            <el-popover
            placement="bottom"
            trigger="click"
            :visible=isChooseDate
            :width="650"
            >
                <template #reference>
                    <div class="calendarBar" @click="isChooseDate = !isChooseDate">
                        <span class="txt">
                            <i class="iconfont ico">&#xe61c;</i>
                            <span v-html="getChooseDateText()"></span>
                        </span>
                        <i class="clear iconfont" v-if="iptDate[0] != null && iptDate[1] != null"
                        @click="iptDate[0] = null;iptDate[0] = null;isChooseDate = !isChooseDate">
                            &#xe68b;
                        </i>
                        <i :class="{iconfont: true,ico2: true,act:isChooseDate}">&#xe6a8;</i>
                    </div>
                </template>
                <div class="calendarBox">
                    <MyDatePicker v-model="iptDate[0]"/>
                    <div class="tip">&nbsp;</div>
                    <MyDatePicker v-model="iptDate[1]"/>
                </div>
            </el-popover>
        </div>
        <el-table :data="pageData.records" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="info.createTime" label="创建日期" width="180" />
            <el-table-column prop="info.name" label="名称" width="180" />
            <el-table-column prop="info.department" label="学院" />
            <el-table-column label="所属角色" >
                <template #default="scope">
                    {{ getRolesNameStr(scope.row) }}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        v-model:current-page="pageData.current"
        v-model:page-size="pageData.size"
        :page-sizes="[5, 10, 20, 40]"
        :size="pageData.size"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="getMyPageData"
        @current-change="getMyPageData"
        />
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref, watch, onMounted } from 'vue';
import { formatDate } from '@/utils/dateUtil';
import { getPageData } from '@/api/user';
import MyDatePicker from '@/components/MyDatePicker.vue';

const keyword = ref('');

const iptDate = ref([null, null]);
const isChooseDate = ref(false)

// 存分页获取的数据
const pageData = ref({
    total: 0,
    size: 0,
    current: 1,
    records: []
})

// 存分页请求数据
const pageReqData = ref({
    size: 0,
    page: 1,
    queryObj: {
        keyword: '',
        startCreateTime: null,
        endCreateTime: null
    }
})
// 发请求获取分页数据
const getMyPageData = async()=>{
    pageReqData.value.size = pageData.value.size
    pageReqData.value.page = pageData.value.current

    let data = await getPageData(pageReqData.value)
    console.log(data)
    pageData.value = data
}

/**
 * 获取一个用户的角色姓名连起来的字符串 eg: xx管理员、xx管理员
 * @param {Object} user 
 * @returns 用户的角色姓名连起来的字符串
 */
function getRolesNameStr(user){
    let nameStr = ''
    for (let i = 0; i < user.roleList.length ; i++) {
        if(i != 0){
            nameStr += '、'
        }
        nameStr += user.roleList[i].roleName
    }
    return nameStr
}
// 生成选择日期 框中的文字
function getChooseDateText(){
    if(iptDate.value[0] == null || iptDate.value[1] == null){
        return '选择创建日期'
    }
    return `${formatDate(iptDate.value[0])}&nbsp&nbsp&nbsp到&nbsp&nbsp&nbsp ${formatDate(iptDate.value[1])}`
}

/**
 * 监听输入日期的变化，更新显示数据
 */
watch(iptDate, (newValue, oldValue) => {
    if(newValue[0] != null && newValue[1] != null){
        if(newValue[0] > newValue[1]){
            newValue[1] = newValue[0]
        }
        pageReqData.value.startCreateTime = newValue[0]
        pageReqData.value.endCreateTime = newValue[1]
        getMyPageData()
    }
}, { deep: true });
function show(){
    console.log()
    alert(keyword.value + formatDate(iptDate.value[0]) + ' 到 ' + formatDate(iptDate.value[1]))
}
onMounted(()=>{
    getMyPageData()
})
</script>

<style lang="scss" scoped>
@import url('../../../assets/font/iconfont.css');
@import '../../../styles/globalPage.scss';
@import '../../../styles/commonFlexStyles.scss';
@import '../../../styles/common.scss';

.userAllSty{
    .funBar{
        @include flex-center-y;
        justify-content: space-between;
        .iptBar{
            @include flex-center-y;
            padding: 10px 10px;
            background: #FFF;
            box-shadow: $small-box-shadow;
            border-radius: 10px;
            input{
                font-size: 15px;
                border: 0;
                &:focus{
                    @include ipt-focus;
                }
            }
            .btnIco{
                border: 0;
                background-color: transparent;
                font-size: 25px;
            }
        }
        .calendarBar{
            @include flex-center-y;
            padding: 10px 20px;
            background-color: #FFF;
            box-shadow: $small-box-shadow;
            border-radius: 10px;
            user-select: none;
            .txt{
                min-width: 200px;
                // margin-right: 100px;
                .ico{
                    font-size: 20px;
                    margin-right: 10px;
                    color: rgb(255,97,117);
                }
            }
            .clear{
                margin-left: 15px;
                color: rgb(255,97,117);
                font-size: 18px;
                &:hover{
                    color: #C4C4C4;
                }
            }
            .ico2{
                color:#C4C4C4;
            }
            .act{
                display: inline-block;
                transform: rotate(-90deg);
            }
        }
    }
}

.calendarBox{
    display: flex;
    justify-content: space-between;
    .tip{
        height: 342.5px;
        width: 2.5px;
        border-radius: 100px;
        background-color: rgba(2, 63, 153, 0.5);
    }
}
</style>