<template>
  <PageTitle content="日志列表" />
  <div class="back">
    <div class="title">
      <div class="module-all">
        <div :class="['moduleOne', selectedModuleId + '' === module.id + '' ? 'chooseModule' : '']"
          v-for="module in modules" :key="module.id"
          @click="chooseModule(module.id)"
        >
          {{module.name}}
        </div>
      </div>
      <div class="fun-box">

        <el-input
          v-model="keyword"
          placeholder="请输入关键字"
          clearable
          @change="fetchAllLogs"
          style="width: 260px"
        >
          <template #append>
            <el-button :icon="Search" @click="fetchAllLogs()" />
          </template>
        </el-input>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="fetchAllLogs"
          style="width: 240px"
        />
      </div>
    </div>
    <div class="container">
      <el-table
        ref="logTable"
        :data="logs"
        v-loading="isLoadingTable"
      >
        <el-table-column label="信息" width="500">
          <template #default="scope">
            {{ scope.row.userName }} - {{ getTypeLabel(scope.row.type) }} - {{ scope.row.content }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" prop="createTime" />
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
      width="500"
      append-to-body
    >
      <div v-if="selectedLog">
        <p>{{ selectedLog.userName }} {{ getTypeLabel(selectedLog.type) }} {{ selectedLog.content }}</p>
        <p><strong class="label">用户IP:</strong> {{ selectedLog.ip }}</p>
        <p><strong class="label">操作类型:</strong> {{ getTypeLabel(selectedLog.type) }}</p>
        <p><strong class="label">操作者:</strong> {{ selectedLog.userName }}</p>
        <p><strong class="label">操作时间:</strong> {{ selectedLog.createTime }}</p>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { ref, onMounted } from 'vue';
import { getAllLogs, getPageLogs } from '@/api/logs';
import { Search } from "@element-plus/icons-vue";

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
const isLoadingTable = ref(false); // 是否正在加载表格

function chooseModule(moduleId = -1){
  selectedModuleId.value = moduleId
  fetchAllLogs()
}

// 获取日志模块数据
const fetchModules = async () => {
  try {
    const response = await getAllLogs();
    modules.value = [{id: -1, name: '全部'}]
    modules.value.push(... response);
    // modules.value = response;
  } catch (error) {
    console.error('获取日志模块失败:', error);
  }
};

// 获取所有日志数据
const fetchAllLogs = async () => {
  isLoadingTable.value = true
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
    isLoadingTable.value = false
  } catch (error) {
    console.error('获取日志数据失败:', error);
    isLoadingTable.value = false
  }
};

// 获取操作类型标签
const getTypeLabel = (type) => {
  const labels = ['查询', '新增', '修改', '删除', '导出', '导入', '其他'];
  return labels[type - 1] || '未知';
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

</script>

<style lang="scss" scoped>
@import "../../../styles/commonFlexStyles.scss";
@import "../../../styles/globalPage.scss";

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
  .fun-box{
    margin-left: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
  }
}

.module-all{
  @include flex-center-y;
  .moduleOne{
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
  .module:active, .chooseModule{
    color: $main-show-color;
  }
  .chooseModule{
    border-bottom-color: $main-show-color;
  }
}

.label{
  margin-right: 50px;
  display: inline-flex;
  width: 100px;
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
</style>
