<!-- 评教任务页面 -->
<template>
  <PageTitle content="评教任务列表" />
  <div class="taskAllSty">
    <div class="funBar">
      <div class="taskTypeAll">
        <div :class="{statusOne: true,chooseStatus: statusOne.value === pageReqData.queryObj.taskStatus}"
          v-for="statusOne in allTaskStatus" :key="statusOne.value"
          @click="changeChooseStatus(statusOne)"
        >
          {{statusOne.label}}
        </div>
      </div>
      <span class="iptFuns">
        <el-input
          v-model="pageReqData.queryObj.keyword"
          style="width: 260px"
          placeholder="请输入评教的课程名称"
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
      </span>
    </div>

    <el-table
      :data="pageData.records"
      v-loading="isLoadingTable"
      class="tableBox"
    >
      <el-table-column prop="evaTeacherName" label="评教老师" width="200" />
      <el-table-column prop="courseName" label="评教课程" width="300" />
      <el-table-column prop="teacherName" label="教学老师" width="200" />

      <el-table-column label="任务状态" width="150">
        <template #default="scope">
          <el-tag
            :type="
              allTaskStatus.find((item) => item.value === scope.row.status).type
            "
          >
            {{
              allTaskStatus.find((item) => item.value === scope.row.status)
                .label
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建日期"
        width="220"
        sortable
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            class="iconfont operation"
            :disabled="!hasBtnPermission('evaluate.task.query')"
            type="primary"
            @click="initDialog(scope.row)"
          >
            查看详情
          </el-link>
          <el-link
            class="iconfont operation"
            :disabled="!hasBtnPermission('msg.tips.send')"
            type="info"
            @click="initMsgDialog(scope.row)"
            v-if="scope.row.status === PENDING_TASK"
          >
            发送提醒
          </el-link>
          <el-link
            class="iconfont operation"
            type="danger"
            :disabled="!hasBtnPermission('evaluate.task.cancel')"
            @click="cancelMyTask(scope.row)"
            v-if="scope.row.status === PENDING_TASK"
          >
            撤回任务
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 发送消息的弹窗 -->
    <el-dialog
      width="500"
      v-model="msgDialogVisible"
      title="发送信息提醒"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="评教老师">
          <el-input v-model="checkedTask.evaTeacherName" disabled></el-input>
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
            <el-radio :value="false">是</el-radio>
            <el-radio :value="true">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="sendMyMsg()" :loading="isLoadingBtn">发送</el-button>
        <el-button @click="msgDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 任务详情弹窗 -->
    <el-dialog
      width="500"
      v-model="detailDialogVisible"
      title="任务详情"
      append-to-body
    >
      <el-form label-width="100px">
        <el-form-item label="评教老师">
          <el-input :model-value="checkedTask.evaTeacherName"></el-input>
        </el-form-item>
        <el-form-item label="评教课程">
          <el-input :model-value="checkedTask.courseName"></el-input>
        </el-form-item>
        <el-form-item label="教学老师">
          <el-input :model-value="checkedTask.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="任务状态">
            <el-tag
            :type="
              allTaskStatus.find((item) => item.value === checkedTask.status).type
            "
          >
            {{
              allTaskStatus.find((item) => item.value === checkedTask.status).label
            }}
          </el-tag>
        </el-form-item>
        <el-form-item label="上课时间">
          <el-input :model-value="getCourseTime(checkedTask.courseTime)"></el-input>
        </el-form-item>
        <el-form-item label="上课教室">
          <el-input :model-value="checkedTask.location"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input :model-value="checkedTask.createTime"></el-input>
        </el-form-item>
        <el-form-item label="修改时间">
          <el-input :model-value="checkedTask.updateTime"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
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
import { sendMsg } from '@/api/msg';
import { 
  getPageData,
  cancelOneTask,
  getOneTask,
} from "@/api/evaTask";
import {
  useSimpleConfirm,
  useSuccessTip,
  useFailedTip,
} from "@/utils/msgTip.js";
import {
  PENDING_TASK,
  allTaskStatus,
  allMsgTypes,
  EVA_MSG_MODE,
  REMINDER_MSG,
} from "@/utils/service/staticData";
import { removeSpace } from "@/utils/stringUtil";
import {
  getWeekByNum,
} from '@/utils/numUtil';
import { hasBtnPermission } from '@/utils/btnPermission';
import { useUserStore } from "@/stores/userStore";
import pinia from "@/utils/pinia";


const isLoadingBtn = ref(false)
// 消息对象
const myMsg = ref({
  senderId: useUserStore(pinia).info.id,
  type: REMINDER_MSG,
  mode: EVA_MSG_MODE,
  isShowName: true,
  recipientId: -1,
  taskId: -1,
  msg: "",
});

// 控制消息弹窗的开关
const msgDialogVisible = ref(false);

// 当前正在操作的评教任务
const checkedTask = ref({});

// 控制详情弹窗的开启
const detailDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);

// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    startCreateTime: null,
    endCreateTime: null,
    taskStatus: -1,
  },
});
// 存分页获取的数据
const pageData = ref({
  total: 0,
  size: 10,
  current: 1,
  records: [],
});

// 存创建日期对应数组
const createTimeArr = ref([]);

/**
 * 改变任务状态
 * @param {*} statusOne 
 */
function changeChooseStatus(statusOne){
  pageReqData.value.queryObj.taskStatus = statusOne.value
  getMyPageData()
}

/**
 * 通过time对象获取课程的文本时间
 * @param {Object} time 
 */
function getCourseTime(time = {}){
  return `第${time.week}周 星期${getWeekByNum(time.day)} 第${time.startTime}-${time.endTime}节课`
}

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
 * 初始化消息弹窗
 * @param {Object} task 任务信息
 */
function initMsgDialog(task) {
  checkedTask.value = task;
  myMsg.value.taskId = task.id;
  myMsg.value.msg = `请您尽快完成对“${task.teacherName}老师”的\n${task.courseName}课程的评教~`;
  msgDialogVisible.value = true;
}

/**
 * 初始化详情弹窗
 * @param {Object} task 操作的评教任务
 */
const initDialog = async(task = {})=>{
  let data = await getOneTask(task.id)
  checkedTask.value = data;
  detailDialogVisible.value = true;
}

/**
 * 取消一个评教任务
 * @param {Object} task 待取消的评教任务
 */
function cancelMyTask(task) {
  useSimpleConfirm("你确定要取消该评教任务吗？").then(async () => {
    await cancelOneTask(task.id);
    useSuccessTip("成功取消该评教任务");
    getMyPageData();
  });
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
 * 获取分页评教任务信息
 */
const getMyPageData = async () => {
  isLoadingTable.value = true;
  const queryObj = pageReqData.value.queryObj;
  queryObj.keyword = removeSpace(queryObj.keyword);
  queryObj.startCreateTime = createTimeArr[0];
  queryObj.endCreateTime = createTimeArr[1];
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
@import "../../styles/globalPage.scss";

.taskAllSty {
  background-color: #fff;
  overflow: auto;
  padding: 15px;
  .funBar {
    @include flex-center-y;
    justify-content: space-between;
    .taskTypeAll{
      @include flex-center-y;
      .statusOne{
        user-select: none;
        cursor: pointer;
        padding: 7px 20px;
        border-bottom: 1.5px transparent solid;
        color: rgb(140,140,140);
        font-size: 15px;
        &:hover{
          background-color: $main-back-color;
        }
      }
      .statusOne:active, .chooseStatus{
        color: $main-show-color;
      }
      .chooseStatus{
        border-bottom-color: $main-show-color;
      }
    }
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