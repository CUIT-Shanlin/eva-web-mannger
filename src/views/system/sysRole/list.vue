<template>
  <PageTitle content="角色列表" />
  <div class="roleAllSty">
    <div class="funBar">
      <el-button type="primary" @click="initDialog({}, 1)">新建</el-button>
      <span class="iptFuns">
        <el-input
        v-model="pageReqData.queryObj.keyword"
        style="width: 260px"
        placeholder="请输入角色名称或描述"
        clearable
        @change="getMyPageData"
        >
          <template #append>
            <el-button :icon="Search" @click="getMyPageData()"/>
          </template>
        </el-input>
        <el-date-picker
        v-model="createTimeArr"
        type="daterange"
        range-separator="到"
        start-placeholder="开始创建时间"
        end-placeholder="结束创建时间"
        :shortcuts="shortcuts"
        @change="getMyPageData()"
        style="width: 240px;"
        />

        <el-date-picker
        v-model="updateTimeArr"
        type="daterange"
        range-separator="到"
        start-placeholder="开始修改时间"
        end-placeholder="结束修改时间"
        style="width: 240px;"
        :shortcuts="shortcuts"
        @change="getMyPageData()"
        />
      </span>
    </div>

    <el-table
    :data="pageData.records"
    v-loading="isLoadingTable"
    class="tableBox"
    @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="roleName" label="角色名称" width="200" />
      <el-table-column prop="description" label="描述" width="250" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-switch
          v-model="scope.row.status"
          :active-value="0"
          :inactive-value="1"
          @change="updateThisRoleStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="200" sortable/>
      <el-table-column prop="updateTime" label="修改日期" width="200" sortable/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-link class="iconfont operation" type="primary" @click="initDialog(scope.row, 0)">
            <span class="ico">&#xe8cf;&nbsp;</span>
            修改
          </el-link>
          <el-link class="iconfont operation" type="primary"
          @click="removeOneRole(scope.row)">
            <span class="ico">&#xe610;&nbsp;</span>
            删除
          </el-link>
          <el-link class="iconfont operation" type="primary"
          @click="$router.push(`/assignPerm?id=${scope.row.id}&roleName=${scope.row.roleName}`)">
            <span class="ico">&#xe603;&nbsp;</span>
            分配权限
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="batchRemoveMyRoles()">批量删除</el-button>

    <!-- 新建/修改弹窗 -->
    <teleport to="body">
      <el-dialog width="500" v-model="updateOrAddDialogVisible" :title="funMode === 0 ? '修改角色' : '新建角色'">
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="checkedRole.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="checkedRole.description" placeholder="请输入该角色描述信息"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" v-if="funMode === 0">
            <el-input v-model="checkedRole.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="修改时间" v-if="funMode === 0">
            <el-input v-model="checkedRole.updateTime" disabled></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="updateOrAddRole()">保存</el-button>
          <el-button @click="updateOrAddDialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </teleport>

    <el-pagination
    v-model:current-page="pageData.current"
    v-model:page-size="pageData.size"
    :page-sizes="[5, 10, 20, 40]"
    :size="pageData.size"
    layout="sizes, prev, pager, next, jumper"
    :total="pageData.total"
    @size-change="getMyPageData"
    @current-change="getMyPageData"
    background
    class="myPage"
    />
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { getPageData, updateRoleStatus, batchRemove, removeOne, updateRole, addRole } from '@/api/role';
import { useSimpleConfirm, useSuccessTip, useInfoTip, useFailedTip } from "@/utils/msgTip.js";
import { isEmptyArr, deepCopy } from "@/utils/objUtil";
import { removeSpace } from "@/utils/stringUtil";
import { useRouter } from "vue-router";

const router = useRouter()

// 当前正在操作的角色
const checkedRole = ref({})
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(0)
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false)
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存勾选了的角色
const handleRoles = ref([])
// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    startCreateTime: null,
    endCreateTime: null,
    startUpdateTime: null,
    endUpdateTime: null,
  },
});
// 存分页获取的数据
const pageData = ref({
  total: 0,
  size: 0,
  current: 1,
  records: [],
});
// 存修改日期对应数组
const updateTimeArr = ref([])
// 存创建日期对应数组
const createTimeArr = ref([])

