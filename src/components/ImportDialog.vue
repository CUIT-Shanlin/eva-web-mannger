<template>
    <el-dialog
      title="批量导入课程"
      :visible="visible"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="importForm">
        <el-form-item label="选择学期">
          <el-cascader
            v-model="importForm.semester"
            :options="semesterOptions"
            :props="cascaderProps"
            clearable
            @change="handleSemesterChange"
          />
        </el-form-item>
        <el-form-item label="开学日期">
          <el-date-picker v-model="importForm.startDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="选择文件">
          <el-upload
            ref="upload"
            action="/upload" 
            accept=".xls,.xlsx"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
          >
            <el-button slot="trigger" type="primary">选取文件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="课程性质">
          <el-select v-model="importForm.courseNature">
            <el-option
              v-for="nature in courseNatures"
              :key="nature.value"
              :label="nature.name"
              :value="nature.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="importFiles" :disabled="!checkPermission('course.table.import') || !isChecked()">导入</el-button>
        </span>
      </template>
      <!-- 确认覆盖对话框 -->
    <el-dialog
      title="确认覆盖"
      v-model="showConfirmOverwriteDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <p>
        该学期已导入过课表，是否覆盖？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="executeOverwrite" :disabled="!checkPermission('course.table.import')" :loading="isLoadingBtn">确认</el-button>
          <el-button @click="showConfirmOverwriteDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 确认导入对话框 -->
    <el-dialog
      title="确认导入"
      v-model="showConfirmImportDialog"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <p>
        是否确定导入 {{ importForm.startYear }}-{{ importForm.endYear }} 学年第 {{ importForm.period === 0 ? '一' : '二' }} 学期的课程文件？
      </p>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="executeImport" :disabled="!checkPermission('course.table.import')" :loading="isLoadingBtn">确认</el-button>
          <el-button @click="showConfirmImportDialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
    </el-dialog>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import { ElDialog, ElForm, ElFormItem, ElCascader, ElDatePicker, ElUpload, ElButton, ElSelect, ElOption, ElMessage, ElMessageBox } from 'element-plus';
  import { importFile, getSemesterisImported } from '../api/courseTable.js';
  import { allCourseNature, THEORY_COURSE, LAB_COURSE, OTHER_COURSE } from '../utils/service/staticData.js';
  import { getAllSemester } from '../api/semester.js';
  import { hasBtnPermission  } from '@/utils/btnPermission';
  import { isSpace } from '@/utils/stringUtil';
  import { isEmptyOrNullOrUndefined, isEmptyArrOrNull } from '@/utils/objUtil';
  import { getNewThisSemester } from '@/utils/service/semesterUtil';

  export default {
    components: {
      ElDialog,
      ElForm,
      ElFormItem,
      ElCascader,
      ElDatePicker,
      ElUpload,
      ElButton,
      ElSelect,
      ElOption
    },
    props: {
      visible: {
        type: Boolean,
        required: true,
      }
    },
    emits: ['update:modelValue', 'import-success'],
    setup(props, { emit }) {
      const visible = ref(props.visible);
      const importForm = ref({
        id: null, // 学期ID
        period: null, // 学期（0 或 1）
        startYear: null, // 学年开始年份
        endYear: null, // 学年结束年份
        startDate: '',
        file: null,
        courseNature: THEORY_COURSE // 默认选择理论课
      });
  
      const semesterOptions = ref([]);
      const cascaderProps = {
        value: 'id',
        label: 'label',
        children: 'children'
      };
  
      const courseNatures = ref(allCourseNature);
  
      const showConfirmOverwriteDialog = ref(false);
      const showConfirmImportDialog = ref(false);
  
      const isLoadingBtn = ref(false)

      /**
       * 关闭弹窗
       */
      function cancelDialog(){
        visible.value = false;
        emit('update:modelValue', false);
      }

      /**
       * 用于确认是否可以提交表单
       */
      const isChecked = ()=>{
        const formValue = importForm.value
        return !isSpace(formValue.startDate) && !isSpace(formValue.startYear) && !isSpace(formValue.endYear)
        && !isEmptyOrNullOrUndefined(formValue.file)
      }


      const handleClose = () => {
        visible.value = false;
        emit('update:modelValue', false);
      };
  
      const handleFileChange = (file) => {
        importForm.value.file = file.raw;
      };
  
      const fetchSemesters = async () => {
        try {
          const response = await getAllSemester();
          const semesters = response.reduce((acc, semester) => {
            const existingYear = acc.find(year => year.label === `${semester.startYear}-${semester.endYear}`);
            if (existingYear) {
              existingYear.children.push({
                id: semester.id,
                label: semester.period === 0 ? '上学期' : '下学期',
                period: semester.period,
                startDate: semester.startDate,
              });
            } else {
              acc.push({
                id: semester.id,
                label: `${semester.startYear}-${semester.endYear}`,
                children: [
                  {
                    id: semester.id,
                    label: semester.period === 0 ? '上学期' : '下学期',
                    period: semester.period,
                    startDate: semester.startDate,
                  }
                ]
              });
            }
            return acc;
          }, []);
          // 计算新学期
          if (semesters.length > 0) {
            const lastSemester = semesters[semesters.length - 1];
            const lastYear = lastSemester.label.split(' ')[0];
            let lastPeriod;
            if (lastSemester.children.length > 1 && lastSemester.children[1].label === '下学期') {
                lastPeriod = lastSemester.children[1].label;
            } else {
                lastPeriod = lastSemester.children[0].label;
            }
             
            const [startYear, endYear] = lastYear.split('-').map(Number);
            const newStartYear = lastPeriod === '下学期' ? startYear + 1 : startYear;
            const newEndYear = lastPeriod === '下学期' ? endYear + 1 : endYear;
            const newPeriod = lastPeriod === '下学期' ? '上学期' : '下学期';
  
            // 检查最后一个学年是否已经包含两个学期
            if (lastSemester.children.length < 2) {
              lastSemester.children.push({
                id: `${newStartYear}-${newEndYear}`,
                label: '下学期',
                period: 1
              });
            } else {
              semesters.push({
                id: null,
                label: `${newStartYear}-${newEndYear}`,
                children: [
                  {
                    id: null,
                    label: '上学期',
                    period: 0
                  }
                ]
              });
            }
          }
          semesterOptions.value = semesters;
          // dkh: 检验本学期有没有加入选项
          let thisSemester = getNewThisSemester()
          let flag = false
          for(let i = 0;i < semesterOptions.value.length;i++){
            const semesterOption = semesterOptions.value[i]
            if(semesterOption.label === thisSemester.label){
              flag = true
              if(isEmptyArrOrNull(semesterOption.children)){
                semesterOptions.value[i] = thisSemester
              }
              if(!semesterOption.children.find(child=> child.period === thisSemester.children[0].period)){
                semesterOption.children.push(thisSemester.children[0])
              }
              break;
            }
          }

          if(!flag){
            semesterOptions.value.push(thisSemester)
          }

        } catch (error) {
          semesterOptions.value.push(getNewThisSemester())
          console.error('获取学期数据失败:', error);
        }
      };
  
      const handleSemesterChange = (value) => {
        if (value && value.length === 2) {
          const [id, period] = value;
          const selectedSemester = semesterOptions.value.find(year => year.id === id);
          if (selectedSemester) {
            const semester = selectedSemester.children.find(child => child.id === period);
            if (semester) {
              importForm.value.id = semester.id;
              importForm.value.period = semester.period;
              importForm.value.startYear = selectedSemester.label.split('-')[0];
              importForm.value.endYear = selectedSemester.label.split('-')[1];
              importForm.value.startDate = semester.startDate
            }
          }
        } else {
          importForm.value.id = null;
          importForm.value.period = null;
          importForm.value.startYear = null;
          importForm.value.endYear = null;
        }
      };
  
      const importFiles = async () => {
        try {
          const { id, period, startYear, endYear, startDate, file, courseNature } = importForm.value;
          // 确保学期、学年开始年份和学年结束年份都不为空
          if (period === null || !startYear || !endYear) {
            ElMessage.error('请选择正确的学期');
            return;
          }
          const isImported = await getSemesterisImported(courseNature, {
            period,
            startYear,
            endYear
          });
  
          if (isImported) {
            showConfirmOverwriteDialog.value = true;
          } else {
            showConfirmImportDialog.value = true;
          }
        } catch (error) {
          console.error('导入课程失败:', error);
          ElMessage.error('导入失败');
        }
      };
      const executeOverwrite = async () => {
        isLoadingBtn.value = true
        const id = importForm.value.id;
        const period = importForm.value.period;
        const startYear = importForm.value.startYear;
        const endYear = importForm.value.endYear;
        const startDate = importForm.value.startDate;
        const file = importForm.value.file;
        const courseNature = importForm.value.courseNature;
          const date = new Date(startDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
  
          const semesterData = {
            id,
            period,
            startYear,
            endYear,
            startDate: formattedDate
          };
        try {
          delete semesterData.id
          await importFile(courseNature, semesterData, file);
          emit('import-success');
          ElMessage({
            message: '覆盖成功',
            type: 'success',
          });
          handleClose();
        } catch (error) {
          console.error('覆盖课程失败:', error);
          ElMessage.error('覆盖失败');
        } finally {
          showConfirmOverwriteDialog.value = false;
          isLoadingBtn.value = false
        }
      };
  
      const executeImport = async () => {
        isLoadingBtn.value = true
        const id = importForm.value.id;
        const period = importForm.value.period;
        const startYear = importForm.value.startYear;
        const endYear = importForm.value.endYear;
        const startDate = importForm.value.startDate;
        const file = importForm.value.file;
        const courseNature = importForm.value.courseNature;
          const date = new Date(startDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
  
          const semesterData = {
            id,
            period,
            startYear,
            endYear,
            startDate: formattedDate
          };
        try {
          delete semesterData.id
          await importFile(courseNature, semesterData, file);
          emit('import-success');
          ElMessage({
            message: '导入成功',
            type: 'success',
          });
          handleClose();
        } catch (error) {
          console.error('导入课程失败:', error);
          ElMessage.error('导入失败');
        } finally {
          showConfirmImportDialog.value = false;
          isLoadingBtn.value = false
        }
      };
      const checkPermission=(permission = '')=> {
        return hasBtnPermission(permission);
      };
  
      onMounted(() => {
        fetchSemesters();
      });
  
      watch(visible, (newVisible) => {
        if (!newVisible) {
          // 当对话框关闭时，重置表单数据
          importForm.value = {
            id: null,
            period: null,
            startYear: null,
            endYear: null,
            startDate: '',
            file: null,
            courseNature: THEORY_COURSE // 默认选择理论课
          };
        }
      });
  
      return {
        isLoadingBtn,
        visible,
        importForm,
        semesterOptions,
        cascaderProps,
        courseNatures,
        showConfirmOverwriteDialog,
        showConfirmImportDialog,
        handleClose,
        handleFileChange,
        handleSemesterChange,
        importFiles,
        executeOverwrite,
        executeImport,
        checkPermission,
        isChecked,
        cancelDialog
      };
    }
  };
  </script>
  
  <style scoped>
  </style>
  