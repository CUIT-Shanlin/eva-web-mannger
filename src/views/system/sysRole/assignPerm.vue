<!-- 分配权限页面 -->
<template>
    <PageTitle :content="`正在为 “${role.roleName}” 分配权限`" />
    <div class="assignAllSty">
        <div class="funMode">
            <el-button @click="goBackPage()" >退出</el-button>
            <el-button class="banStyle" :disabled="!hasBtnPermission('system.role.assignPerm')" @click="save()" type="primary" :loading="isLoadingBtn">保存</el-button>
            <el-tree
            ref="tree"
            :data="menuTreeList"
            node-key="id"
            show-checkbox
            :props="myProps"
            default-expand-all
            @check-change="getChooseMenusIdlist"
            :default-checked-keys="chooseIdList"
            :check-strictly="isChecked"
            />
        </div>
    </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { useRoute,useRouter } from 'vue-router'
import { ref, onMounted } from "vue";
import{ useSuccessTip } from '@/utils/msgTip'
import { getTreeMenus, getMenuIdListByRoleId } from '@/api/menu'
import { doAssignForRole } from '@/api/role'
import { hasBtnPermission } from '@/utils/btnPermission';

// 确定按钮是否是loading状态
const isLoadingBtn = ref(false)


const isChecked = ref(true)

// 保存并退出
const save = async()=>{
    isLoadingBtn.value = true
    await doAssignForRole({roleId: role.value.id,menuIdList: chooseIdList.value});
    useSuccessTip(`你成功对角色 “${role.value.roleName}” 进行了权限修改`)
    isLoadingBtn.value = false
}

const router = useRouter()
// 直接返回上一个路由
function goBackPage(){
    router.go(-1)
}

// 存选中的id列表
let chooseIdList = ref([])
// 配置树型复选框
let myProps = ref({label: 'name'})
// 通过监听选中与否来不断获取选中了的菜单
function getChooseMenusIdlist(data, checked, indeterminate) {
    isChecked.value = false
    const index = chooseIdList.value.indexOf(data.id);
    if (checked || indeterminate) {
        // 如果节点被选中且此前还没有添加，就添加到chooseIdList
        if(index < 0){
            chooseIdList.value.push(data.id);
        }
    } else {
        // 如果节点被取消选中且已经存在于列表中，则从chooseIdList中移除
        if (index !== -1) {
            chooseIdList.value.splice(index, 1);
        }
    }
}

// 拿到原本就有的菜单id列表(无子节点)

const getMyMenuIds = async()=>{
    let res = await getMenuIdListByRoleId(role.value.id)
    // 将旧数据拿到默认选中里面
    chooseIdList.value = res
}

// 获取到所有的树型菜单列表
const getTreeMenusList = async()=>{
    let menuTree = await getTreeMenus()
    menuTreeList.value = menuTree
    // console.log(menuTree)
}
// 存所有的menu
let menuTreeList = ref([])
const route = useRoute()
// 存待操作的role
let role = ref({})
onMounted(() => {
    // 拿到对应角色的参数
    role.value.id = route.query.id
    role.value.roleName = route.query.roleName
    // 初始化菜单数据
    getTreeMenusList()
    // 原本就有的菜单id
    getMyMenuIds()
})
</script>

<style lang="scss" scoped>
@import url('/src/assets/font/iconfont.css');
@import '/src/styles/globalPage.scss';
.assignAllSty{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .funMode{
        background: #FFF;
        width: 100%;
        padding: 3vh 2vw;
    }
}
</style>