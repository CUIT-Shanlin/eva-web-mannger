<!-- 权限菜单页面 -->
<template>
  <PageTitle content="菜单列表" />
  <div class="roleAllSty">
    <div class="funBar">
      <el-button type="primary" @click="initDialog({}, 1)">新建</el-button>
      <span class="iptFuns">
        <el-input
          v-model="treeReqData.keyword"
          style="width: 260px"
          placeholder="请输入菜单名称"
          clearable
          @change="getMyTreeData"
        >
          <template #append>
            <el-button :icon="Search" @click="getMyTreeData()" />
          </template>
        </el-input>
        <el-select v-model="treeReqData.status" placeholder="筛选状态"
        @change="getMyTreeData" clearable>
        <el-option
          v-for="item in [{label: '正常', value: 0},{label: '禁用', value: 1}]"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
    </el-select>
      </span>
    </div>

    <el-table
    :data="treeData"
    v-loading="isLoadingTable"
    class="tableBox"
    :tree-props="{children: 'children'}"
    row-key="id"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="菜单名称"></el-table-column>
      <el-table-column label="图标" width="60">
        <template #default="scope">
          <i class="iconfont" v-html="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识"></el-table-column>
      <el-table-column prop="component" label="组件路径"></el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <div v-if="scope.row.status === 0" class="rightStatus">正常</div>
          <div v-else class="wrongStatus">禁用</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-link class="iconfont operation" type="primary" @click="initDialog(scope.row, 0)">
            <span class="ico">&#xe8cf;&nbsp;</span>
            修改
          </el-link>
          <el-link class="iconfont operation" type="primary"
          @click="$router.push(`/assignPerm?id=${scope.row.id}&roleName=${scope.row.roleName}`)">
            <span class="ico">&#xe611;&nbsp;</span>
            新增
          </el-link>
          <el-link class="iconfont operation" type="primary"
          @click="removeOneRole(scope.row)">
            <span class="ico">&#xe610;&nbsp;</span>
            删除
          </el-link>
          
        </template>
      </el-table-column>
    </el-table>
    
    <el-button @click="batchRemoveMyRoles()">批量删除</el-button>

    <!-- 新建/修改弹窗 -->
    <teleport to="body">
      <!-- <el-dialog
        width="500"
        v-model="updateOrAddDialogVisible"
        :title="funMode === 0 ? '修改角色' : '新建角色'"
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
      </el-dialog> -->
    </teleport>
  </div>
</template>
  
<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import {
  updateRoleStatus,
  batchRemove,
  removeOne,
  updateRole,
  addRole,
} from "@/api/role";
import { getTreeMenus } from "@/api/menu";
import {
  useSimpleConfirm,
  useSuccessTip,
  useInfoTip,
  useFailedTip,
} from "@/utils/msgTip.js";
import { isEmptyArr, deepCopy } from "@/utils/objUtil";
import { removeSpace } from "@/utils/stringUtil";
import { useRouter } from "vue-router";

const router = useRouter();

// 当前正在操作的角色
const checkedRole = ref({});
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(0);
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存勾选了的角色
const handleRoles = ref([]);
// 存获取树型数据的请求
const treeReqData = ref({
  keyword: "",
  status: null,
});
// 存获取的树型菜单数据
const treeData = ref([]);

/**
 * 修改和新建的总方法
 */
const updateOrAddRole = async () => {
  const role = checkedRole.value;
  let msg = "";
  if (funMode.value === 0) {
    let res = await updateRole(role);
    msg = `成功修改角色 “${role.roleName}”`;
  } else {
    let res = await addRole(role);
    msg = "成功新建角色";
  }
  getMyTreeData(); // 刷新页面
  updateOrAddDialogVisible.value = false;
  useSuccessTip(msg);
};

/**
 * 初始化弹窗
 * @param {Object} role 操作的角色
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(role = {}, fun = 0) {
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
    getMyTreeData();
  });
}

function handleSelectionChange(roles) {
  handleRoles.value = roles;
}


/**
 * 修改角色的状态
 * @param role 角色信息
 */
const updateThisRoleStatus = async (role) => {
  let res = await updateRoleStatus(role.id, role.status);
  if (role.status === 0) {
    useSuccessTip(`成功启用角色 “${role.roleName}”`);
  } else {
    useInfoTip(`成功禁用角色 “${role.roleName}”`);
  }
};

/**
 * 获取检索到的树型菜单数据
 */
const getMyTreeData = async () => {
  isLoadingTable.value = true;
  let {menuTree} = await getTreeMenus(treeReqData.value);
  treeData.value = menuTree;
  console.log(menuTree)
  isLoadingTable.value = false;
};

onMounted(() => {
  getMyTreeData();
});
</script>
  
<style lang="scss" scoped>
@import url("../../../assets/font/iconfont.css");
@import "../../../styles/commonFlexStyles.scss";

.roleAllSty {
  background-color: #fff;
  overflow: auto;
  padding: 15px;
  .funBar {
    @include flex-center-y;
    justify-content: space-between;
    .iptFuns {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 10px;
    }
  }
  .tableBox {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 35px;
  }
}

.rightStatus,.wrongStatus{
    text-align: center;
    padding: 2px 4px;
    border-radius: 5px;
    border: 1px transparent solid;
}
.rightStatus{
  background: rgb(240,249,235);
  color: rgb(103,194,58);
  border-color: rgb(179,225,157);
}
.wrongStatus{
  background: rgb(254,240,240);
  color: rgb(245,108,108);
  border-color: rgb(250,182,182);
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