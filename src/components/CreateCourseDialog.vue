<template>
    <el-dialog
      title="创建课程"
      :visible="visible"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-radio-group v-model="createType">
        <el-radio label="new">在新课程中添加</el-radio>
        <el-radio label="existing">在已有课程添加</el-radio>
      </el-radio-group>
      <div v-if="createType === 'new'">
        <!-- 创建新课程的表单 -->
        <el-form :model="newCourseForm">
          <el-form-item label="课程名称">
            <el-select
              v-model="newCourseForm.subjectId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="fetchSubjects"
              :loading="loading"
            >
              <el-option
                v-for="subject in subjects"
                :key="subject.id"
                :label="subject.name"
                :value="subject.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="教师名称">
            <el-select
              v-model="newCourseForm.teacherId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="fetchTeachers"
              :loading="loading"
            >
              <el-option
                v-for="teacher in teachers"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程性质">
            <el-select v-model="newCourseForm.courseNature">
              <el-option
                v-for="nature in courseNatures"
                :key="nature.value"
                :label="nature.name"
                :value="nature.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="评教模板">
            <el-select v-model="newCourseForm.templateId">
              <el-option
                v-for="template in templates"
                :key="template.id"
                :label="template.name"
                :value="template.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型">
          <el-select v-model="newCourseForm.courseTypeIds" multiple>
            <el-option
              v-for="type in courseTypes"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
          <el-form-item label="时段">
            <div v-for="(timeSlot, index) in existingCourseForm.timeSlots" :key="index">
              <el-form-item label="周数">
                <el-select
                  v-model="timeSlot.weeks"
                  multiple
                  placeholder="选择周数"
                >
                  <el-option
                    v-for="week in weeks"
                    :key="week"
                    :label="week"
                    :value="week"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="星期数">
                <el-select v-model="timeSlot.day" placeholder="选择星期数">
                  <el-option
                    v-for="day in days"
                    :key="day.value"
                    :label="day.label"
                    :value="day.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="时间">
                <el-select v-model="timeSlot.startTime" placeholder="选择开始时间">
                  <el-option
                    v-for="(time, idx) in times"
                    :key="idx + 1"
                    :label="time.startTime"
                    :value="idx + 1"
                  />
                </el-select>
                <el-select v-model="timeSlot.endTime" placeholder="选择结束时间">
                  <el-option
                    v-for="(time, idx) in times"
                    :key="idx + 1"
                    :label="time.endTime"
                    :value="idx + 1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="教室">
                <el-input v-model="timeSlot.classroom" placeholder="输入教室" />
              </el-form-item>
              <el-button @click="removeTimeSlot(index)">删除时段</el-button>
            </div>
            <el-button @click="addTimeSlot">添加时段</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <!-- 创建已有课程的表单 -->
        <el-form :model="existingCourseForm">
          <el-form-item label="课程名">
            <el-select
              v-model="existingCourseForm.courseId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="fetchCourses"
              :loading="loading"
            >
              <el-option
                v-for="course in existingCourses"
                :key="course.id"
                :label="`${course.name} -- ${course.teacherName}`"
                :value="course.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时段">
            <div v-for="(timeSlot, index) in existingCourseForm.timeSlots" :key="index">
              <el-form-item label="周数">
                <el-select
                  v-model="timeSlot.weeks"
                  multiple
                  placeholder="选择周数"
                >
                  <el-option
                    v-for="week in weeks"
                    :key="week"
                    :label="week"
                    :value="week"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="星期数">
                <el-select v-model="timeSlot.day" placeholder="选择星期数">
                  <el-option
                    v-for="day in days"
                    :key="day.value"
                    :label="day.label"
                    :value="day.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="时间">
                <el-select v-model="timeSlot.startTime" placeholder="选择开始时间">
                  <el-option
                    v-for="(time, idx) in times"
                    :key="idx + 1"
                    :label="time.startTime"
                    :value="idx + 1"
                  />
                </el-select>
                <el-select v-model="timeSlot.endTime" placeholder="选择结束时间">
                  <el-option
                    v-for="(time, idx) in times"
                    :key="idx + 1"
                    :label="time.endTime"
                    :value="idx + 1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="教室">
                <el-input v-model="timeSlot.classroom" placeholder="输入教室" />
              </el-form-item>
              <el-button @click="removeTimeSlot(index)">删除时段</el-button>
            </div>
            <el-button @click="addTimeSlot">添加时段</el-button>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="createCourse" :disabled="!checkPermission('course.table.add')">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { ElDialog, ElRadioGroup, ElRadio, ElForm, ElFormItem, ElInput, ElTimePicker, ElSelect, ElOption, ElButton, ElMessage} from 'element-plus';
  import { createClass, createNewClass } from '../api/courseTable.js';
  import { getAllBaseCourse, getAllBaseSubject } from '../api/courseList.js';
  import { getAllBaseUser } from '../api/user.js';
  import { getAllType } from '../api/courseType.js';
  import { getAllTemplates } from '../api/template.js';
  import { allCourseNature, THEORY_COURSE, LAB_COURSE, OTHER_COURSE } from '../utils/service/staticData.js';
  import { hasBtnPermission } from '@/utils/btnPermission';
  export default {
    components: {
      ElDialog,
      ElRadioGroup,
      ElRadio,
      ElForm,
      ElFormItem,
      ElInput,
      ElTimePicker,
      ElSelect,
      ElOption,
      ElButton
    },
    props: {
      visible: {
        type: Boolean,
        required: true,
      }
    },
    emits: ['update:modelValue', 'create-success'],
    setup(props, { emit }) {
      const visible = ref(props.visible);
      const createType = ref('new');
      const newCourseForm = ref({
        subjectId: '',
        teacherId: '',
        courseNature: '',
        templateId: '',
        courseTypeId: [],
        startTime: '',
        endTime: '',
        location: ''
      });
      const existingCourseForm = ref({
        courseId: '',
        timeSlots: []
      });
      const existingCourses = ref([]);
      const allCourses = ref([]); // 保存所有课程数据
      const subjects = ref([]);
      const teachers = ref([]);
      const templates = ref([]);
      const courseTypes = ref([]);
      const loading = ref(false);
  
      const weeks = Array.from({ length: 20 }, (_, i) => i + 1);
      const days = [
        { value: 1, label: '星期一' },
        { value: 2, label: '星期二' },
        { value: 3, label: '星期三' },
        { value: 4, label: '星期四' },
        { value: 5, label: '星期五' },
        { value: 6, label: '星期六' },
        { value: 7, label: '星期天' }
      ];
      const times = [
        { startTime: "8:20", endTime: "9:05" },
        { startTime: "9:15", endTime: "10:00" },
        { startTime: "10:20", endTime: "11:05" },
        { startTime: "11:15", endTime: "12:00" },
        { startTime: "14:00", endTime: "14:45" },
        { startTime: "14:55", endTime: "15:40" },
        { startTime: "16:00", endTime: "16:45" },
        { startTime: "16:55", endTime: "17:40" },
        { startTime: "19:30", endTime: "20:15" },
        { startTime: "20:25", endTime: "21:10" },
        { startTime: "21:20", endTime: "22:05" }
      ];
      const courseNatures = [
        { value: THEORY_COURSE, name: '理论课' },
        { value: LAB_COURSE, name: '实验课' },
        { value: OTHER_COURSE, name: '其他' }
      ];
  
      const handleClose = () => {
        visible.value = false;
        emit('update:modelValue', false);
      };
  
      const fetchAllCourses = async () => {
        try {
          const response = await getAllBaseCourse();
          allCourses.value = response;
        } catch (error) {
          console.error('获取所有课程失败:', error);
        }
      };
  
      const fetchCourses = async (query) => {
        if (query !== '') {
          loading.value = true;
          try {
            // 使用本地保存的所有课程数据进行过滤
            existingCourses.value = allCourses.value.filter(course => {
              return course.name.includes(query) || course.teacherName.includes(query);
            });
          } catch (error) {
            console.error('过滤课程失败:', error);
          } finally {
            loading.value = false;
          }
        } else {
          existingCourses.value = [];
        }
      };
  
      const fetchSubjects = async (query) => {
        if (query !== '') {
          loading.value = true;
          try {
            const response = await getAllBaseSubject();
            subjects.value = response.filter(subject => {
              return subject.name.includes(query);
            });
          } catch (error) {
            console.error('过滤学科失败:', error);
          } finally {
            loading.value = false;
          }
        } else {
          subjects.value = [];
        }
      };
  
      const fetchTeachers = async (query) => {
        if (query !== '') {
          loading.value = true;
          try {
            const response = await getAllBaseUser();
            teachers.value = response.filter(teacher => {
              return teacher.name.includes(query);
            });
          } catch (error) {
            console.error('过滤教师失败:', error);
          } finally {
            loading.value = false;
          }
        } else {
          teachers.value = [];
        }
      };
  
      const fetchTemplates = async () => {
        try {
          const response = await getAllTemplates();
          templates.value = response;
        } catch (error) {
          console.error('获取评教模板失败:', error);
        }
      };
  
      const fetchCourseTypes = async () => {
        try {
          const response = await getAllType();
          courseTypes.value = response;
        } catch (error) {
          console.error('获取课程类型失败:', error);
        }
      };
  
      const addTimeSlot = () => {
        existingCourseForm.value.timeSlots.push({
          weeks: [],
          day: '',
          startTime: '',
          endTime: '',
          classroom: ''
        });
      };
  
      const removeTimeSlot = (index) => {
        existingCourseForm.value.timeSlots.splice(index, 1);
      };
  
      const createCourse = async () => {
        try {
            if (createType.value === 'new') {
                const id = newCourseForm.value.subjectId;
                const techerId = newCourseForm.value.teacherId; 
              const courseInfo = {
              id:id,
              subjectMsg: {
                name: subjects.value.find(subject => subject.id === newCourseForm.value.subjectId)?.name || '',
                nature: newCourseForm.value.courseNature
              },
              templateId: newCourseForm.value.templateId,
              typeIdList: newCourseForm.value.courseTypeIds
            };
  
            const dateArr = existingCourseForm.value.timeSlots.map(slot => ({
              weeks: slot.weeks,
              day: slot.day,
              startTime: slot.startTime,
              endTime: slot.endTime,
              classroom: slot.classroom
            }));
  
            await createNewClass(techerId, courseInfo, dateArr);
           ElMessage({
            message: '创建成功',
            type: 'success',
          });
          } else {
            const { courseId, timeSlots } = existingCourseForm.value;
            await createClass(courseId, timeSlots);
            ElMessage({
            message: '创建成功',
            type: 'success',
          });
          }
          emit('create-success');
          handleClose();
        } catch (error) {
            console.error('创建课程失败:', error);
            ElMessage.error('创建失败');
        }
      };
      const checkPermission=(permission = '')=> {
      return hasBtnPermission(permission);
    };
  
      onMounted(() => {
        fetchAllCourses();
        fetchTemplates();
        fetchCourseTypes();
      });
  
      return {
        visible,
        createType,
        newCourseForm,
        existingCourseForm,
        existingCourses,
        subjects,
        teachers,
        templates,
        courseTypes,
        loading,
        weeks,
        days,
        times,
        courseNatures,
        handleClose,
        fetchCourses,  
        fetchSubjects,
        fetchTeachers,
        addTimeSlot,
        removeTimeSlot,
        createCourse,
        checkPermission
      };
    }
  };
  </script>
  
  <style scoped>
  </style>
  