/**
 * 修改和新建的总方法
 */
const updateOrAddRole = async()=>{
  const role = checkedRole.value
  let msg = ''
  if(funMode.value === 0){
    let res = await updateRole(role)
    msg = `成功修改角色 “${role.roleName}”`
  }else{
    let res = await addRole(role)
    msg = '成功新建角色'
  }
  getMyPageData()// 刷新页面
  updateOrAddDialogVisible.value = false
  useSuccessTip(msg)
}

/**
 * 初始化弹窗
 * @param {Object} role 操作的角色
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(role = {}, fun = 0){
  funMode.value = fun
  checkedRole.value = deepCopy(role)
  updateOrAddDialogVisible.value = true
}

/**
 * 删除单个角色
 * @param {Number} roleId 待删除角色id
 */
function removeOneRole(role){
  useSimpleConfirm(`你确定要删除角色 “${role.roleName}” 吗？`).then(async()=>{
    let res = await removeOne(role)
    useSuccessTip(`成功删除角色 “${role.roleName}”`)
  })
}

/**
 * 批量删除角色
 */
function batchRemoveMyRoles(){
  if(isEmptyArr(handleRoles.value)){
    useFailedTip('未选中角色')
    return
  }
  useSimpleConfirm('你确定要删除选中角色吗？').then(async()=>{
    const idList = handleRoles.value.map(role => role.id)
    console.log(idList)
    let res = await batchRemove(idList)
    useSuccessTip('成功删除选中角色')
    getMyPageData()
  })
}

function handleSelectionChange(roles){
  handleRoles.value = roles
}
/**
 * 生成快速选择的value
 * @param {Number} days 天数 
 */
const createCutValue = (days = 1)=>{
  const end = new Date()
  const start = new Date()
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)
  return [start, end]
}

// 实现日期选择器的快速选择
const shortcuts = [
  {
    text: '上周',
    value: createCutValue(7),
  },
  {
    text: '上个月',
    value: createCutValue(30),
  },
  {
    text: '3个月前',
    value: createCutValue(90),
  },
]


/**
 * 修改角色的状态
 * @param role 角色信息
 */
const updateThisRoleStatus = async(role)=>{
  let res = await updateRoleStatus(role.id, role.status)
  if(role.status === 0){
    useSuccessTip(`成功启用角色 “${role.roleName}”`)
  }else{
    useInfoTip(`成功禁用角色 “${role.roleName}”`)
  }
}

/**
 * 获取分页角色信息
 */
const getMyPageData = async()=>{
  isLoadingTable.value = true
  const queryObj = pageReqData.value.queryObj
  queryObj.keyword = removeSpace(queryObj.keyword)
  queryObj.startCreateTime = createTimeArr[0]
  queryObj.endCreateTime = createTimeArr[1]
  queryObj.startUpdateTime = updateTimeArr[0]
  queryObj.endUpdateTime = updateTimeArr[1]
  let res = await getPageData(pageReqData.value)
  pageData.value = res
  isLoadingTable.value = false
}


onMounted(()=>{
  getMyPageData()
})
</script>

<style lang="scss" scoped>
@import url("../../../assets/font/iconfont.css");
@import "../../../styles/commonFlexStyles.scss";

.roleAllSty{
  background-color: #FFF;
  overflow: auto;
  padding: 15px;
  .funBar{
    @include flex-center-y;
    justify-content: space-between;
    .iptFuns{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 10px;
    }
  }
  .tableBox{
    width: 100%;
    margin-top: 50px;
    margin-bottom: 35px;
  }
}
.myPage {
  float: right;
}
:deep() {
  th.el-table__cell {
    font-size: 15px;
    font-weight: 500;
    color: black;
    background-color: rgb(250,250,250);
  }
  .el-table__body-wrapper{
    td{
       color: rgb(89,89,89); 
    }
  }
}
.operation{
  font-size: 14px;
  margin-right: 15px;
  // color: rgb(64,158,255);
  .ico{
    font-size: 18px;
  }
}
</style>