<!-- 课程列表页面 -->
<template>
  <PageTitle content="课程列表" />
  <div class="typeAllSty">
    <div class="funBar">
      <el-button type="primary" @click="initDialog({}, 1)">新建</el-button>
      <span class="iptFuns">
        <el-input
          v-model="pageReqData.queryObj.keyword"
          style="width: 260px"
          placeholder="请输入课程名称"
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
      <el-table-column prop="name" label="课程名称" width="200"/>
      <el-table-column prop="teacherMsg.name" label="教学老师" width="120" />
      <el-table-column prop="templateMsg.name" label="评教模板" width="300" />
      <el-table-column prop="teacherMsg.department" label="学院" width="200" />
      <el-table-column
        label="创建日期"
        width="220"
        sortable
      >
        <template #default="scope">
          {{getTime(scope.row.createTime)}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            class="operation"
            type="primary"
            @click="getThisEvaData(scope.row)"
          >
            评教统计
          </el-link>
          <el-link
            class="operation"
            type="primary"
            @click="removeOneType(scope.row)"
          >
            评教记录
          </el-link>
          <el-link
            class="operation"
            type="primary"
            @click="initDialog(scope.row, 0)"
          >
            课程详情
          </el-link>
          
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建/修改弹窗 -->
    <el-dialog
      width="500"
      v-model="updateOrAddDialogVisible"
      append-to-body
      :title="funMode === 0 ? '修改课程类型' : '新建课程类型'"
    >
      <el-form label-width="80px">
        <el-form-item label="姓名">
          <el-input
            v-model="checkedType.name"
            placeholder="请输入类型名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="checkedType.description"
            placeholder="请输入该课程类型描述信息"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间" v-if="funMode === 0">
          <el-input v-model="checkedType.createTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改时间" v-if="funMode === 0">
          <el-input v-model="checkedType.updateTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="updateOrAddType()">保存</el-button>
        <el-button @click="updateOrAddDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 评分查询的弹窗 -->
    <el-dialog v-model="evaDataDialogVisible"
      width="1000"
      append-to-body
      :title="evaDataTitle"
    >
      <el-table :data="evaDataList">
          <el-table-column prop="prop" label="指标名称" width="365" />
          <el-table-column prop="averScore" label="平均分" width="200" />
          <el-table-column prop="minScore" label="最低分" width="200"/>
          <el-table-column prop="maxScore" label="最高分" width="200"/>
      </el-table>
      <template #footer>
        <el-button @click="evaDataDialogVisible = false">关闭</el-button>
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
import {
  batchRemove,
  removeOne,
  updateType,
  addType,
} from "@/api/courseType";
import {
  getPageData,
  getCourseEvaData
} from '@/api/courseList';
import {
  useSimpleConfirm,
  useSuccessTip,
} from "@/utils/msgTip.js";
import { isEmptyArr, deepCopy } from "@/utils/objUtil";
import { removeSpace } from "@/utils/stringUtil";
import { getTime } from "@/utils/dateUtil";
import { useRouter } from "vue-router";

const router = useRouter();

// 控制统计数据弹窗的开关
const evaDataDialogVisible = ref(false)
// 存当前展示的这门课程的评教的统计数据
const evaDataList = ref([])
// 存统计数据弹窗的title
const evaDataTitle = ref('')

// 当前正在操作的课程类型
const checkedType = ref({});
// 控制弹窗功能 0: 修改，1：新建
const funMode = ref(0);
// 控制弹窗的开启
const updateOrAddDialogVisible = ref(false);
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
const updateTimeArr = ref([]);
// 存创建日期对应数组
const createTimeArr = ref([]);

/**
 * 加载该门课程的评教统计数据并打开弹窗
 * @param {Object} course 该门课程的基础信息
 */
const getThisEvaData = async(course) => {
  evaDataTitle.value = `${course.name}  ${course.teacherMsg.name}  ${course.teacherMsg.department}`
  let {dataArr} = await getCourseEvaData(course.id)
  evaDataList.value = dataArr
  evaDataDialogVisible.value = true
}

/**
 * 修改和新建的总方法
 */
const updateOrAddType = async () => {
  const type = checkedType.value;
  let msg = "";
  if (funMode.value === 0) {
    let res = await updateType(type);
    msg = `成功修改课程类型 “${type.name}”`;
  } else {
    let res = await addType(type);
    msg = "成功新建课程类型";
  }
  getMyPageData(); // 刷新页面
  updateOrAddDialogVisible.value = false;
  useSuccessTip(msg);
};

/**
 * 初始化弹窗
 * @param {Object} type 操作的课程类型
 * @param {Number} fun 弹窗功能 0：修改，1：新建
 */
function initDialog(type = {}, fun = 0) {
  funMode.value = fun;
  checkedType.value = deepCopy(type);
  updateOrAddDialogVisible.value = true;
}

/**
 * 删除单个课程类型
 * @param {Object} type 待删除课程类型
 */
function removeOneType(type) {
  useSimpleConfirm(`你确定要删除课程类型 “${type.name}” 吗？`).then(
    async () => {
      let res = await removeOne(type);
      useSuccessTip(`成功删除课程类型 “${type.name}”`);
    }
  );
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
 * 获取分页课程列表信息
 */
const getMyPageData = async () => {
  isLoadingTable.value = true;
  const queryObj = pageReqData.value.queryObj;
  queryObj.keyword = removeSpace(queryObj.keyword);
  queryObj.startCreateTime = createTimeArr[0];
  queryObj.endCreateTime = createTimeArr[1];
  queryObj.startUpdateTime = updateTimeArr[0];
  queryObj.endUpdateTime = updateTimeArr[1];
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

.typeAllSty {
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