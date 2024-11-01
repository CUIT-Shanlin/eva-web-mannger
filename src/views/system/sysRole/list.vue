<template>
  <el-scrollbar always>
    <PageTitle content="角色列表" />
    <div class="roleAllSty">
      <div class="funBar">
        <el-button
          class="banStyle"
          :disabled="!hasBtnPermission('system.role.add')"
          type="primary"
          @click="initDialog({}, ADD_MODE)"
          >新建</el-button
        >
        <span class="iptFuns">
          <el-input
            v-model="pageReqData.queryObj.keyword"
            style="width: 260px"
            placeholder="请输入角色名称或描述"
            clearable
            @change="getMyPageData"
          >
            <template #append>
              <el-button :icon="Search" @click="getMyPageData()" />
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
            style="width: 240px"
          />

          <el-date-picker
            v-model="updateTimeArr"
            type="daterange"
            range-separator="到"
            start-placeholder="开始修改时间"
            end-placeholder="结束修改时间"
            style="width: 240px"
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
              class="banStyle"
              :disabled="!hasBtnPermission('system.role.update')"
              v-model="scope.row.status"
              :active-value="NORMAL_STATE"
              :inactive-value="DISABLED_STATE"
              @change="updateThisRoleStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="200"
          sortable
        />
        <el-table-column
          prop="updateTime"
          label="修改日期"
          width="200"
          sortable
        />
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-link
              class="iconfont operation banStyle"
              type="primary"
              @click="initDialog(scope.row, UPDATE_MODE)"
              :disabled="!hasBtnPermission('system.role.update')"
            >
              <span class="ico">&#xe8cf;&nbsp;</span>
              修改
            </el-link>
            <el-link
              class="iconfont operation banStyle"
              type="primary"
              :disabled="!hasBtnPermission('system.role.delete')"
              @click="removeOneRole(scope.row)"
            >
              <span class="ico">&#xe610;&nbsp;</span>
              删除
            </el-link>
            <el-link
              class="iconfont operation banStyle"
              type="primary"
              :disabled="!hasBtnPermission('system.role.assignPerm')"
              @click="
                $router.push(
                  `/assignPerm?id=${scope.row.id}&roleName=${scope.row.roleName}`
                )
              "
            >
              <span class="ico">&#xe603;&nbsp;</span>
              分配权限
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        class="banStyle"
        @click="batchRemoveMyRoles()"
        :disabled="!hasBtnPermission('system.role.delete')"
        >批量删除</el-button
      >

      <!-- 新建/修改弹窗 -->
      <teleport to="body">
        <el-dialog
          width="500"
          v-model="updateOrAddDialogVisible"
          :title="funMode === UPDATE_MODE ? '修改角色' : '新建角色'"
        >
          <el-form label-width="80px">
            <el-form-item label="姓名">
              <el-input
                v-model="checkedRole.roleName"
                placeholder="请输入角色名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input
                v-model="checkedRole.description"
                placeholder="请输入该角色描述信息"
              ></el-input>
            </el-form-item>
            <el-form-item label="创建时间" v-if="funMode === UPDATE_MODE">
              <el-input v-model="checkedRole.createTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="修改时间" v-if="funMode === UPDATE_MODE">
              <el-input v-model="checkedRole.updateTime" disabled></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <el-button
              type="primary"
              @click="updateOrAddRole()"
              :loading="isLoadingBtn"
              :disabled="isChecked()"
              >保存</el-button
            >
            <el-button @click="updateOrAddDialogVisible = false"
              >取消</el-button
            >
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
  </el-scrollbar>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import {
  getPageData,
  updateRoleStatus,
  batchRemove,
  removeOne,
  updateRole,
  addRole,
} from "@/api/role";
import {
  useSimpleConfirm,
  useSuccessTip,
  useInfoTip,
  useFailedTip,
} from "@/utils/msgTip.js";
import {
  UPDATE_MODE,
  ADD_MODE,
  NORMAL_STATE,
  DISABLED_STATE,
} from "@/utils/service/staticData";
import { hasBtnPermission } from "@/utils/btnPermission";
import { isEmptyArr, deepCopy } from "@/utils/objUtil";
import { formatDate } from "@/utils/dateUtil";
import { isSpace, removeSpace } from "@/utils/stringUtil";

const isLoadingBtn = ref(false);

// 当前正在操作的角色
const checkedRole = ref({});
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(UPDATE_MODE);
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存勾选了的角色
const handleRoles = ref([]);
// 存分页请求数据
const pageReqData = ref({
  size: 10,
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
  size: 10,
  current: 1,
  records: [],
});
// 存修改日期对应数组
const updateTimeArr = ref([]);
// 存创建日期对应数组
const createTimeArr = ref([]);

