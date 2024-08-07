<template>
    <div class="userAllSty">
        <PageTitle content="用户列表"/>
        <div class="funBar">
            <form class="iptBar" @submit.prevent="getMyPageData">
                <input v-model="pageReqData.queryObj.keyword" placeholder="请输入姓名或用户名" />
                <button class="iconfont btnIco" >&#xe602;</button>
            </form>
            <div class="myBox">
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
                <my-common-btn class="addIco" txt="新建用户" :is-large="true"  default-color="rgb(255,97,117)" ico="&#xe712;" />
            </div>
        </div>
        <el-table :data="pageData.records" style="width: 100%" v-loading="isLoadingTable">
            <!-- <el-table-column type="selection" width="50" /> -->
            <el-table-column prop="info.createTime" label="创建日期" width="180" />
            <el-table-column label="名称" width="180">
                <template #default="scope">
                    <div class="nameBar">
                        <el-avatar class="avatar" shape="square" :size="40" fit="cover"
                        :src="getMyAvatar(scope.row.info.avatar)"/>
                        {{scope.row.info.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="info.department" label="学院" width="200"/>
            <el-table-column label="状态" width="100">
                <template #default="scope">
                    <el-switch v-model="scope.row.info.status"
                    :active-value="0"
                    :inactive-value="1"
                    style="--el-switch-on-color: rgb(255,97,117);"/>
                </template>
            </el-table-column>
            <el-table-column label="所属角色" >
                <template #default="scope">
                    {{ getRolesNameStr(scope.row) }}
                </template>
            </el-table-column>
            <el-table-column label="联系" width="150">
                <template #default="scope">
                    <div class="icoBox">
                        <el-tooltip :content="scope.row.info.phone" placement="top" effect="light">
                            <div class="iconfont linkIco">&#xe862;</div>
                        </el-tooltip>
                        <el-tooltip :content="scope.row.info.email" placement="top" effect="light">
                            <div class="iconfont linkIco">&#xe697;</div>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <div class="operationBox">
                        <my-common-btn txt="查看" :default-color="getRandColor()" :is-large="true"/>
                        <my-common-btn txt="修改" :default-color="getRandColor()" :is-large="true"/>
                        <el-popover
                        placement="left"
                        :width="200"
                        trigger="hover"
                        >
                            <template #reference>
                                <i class="iconfont more">&#xe612;</i>
                            </template>
                            <div class="moreBox">
                                <div>
                                    <el-link type="primary">查看评语/评分</el-link>
                                </div>
                                <div>
                                    <el-link type="info" @click="showAssignRole(scope.row)">分配角色</el-link>
                                </div>
                                <div>
                                    <el-link type="danger" @click="deleteOneUser(scope.row.info)">删除用户</el-link>
                                </div>
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 分配角色的提示框 -->
        <el-dialog title="分配角色" v-model="assignDialogOpen" width="500">
        <el-form label-width="80px">
            <el-form-item label="姓名">
            <el-input disabled :value="checkedUser.info.name"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input disabled :value="checkedUser.info.username"></el-input>
          </el-form-item>
  
          <el-form-item label="角色列表">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange()">全选</el-checkbox>
            <br />
            <el-checkbox-group v-model="userRoleIds">
              <el-checkbox v-for="role in allRoles" :key="role.id" :value="role.id" :title="'描述：' + role.description">{{role.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="doMyAssign()">保存</el-button>
          <el-button @click="assignDialogOpen = false" >取消</el-button>
        </template>
      </el-dialog>


        <el-pagination
        v-model:current-page="pageData.current"
        v-model:page-size="pageData.size"
        :page-sizes="[5, 10, 20, 40]"
        :size="pageData.size"
        :disabled="disabled"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
        @size-change="getMyPageData"
        @current-change="getMyPageData"
        class="myPage"
        />
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref, watch, onMounted } from 'vue';
import { formatDate } from '@/utils/dateUtil';
import { getPageData, removeOne, doAssign } from '@/api/user';
import { getAllRoles } from '@/api/role';
import { getMyAvatar } from '@/utils/service/userUtil';
import { getRandomNumber } from '@/utils/randomUtil';
import { useSimpleConfirm, useSuccessTip } from '@/utils/msgTip.js';
import { removeSpace } from '@/utils/stringUtil';
import MyDatePicker from '@/components/MyDatePicker.vue';
import MyCommonBtn from '@/components/MyCommonBtn.vue';


const iptDate = ref([null, null]);
const isChooseDate = ref(false)

// 是否正在加载表格
const isLoadingTable = ref(false)
// 确定是否打开 分配角色的弹窗
const assignDialogOpen = ref(false)
// 存所有的角色
const allRoles = ref([])
// 当前正在操作的用户
const checkedUser = ref({})
// 是否是不确定的
const isIndeterminate = ref(true)
// 当前被分配角色的用户的角色id集合
const userRoleIds = ref([])
// 确认是否全选
const checkAll = ref(false)

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

/**
 * 为对应用户分配角色
 */
const doMyAssign = async()=>{
    const assighVo = {
        userId: checkedUser.value.id,
        roleIdList: userRoleIds
    }
    let res =  await doAssign(assighVo)
    assignDialogOpen.value = false
    useSuccessTip('分配角色成功')
}

/**
 * 展示分配的角色，以及弹窗的初始化
 */
function showAssignRole(user){
    isIndeterminate.value = true
    userRoleIds.value = user.roleList.map(role => role.id)
    assignDialogOpen.value = true
    checkedUser.value = user
}

/**
 * 实现角色的全选以及全不选
 */
function handleCheckAllChange(){
    userRoleIds.value = checkAll.value ? allRoles.value.map(role => role.id) : [];
    isIndeterminate.value = false
}
/**
 * 初始化 角色信息
 */
const initRoles = async()=>{
    let {dataArr} = await getAllRoles()
    allRoles.value = dataArr
}

/**
 * 发请求获取分页数据
 */
const getMyPageData = async()=>{
    isLoadingTable.value = true
    pageReqData.value.queryObj.keyword = removeSpace(pageReqData.value.queryObj.keyword)
    pageReqData.value.size = pageData.value.size
    pageReqData.value.page = pageData.value.current

    let data = await getPageData(pageReqData.value)
    // console.log(data)
    pageData.value = data
    isLoadingTable.value = false
}

/**
 * 发请求删除一个用户
 */
function deleteOneUser (user){
    useSimpleConfirm(`你确定要删除用户 “${user.name}” 吗？`).then(async()=>{
        let data = await removeOne(user.id)
        getMyPageData()// 刷新数据
        useSuccessTip(`删除用户 “${user.name}” 成功`)
    })
}

/**
 * 获取随机颜色字符串
 * @returns 随机颜色字符串
 */
function getRandColor(){
    const colorArr = ['rgb(57,25,149)','rgb(255,170,43)','rgb(30,174,122)','rgb(57,25,149)']
    return colorArr[getRandomNumber(0,colorArr.length - 1)]
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

onMounted(()=>{
    getMyPageData()
    initRoles()
})
</script>

<style lang="scss" scoped>
@import url('../../../assets/font/iconfont.css');
@import '../../../styles/globalPage.scss';
@import '../../../styles/commonFlexStyles.scss';
@import '../../../styles/common.scss';

$ico-btn-color:rgb(255,97,117);

.userAllSty{
    .funBar{
        @include flex-center-y;
        justify-content: space-between;
        padding-bottom: 20px;
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
                cursor: pointer;
                border: 0;
                background-color: transparent;
                font-size: 25px;
            }
        }
        .calendarBar{
            cursor: pointer;
            @include flex-center-y;
            padding: 10px 20px;
            background-color: #FFF;
            box-shadow: $small-box-shadow;
            border-radius: 10px;
            user-select: none;
            .txt{
                // min-width: 200px;
                min-width: 150px;
                // margin-right: 100px;
                .ico{
                    font-size: 20px;
                    margin-right: 10px;
                    color: $ico-btn-color;
                }
            }
            .clear{
                margin-left: 15px;
                color: $ico-btn-color;
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
        .addIco{
            font-size: 15px;
            margin-left: 25px;

        }
    }
}

.myPage{
    margin-top: 15px;
    padding: 10px 0;
    // float: right;
    display: grid;
    grid-template-columns: 10fr 1fr 0.5fr 1fr 0.5fr 1fr;
}
.myBox{
    display: flex;
    flex-wrap: wrap;
}
.icoBox{
    @include flex-center-y;
    // justify-content: space-between;
    user-select: none;
    .linkIco{
        cursor: pointer;
        font-size: 22px;
        color: $ico-btn-color;
        padding: 8px;
        background-color: rgb(255,231,234);
        border-radius: 10px;
        margin-right: 20px;
    }
    .linkIco:hover{
        background-color: rgb(221, 214, 215);

    }
}
.moreBox{
    // @include flex-center;
    // flex-wrap: wrap;
    text-align: center;
}
.operationBox{
    @include flex-center-y;
    justify-content: space-between;
    .more{
        cursor: pointer;
        font-size: 22px;
    }
}
:deep(){
    .el-table__cell{
        color: black;
    }
    // .el-pagination__total,.el-pagination__sizes{
    //     flex: 0 0 50%;
    //     order: -1;
    //     // color: #C4C4C4;
    // }
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
.nameBar{
    @include flex-center-y;
    .avatar{
        margin-right: 15px;
    }
}
</style>