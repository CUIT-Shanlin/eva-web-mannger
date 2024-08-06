<!-- 自己封装的普通按钮，即自动生成 多种状态颜色的按钮 -->
<template>
    <button :class="{btn: true, largeBtn: isLarge}">{{txt}}</button>
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
    }
})
const defaultColor = ref(props.defaultColor)

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
</script>

<style lang="scss" scoped>

.btn{
    $default-color: v-bind(defaultColor);
    background: $default-color;
    border: 0;
    outline: none;
    color: #FFF;
    padding: 5px 15px;
    border-radius: 5px;
    &:hover{
        background: v-bind(getHoverColor());
    }
    &:active{
        background: v-bind(getActiveColor());
    }
    &:disabled{
        background: v-bind(getDisabledColor());
        cursor: not-allowed;
    }
}
.largeBtn{
    padding: 10px 35px;
    border-radius: 12px;
}

</style>