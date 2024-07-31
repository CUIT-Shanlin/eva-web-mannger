<template>
    <div class="userAllSty">
        <PageTitle content="用户列表"/>
        <div class="funBar">
            <form class="iptBar" @submit.prevent="show">
                <input v-model="keyword" placeholder="请输入姓名或用户名" />
                <button class="iconfont btnIco" >&#xe602;</button>
            </form>

            <el-date-picker />
            <el-popover
            placement="bottom"
            trigger="click"
            :visible=isChoose
            :width="350"
            >
                <template #reference>
                    <el-button style="margin-right: 100px;">点我选择日期</el-button>
                </template>
                <MyDatePicker v-model="iptDate"/>
            </el-popover>
        </div>
        
    </div>
</template>

<script setup>
import PageTitle from '@/components/PageTitle.vue';
import { ref } from 'vue';
import { formatDate } from '@/utils/dateUtil';
import MyDatePicker from '@/components/MyDatePicker.vue';

const keyword = ref('');

const iptDate = ref(new Date());
function show(){
    console.log()
    alert(keyword.value + formatDate(iptDate.value))
}
</script>

<style lang="scss" scoped>
@import url('../../../assets/font/iconfont.css');
@import '../../../styles/globalPage.scss';
@import '../../../styles/commonFlexStyles.scss';
@import '../../../styles/common.scss';

.userAllSty{
    .funBar{
        @include flex-center-y;
        justify-content: space-between;
        .iptBar{
            @include flex-center-y;
            padding: 10px 10px;
            background: #FFF;
            box-shadow: $small-box-shadow;
            border-radius: 10px;
            input{
                font-size: 15px;
                border: 0;
                &:focus{
                    @include ipt-focus;
                }
            }
            .btnIco{
                border: 0;
                background-color: transparent;
                font-size: 25px;
            }
        }
    }
}
.hiddenDate{
    position: relative;
    width: 0px;
}
.myDate{
    position: absolute;
    right: 0;
    z-index: 10000000000;
}
</style>