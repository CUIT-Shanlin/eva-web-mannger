<!-- 课程列表页面 -->
<template>
  <PageTitle content="课程列表" />
  <div class="courseListAllSty">
    <div class="funBar">
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
        <el-select
          clearable
          v-model="pageReqData.queryObj.departmentName"
          placeholder="请选择课程所在的学院名"
          @change="getMyPageData"
        >
          <el-option
            v-for="department in allDepartments"
            :key="department"
            :label="department"
            :value="department"
          />
        </el-select>
        <el-select
          clearable
          v-model="pageReqData.queryObj.templateId"
          placeholder="请选择课程模板"
          @change="getMyPageData"
        >
          <el-option
            v-for="template in allTemplates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          />
        </el-select>
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
      <el-table-column prop="name" label="课程名称" width="200" />
      <el-table-column prop="teacherMsg.name" label="教学老师" width="120" />
      <el-table-column prop="templateMsg.name" label="评教模板" width="250" />
      <el-table-column prop="teacherMsg.department" label="学院" width="200" />
      <el-table-column label="创建日期" width="220" sortable>
        <template #default="scope">
          {{ getTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-link
            class="operation"
            :disabled="!hasBtnPermission('course.tabulation.eva.query')"
            type="primary"
            @click="getThisEvaData(scope.row)"
          >
            评教统计
          </el-link>
          <el-link
            class="operation"
            type="primary"
            @click="goToMyRecord(scope.row)"
          >
            评教记录
          </el-link>
          <el-link
            class="operation"
            :disabled="!hasBtnPermission('course.tabulation.query')"
            type="primary"
            @click="initDialog(scope.row.id)"
          >
            课程详情
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="batchUpdateVisible = true" :disabled="!hasBtnPermission('course.template.update')">批量修改课程模板</el-button>

    <!-- 课程详情查看及修改弹窗 -->
    <el-dialog width="500" v-model="checkOrUpdateDialogVisible" append-to-body>
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="titleClass">
          <el-radio-group v-model="funMode" @change="changeMode()">
            <el-radio-button label="查看详情" :value="CHECK_MODE" />
            <el-radio-button label="修改信息" :value="UPDATE_MODE" />
          </el-radio-group>
        </div>
      </template>
      <el-form label-width="80px">
        <el-form-item label="课程名称">
          <el-input
            v-if="funMode === CHECK_MODE"
            v-model="checkedCourse.courseBaseMsg.name"
          ></el-input>
          <el-input v-model="updatedCourse.subjectMsg.name" v-else></el-input>
        </el-form-item>
        <el-form-item label="教学老师" v-if="funMode === CHECK_MODE">
          <el-input
            v-model="checkedCourse.courseBaseMsg.teacherMsg.name"
            v-if="funMode === CHECK_MODE"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程模板">
          <el-input
            v-model="checkedCourse.courseBaseMsg.templateMsg.name"
            v-if="funMode === CHECK_MODE"
          ></el-input>
          <el-select
            v-else
            clearable
            v-model="updatedCourse.templateId"
            placeholder="请选择课程模板"
          >
            <el-option
              v-for="template in allTemplates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程性质">
          <el-input
            :model-value="getNature(checkedCourse.courseBaseMsg.nature)"
            v-if="funMode === CHECK_MODE"
          ></el-input>
          <el-select
            v-else
            clearable
            v-model="updatedCourse.subjectMsg.nature"
            placeholder="请选择课程性质"
          >
            <el-option
              v-for="nature in allCourseNature"
              :key="nature.value"
              :label="nature.name"
              :value="nature.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-input
            :model-value="getTypeNameStr(checkedCourse.typeList)"
            v-if="funMode === CHECK_MODE"
          ></el-input>
          <el-select
            v-else
            v-model="updatedCourse.typeIdList"
            multiple
            filterable
            clearable
            placeholder="请输入课程类型名称"
          >
            <el-option
              v-for="courseType in allTypes"
              :key="courseType.id"
              :label="courseType.name"
              :value="courseType.id"
            />
          </el-select>
        </el-form-item>
        <el-alert
          type="info"
          show-icon
          :closable="false"
          v-if="funMode === UPDATE_MODE"
        >
          <p>
            同步修改：选中后，进行批量修改，将所有老师的该课程一起修改，慎重勾选。
          </p>
        </el-alert>
        <el-form-item label="同步修改" v-if="funMode === UPDATE_MODE">
          <el-radio-group v-model="updatedCourse.isUpdate">
            <el-radio :value="true" :border="true" size="small">是</el-radio>
            <el-radio :value="false" :border="true" size="small">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="课程教室" v-if="funMode === CHECK_MODE">
          <el-input
            :model-value="
              getClassroomStr(checkedCourse.courseBaseMsg.classroomList)
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="创建时间" v-if="funMode === CHECK_MODE">
          <el-input v-model="checkedCourse.courseBaseMsg.createTime"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" v-if="funMode === CHECK_MODE">
          <el-input v-model="checkedCourse.courseBaseMsg.updateTime"></el-input>
        </el-form-item>
        <el-form-item label="课程时间:" v-if="funMode === CHECK_MODE">
          <el-input
            type="textarea"
            :rows="5"
            :model-value="getDatesStr(checkedCourse.dateList)"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          v-if="funMode === UPDATE_MODE"
          type="primary"
          @click="updateMyCourse()"
          >保存</el-button
        >
        <el-button @click="checkOrUpdateDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 评分查询的弹窗 -->
    <el-dialog
      v-model="evaDataDialogVisible"
      width="1200"
      append-to-body
      :title="evaDataTitle"
    >
      <el-table :data="evaDataList">
        <el-table-column prop="prop" label="指标名称" width="565" />
        <el-table-column prop="averScore" label="平均分" width="200" />
        <el-table-column prop="minScore" label="最低分" width="200" />
        <el-table-column prop="maxScore" label="最高分" width="200" />
      </el-table>
      <template #footer>
        <el-button @click="evaDataDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 批量修改评教模板的弹窗 -->
    <el-dialog
      v-model="batchUpdateVisible"
      append-to-body
      title="批量修改课程模板中"
    >
      <div class="chooseBox">
        <el-select
          clearable
          v-model="changeTemplateId"
          placeholder="请选择要改成的课程模板"
          class="myChoose"
        >
          <el-option
            v-for="template in allTemplates"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          />
        </el-select>
      </div>

      <el-transfer
        v-model="handleCourseIds"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入课程名称或老师姓名"
        :data="allCourseMsg"
        :props="{
          key: 'id',
        }"
        :titles="['不进行修改的课程', '待修改模板的课程']"
        @change="handleChange"
        style="display: flex; justify-content: center; align-items: center"
      >
        <template #default="{ option }">
          <span>{{ option.name }} - {{ option.teacherName }}</span>
        </template>
      </el-transfer>

      <template #footer>
        <el-button
          type="primary"
          @click="batchUpdateMyTemplate()"
          :disabled="changeTemplateId == null"
          >保存</el-button
        >
        <el-button @click="batchUpdateVisible = false">取消</el-button>
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
  UPDATE_MODE,
  CHECK_MODE,
  THEORY_COURSE,
  OTHER_COURSE,
  allCourseNature,
} from "@/utils/service/staticData";
import {
  getPageData,
  getCourseEvaData,
  getOneCourseDetail,
  batchUpdateTemplate,
  getAllBaseCourse,
  updateCourse,
} from "@/api/courseList";
import { getAllType } from "@/api/courseType";
import { getAllDepartments } from "@/api/other";
import { getAllTemplates } from "@/api/template";
import { useSimpleConfirm, useSuccessTip } from "@/utils/msgTip.js";
import { deepCopy } from "@/utils/objUtil";
import { getChineseNum, getWeekByNum } from "@/utils/numUtil";
import { removeSpace } from "@/utils/stringUtil";
import { getTime } from "@/utils/dateUtil";
import { hasBtnPermission } from '@/utils/btnPermission';
import { useRouter } from "vue-router";

