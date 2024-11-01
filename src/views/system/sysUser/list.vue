<template>
  <div class="userAllSty">
    <PageTitle content="用户列表" />
    <div class="funBar">
      <form class="iptBar" @submit.prevent="getMyPageData">
        <input
          v-model="pageReqData.queryObj.keyword"
          placeholder="请输入姓名或用户名"
        />
        <button class="iconfont btnIco">&#xe602;</button>
      </form>
      <div class="myBox">
        <el-popover
          placement="bottom"
          trigger="click"
          :visible="isChooseDate"
          :width="650"
        >
          <template #reference>
            <div class="calendarBar" @click="isChooseDate = !isChooseDate">
              <span class="txt">
                <i class="iconfont ico">&#xe61c;</i>
                <span v-html="getChooseDateText()"></span>
              </span>
              <i
                class="clear iconfont"
                v-if="iptDate[0] != null && iptDate[1] != null"
                @click="
                  iptDate[0] = null;
                  iptDate[0] = null;
                  isChooseDate = !isChooseDate;
                "
              >
                &#xe68b;
              </i>
              <i :class="{ iconfont: true, ico2: true, act: isChooseDate }"
                >&#xe6a8;</i
              >
            </div>
          </template>
          <div class="calendarBox">
            <MyDatePicker v-model="iptDate[0]" />
            <div class="tip">&nbsp;</div>
            <MyDatePicker v-model="iptDate[1]" />
          </div>
        </el-popover>
        <my-common-btn
          class="addIco banStyle"
          :disabled="!hasBtnPermission('system.user.add')"
          txt="新建用户"
          :is-large="true"
          default-color="rgb(255,97,117)"
          @click="showFunDialog({info:{}}, ADD_MODE)"
          ico="&#xe712;"
        />
        <my-common-btn
          class="addIco"
          :disabled="!hasBtnPermission('system.user.sync')"
          txt="同步ldap用户"
          :is-large="true"
          default-color="rgb(255,97,117)"
          :plain="true"
          @click="syncMyLdap()"
        />
      </div>
    </div>
    <el-table
      :data="pageData.records"
      style="min-width: 100%;overflow-x: auto"
      v-loading="isLoadingTable"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column prop="info.createTime" label="创建日期" width="180" />
      <el-table-column label="名称" width="180">
        <template #default="scope">
          <div class="nameBar">
            <el-avatar
              class="avatar"
              shape="square"
              :size="40"
              fit="cover"
              :src="scope.row.info.avatarUrl"
              @error="() => true"
            >
              <img
                :src="ERROR_AVATAR_URL"
              />
            </el-avatar>


            {{ scope.row.info.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="info.department" label="专业" width="200" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-switch
            class="banStyle"
            :disabled="!hasBtnPermission('system.user.update')"
            v-model="scope.row.info.status"
            :active-value="NORMAL_STATE"
            :inactive-value="DISABLED_STATE"
            @change="updateThisUserStatus(scope.row.info)"
            style="--el-switch-on-color: rgb(255, 97, 117)"
          />
        </template>
      </el-table-column>
      <el-table-column label="所属角色" width="250">
        <template #default="scope">
          {{ getRolesNameStr(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column label="联系" width="150">
        <template #default="scope">
          <div class="icoBox">
            <el-tooltip
              :content="scope.row.info.phone"
              placement="top"
              effect="light"
              v-if="!isSpace(scope.row.info.phone)"
            >
              <div class="iconfont linkIco">&#xe862;</div>
            </el-tooltip>
            <el-tooltip
              :content="scope.row.info.email"
              placement="top"
              effect="light"
              v-if="!isSpace(scope.row.info.email)"
            >
              <div class="iconfont linkIco">&#xe697;</div>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template #default="scope">
          <div class="operationBox">
            <my-common-btn
              class="banStyle"
              :disabled="!hasBtnPermission('system.user.query')"
              txt="查看"
              :default-color="getRandColor()"
              :is-large="true"
              @click="showFunDialog(scope.row, CHECK_MODE)"
            />
            <my-common-btn
              class="banStyle"
              :disabled="!hasBtnPermission('system.user.update')"
              txt="修改"
              :default-color="getRandColor()"
              :is-large="true"
              @click="showFunDialog(scope.row, UPDATE_MODE)"
            />
            <el-popover placement="left" :width="200" trigger="hover">
              <template #reference>
                <i class="iconfont more">&#xe612;</i>
              </template>
              <div class="moreBox">
                <div>
                  <el-link
                    class="banStyle"
                    :disabled="!hasBtnPermission('system.user.score.query')"
                    type="primary"
                    @click="showScoreMsg(scope.row)"
                    >评分查询</el-link>
                </div>
                <div>
                  <el-link type="info" @click="showAssignRole(scope.row)"
                    class="banStyle"
                    :disabled="!hasBtnPermission('system.user.assignRole')"
                    >分配角色</el-link>
                </div>
                <div>
                  <el-link type="danger" @click="deleteOneUser(scope.row.info)"
                    class="banStyle"
                    :disabled="!hasBtnPermission('system.user.delete')"
                    >删除用户</el-link>
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配角色的提示框 -->
    <teleport to="body">
      <el-dialog title="分配角色" v-model="assignDialogOpen" width="500">
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input disabled :value="checkedUser.info.name"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input disabled :value="checkedUser.info.username"></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange()"
              >全选</el-checkbox
            >
            <br />
            <el-checkbox-group v-model="userRoleIds">
              <el-checkbox
                v-for="role in allRoles"
                :key="role.id"
                :value="role.id"
                :title="'描述：' + role.description"
                >{{ role.roleName }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" @click="doMyAssign()" :loading="isLoadingAssignBtn">保存</el-button>
          <el-button @click="assignDialogOpen = false">取消</el-button>
        </template>
      </el-dialog>
    </teleport>

    <!-- 评分查询的弹窗 -->
    <teleport to="body">
      <el-dialog v-model="scoreDialogVisible" width="800">
        <template #header="{ titleId, titleClass }">
          <div class="my-header">
            <div :id="titleId" :class="titleClass">评分查询</div>
          </div>
        </template>
        <el-table :data="scoreMsg" class="scoreTable"
        :header-cell-style="{backgroundColor: 'rgb(250,250,250)', padding: '10px 0'}"
        :cell-style="{padding: '10px 0'}">
            <el-table-column prop="courseName" label="课程名称" width="300" />
            <el-table-column prop="score" label="课程评分" width="232" />
            <el-table-column prop="evaNum" label="评教人数" width="232"/>
        </el-table>
        <template #footer>
          <el-button @click="scoreDialogVisible = false">关闭</el-button>
        </template>
      </el-dialog>
    </teleport>

    <!--  修改/新建/查看用户的弹窗-->
    <teleport to="body">
      <el-dialog v-model="updateOrAddDialogVisible" :title="getFunTitle(checkedUser, updateOrAddProp.fun)" width="500">
        <el-form label-width="80px">
          <el-form-item label="姓名">
            <el-input v-model="checkedUser.info.name" placeholder="请输入姓名"
            :disabled="updateOrAddProp.fun === CHECK_MODE"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="checkedUser.info.username" placeholder="请输入用户名"
            @change="checkUsername(checkedUser.info.username)"
            :disabled="updateOrAddProp.fun === CHECK_MODE"></el-input>
            <div class="tipMsg">{{updateOrAddProp.usernameMsg}}</div>
          </el-form-item>
          <el-form-item label="密码" v-if="!updateOrAddProp.isUpdatePwd && updateOrAddProp.fun === UPDATE_MODE">
            <el-link type="primary"
            @click="updateOrAddProp.isUpdatePwd = !updateOrAddProp.isUpdatePwd">修改密码</el-link>
          </el-form-item>
          <el-form-item :label="updateOrAddProp.fun === UPDATE_MODE ? '新密码' : '密码'" 
          v-if="!(!updateOrAddProp.isUpdatePwd && updateOrAddProp.fun === UPDATE_MODE) && updateOrAddProp.fun !== CHECK_MODE">
            <el-input v-model="checkedUser.info.password" placeholder="请输入密码"
            @change="checkNewPwd(checkedUser.info.password)" type="password" show-password></el-input>
            <div class="tipMsg">{{updateOrAddProp.pwdMsg}}</div>
          </el-form-item>
          <el-form-item label="重复密码" v-if="!(!updateOrAddProp.isUpdatePwd && updateOrAddProp.fun === UPDATE_MODE)
          && updateOrAddProp.fun !== CHECK_MODE">
            <el-input v-model="updateOrAddProp.againPwd" placeholder="请再次输入相同密码"
            @change="checkAgainPwd(updateOrAddProp.againPwd)" type="password" show-password></el-input>
            <div class="tipMsg">{{updateOrAddProp.againPwdMsg}}</div>
          </el-form-item>
          <el-form-item label="专业">
            <el-select
            v-model="checkedUser.info.department"
            filterable
            placeholder="请输入专业名称"
            :disabled="updateOrAddProp.fun === CHECK_MODE"
            >
            <el-option
            v-for="department in departments"
            :key="department"
            :label="department"
            :value="department"
            />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="性别">
            <el-radio-group v-model="checkedUser.info.sex" :disabled="updateOrAddProp.fun === CHECK_MODE">
              <el-radio :value="1" >男</el-radio>
              <el-radio :value="0">女</el-radio>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="电话号码">
            <el-input v-model="checkedUser.info.phone" placeholder="请输入电话号码"
            :disabled="updateOrAddProp.fun === CHECK_MODE"></el-input>
            <div class="tipMsg" v-if="updateOrAddProp.fun !== CHECK_MODE"
            v-text="isPhone(checkedUser.info.phone) ? '✔️ 电话格式正确' : '* 非法电话号码'"></div>
          </el-form-item>
          <el-form-item label="邮箱地址">
            <el-input v-model="checkedUser.info.email" placeholder="请输入邮箱地址"
            :disabled="updateOrAddProp.fun === CHECK_MODE"></el-input>
            <div class="tipMsg" v-if="updateOrAddProp.fun !== CHECK_MODE"
            v-text="isEmail(checkedUser.info.email) ? '✔️ 邮箱格式正确' : '* 非法邮箱地址'"></div>
          </el-form-item>
          <el-form-item label="职称">
            <el-input v-model="checkedUser.info.profTitle"
            placeholder="请输入职称，例如：教授等（非必填）"
            :disabled="updateOrAddProp.fun === CHECK_MODE"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" v-if="updateOrAddProp.fun !== ADD_MODE">
            <el-input v-model="checkedUser.info.createTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="修改时间" v-if="updateOrAddProp.fun !== ADD_MODE">
            <el-input v-model="checkedUser.info.updateTime" disabled></el-input>
          </el-form-item>
        </el-form>
        <template #footer v-if="updateOrAddProp.fun !== CHECK_MODE">
          <el-button type="primary" :disabled="!totalCheck()" @click="updateOrAddThisUser()" :loading="isLoadingBtn">保存</el-button>
          <el-button @click="updateOrAddDialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </teleport>

    <el-pagination
      v-model:current-page="pageData.current"
      v-model:page-size="pageData.size"
      :page-sizes="[5, 10, 20, 40]"
      :size="pageData.size"
      :disabled="disabled"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageData.total"
      @size-change="getMyPageData"
      @current-change="getMyPageData"
      class="myPage"
    />
  </div>
</template>

<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { ref, watch, onMounted } from "vue";
import {
  formatDate,
  formatDateNotTime
} from "@/utils/dateUtil";
import {
  getPageData,
  removeOne,
  doAssign,
  getScoreMsg,
  isExistUsername,
  updateUser,
  updateUserStatus,
  addUser,
  getUserAvatar,
  syncLdap
} from "@/api/user";
import { getAllRoles } from "@/api/role";
import { getAllDepartments } from '@/api/other';
import {
  UPDATE_MODE,
  ADD_MODE,
  CHECK_MODE,
  NORMAL_STATE,
  DISABLED_STATE,
  ERROR_AVATAR_URL
} from "@/utils/service/staticData";
import { getRandomNumber } from "@/utils/randomUtil";
import { useSimpleConfirm, useSuccessTip, useInfoTip } from "@/utils/msgTip.js";
import { isSpace, removeSpace, isPhone, isEmail } from "@/utils/stringUtil";
import { deepCopy } from '@/utils/objUtil';
import { hasBtnPermission } from '@/utils/btnPermission';
import MyDatePicker from "@/components/MyDatePicker.vue";
import MyCommonBtn from "@/components/MyCommonBtn.vue";

const iptDate = ref([null, null]);
const isChooseDate = ref(false);

const isLoadingAssignBtn = ref(false)
const isLoadingBtn = ref(false)

// 是否正在加载表格
const isLoadingTable = ref(false);

// 用于确定弹窗格式
const updateOrAddProp = ref({
  fun: UPDATE_MODE,// 确定弹窗的功能，0：修改 1：增加 2：查看
  isUsername: true,// 用户名是否合法
  isUpdatePwd: false,
  againPwd: '',
  pwdMsg: '',
  againPwdMsg: '',
  phoneMsg: '',
  emailMsg: '',
  usernameMsg: ''
})
let tmpOriginUsername = '';// 存临时的 用户原本的用户名
// 是否开启查看或修改或新建的弹窗
const updateOrAddDialogVisible = ref(false)

// 确定是否开启评分查询的弹窗
const scoreDialogVisible = ref(false);
// 存当前查询的评分数据
const scoreMsg = ref([])
// 确定是否打开 分配角色的弹窗
const assignDialogOpen = ref(false);
// 存所有的角色
const allRoles = ref([]);
// 存所有的专业名
const departments = ref([]);
// 当前正在操作的用户
const checkedUser = ref({info: {}});
// 是否是不确定的
const isIndeterminate = ref(true);
// 当前被分配角色的用户的角色id集合
const userRoleIds = ref([]);
// 确认是否全选
const checkAll = ref(false);

// 存分页获取的数据
const pageData = ref({
  total: 0,
  size: 10,
  current: 1,
  records: [],
});

// 存分页请求数据
const pageReqData = ref({
  size: 0,
  page: 1,
  queryObj: {
    keyword: "",
    startCreateTime: null,
    endCreateTime: null,
  },
});

/**
 * 同步ldap用户
 */
function syncMyLdap(){
  useSimpleConfirm('你确定要同步ldap中的用户吗？（注：不会覆盖已存在的用户（用户名相同的情况），也不会删除原来的任何用户）').then(async()=>{
    await syncLdap()
    useSuccessTip('同步ldap用户成功')
    getMyPageData()
  })
}

/**
 * 修改用户的状态
 * @param info 用户信息
 */
const updateThisUserStatus = async(info)=>{
  let res = await updateUserStatus(info.id, info.status)
  if(info.status === NORMAL_STATE){
    useSuccessTip(`成功启用用户 “${info.name}”`)
  }else{
    useInfoTip(`成功禁用用户 “${info.name}”`)
  }
}

/**
 * 修改/新建一名用户
 */
const updateOrAddThisUser = async()=>{
  if(!totalCheck()){
    return
  }
  isLoadingBtn.value = true
  const fun = updateOrAddProp.value.fun
  let tipMsg = ''
  if(fun === 0){
    await updateUser(checkedUser.value.info, updateOrAddProp.value.isUpdatePwd)
    tipMsg = `修改用户 “${checkedUser.value.info.name}” 成功`
  }else if(fun === 1){
    await addUser(checkedUser.value.info)
    tipMsg = '成功新建用户'
  }
  updateOrAddDialogVisible.value = false
  useSuccessTip(tipMsg)
  isLoadingBtn.value = false
}

/**
 * 判断全部信息是否都符合要求
 * @returns 是否符合
 */
function totalCheck(){
  const info = checkedUser.value.info
  const prop = updateOrAddProp.value
  const fun = prop.fun
  checkUsername(info.username)
  return ( (checkNewPwd(info.password) && checkAgainPwd(prop.againPwd)) || (!prop.isUpdatePwd && fun === 0))
  && prop.isUsername && isPhone(info.phone) && isEmail(info.email)
}

/**
 * 检查重复密码格式
 * @param {string} pwd 重复密码
 * @returns 是否合规 
 */
 function checkAgainPwd(pwd = ''){
  updateOrAddProp.value.againPwdMsg = '✔️ 密码格式正确'
  if(isSpace(pwd)){
    updateOrAddProp.value.againPwdMsg = '* 密码不能为空或纯空格'
    return false
  } else if(pwd !== checkedUser.value.info.password){
    updateOrAddProp.value.againPwdMsg = '* 输入密码不一致!'
    return false
  }
  return true
}

/**
 * 检查新密码格式
 * @param {string} pwd 新密码
 * @returns 是否合规 
 */
function checkNewPwd(pwd = ''){
  updateOrAddProp.value.pwdMsg = '✔️ 密码格式正确'
  checkAgainPwd(updateOrAddProp.value.againPwd)
  if(isSpace(pwd)){
    updateOrAddProp.value.pwdMsg = '* 密码不能为空或纯空格'
    return false
  }
  return true
}

/**
 * 检查用户名是否合法
 * @param username 用户名
 */
const checkUsername = async(username ='')=>{
  const prop = updateOrAddProp.value
  const fun = prop.fun
  // 用户名为空直接认定非法
  prop.usernameMsg = '✔️ 用户名格式正确'
  if(isSpace(username)){
    prop.isUsername = false
    prop.usernameMsg = '* 用户名不能为空或纯空格'
    return
  }
  if(fun === 0 && username === tmpOriginUsername){// 修改功能时的弹窗
    prop.isUsername = true// 用户名是否和旧用户名一致
    return
  }
  await isThisExist(username)
  if(!prop.isUsername){
    prop.usernameMsg =  '* 该用户名已被使用，请重新输入新用户名'
  }
}

/**
 * 确定输入用户名是否已经被注册或者是否为 非旧用户名
 * @param {string} username 
 */
const isThisExist = async(username)=>{
  // 检测用户名是否已经抢注
  let isExist = await isExistUsername(username)
  updateOrAddProp.value.isUsername = !isExist// 用户名
}

/**
 * 初始化修改弹窗
 * @param {Object} user 待修改的用户 
 */
function showFunDialog(user, fun = CHECK_MODE){
  checkedUser.value = deepCopy(user)
  tmpOriginUsername = user.info.username
  updateOrAddProp.value = {
    fun,
    isUsername: false,// 用户名是否合法
    isUpdatePwd: 0,
    againPwd: '',
    pwdMsg: '',
    againPwdMsg: '',
    phoneMsg: '',
    emailMsg: '',
  }
  updateOrAddDialogVisible.value = true
}

/**
 * 获取功能弹窗的title
 * @param fun 弹窗功能
 */
function getFunTitle(user = {info: {}}, fun = CHECK_MODE){
  if(fun === UPDATE_MODE){
    return `修改用户 “${user.info.name}” `
  }else if(fun === ADD_MODE){
    return '新建用户'
  } else if(fun === CHECK_MODE){
    return '查看详情'
  }
}

/**
 * 展示查询的评分数据，以及弹窗的初始化
 * @param {Object} user 对应的用户
 */
const showScoreMsg = async(user)=>{
  checkedUser.value = user;
  let data = await getScoreMsg(user.info.id)
  scoreMsg.value = data
  scoreDialogVisible.value = true;
}

/**
 * 为对应用户分配角色
 */
function doMyAssign(){
  isLoadingAssignBtn.value = true
  const assighVo = {
    userId: checkedUser.value.info.id,
    roleIdList: userRoleIds.value,
  };
  console.log(assighVo)
  doAssign(assighVo).then(()=>{
    assignDialogOpen.value = false;
    useSuccessTip("分配角色成功");
    isLoadingAssignBtn.value = false
    getMyPageData();
  }).catch(()=>{
    isLoadingAssignBtn.value = false
  })
};

/**
 * 展示分配的角色，以及弹窗的初始化
 */
function showAssignRole(user) {
  isIndeterminate.value = true;
  userRoleIds.value = user.roleList.map((role) => role.id);
  assignDialogOpen.value = true;
  checkedUser.value = user;
}

/**
 * 实现角色的全选以及全不选
 */
function handleCheckAllChange() {
  userRoleIds.value = checkAll.value
    ? allRoles.value.map((role) => role.id)
    : [];
  isIndeterminate.value = false;
}

/**
 * 初始化专业信息
 */
const initDepartments = async()=>{
  let res = await getAllDepartments()
  departments.value = res
}

/**
 * 初始化 角色信息
 */
const initRoles = async () => {
  let res = await getAllRoles();
  allRoles.value = res;
};

/**
 * 发请求获取分页数据
 */
const getMyPageData = async () => {
  isLoadingTable.value = true;
  pageReqData.value.queryObj.keyword = removeSpace(
    pageReqData.value.queryObj.keyword
  );

  pageReqData.value.queryObj.startCreateTime = formatDate(pageReqData.value.queryObj.startCreateTime)
  pageReqData.value.queryObj.endCreateTime = formatDate(pageReqData.value.queryObj.endCreateTime)

  pageReqData.value.size = pageData.value.size;
  pageReqData.value.page = pageData.value.current;

  let data = await getPageData(pageReqData.value);
  // console.log(data)
  pageData.value = data;
  // 获取头像信息
  pageData.value.records.forEach(user => {
    initAvatarOne(user.info)
  })
  isLoadingTable.value = false;
};
/**
 * 初始化一个用户的头像
 * @param {Object} userInfo 
 */
const initAvatarOne = async(userInfo)=>{
  isLoadingTable.value = true
  let res = await getUserAvatar(userInfo.id)
  userInfo.avatarUrl = res
  isLoadingTable.value = false
}
/**
 * 发请求删除一个用户
 */
function deleteOneUser(user) {
  useSimpleConfirm(`你确定要删除用户 “${user.name}” 吗？`).then(async () => {
    let data = await removeOne(user.id);
    getMyPageData(); // 刷新数据
    useSuccessTip(`删除用户 “${user.name}” 成功`);
  });
}

/**
 * 获取随机颜色字符串
 * @returns 随机颜色字符串
 */
function getRandColor() {
  const colorArr = [
    "rgb(57,25,149)",
    "rgb(255,170,43)",
    "rgb(30,174,122)",
    "rgb(57,25,149)",
  ];
  return colorArr[getRandomNumber(0, colorArr.length - 1)];
}

/**
 * 获取一个用户的角色姓名连起来的字符串 eg: xx管理员、xx管理员
 * @param {Object} user
 * @returns 用户的角色姓名连起来的字符串
 */
function getRolesNameStr(user) {
  let nameStr = "";
  for (let i = 0; i < user.roleList.length; i++) {
    if (i != 0) {
      nameStr += "、";
    }
    nameStr += user.roleList[i].roleName;
  }
  return nameStr;
}
// 生成选择日期 框中的文字
function getChooseDateText() {
  if (iptDate.value[0] == null || iptDate.value[1] == null) {
    return "选择创建日期";
  }
  return `${formatDateNotTime(
    iptDate.value[0]
  )}&nbsp&nbsp&nbsp到&nbsp&nbsp&nbsp ${formatDateNotTime(iptDate.value[1])}`;
}

/**
 * 监听输入日期的变化，更新显示数据
 */
watch(
  iptDate,
  (newValue, oldValue) => {
    if (newValue[0] != null && newValue[1] != null) {
      if (newValue[0] > newValue[1]) {
        newValue[1] = newValue[0];
      }
      pageReqData.value.queryObj.startCreateTime = newValue[0];
      pageReqData.value.queryObj.endCreateTime = newValue[1];
      getMyPageData();
    }
  },
  { deep: true }
);

onMounted(() => {
  getMyPageData();
  initRoles();
  initDepartments();
});
</script>

<style lang="scss" scoped>
@import url("../../../assets/font/iconfont.css");
@import "../../../styles/globalPage.scss";
@import "../../../styles/commonFlexStyles.scss";
@import "../../../styles/common.scss";

$ico-btn-color: rgb(255, 97, 117);

.userAllSty {
  .funBar {
    @include flex-center-y;
    justify-content: space-between;
    padding-bottom: 20px;
    .iptBar {
      @include flex-center-y;
      padding: 10px 10px;
      background: #fff;
      box-shadow: $small-box-shadow;
      border-radius: 10px;
      input {
        font-size: 15px;
        border: 0;
        &:focus {
          @include ipt-focus;
        }
      }
      .btnIco {
        cursor: pointer;
        border: 0;
        background-color: transparent;
        font-size: 25px;
      }
    }
    .calendarBar {
      cursor: pointer;
      @include flex-center-y;
      padding: 10px 20px;
      background-color: #fff;
      box-shadow: $small-box-shadow;
      border-radius: 10px;
      user-select: none;
      .txt {
        // min-width: 200px;
        min-width: 150px;
        // margin-right: 100px;
        .ico {
          font-size: 20px;
          margin-right: 10px;
          color: $ico-btn-color;
        }
      }
      .clear {
        margin-left: 15px;
        color: $ico-btn-color;
        font-size: 18px;
        &:hover {
          color: #c4c4c4;
        }
      }
      .ico2 {
        color: #c4c4c4;
      }
      .act {
        display: inline-block;
        transform: rotate(-90deg);
      }
    }
    .addIco {
      font-size: 15px;
      margin-left: 25px;
    }
  }
}
.tipMsg{
  color: rgb(245,114,114);
}
  

.my-header{
  @include flex-center-y;
  border-bottom: 1px solid;
}
.myPage {
  margin-top: 15px;
  padding: 10px 0;
  // float: right;
  display: grid;
  grid-template-columns: 10fr 1fr 0.5fr 1fr 0.5fr 1fr;
}
.myBox {
  display: flex;
  flex-wrap: wrap;
}
.icoBox {
  @include flex-center-y;
  // justify-content: space-between;
  user-select: none;
  .linkIco {
    cursor: pointer;
    font-size: 22px;
    color: $ico-btn-color;
    padding: 8px;
    background-color: rgb(255, 231, 234);
    border-radius: 10px;
    margin-right: 20px;
  }
  .linkIco:hover {
    background-color: rgb(221, 214, 215);
  }
}
.moreBox {
  text-align: center;
}
.operationBox {
  @include flex-center-y;
  justify-content: space-between;
  .more {
    cursor: pointer;
    font-size: 22px;
  }
}
:deep() {
  th.el-table__cell {
    font-size: 15px;
    color: black;
  }
  .el-table__body-wrapper{
    td{
       color: rgb(89,89,89); 
    }
  }
}
.calendarBox {
  display: flex;
  justify-content: space-between;
  .tip {
    height: 342.5px;
    width: 2.5px;
    border-radius: 100px;
    background-color: rgba(2, 63, 153, 0.5);
  }
}
.nameBar {
  @include flex-center-y;
  .avatar {
    margin-right: 15px;
  }
}
</style>