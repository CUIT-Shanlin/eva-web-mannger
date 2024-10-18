<template>
  <PageTitle content="日志列表" />
  <div class="back">
    <div class="title">
      <div class="choose">
        <el-radio-group v-model="selectedModuleId">
          <el-radio :label="-1">全部日志</el-radio>
          <el-radio v-for="module in modules" :key="module.id" :label="module.id">{{ module.name }}</el-radio>
        </el-radio-group>
      </div>
      <div class="search-box">
        <el-input
          v-model="keyword"
          placeholder="请输入关键字"
          clearable
          @input="fetchAllLogs"
        />
      </div>
      <div class="date-picker">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchAllLogs"
        />
      </div>
    </div>
    <div class="container">
      <el-table
        ref="logTable"
        :data="logs"
      >
        <el-table-column label="信息" width="500">
          <template #default="scope">
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
import { ref, onMounted, watch } from 'vue';
import { getAllLogs, getPageLogs } from '../../../api/logs';
import { ElRadioGroup, ElRadio, ElDatePicker, ElTable, ElTableColumn, ElPagination, ElButton, ElDialog, ElInput } from 'element-plus';

// 定义响应式变量
const modules = ref([]);
const logs = ref([]); // 当前显示的日志数据
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const selectedModuleId = ref(-1); // 默认选择全部日志
const dateRange = ref([]);
const keyword = ref(''); // 搜索关键字
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
    const startCreateTime = dateRange.value[0] ? dateRange.value[0].toISOString() : null;
    const endCreateTime = dateRange.value[1] ? dateRange.value[1].toISOString() : null;

    const response = await getPageLogs(selectedModuleId.value, {
      page: currentPage.value,
      size: pageSize.value,
      queryObj: {
        keyword: keyword.value,
        startCreateTime,
        endCreateTime,
        startUpdateTime: null,
        endUpdateTime: null
      }
    });

    logs.value = response.records;
    total.value = response.total;
  } catch (error) {
    console.error('获取日志数据失败:', error);
  }
};

// 获取操作类型标签
const getTypeLabel = (type) => {
  const labels = ['查询','新增',  '修改', '删除','导出', '导入','其他'];
  return labels[type] || '未知';
};

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchAllLogs(); // 分页变化时重新获取数据
};

// 查看详细信息
const showDetail = (log) => {
  selectedLog.value = log;
  dialogVisible.value = true;
};

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
.title {
  display: inline-flex;
  width: 100%;
  .date-picker {
    margin-left: auto;
  }
}
.search-box {
  margin-left: 20px;
}
</style>
