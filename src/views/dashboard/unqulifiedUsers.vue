<!-- 查看全部未达标用户的页面 -->
<template>
  <PageTitle content="未达标用户列表" />
  <div class="userAllSty">
    <div class="funBar">
      <el-radio-group v-model="unqualifiedType" @change="getMyUnqualifiedUsers" size="large">
        <el-radio-button label="评教" :value="EVA_UNQUALIFIED_USER" />
        <el-radio-button label="被评" :value="UNQUALIFIED_USER" />
      </el-radio-group>
      <span class="iptFuns">
        <el-input
          v-model="pageReqData.queryObj.keyword"
          style="width: 260px"
          placeholder="请输入用户姓名"
          clearable
          @change="getMyPageData"
        >
          <template #append>
            <el-button :icon="Search" @click="getMyPageData()" />
          </template>
        </el-input>
        <el-select
          clearable
          v-model="pageReqData.queryObj.departmentName"
          placeholder="请选择用户所在的学院名"
          @change="getMyPageData"
        >
          <el-option
            v-for="department in allDepartments"
            :key="department"
            :label="department"
            :value="department"
          />
        </el-select>
      </span>
    </div>

    <el-table
      :data="pageData.records"
      v-loading="isLoadingTable"
      class="tableBox"
    >
      <el-table-column prop="name" label="用户姓名" width="350"/>
      <el-table-column prop="department" label="学院名称" width="400"/>

      <el-table-column
        prop="num"
        :label="`${unqualifiedType === UNQUALIFIED_USER ? '被评教' : '评教'}已完成次数`"
        sortable
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            class="iconfont operation"
            type="primary"
            @click="removeOneType(scope.row)"
          >
            <span class="ico">&#xe610;&nbsp;</span>
            发送提醒
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <teleport to="body">
      <el-dialog
        width="500"
        v-model="tipDialogVisible"
        title="发送信息提醒"
      >
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input
              v-model="checkedUser.name"
              placeholder="请输入类型名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="checkedUser.description"
              placeholder="请输入该课程类型描述信息"
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary">发送</el-button>
          <el-button @click="tipDialogVisible = false">取消</el-button>
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
import { Search } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { getUnqulifiedPageData } from '@/api/user';
import { getAllDepartments } from "@/api/other";
import{
  EVA_UNQUALIFIED_USER,
  UNQUALIFIED_USER,
}from '@/utils/service/staticData';
import { getQulifiedStandards } from '@/utils/service/userUtil';
import { deepCopy } from "@/utils/objUtil";
import { removeSpace } from "@/utils/stringUtil";

// 确认当前选择的未达标用户是评教还是被评教
const unqualifiedType = ref(EVA_UNQUALIFIED_USER)

// 存所有学院名
const allDepartments = ref([]);

// 当前正在操作的用户
const checkedUser = ref({});

// 控制弹窗的开启
const tipDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);

// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    departmentName: ''
  },
});
// 存分页获取的数据
const pageData = ref({
  total: 0,
  size: 0,
  current: 1,
  records: [],
});


/**
 * 初始化弹窗
 * @param {Object} user 操作的用户
 */
function initDialog(user = {}) {
  funMode.value = fun;
  checkedUser.value = deepCopy(user);
  tipDialogVisible.value = true;
}

/**
 * 获取分页未达标用户信息
 */
const getMyPageData = async () => {
  isLoadingTable.value = true;
  const queryObj = pageReqData.value.queryObj;
  queryObj.keyword = removeSpace(queryObj.keyword);
  let res = await getUnqulifiedPageData( unqualifiedType.value, getQulifiedStandards[unqualifiedType.value], pageReqData.value);
  pageData.value = res;
  isLoadingTable.value = false;
};

onMounted(() => {
  getMyPageData();
  getAllDepartments().then((res) => {
    allDepartments.value = res;
  });
});
</script>
    
<style lang="scss" scoped>
@import url("../../assets/font/iconfont.css");
@import "../../styles/commonFlexStyles.scss";

.userAllSty{
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