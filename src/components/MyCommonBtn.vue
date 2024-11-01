<!-- 自己封装的普通按钮，即自动生成 多种状态颜色的按钮 -->
<template>
    <button :class="[plain ? 'plainBtn' : 'btn', isLarge ? 'largeBtn' : '']">
        <i class="iconfont ico" v-html="ico" v-if="ico != ''"></i>
        {{txt}}
    </button>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { colorStrToArr } from '@/utils/stringUtil'

let props = defineProps({
    defaultColor: {
        type: String,
        default(){
            return 'rgb(64,158,255)'
        }
    },
    txt: {
        type: String,
        default(){
            return ''
        }
    },
    isLarge: {
        type: Boolean,
        default(){
            return false
        }
    },
    ico: {
        type: String,
        default(){
            return ''
        }
    },
    icoSize: {
        type: String,
        default(){
            return '22px'
        }
    },
    plain: {
        type: Boolean,
        default(){
            return false
        }
    }
})
const defaultColor = ref(props.defaultColor)
const icoSize = ref(props.icoSize)
/**
 * 获取hover的颜色
 */
function getHoverColor(){
    const arr = colorStrToArr(defaultColor.value)
    return `rgb(${arr[0] + 57},${arr[1] + 29},${arr[2]})`
}

/**
 * 获取active的颜色
 */
 function getActiveColor(){
    const arr = colorStrToArr(defaultColor.value)
    return `rgb(${arr[0] - 13},${arr[1] - 32},${arr[2] - 51})`
}

/**
 * 获取disabled的颜色
 */
 function getDisabledColor(){
    const arr = colorStrToArr(defaultColor.value)
    return `rgba(${arr[0] + 96},${arr[1] + 49},${arr[2]},0.5)`
}

/**
 * 获取plain状态下的hover背景色
 */
function getPlainHoverColor(){
    const arr = colorStrToArr(defaultColor.value)
    return `rgba(${arr[0] + 172},${arr[1] + 87},${arr[2]},0.5)`
}

</script>

<style lang="scss" scoped>
@import url('../assets/font/iconfont.css');

$default-color: v-bind(defaultColor);
.btn, .plainBtn{
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px transparent solid;
    outline: none;
    color: #FFF;
    padding: 5px 15px;
    border-radius: 5px;
    box-sizing: border-box;
    &:disabled{
        cursor: not-allowed;
    }
}
.btn{
    background: $default-color;
    &:hover{
        background: v-bind(getHoverColor());
    }
    &:active{
        background: v-bind(getActiveColor());
    }
    &:disabled{
        background: v-bind(getDisabledColor());
    }
    .ico{
        font-size: v-bind(icoSize);
        margin-right: 5px;
    }
}
.plainBtn{
    background-color: #FFF;
    border-color: $default-color;
    color: $default-color;
    &:hover{
        background: v-bind(getPlainHoverColor());
    }
    &:disabled{
        background: #F5F5F5;
    }
}
.largeBtn{
    min-width: 100px;
    padding: 10px 35px;
    border-radius: 12px;
}

</style>