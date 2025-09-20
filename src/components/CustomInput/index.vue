<template>
    <input v-bind="$attrs" ref="inputRef" @input="handleInput" @change="handleChange" :value="modelValue"
        :disabled="disabled" :type="inputType" :placeholder="placeholder"
        style="height: 100%;outline: none;border: 0;" />
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
    modelValue: String,
    disabled: Boolean,
    inputType: {
        type: String,
        default: 'text'
    },
    placeholder: {
        type: String,
        default: '请输入内容'
    }
})

const emits = defineEmits(['update:modelValue', 'change'])

const inputRef = ref(null)

// 暴露focus方法
const focus = () => {
    inputRef.value?.focus()
}

const handleInput = (event) => {
    emits('update:modelValue', event.target.value)
}

const handleChange = (event) => {
    emits('change', event.target.value)
}

defineExpose({
    focus
})
</script>