/**
 * 确认是否可以提交表单
 */
function isChecked() {
  return funMode.value === ADD_MODE && isSpace(checkedRole.value.roleName);
}

/**
 * 修改和新建的总方法
 */
const updateOrAddRole = async () => {
  isLoadingBtn.value = true;
  const role = checkedRole.value;
  let msg = "";
  if (funMode.value === UPDATE_MODE) {
    await updateRole(role);
    msg = `成功修改角色 “${role.roleName}”`;
  } else {
    await addRole(role);
    msg = "成功新建角色";
  }
  getMyPageData(); // 刷新页面
  updateOrAddDialogVisible.value = false;
  useSuccessTip(msg);
  isLoadingBtn.value = false;
};

/**
 * 初始化弹窗
 * @param {Object} role 操作的角色
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(role = {}, fun = UPDATE_MODE) {
  funMode.value = fun;
  checkedRole.value = deepCopy(role);
  updateOrAddDialogVisible.value = true;
}

/**
 * 删除单个角色
 * @param {Number} roleId 待删除角色id
 */
function removeOneRole(role) {
  useSimpleConfirm(`你确定要删除角色 “${role.roleName}” 吗？`).then(
    async () => {
      let res = await removeOne(role);
      useSuccessTip(`成功删除角色 “${role.roleName}”`);
    }
  );
}

/**
 * 批量删除角色
 */
function batchRemoveMyRoles() {
  if (isEmptyArr(handleRoles.value)) {
    useFailedTip("未选中角色");
    return;
  }
  useSimpleConfirm("你确定要删除选中角色吗？").then(async () => {
    const idList = handleRoles.value.map((role) => role.id);
    console.log(idList);
    let res = await batchRemove(idList);
    useSuccessTip("成功删除选中角色");
    getMyPageData();
  });
}

function handleSelectionChange(roles) {
  handleRoles.value = roles;
}
/**
 * 生成快速选择的value
 * @param {Number} days 天数
 */
const createCutValue = (days = 1) => {
  const end = new Date();
  const start = new Date();
  start.setTime(start.getTime() - 3600 * 1000 * 24 * days);
  return [start, end];
};

// 实现日期选择器的快速选择
const shortcuts = [
  {
    text: "上周",
    value: createCutValue(7),
  },
  {
    text: "上个月",
    value: createCutValue(30),
  },
  {
    text: "3个月前",
    value: createCutValue(90),
  },
];

/**
 * 修改角色的状态
 * @param role 角色信息
 */
const updateThisRoleStatus = async (role) => {
  let res = await updateRoleStatus(role.id, role.status);
  if (role.status === NORMAL_STATE) {
    useSuccessTip(`成功启用角色 “${role.roleName}”`);
  } else {
    useInfoTip(`成功禁用角色 “${role.roleName}”`);
  }
};

/**
 * 获取分页角色信息
 */
const getMyPageData = async () => {
  isLoadingTable.value = true;
  const queryObj = pageReqData.value.queryObj;
  queryObj.keyword = removeSpace(queryObj.keyword);
  queryObj.startCreateTime = formatDate(createTimeArr.value[0]);
  queryObj.endCreateTime = formatDate(createTimeArr.value[1]);
  queryObj.startUpdateTime = formatDate(updateTimeArr.value[0]);
  queryObj.endUpdateTime = formatDate(updateTimeArr.value[1]);

  pageReqData.value.size = pageData.value.size;
  pageReqData.value.page = pageData.value.current;

  let res = await getPageData(pageReqData.value);
  pageData.value = res;
  isLoadingTable.value = false;
};

onMounted(() => {
  getMyPageData();
});
</script>

<style lang="scss" scoped>
@import url("../../../assets/font/iconfont.css");
@import "../../../styles/commonFlexStyles.scss";

.roleAllSty {
  background-color: #fff;
  overflow: auto;
  // overflow-x: hidden;
  padding: 15px;
  .funBar {
    @include flex-center-y;
    justify-content: space-between;
    .iptFuns {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 10px;
    }
  }
  .tableBox {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 35px;
    overflow-x: auto;
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
    background-color: rgb(250, 250, 250);
  }
  .el-table__body-wrapper {
    td {
      color: rgb(89, 89, 89);
    }
  }
}
.operation {
  font-size: 14px;
  margin-right: 15px;
  // color: rgb(64,158,255);
  .ico {
    font-size: 18px;
  }
}
</style>