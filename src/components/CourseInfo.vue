<template>
  <el-aside width="300px" v-if="selectedBox" class="el-side">
    <h3 class="title">课程信息</h3>
    <div v-if="selectedBox" class="selected-date">
      <div v-if="selectedBox.num<=6">
        <p><strong>已选中于{{ selectedDate }}的第{{selectedBox.num }},{{String(Number(selectedBox.num)+1)}}节课开始的课程</strong></p>
      </div>
      <div v-else-if="selectedBox.num>=7&&selectedBox.num<=9">
        <p><strong>已选中于{{ selectedDate }}的第{{selectedBox.num }},{{String(Number(selectedBox.num)+1)}},{{String(Number(selectedBox.num)+2)}}节课开始的课程</strong></p>
      </div>
      <div v-else-if="selectedBox.num>=10&&selectedBox.num<=11">
        <p><strong>已选中于{{ selectedDate }}的第{{selectedBox.num }},{{String(Number(selectedBox.num)+1)}}节课开始的课程</strong></p>
      </div>
      <div v-else>
        <p><strong>已选中于{{ selectedDate }}的第{{selectedBox.num }}节课开始的课程</strong></p>
      </div>
    </div>
    <el-scrollbar max-height="700px"> <!-- 使用 el-scrollbar 包裹课程数据部分 -->
      <div v-if="hasCourses">
        <div v-for="(course, index) in selectedBox.courses" :key="index" class="course-module">
          <div class="course-header">
            <span class="teacher-name">{{ course.teacherName }}</span>
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                点击操作...
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{ action: 'edit', course }" :disabled="!checkPermission('course.tabulation.update')">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'delete', course }" :disabled="!checkPermission('course.table.delete')">删除</el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'assigned', course }" :disabled="!checkPermission('course.table.assignEva')">分配听课</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="course-details">
            <p><strong>课程名称:</strong> {{ course.name }}</p>
            <p><strong>课程时间:</strong> {{`第${course.time.startTime}-${course.time.endTime}节(${formatTime(course.time.startTime, course.time.endTime)})`}}</p>
            <p><strong>课程教室:</strong> {{ course.location }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-course">
        <p>暂无课程</p>
      </div>
    </el-scrollbar>
    <el-dialog
      title="删除课程"
      v-model="showDeleteDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="deleteForm">
        <el-form-item label="是否批量删除">
          <el-radio-group v-model="deleteForm.isBatch">
            <el-radio :label="true" >是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="deleteForm.isBatch" label="开始周数">
          <el-input-number v-model="deleteForm.startWeek" :min="1" :max="20" />
        </el-form-item>
        <el-form-item v-if="deleteForm.isBatch" label="结束周数">
          <el-input-number v-model="deleteForm.endWeek" :min="1" :max="20" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmDelete" :disabled="!checkPermission('course.table.delete')">删除</el-button>
          <el-button @click="showDeleteDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="确认删除"
      v-model="showConfirmDeleteDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <p v-if="deleteForm.isBatch">
        是否删除<strong>{{ selectedCourse.teacherName }}</strong>的从第<strong>{{ deleteForm.startWeek }}</strong>周到第<strong>{{ deleteForm.endWeek }}</strong>周的<strong>{{selectedCourse.name}}</strong>课程？
      </p>
      <p v-else>
        是否删除<strong>{{ selectedCourse.teacherName }}</strong>第<strong>{{ currentWeek }}</strong>周的<strong>{{selectedCourse.name}}</strong>课程？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="executeDelete" :disabled="!checkPermission('course.table.delete')">确认删除</el-button>
          <el-button @click="showConfirmDeleteDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="修改课程"
      v-model="showEditDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="editForm">
        <el-form-item label="教室">
          <el-input v-model="editForm.location" />
        </el-form-item>
        <el-form-item label="周数">
          <el-input-number v-model="editForm.week" :min="1" :max="20"/>
        </el-form-item>
        <el-form-item label="星期">
          <el-select v-model="editForm.day">
            <el-option label="星期一" value="1" />
            <el-option label="星期二" value="2" />
            <el-option label="星期三" value="3" />
            <el-option label="星期四" value="4" />
            <el-option label="星期五" value="5" />
            <el-option label="星期六" value="6" />
            <el-option label="星期日" value="7" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始节数">
          <el-input-number v-model="editForm.startTime" :min="1" :max="11" />
        </el-form-item>
        <el-form-item label="结束节数">
          <el-input-number v-model="editForm.endTime" :min="1" :max="11" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="confirmEdit" :disabled="!checkPermission('course.tabulation.update')">确认</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="确认修改"
      v-model="showConfirmEditDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <p>
        是否将<strong>{{ selectedCourse.teacherName }}</strong>位于{{ selectedCourse.location}}教室第<strong>{{ currentWeek }}</strong>周星期<strong>{{ selectedBox.day }}</strong>从第<strong>{{ getLessonNumber(selectedCourse.time.startTime) }}</strong>节到第<strong>{{ getLessonNumber(selectedCourse.time.endTime) }}</strong>节的课程
      </p>
      <p>
        修改为位于{{editForm.location}}教室第<strong>{{ editForm.week }}</strong>周星期<strong>{{ editForm.day }}</strong>从第<strong>{{ editForm.startTime }}</strong>节到第<strong>{{ editForm.endTime }}</strong>节？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" :loading="isLoadingUpdateBtn" @click="executeEdit" :disabled="!checkPermission('course.tabulation.update')">确认</el-button>
          <el-button @click="showConfirmEditDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="分配听课"
      v-model="showAssignDialog"
      append-to-body
      width="50%"
      :before-close="handleClose"
    >
      <el-transfer
        v-model="selectedTeachers"
        :data="allTeachers"
        :titles="['所有教师', '已选教师']"
        :filterable="true"
        filter-placeholder="搜索教师"
        @change="handleTransferChange"
      ></el-transfer>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary"  @click="confirmAssign"  :disabled="!checkPermission('course.table.assignEva') || isArrayEmpty" >确认分配</el-button>
          <el-button @click="showAssignDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="确认分配"
      v-model="showConfirmAssignDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <p>
        是否将<strong>{{ selectedTeachersNames.join(', ') }}</strong>分配至<strong>{{ selectedCourse.name }}</strong>课程？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="executeAssign" :disabled="!checkPermission('course.table.assignEva')" :loading="isLoadingAssignBtn">确认分配</el-button>
          <el-button @click="showConfirmAssignDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-aside>
</template>

<script>
import { getClassDay, delClassData, changeClass, assignedTeacher } from '../api/courseTable.js';
import { getAllBaseUser } from '../api/user.js';
import { ElMessage, ElScrollbar } from 'element-plus';
import { hasBtnPermission  } from '@/utils/btnPermission';

export default {
  components: {
    ElScrollbar
  },
  props: {
    selectedBox: {
      type: Object,
      required: false
    },
    nums: {
      type: Array,
      required: true
    },
    currentWeek: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isLoadingUpdateBtn: false, // 修改课程的弹窗按钮的loading状态确认
      isLoadingAssignBtn: false, // 分配教师的弹窗按钮的loading状态确认
      showAddCourseDialog: false,
      dialogMode: 'add',
      courseForm: {
        name: '',
        teacherName: '',
        time: {
          startTime: 1,
          endTime: 1
        }
      },
      editingCourse: null,
      selectedDate: '',
      showDeleteDialog: false,
      showConfirmDeleteDialog: false,
      deleteForm: {
        isBatch: false,
        startWeek: 1,
        endWeek: 1
      },
      selectedCourse: null,
      showEditDialog: false,
      showConfirmEditDialog: false,
      editForm: {
        teacherName: '',
        location: '',
        time:{
        week: 1,
        day: 1,
        startTime: 1,
        endTime: 1
      }
      },
      showAssignDialog: false,
      showConfirmAssignDialog: false,
      allTeachers: [],
      selectedTeachers: [],
      selectedTeachersNames: []
    };
  },
  computed: {
    hasCourses() {
      return this.selectedBox && this.selectedBox.courses && this.selectedBox.day && this.selectedBox.courses.length > 0;
    },
    isArrayEmpty() {
      return this.selectedTeachers.length === 0;
    },
  },
  watch: {
    selectedBox: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.courseForm.time = newVal.time;
          this.fetchSelectedDate(this.currentWeek, newVal.day);
        }
      }
    }
  },
  methods: {
    handleCommand({ action, course }) {
      if (action === 'edit') {
        this.openEditDialog(course);
      } else if (action === 'delete') {
        this.selectedCourse = course;
        this.deleteForm.startWeek = this.currentWeek;
        this.deleteForm.endWeek = this.currentWeek;
        this.showDeleteDialog = true;
      } else if (action === 'assigned') {
        this.selectedCourse = course;
        this.fetchAllTeachers();
        this.showAssignDialog = true;
      }
    },
    openEditDialog(course) {
      this.selectedCourse = course;
      this.editForm = {
        teacherName: course.teacherName,
        location: course.location,
        week: course.week,
        day: course.day,
        startTime: course.time.startTime,
        endTime: course.time.endTime
      };
      this.showEditDialog = true;
    },
    confirmEdit() {
      this.showEditDialog = false;
      this.showConfirmEditDialog = true;
    },
    async executeEdit() {
      this.isLoadingUpdateBtn = true
      try {
        await changeClass({
          id: this.selectedCourse.id,
          location: this.editForm.location,
          time:{
          week: this.editForm.week,
          day: parseInt(this.editForm.day),
          startTime: this.editForm.startTime,
          endTime: this.editForm.endTime
          }
        });
        this.showConfirmEditDialog = false;
        this.$emit('edit-course', {
          ...this.selectedCourse,
          teacherName: this.editForm.teacherName,
          location: this.editForm.location,
          week: this.editForm.week,
          day: this.editForm.day,
          time: {
            startTime: this.editForm.startTime,
            endTime: this.editForm.endTime
          }
        });
        ElMessage({
          message: '修改成功',
          type: 'success',
        });
        window.location.reload();
      } catch (error) {
        console.error('修改课程失败:', error);
        ElMessage.error('修改失败');
      }
      this.isLoadingUpdateBtn = false
    },
    deleteCourse(course) {
      this.$emit('delete-course', course);
    },
    formatTime(startTime, endTime) {
      const startTimes = ["8:20", "9:15", "10:20", "11:15", "14:00", "14:55", "15:50", "16:45","17:40", "19:30", "20:25", "21:20"];
      const endTimes = ["9:05", "10:00", "11:05", "12:00", "14:45", "15:40", "16:35", "17:30","18:25", "20:15", "21:10", "22:05"];
      return `${startTimes[startTime - 1 < 0 ? 0 : startTime - 1]} - ${endTimes[endTime - 1 > endTimes.length - 1 ? endTimes.length - 1 : endTime - 1]}`;
    },
    getLessonNumber(time) {
      return time;
    },
    async fetchSelectedDate(week, day) {
      try {
        const response = await getClassDay(week, day);
        this.selectedDate = new Date(response).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (error) {
        console.error('获取选中日期失败:', error);
      }
    },
    confirmDelete() {
      this.showDeleteDialog = false;
      this.showConfirmDeleteDialog = true;
    },
    async executeDelete() {
      try {
        await delClassData(this.selectedCourse.id, {
          startWeek: this.deleteForm.startWeek,
          endWeek: this.deleteForm.endWeek,
          day: parseInt(this.selectedBox.day),
          startTime: this.selectedCourse.time.startTime,
          endTime: this.selectedCourse.time.endTime
        });
        this.showConfirmDeleteDialog = false;
        this.$emit('delete-course', this.selectedCourse);
        ElMessage({
          message: '删除成功',
          type: 'success',
        });
        window.location.reload();
      } catch (error) {
        console.error('删除课程失败:', error);
        ElMessage.error('删除失败');
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    checkPermission(permission = '') {
      return hasBtnPermission(permission);
    },
    async fetchAllTeachers() {
      try {
        const response = await getAllBaseUser();
        this.allTeachers = response.map(teacher => ({
          key: teacher.id,
          label: teacher.name
        }));
      } catch (error) {
        console.error('获取所有教师信息失败:', error);
        ElMessage.error('获取教师信息失败');
      }
    },
    handleTransferChange(value, direction, movedKeys) {
      if (direction === 'right') {
        this.selectedTeachersNames = this.allTeachers
          .filter(teacher => value.includes(teacher.key))
          .map(teacher => teacher.label);
      }
    },
    confirmAssign() {
      this.showAssignDialog = false;
      this.showConfirmAssignDialog = true;
    },
    async executeAssign() {
      this.isLoadingAssignBtn = true
      try {
        await assignedTeacher({
          id: this.selectedCourse.id,
          evaTeacherIdList: this.selectedTeachers
        });
        this.showConfirmAssignDialog = false;
        ElMessage({
          message: '分配成功',
          type: 'success',
        });
        this.selectedTeachers = [];
        this.selectedTeachersNames = [];
      } catch (error) {
        console.error('分配听课失败:', error);
        ElMessage.error('分配失败');
        this.selectedTeachers = [];
        this.selectedTeachersNames = [];
      }
      this.isLoadingAssignBtn = false
    }
  }
};
</script>

<style scoped>
.el-side {
  background-color: #ffffff;
  border-radius: 15px;
  overflow: hidden;
}
.course-module {
  border-bottom: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.teacher-name {
  font-weight: bold;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.course-details p {
  margin: 5px 0;
}

.no-course {
  text-align: center;
  font-style: italic;
  color: #999;
}
.title {
  text-align: center;
}
.selected-date {
  text-align: center;
  margin-bottom: 10px;
  color: #666;
  font-size: 12px;
}
</style>
