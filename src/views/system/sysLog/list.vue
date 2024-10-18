<template>
  <PageTitle content="日志列表" />
  <div class="back">
    <div class="title">
      <div class="choose">
        <el-radio-group v-model="selectedModuleId">
          <el-radio :label="null">全部日志</el-radio>
          <el-radio v-for="module in modules" :key="module.id" :label="module.id">{{ module.name }}</el-radio>
        </el-radio-group>
      </div>
      <div class="date-picker">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="filterLogsByDateRange"
        />
      </div>
    </div>
    <div class="container">
      <el-table
        ref="logTable"
        :data="sortedLogs"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="信息" width="500">
          <template #default="scope">
            <span v-if="!scope.row.isRead" class="unread-star">*</span>
            {{ scope.row.userName }} - {{ getTypeLabel(scope.row.type) }} - {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="showDetail(scope.row)">查看详细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <div>
          <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
        </div>
        <div class="btn">
          <el-button type="primary" @click="markAsRead">已读</el-button>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    <el-dialog
      title="日志详细信息"
      v-model="dialogVisible"
      width="50%"
      append-to-body
    >
      <div v-if="selectedLog">
        <p>{{ selectedLog.userName }} {{ getTypeLabel(selectedLog.type) }} {{ selectedLog.content }}</p>
        <p><strong>用户IP:</strong> {{ selectedLog.ip }}</p>
        <p><strong>创建时间:</strong> {{ selectedLog.createTime }}</p>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { ref, onMounted, watch, computed } from 'vue';
import { getAllLogs, getPageLogs } from '../../../api/logs';
import { ElRadioGroup, ElRadio, ElDatePicker, ElTable, ElTableColumn, ElPagination, ElButton, ElCheckbox, ElDialog } from 'element-plus';

// 定义响应式变量
const modules = ref([]);
const allLogs = ref([]); // 存储所有日志数据
const logs = ref([]); // 当前显示的日志数据
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedModuleId = ref(null);
const selectedLogs = ref([]);
const dateRange = ref([]);
const selectAll = ref(false);
const dialogVisible = ref(false);
const selectedLog = ref(null);
const logTable = ref(null);

// 获取日志模块数据
const fetchModules = async () => {
  try {
    const response = await getAllLogs();
    modules.value = response;
  } catch (error) {
    console.error('获取日志模块失败:', error);
  }
};

// 获取所有日志数据
const fetchAllLogs = async () => {
  try {
    const response = await getPageLogs(selectedModuleId.value);
    allLogs.value = response.records.map(log => ({ ...log, isRead: false }));
    total.value = response.total;
    filterLogsByDateRange(); // 初始化时根据时间范围过滤数据
  } catch (error) {
    console.error('获取日志数据失败:', error);
  }
};

// 根据时间范围过滤日志数据
const filterLogsByDateRange = () => {
  const startDate = dateRange.value[0] ? new Date(dateRange.value[0]).getTime() : null;
  const endDate = dateRange.value[1] ? new Date(dateRange.value[1]).getTime() : null;

  logs.value = allLogs.value.filter(log => {
    const logTime = new Date(log.createTime).getTime();
    return (!startDate || logTime >= startDate) && (!endDate || logTime <= endDate);
  });
};

// 获取操作类型标签
const getTypeLabel = (type) => {
  const labels = ['新增', '删除', '修改', '查询', '其他'];
  return labels[type] || '未知';
};

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedLogs.value = selection;
  selectAll.value = selection.length === logs.value.length;
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  // 分页变化时不需要重新获取数据，只需更新当前页码
};

// 标记已读
const markAsRead = () => {
  selectedLogs.value.forEach(log => {
    const index = logs.value.findIndex(item => item.id === log.id);
    if (index !== -1) {
      logs.value[index].isRead = true;
    }
  });
  selectedLogs.value = [];
};

// 查看详细信息
const showDetail = (log) => {
  selectedLog.value = log;
  dialogVisible.value = true;
};

// 全选/取消全选
const toggleSelectAll = (value) => {
  if (value) {
    logTable.value.clearSelection();
    logTable.value.toggleAllSelection();
  } else {
    logTable.value.clearSelection();
  }
};

// 排序日志数据，未读的置于前列
const sortedLogs = computed(() => {
  return logs.value.slice().sort((a, b) => {
    if (!a.isRead && b.isRead) return -1;
    if (a.isRead && !b.isRead) return 1;
    return 0;
  });
});

// 组件挂载时获取日志模块数据
onMounted(() => {
  fetchModules();
  fetchAllLogs();
});

// 监听 selectedModuleId 变化，重新获取日志数据
watch(selectedModuleId, fetchAllLogs);
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
}
.unread-star {
  color: red;
  margin-right: 5px;
}
.back {
  background-color: white;
  padding: 20px;
  padding-bottom: 30px;
}
.bottom {
  margin-top: 100px;
  display: inline-flex;
  width: 100%;
  .pagination {
    margin-left: auto;
  }
}
.btn {
  margin-left: 10px;
}
.title {
  display: inline-flex;
  width: 100%;
  .date-picker {
    margin-left: auto;
  }
}
</style>
