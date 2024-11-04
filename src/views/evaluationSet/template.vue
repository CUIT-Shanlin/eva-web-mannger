<!-- 评教模板页面 -->
<template>
  <PageTitle content="评教模板列表" />
  <div class="templateAllSty">
    <div class="funBar">
      <el-button type="primary" @click="initDialog({}, ADD_MODE)" :disabled="!hasBtnPermission('evaluate.template.add')">新建</el-button>
      <span class="iptFuns">
        <el-input
          v-model="pageReqData.queryObj.keyword"
          style="width: 260px"
          placeholder="请输入模板名称或描述"
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
      <el-table-column type="selection" width="50" :selectable="isNotDefaultTemplate"/>
      <el-table-column prop="name" label="模板名称" width="200" />
      <el-table-column prop="description" label="描述" width="400" />
      <el-table-column label="是否为默认模板" width="170">
        <template #default="scope">
          <span>{{getIsDefaultText(scope.row.isDefault)}}模板</span>
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
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-link
            class="iconfont operation"
            :disabled="!hasBtnPermission('evaluate.template.update')"
            type="primary"
            @click="initDialog(scope.row, UPDATE_MODE)"
          >
            编辑模板
          </el-link>
          <el-link
            class="iconfont operation"
            :disabled="!hasBtnPermission('evaluate.template.delete')"
            type="primary"
            @click="removeOneTemplate(scope.row)"
          >
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="batchRemoveMyTemplates()" :disabled="!hasBtnPermission('evaluate.template.delete')">批量删除</el-button>

    <!-- 新建/修改弹窗 -->
    <el-dialog
      v-model="updateOrAddDialogVisible"
      width="650"
      append-to-body
      :title="funMode === UPDATE_MODE ? '修改模板' : '新建模板'"
    >
      <el-form label-width="80px">
        <el-form-item label="模板名称">
          <el-input
            v-model="checkedTemplate.name"
            placeholder="请输入评教模板的名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="checkedTemplate.description"
            placeholder="请输入该模板描述信息"
          ></el-input>
        </el-form-item>
        <div class="myProp">
          <div class="propHeader">
            <span>指标名称</span>
            <span>操作</span>
          </div>
          <div class="propAll">
            <div class="propOne" v-for="(prop,index) in myProps" :key="index"
            :style="{marginBottom: index < myProps.length - 1 ? '30px' :''}">
                <el-input v-model="myProps[index]" size="large" style="width: 450px;"
                placeholder="请输入指标名称" @change="deelDuplicateName()"></el-input>
                <el-link disabledclass="operation" type="primary" @click="removeRow(prop)">删除</el-link>
            </div>
          </div>

        </div>
        <button class="addBtn" type="button" @click="addNewRow()">＋</button>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="updateOrAddRole()" :loading="isLoadingBtn" :disabled="!isChecked()">保存</el-button>
        <el-button @click="updateOrAddDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

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
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted, computed } from "vue";
import { getPageData, removeOne, batchRemove, updateTemplate, addTemplate } from "@/api/template";
import {
  useSimpleConfirm,
  useWarningConfirm,
  useSuccessTip,
  useFailedTip,
} from "@/utils/msgTip.js";
import {
  UPDATE_MODE,
  ADD_MODE,
  NOT_DEFAULT,
  allDefaultData
} from "@/utils/service/staticData";
import { isEmptyArr, deepCopy, addSuffixToDuplicates, removeSpaceStrToArr, isEmptyArrOrNull } from "@/utils/objUtil";
import { isSpace, removeSpace } from "@/utils/stringUtil";
import { formatDate } from '@/utils/dateUtil';
import { hasBtnPermission } from '@/utils/btnPermission';


const isLoadingBtn = ref(false)
// 当前正在操作的评教模板
const checkedTemplate = ref({props: JSON.stringify([]), name: ''});
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(UPDATE_MODE);
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存勾选了的评教模板
const handleTemplates = ref([]);
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


// 当前正在操作的指标
const myProps = ref([])

/**
 * 确认当前是否可以提交新建表单
 * @returns false: 不能提交; true: 可以提交
 */
function isChecked(){
  if(funMode.value === UPDATE_MODE){
    return true
  }
  try {
    const thisProps = myProps.value
    return !(isSpace(checkedTemplate.value.name) || isEmptyArr(thisProps) || isSpace(thisProps[0]))
  } catch (error) {
    return false
  }
}


/**
 * 确认是否不是默认模板
 * @param {Obeject} data 传入的模板对象
 */
