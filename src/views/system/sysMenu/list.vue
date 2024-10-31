<!-- 权限菜单页面 -->
<template>
  <PageTitle content="菜单列表" />
  <div class="roleAllSty">
    <div class="funBar">
      <el-button type="primary" @click="initDialog({}, ADD_MODE)"
        :disabled="!hasBtnPermission('system.menu.add')">新建</el-button>
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
          v-for="item in [{label: '正常', value: NORMAL_STATE},{label: '禁用', value: DISABLED_STATE}]"
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
    @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="菜单名称" width="230"></el-table-column>
      <el-table-column label="图标" width="60">
        <template #default="scope">
          <i class="iconfont" v-html="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识"></el-table-column>
      <el-table-column prop="component" label="组件路径"></el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <div v-if="scope.row.status === NORMAL_STATE" class="rightStatus">正常</div>
          <div v-else class="wrongStatus">禁用</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable=""></el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-link class="iconfont operation" type="primary" @click="initDialog(scope.row, UPDATE_MODE)"
          :disabled="!hasBtnPermission('system.menu.update')"
          >
            <span class="ico">&#xe8cf;&nbsp;</span>
            修改
          </el-link>
          <el-link class="iconfont operation" type="primary" @click="initDialog(scope.row, ADD_MODE)"
          :disabled="!hasBtnPermission('system.menu.add')"
          >
            <span class="ico">&#xe611;&nbsp;</span>
            新增
          </el-link>
          <el-link class="iconfont operation" type="primary"
          :disabled="!hasBtnPermission('system.menu.delete')"
          @click="removeOneMenu(scope.row)">
            <span class="ico">&#xe610;&nbsp;</span>
            删除
          </el-link>
          
        </template>
      </el-table-column>
    </el-table>
    
    <el-button @click="batchRemoveMyMenus()" :disabled="!hasBtnPermission('system.menu.delete')">批量删除</el-button>

    <!-- 新建/修改弹窗 -->
    <teleport to="body">
      <el-dialog
        width="700"
        v-model="updateOrAddDialogVisible"
        :title="funMode === 0 ? '修改菜单' : '新增菜单'"
      >
        <el-form label-width="100px">
          <el-form-item label="上级菜单">
            <el-select v-model="checkedMenu.parentName" placeholder="请选择上级菜单" clearable>
              <template #empty>
                <el-tree
                :data="rootTree"
                :props="{
                  children: 'children',
                  label: 'name',
                }"
                node-key="id"
                @node-click="handleNodeClick"
                class="myTreeSelect"
                />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单类型">
            <el-radio-group v-model="checkedMenu.type">
              <el-radio :value="LIB_TYPE">目录</el-radio>
              <el-radio :value="MENU_TYPE">菜单</el-radio>
              <el-radio :value="BTN_TYPE">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图标" v-if="checkedMenu.type !== BTN_TYPE">
            <el-select placeholder="请选择图标" v-model="checkedMenu.icon" clearable>
              <el-option
                v-for="icon in allIcons"
                :key="icon.ico"
                :label="icon.namr"
                :value="icon.ico"
              >
                <div class="iconBox">
                  <i class="iconfont ico" v-html="icon.ico"></i>
                  <span>{{icon.name}}</span>
                </div>
              </el-option>
              <template #label>
                <div class="iconBox">
                  <i class="iconfont ico" v-html="checkedMenu.icon"></i>
                  <span>{{getIconName(checkedMenu.icon)}}</span>
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="checkedMenu.name"></el-input>
          </el-form-item>
          <el-form-item label="路由地址"  v-if="checkedMenu.type !== BTN_TYPE">
            <el-input v-model="checkedMenu.path"></el-input>
          </el-form-item>
          <el-form-item label="组件路径"  v-if="checkedMenu.type !== BTN_TYPE">
            <el-input v-model="checkedMenu.component"></el-input>
          </el-form-item>
          <el-form-item label="权限标识" v-if="checkedMenu.type === BTN_TYPE">
            <el-input v-model="checkedMenu.perms"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态" v-if="funMode === UPDATE_MODE">
            <el-radio-group v-model="checkedMenu.status">
              <el-radio :value="NORMAL_STATE">正常</el-radio>
              <el-radio :value="DISABLED_STATE">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="创建时间" v-if="funMode === UPDATE_MODE">
            <el-input v-model="checkedMenu.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="修改时间" v-if="funMode === UPDATE_MODE">
            <el-input v-model="checkedMenu.updateTime" disabled></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="updateOrAddMenu()" :loading="isLoadingBtn">保存</el-button>
          <el-button @click="updateOrAddDialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </teleport>
  </div>
</template>
  
