<template>
  <el-container class="big-box">
    <el-main>
      <div class="header-bar">
        <div class="left-section">
          <div class="week-display">第 {{ currentWeek }} 周</div>
          <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            :disabledDate="disabledDate"
            @change="updateWeek"
          />
          <div class="clickBtn">
            <el-button type="primary" @click="showImportDialog = true" :disabled="!checkPermission('course.table.import')">批量导入</el-button>
            <el-button type="primary" @click="showCreateCourseDialog = true" :disabled="!checkPermission('course.table.add')">创建课程</el-button>
          </div>
        </div>
        <div class="right-section">
          <el-button @click="changeWeek(-1)" :disabled="currentWeek <= 1">
            <el-icon><ArrowLeftBold /></el-icon>
          </el-button>
          <el-button @click="changeWeek(1)" :disabled="currentWeek >= 20">
            <el-icon><ArrowRightBold /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="grid">
        <div class="header" v-for="day in days" :key="day">星期{{ getDayName(day) }}</div>
        <div v-for="(num, numIndex) in nums" :key="num" class="num-row">
          <div 
            v-for="(day, dayIndex) in days" 
            :key="day" 
            :class="['box', { selected: selectedBox && selectedBox.day === day && selectedBox.num === num }]"
            @click="selectBox({ day, num })"
          >
            {{ getClasses(numIndex, dayIndex) }}
          </div>
        </div>
      </div>
    </el-main>
    <CourseInfo 
      :selectedBox="selectedBox" 
      :nums="nums" 
      :currentWeek="currentWeek"
      @add-course="addCourse" 
      @edit-course="editCourse" 
      @delete-course="deleteCourse" 
    />
    <ImportDialog
      :visible="showImportDialog"
      v-model="showImportDialog"
      @close="showImportDialog = false"
      @import-success="handleImportSuccess" 
    />
    <CreateCourseDialog
      :visible="showCreateCourseDialog"
      v-model="showCreateCourseDialog"
      @close="showCreateCourseDialog = false"
      @create-success="handleCreateSuccess"
    />
  </el-container>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { ElContainer, ElMain, ElDatePicker, ElButton } from 'element-plus';
import 'element-plus/dist/index.css';
import CourseInfo from '../../components/CourseInfo.vue';
import ImportDialog from '../../components/ImportDialog.vue';
import CreateCourseDialog from '../../components/CreateCourseDialog.vue';
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue';
import { getWeekData, getClassTable, getClassDay } from '../../api/courseTable.js';
import { hasBtnPermission } from '@/utils/btnPermission';

const startTimes = ["8:20", "9:15", "10:20", "11:15", "14:00", "14:55", "16:00", "16:55", "19:30", "20:25", "21:20"];
const endTimes = ["9:05", "10:00", "11:05", "12:00", "14:45", "15:40", "16:45", "17:40", "20:15", "21:10", "22:05"];

const getCourseTime = (courseParam) => {
  const index = courseParam - 1;
  return {
    startTime: startTimes[index],
    endTime: endTimes[index]
  };
};

