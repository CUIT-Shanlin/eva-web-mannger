<!-- 查看全部未达标用户的页面 -->
<template>
  <PageTitle content="未达标用户列表" />
  <div class="userAllSty">
    <div class="funBar">
      <el-radio-group v-model="unqualifiedType" @change="getMyPageData" size="large">
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
          placeholder="请选择用户所在的专业名"
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
      <el-table-column prop="name" label="用户姓名" width="300"/>
      <el-table-column prop="department" label="专业名称" width="350"/>

      <el-table-column
        prop="num"
        :label="`${unqualifiedType === UNQUALIFIED_USER ? '被评教' : '评教'}已完成次数`"
        sortable
      />
      <el-table-column
        :label="`${unqualifiedType === UNQUALIFIED_USER ? '被评教' : '评教'}待完成次数`"
      >
        <template #default="scope">
          {{getMyStandard(unqualifiedType) - scope.row.num}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            class="iconfont operation"
            type="primary"
            @click="initDialog(scope.row)"
          >
            <span class="ico">&#xe64b;&nbsp;</span>
            发送提醒
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗 -->
    <el-dialog
      width="500"
      v-model="tipDialogVisible"
      title="发送信息提醒"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="接收者姓名">
          <el-input
            v-model="checkedUser.name"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="消息类型">
          <el-select
            clearable
            v-model="myMsg.type"
            placeholder="请选择消息类型"
          >
            <el-option
              v-for="type in allMsgTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发送内容">
          <el-input type="textarea" :rows="3" v-model="myMsg.msg"></el-input>
        </el-form-item>

        <el-form-item label="是否匿名">
          <el-radio-group v-model="myMsg.isShowName">
            <el-radio :value="false" >是</el-radio>
            <el-radio :value="true">否</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <template #footer>
        <el-button type="primary" @click="sendMyMsg()" :loading="isLoadingBtn">发送</el-button>
        <el-button @click="tipDialogVisible = false">取消</el-button>
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
import { ref, onMounted } from "vue";
import { getUnqulifiedPageData } from '@/api/user';
import { getAllDepartments } from "@/api/other";
import { sendMsg } from "@/api/msg";
import{
  EVA_UNQUALIFIED_USER,
  UNQUALIFIED_USER,
  COMMON_MSG_MODE,
  REMINDER_MSG,
  allMsgTypes,
}from '@/utils/service/staticData';
import { 
  getQulifiedStandards,
  getMyStandard,
} from '@/utils/service/userUtil';
import { removeSpace } from "@/utils/stringUtil";
import { useSuccessTip } from "@/utils/msgTip";
import { useUserStore } from '@/stores/userStore';
import pinia from '@/utils/pinia';

// 消息
const myMsg = ref({
  senderId: useUserStore(pinia).info.id,
  type: REMINDER_MSG,
  mode: COMMON_MSG_MODE,
  isShowName: true,
  recipientId: -1,
  msg: ''
})

const isLoadingBtn = ref(false)

// 确认当前选择的未达标用户是评教还是被评教
const unqualifiedType = ref(EVA_UNQUALIFIED_USER)

// 存所有专业名
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
 * 发送消息的具体操作
 */
const sendMyMsg = async()=>{
  isLoadingBtn.value = true
  await sendMsg(myMsg.value)
  useSuccessTip('成功发送提醒')
  isLoadingBtn.value = false
}

/**
 * 初始化弹窗
 * @param {Object} user 操作的用户
 */
function initDialog(user = {}) {
  checkedUser.value = user;
  // TODO 初始化消息数据
  myMsg.value.msg = `您本学期的${unqualifiedType.value === UNQUALIFIED_USER ? '被' : ''}评教次数不足，\n还差${getMyStandard(unqualifiedType.value) - user.num}次，请尽快完成~`
  myMsg.value.recipientId = user.id

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