const router = useRouter();

// 用于确定当前弹窗的模式，修改还是查看
const funMode = ref(CHECK_MODE);

// 控制修改评教模板的弹窗的开关
const batchUpdateVisible = ref(false);

// 控制统计数据弹窗的开关
const evaDataDialogVisible = ref(false);
// 存当前展示的这门课程的评教的统计数据
const evaDataList = ref([]);
// 存统计数据弹窗的title
const evaDataTitle = ref("");
// 存已选中的课程id数组
const handleCourseIds = ref([]);
// 存用于统一修改的模板的id
const changeTemplateId = ref(null);

// 存所有的课程基础信息
const allCourseMsg = ref([]);

// 存所有课程类型的信息
const allTypes = ref([]);

// 存所有学院名
const allDepartments = ref([]);

// 存所有评教模板的基础信息
const allTemplates = ref([]);

// 当前正在操作的课程
const checkedCourse = ref({});
// 临时存的操作课程原始数据
const tempCourse = ref({});
const updatedCourse = ref({
  id: -1,
  subjectMsg: {
    name: "",
    nature: -1,
  },
  templateId: -1,
  typeIdList: [],
  isUpdate: false,
});

// 控制查看详情及修改弹窗的开启
const checkOrUpdateDialogVisible = ref(false);
// 是否正在加载表格
const isLoadingTable = ref(false);
// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    departmentName: "",
    templateId: null,
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
 * 进行修改课程信息
 */