export default {
  components: {
    ElContainer,
    ElMain,
    ElDatePicker,
    ElButton,
    CourseInfo,
    ImportDialog,
    CreateCourseDialog,
    ArrowLeftBold,
    ArrowRightBold
  },
  setup() {
    const days = ["1", "2", "3", "4", "5", "6", "7"];
    const nums = ["1", "3", "5", "7", "9", "11"];

    const tableData = ref([]);
    const selectedBox = ref(null);
    const selectedDate = ref(null);
    const currentWeek = ref(1);
    const startDay = ref();
    const showImportDialog = ref(false);
    const showCreateCourseDialog = ref(false);

    const getStarDay = async () => {
      const response = await getClassDay(1, 1);
      startDay.value = response;
    };

    const disabledDate = (time) => {
      const start = new Date(startDay.value);
      const start1 = new Date(startDay.value);
      start1.setDate(start.getDate() - 1);
      const end = new Date(startDay.value);
      end.setDate(start.getDate() + 140);
      return time.getTime() < start1.getTime() || time.getTime() > end.getTime();
    };

    const fetchWeekData = async (week) => {
      const response = await getWeekData(week);
      tableData.value = response;
    };

    const selectBox = async (box) => {
      if (selectedBox.value && selectedBox.value.day === box.day && selectedBox.value.num === box.num) {
        selectedBox.value = null; // 再次点击相同的盒子，取消选中
      } else {
        try {
          const response = await getClassTable({ week: currentWeek.value, day: box.day, num: box.num });
          const coursesWithTimes = response.map(course => {
            const { startTime, endTime } = getCourseTime(course.time.startTime);
            return {
              ...course,
              startTime,
              endTime
            };
          });
          selectedBox.value = {
            ...box,
            courses: coursesWithTimes,
            hasCourse: coursesWithTimes.length > 0
          };
        } catch (error) {
          console.error('获取课程数据失败:', error);
        }
      }
    };

    const isBoxSelected = (day, num) => {
      return selectedBox.value && selectedBox.value.day === day && selectedBox.value.num === num;
    };

    const getClasses = (numIndex, dayIndex) => {
      // 检查 tableData.value 是否已经被正确赋值
      if (!tableData.value || tableData.value.length === 0) {
        return '';
      }
      return tableData.value[numIndex][dayIndex];
    };

    const updateWeek = () => {
      if (selectedDate.value) {
        const newWeek = getWeekNumber(selectedDate.value);
        currentWeek.value = newWeek;
        fetchWeekData(newWeek);
        updateUrlWithWeek(newWeek);
        selectedBox.value = null;
      }
    };

    const changeWeek = (direction) => {
      const newWeek = currentWeek.value + direction;
      if (newWeek >= 1 && newWeek <= 20) {
        currentWeek.value = newWeek;
        fetchWeekData(newWeek);
        updateUrlWithWeek(newWeek);
        selectedDate.value = null;
        selectedBox.value = null;
      }
    };

    const updateUrlWithWeek = (week) => {
      const url = new URL(window.location.href);
      url.searchParams.set('week', week);
      window.history.replaceState({}, '', url.toString());
    };

    const getWeekNumber = (date) => {
      const d = new Date(date);
      const start = new Date(startDay.value);
      const diffTime = Math.abs(d - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNo = Math.ceil(diffDays / 7);
      return weekNo;
    };

    const getDayName = (day) => {
      switch (day) {
        case "1": return "一";
        case "2": return "二";
        case "3": return "三";
        case "4": return "四";
        case "5": return "五";
        case "6": return "六";
        case "7": return "天";
        default: return "";
      }
    };

    const handleImportSuccess = () => {
      // 处理导入成功后的逻辑
      console.log('批量导入成功');
      showImportDialog.value = false;
    };

    const handleCreateSuccess = () => {
      // 处理创建成功后的逻辑
      console.log('创建课程成功');
      showCreateCourseDialog.value = false;
    };
    const checkPermission=(permission = '')=> {
      return hasBtnPermission(permission);
    };

    onMounted(async () => {
      await getStarDay();
      const urlParams = new URLSearchParams(window.location.search);
      const weekFromUrl = urlParams.get('week');
      if (weekFromUrl) {
        currentWeek.value = parseInt(weekFromUrl, 10);
      } else {
        const today = new Date();
        currentWeek.value = getWeekNumber(today);
      }
      fetchWeekData(currentWeek.value); // 页面加载时获取初始周的数据
    });

    watch(currentWeek, (newWeek) => {
      fetchWeekData(newWeek); // 当 currentWeek 改变时，获取新的周数据
    });

    return {
      days,
      nums,
      tableData,
      selectedBox,
      selectBox,
      isBoxSelected,
      getClasses,
      selectedDate,
      currentWeek,
      updateWeek,
      changeWeek,
      getDayName,
      getStarDay,
      showImportDialog,
      showCreateCourseDialog,
      handleImportSuccess,
      handleCreateSuccess,
      disabledDate,
      checkPermission
    };
  }
};
</script>

<style lang="scss" scoped>
.big-box{
  overflow: hidden;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); 
  grid-template-rows: repeat(7, auto); 
  gap: 20px;

  .header {
    font-weight: bold;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(228, 228, 228);
    border-radius: 10px;
    padding: 25px;
  }

  .num-row {
    display: contents; 

    .box {
      border: 1px solid #000;
      padding: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border 0.3s;
      border-radius: 15px;

      &.selected {
        border: 2px solid blue;
      }

      .time {
        font-size: 0.8em;
        color: #666;
        margin-top: 5px;
      }
    }
  }
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .left-section {
    display: flex;
    align-items: center;

    .week-display {
      font-size: 1.2em;
      font-weight: bold;
      margin-right: 15px;
    }
    .clickBtn{
      margin-left: 20px;
    }
  }

  .right-section {
    display: flex;
    gap: 10px;
  }
}
</style>