<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, computed } from "vue";
import { getTreeMenus, removeOne, batchRemove, updateMenu, addMenu } from "@/api/menu";
import {
  useSimpleConfirm,
  useSuccessTip,
  useFailedTip,
} from "@/utils/msgTip.js";
import { isEmptyArr, deepCopy, isEmptyObj } from "@/utils/objUtil";
import { isSpace, removeSpace } from "@/utils/stringUtil";
import { 
  allIcons,
  getIconName,
  ADD_MODE,
  UPDATE_MODE,
  LIB_TYPE,
  MENU_TYPE,
  BTN_TYPE,
  NORMAL_STATE,
  DISABLED_STATE
} from '@/utils/service/staticData.js';
import { hasBtnPermission } from '@/utils/btnPermission';

const isLoadingBtn = ref(false)

// 当前正在操作的菜单
const checkedMenu = ref({
  parentId: 0
});
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(UPDATE_MODE);
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存勾选了的菜单
const handleMenus = ref([]);
// 存获取树型数据的请求
const treeReqData = ref({
  keyword: "",
  status: null,
});
// 存获取的树型菜单数据(条件查询)
const treeData = ref([]);

// 存所有的树型数据
const allTreeData = ref([])
// 确定根目录名称
const ROOT_NAME = '根目录'


function isChecked(){
  return funMode.value === ADD_MODE && (isSpace())
}

// 使用计算属性来获取带根节点的树型数据
const rootTree = computed(() => {
  return [{
    name: ROOT_NAME,
    id: 0,  
    children: [...allTreeData.value] // 使用展开运算符复制treeData.value，避免直接修改原始数据
  }];
})

/**
 * 选中上级节点后的操作
 * @param {Object} data 
 */
function handleNodeClick(data){
  checkedMenu.value.parentId = data.id
  checkedMenu.value.parentName = data.name
}


/**
 * 修改和新建的总方法
 */
const updateOrAddMenu = async () => {
  isLoadingBtn.value = true
  const menu = checkedMenu.value;
  let msg = "";
  if (funMode.value === UPDATE_MODE) {
    await updateMenu(menu);
    msg = `成功修改菜单 “${menu.name}”`;
  } else {
    await addMenu(menu);
    msg = "成功新建菜单";
  }
  getMyTreeData(); // 刷新页面
  updateOrAddDialogVisible.value = false;
  useSuccessTip(msg);
  isLoadingBtn.value = false
};

/**
 * 初始化弹窗
 * @param {Object} menu 操作的菜单
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(menu = {}, fun = UPDATE_MODE) {
  // TODO 确定父菜单
  if(fun === ADD_MODE){
    checkedMenu.value = {}
    const myMenu = checkedMenu.value
    if(isEmptyObj(menu)){
      myMenu.parentName = ROOT_NAME
      myMenu.parentId = 0
    }else{
      myMenu.parentName = menu.name
      myMenu.parentId = menu.id
    }
  }else{
    menu.parentName = isSpace(menu.parentName) ? ROOT_NAME : menu.parentName
    checkedMenu.value = deepCopy(menu);
  }
  funMode.value = fun;
  updateOrAddDialogVisible.value = true;
}

/**
 * 删除单个菜单
 * @param {Object} menu 待删除菜单
 */
function removeOneMenu(menu) {
  useSimpleConfirm(`你确定要删除菜单 “${menu.name}” 及其所有子菜单吗？`).then(
    async () => {
      await removeOne(menu.id);
      useSuccessTip(`成功删除菜单 “${menu.name}”`);
      getMyTreeData()
    }
  );
}

/**
 * 批量删除菜单
 */
function batchRemoveMyMenus() {
  if (isEmptyArr(handleMenus.value)) {
    useFailedTip("未选中菜单");
    return;
  }
  useSimpleConfirm("你确定要删除选中的所有菜单吗？").then(async () => {
    const idList = handleMenus.value.map((menu) => menu.id);
    // console.log(idList);
    await batchRemove(idList);
    useSuccessTip("成功删除选中的所有菜单");
    getMyTreeData();
  });
}

function handleSelectionChange(menus) {
  handleMenus.value = menus;
}

/**
 * 获取检索到的树型菜单数据
 */
const getMyTreeData = async () => {
  isLoadingTable.value = true;
  // 去除输入关键字中的空格
  treeReqData.value.keyword = removeSpace(treeReqData.value.keyword)
  let menuTree = await getTreeMenus(treeReqData.value);
  treeData.value = menuTree;
  isLoadingTable.value = false;
};

onMounted(() => {
  getMyTreeData().then(res=>{
    allTreeData.value = treeData.value
  })
});
</script>
  
<style lang="scss" scoped>
@import url("../../../assets/font/iconfont.css");
@import "../../../styles/commonFlexStyles.scss";
@import "../../../styles/common.scss";

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
.myTreeSelect{
  overflow: auto;
  max-height: 400px;
  font-weight: 550;
  @include myScrollbar;
}
.iconBox{
  @include flex-center-y;
  .ico{
    margin-right: 5px;
    
  }
}
.rightStatus,.wrongStatus{
    text-align: center;
    padding: 2px 4px;
    border-radius: 5px;
    border: 1px transparent solid;
}
.rightStatus{
  background: rgb(236,245,255);
  color: rgb(64,158,255);
  border-color: rgb(160,207,255);
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
  .el-form-item__label{
    font-weight: 550;
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