const updateMyCourse = async () => {
  let res = await updateCourse(updatedCourse.value);
  useSuccessTip("成功修改课程信息");
  checkOrUpdateDialogVisible.value = false;
  getMyPageData()
};

/**
 * 切换模式之后进行的处理
 */
function changeMode() {
  if (funMode.value === CHECK_MODE) {
    // 查看详情的模式 =》 恢复原始数据
    checkedCourse.value = tempCourse.value;
  } else if (funMode.value === UPDATE_MODE) {
    // 修改的模式 =》 转换数据模型
    updatedCourse.value = changeCheckCourseToUpdateCourse(tempCourse.value);
  }
}

/**
 * @param originData 初始数据 即 用于查看的课程数据
 * @returns 用于修改的课程的数据模型
 */
function changeCheckCourseToUpdateCourse(originData = {}) {
  // 初始化修改的数据模型
  let updateCourse = {
    id: -1,
    subjectMsg: {
      name: "",
      nature: -1,
    },
    templateId: -1,
    typeIdList: [],
    isUpdate: false,
  };
  // TODO 根据查看详情的数据模型中的数据 填充 用于修改的数据模型的数据
  updateCourse.typeIdList = originData.typeList.map((type) => type.id);
  updateCourse.templateId = originData.courseBaseMsg.templateMsg.id;
  updateCourse.subjectMsg.name = originData.courseBaseMsg.name;
  updateCourse.id = originData.courseBaseMsg.id;
  updateCourse.subjectMsg.nature = originData.courseBaseMsg.nature;

  return updateCourse;
}

/**
 * 穿梭框的自定义过滤功能
 * @param {string} query 关键字
 * @param {*} item
 */
function filterMethod(query, item) {
  return (
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.teacherName.toLowerCase().includes(query.toLowerCase())
  );
}

function handleSelectionChange(courses = []) {
  handleCourseIds.value = courses.map((course) => course.id);
}

/**
 * 批量修改课程的评教模板
 */
