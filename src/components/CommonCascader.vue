<template>
    <el-cascader
      v-model="selectedValues"
      :options="options"
      :show-all-levels="false"
      :props="{ expandTrigger: 'hover' }"
      @change="handleChange"
      placeholder="请选择疾病分类"
      clearable
    ></el-cascader>
</template>

<script>
import { getFormData } from '../utils/api'

export default {
    name: 'Cascader',
    props: {
        url: {
            type: String,
            required: true
        },
    },
    data() {
        return {
        options: [
            {
                value: "", // 第一级别选项的值为空
                label: "", // 第一级别选项的标签为空
                children: [] // 第一级别选项没有子选项
            }
        ],
        selectedValues: []
        }
    },
    methods: {
        handleChange(selectedValues) {
            this.selectedValues = selectedValues
            this.$emit('change', selectedValues)
        },
        loadOptions() {
            // console.log(11111111)
            getFormData(this.url,{}).then((resp) => {
                // console.log(resp.data.data)
                this.options.pop()
                this.updateCascaderData(resp.data.result.disease_types)
            })
        },
        updateCascaderData(response) {
            const diseaseTypes = response;
            diseaseTypes.forEach(type => {
                const typeObj = {
                    value: type.disease_id,
                    label: type.disease_type,
                    children: []
                };
                type.children.forEach(child => {
                    typeObj.children.push({
                    value: child.disease_type_id,
                    label: child.disease_type_name
                    });
                });
                
                this.options.push(typeObj);
                // console.log(typeObj)
            });
      }
    },
    mounted() {
        this.loadOptions()
    }
}
</script>