function isNotDefaultTemplate (data){
  return data.isDefault + '' === NOT_DEFAULT + ''
}

/**
 * 获取是否是默认模板的文本
 * @param {Number|String} isDefault 
 */
function getIsDefaultText(isDefault = -1){
  return allDefaultData.find(data => data.value + '' === isDefault + '').label
}

/**
 * 移除一个指标（仅作用于页面数据）
 * @param {string} str 指标名称
 */
function removeRow(str){
  myProps.value = myProps.value.filter(item => item !== str)
}

/**
 * 新建一个新的空指标
 */
function addNewRow(){
  if(isEmptyArrOrNull(myProps.value)){
    myProps.value = []
  }
    myProps.value.push('')
    deelDuplicateName()
}

/**
 * 处理重名的情况
 */
function deelDuplicateName(){
    myProps.value = addSuffixToDuplicates(myProps.value)
}

/**
 * 修改和新建的总方法
 */
const updateOrAddRole = async () => {
  isLoadingBtn.value = true
  const template = checkedTemplate.value;
  let msg = "";
  // 去除空白指标
  checkedTemplate.value.props = JSON.stringify(removeSpaceStrToArr(myProps.value))
  if (funMode.value === UPDATE_MODE) {
    delete template.isDefault
    await updateTemplate(template);
    msg = `成功修改模板 “${template.name}”`;
  } else {
    delete template.isDefault
    await addTemplate(template);
    msg = "成功新建模板";
  }
  getMyPageData(); // 刷新页面
  updateOrAddDialogVisible.value = false;
  useSuccessTip(msg);
  isLoadingBtn.value = false
};

/**
 * 初始化弹窗
 * @param {Object} template 操作的评教模板
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(template = {props: JSON.stringify([]), name: ''}, fun = UPDATE_MODE) {
  funMode.value = fun;
  try{
    myProps.value = JSON.parse(template.props)
  }catch{
    myProps.value = ['']
  }
  checkedTemplate.value = deepCopy(template);
  updateOrAddDialogVisible.value = true;
}

/**
 * 删除单个模板
 * @param {Object} template 待删除模板消息
 */
function removeOneTemplate(template) {
  // TODO 确定该模板是否允许被删除
  if (!isNotDefaultTemplate(template)) {
    useWarningConfirm(
      "默认模板不允许被删除！"
    );
    return;
  }
  useSimpleConfirm(`你确定要删除评教模板 “${template.name}” 吗？`).then(
    async () => {
      await removeOne(template.id);
      useSuccessTip(`成功删除评教模板 “${template.name}”`);
      getMyPageData()
    }
  );
}

/**
 * 批量删除评教模板
 */
function batchRemoveMyTemplates() {
  if (isEmptyArr(handleTemplates.value)) {
    useFailedTip("未选中评教模板");
    return;
  }
  useSimpleConfirm("你确定要删除所有选中的评教模板吗？").then(async () => {
    const idList = handleTemplates.value.map((template) => template.id);
    console.log(idList);
    let res = await batchRemove(idList);
    useSuccessTip("成功删除选中评教模板");
    getMyPageData();
  });
}

function handleSelectionChange(roles) {
  handleTemplates.value = roles;
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
 * 获取分页模板信息
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
@import url("../../assets/font/iconfont.css");
@import "../../styles/commonFlexStyles.scss";
@import "../../styles/common.scss";
@import "../../styles/globalPage.scss";

.templateAllSty {
  background-color: #fff;
  overflow: auto;
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
    overflow: auto;
  }
}
$table-th-color: rgb(250, 250, 250);
.myProp{
    .propHeader, .propOne{
        @include flex-center-y;
        justify-content: space-between;
    }
    .propHeader{
        padding: 20px 15px;
        margin-bottom: 15px;
    }
    .propAll{
        max-height: 300px;
        overflow: auto;
        @include myScrollbar;
    }
    .propOne{
        padding-right: 15px;
    }
}
/**.addBtn */

.addBtn{
    margin-top: 15px;
    border: 0;
    font-size: 25px;
    background-color: $table-th-color;
    box-shadow: $small-box-shadow;
    cursor: pointer;
    &:hover{
        background: rgb(245, 242, 242);
    }
    &:active{
        background: rgb(238, 223, 223);
    }
}
/**.addBtn */

.myPage {
  float: right;
}
:deep() {
  th.el-table__cell, .propHeader {
    font-size: 15px;
    font-weight: 500;
    color: black;
    background-color: $table-th-color;
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