function batchUpdateMyTemplate() {
  useSimpleConfirm("你确定要修改所有待修改课程的评教模板吗？").then(
    async () => {
      const idList = handleCourseIds.value;
      let res = await batchUpdateTemplate(idList, changeTemplateId.value.id);
      batchUpdateVisible.value = false;
      useSuccessTip("成功修改所有待修改课程的评教模板");
      getMyPageData();
    }
  );
}

function getNature(nature = 0) {
  if (nature === OTHER_COURSE) {
    return "其他";
  }
  return nature === THEORY_COURSE ? "理论课" : "实验课";
}

/**
 * 生成教室字符串的组合字符串，eg: 'H1201、H4120'
 * @param {Array} classroomArr 课程教室的字符串数组
 */
function getClassroomStr(classroomArr = []) {
  let str = "";
  let i = 0;
  classroomArr.forEach((classroom) => {
    if (i === 0) {
      str = classroom;
    } else {
      str = `${str}、${classroom}`;
    }
    i++;
  });
  return str;
}

/**
 * 生成课程时间的组合字符串
 * @param {Array} dateList 时间数组
 */
function getDatesStr(dateList = []) {
  let str = "";
  let i = 0;
  dateList.forEach((date) => {
    let oneTime = `${date.startWeek} - ${date.endWeek}周 星期${getWeekByNum(
      date.day
    )} 第${getChineseNum(date.startTime)}到${getChineseNum(date.endTime)}节课`;
    if (i === 0) {
      str = oneTime;
    } else {
      str = `${str}、\n\n${oneTime}`;
    }
    i++;
  });
  return str;
}

/**
 * 生成类型名称的组合字符串，eg: '编程类、实践类'
 * @param {Array} typeArr 课程类型类型数组
 */
function getTypeNameStr(typeArr = []) {
  let str = "";
  let i = 0;
  typeArr.forEach((type) => {
    if (i === 0) {
      str = type.name;
    } else {
      str = `${str}、${type.name}`;
    }
    i++;
  });
  return str;
}

/**
 * 跳转到 该门课程对应的评教记录页面
 * @param {Object} course 课程信息
 */
function goToMyRecord(course = {}) {
  router.push({
    path: "/evaluation/record",
    query: {
      courseId: course.id,
      teacherId: course.teacherMsg.id,
      department: course.teacherMsg.department,
    },
  });
}

/**
 * 加载该门课程的评教统计数据并打开弹窗
 * @param {Object} course 该门课程的基础信息
 */
const getThisEvaData = async (course) => {
  evaDataTitle.value = `${course.name}  ${course.teacherMsg.name}  ${course.teacherMsg.department}`;
  let res = await getCourseEvaData(course.id);
  evaDataList.value = res;
  evaDataDialogVisible.value = true;
};

/**
 * 初始化弹窗
 * @param {Number | string} courseId 操作课程的id
 */
const initDialog = async (courseId = -1) => {
  let res = await getOneCourseDetail(courseId);
  checkedCourse.value = res;
  tempCourse.value = deepCopy(res);
  checkOrUpdateDialogVisible.value = true;
};

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
  getAllDepartments().then((res) => {
    allDepartments.value = res;
  });
  getAllTemplates().then((res) => {
    allTemplates.value = res;
  });
  getAllBaseCourse().then((res) => {
    allCourseMsg.value = res;
  });
  getAllType().then((res) => {
    allTypes.value = res;
  });
});
</script>
    
<style lang="scss" scoped>
@import url("../../assets/font/iconfont.css");
@import "../../styles/commonFlexStyles.scss";

.courseListAllSty {
  background-color: #fff;
  overflow: auto;
  padding: 15px;
  .funBar {
    @include flex-center-y;
    justify-content: space-between;
    .iptFuns {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      column-gap: 10px;
    }
  }
  .tableBox {
    width: 100%;
    margin-top: 50px;
    margin-bottom: 35px;
  }
}
.chooseBox {
  @include flex-center;
  .myChoose {
    margin: 20px 0;
    width: 80%;
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
  .el-transfer-panel {
    width: auto;
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