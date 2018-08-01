<template>
  <div class="gArea">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="optionTitle" name="addTable">
        <el-form :model="createForm" :rules="createRules" ref="createForm" label-width="120px" class="basic-info-section">
          <el-form-item label="餐桌编号" prop="number">
            <el-input-number v-model="createForm.number" :min="0" :max="9999999"></el-input-number>
          </el-form-item>
          <el-form-item label="餐桌名称" prop="name">
            <el-input v-model="createForm.name" placeholder="请输入餐桌名称"></el-input>
            <el-button type="success" @click="generateName">按照餐桌编号生成</el-button>
          </el-form-item>
          <el-form-item label="餐桌类型" prop="type">
            <el-select v-model="createForm.type" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveCategory">{{optionBtnTitle}}</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="批量添加" name="batAddTable">
        <el-form :model="batCreateForm" :rules="createRules" ref="batCreateForm" label-width="120px" class="basic-info-section">
          <el-form-item label="餐桌编号" required>
            <el-row>
              起始：
              <el-input-number v-model="batCreateForm.start" :min="1" :max="999999999"></el-input-number>
            </el-row>
            <el-row>
              结束：
              <el-input-number v-model="batCreateForm.end" :min="2" :max="999999999"></el-input-number>
            </el-row>
          </el-form-item>
          <el-form-item label="餐桌类型" prop="type">
            <el-select v-model="batCreateForm.type" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="batAddCategory">批量添加餐桌</el-button>
            <div style="color:orange;">注：一次批量最多添加50个</div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'addTable',
      enable: "1",
      isrecommand: "0",
      id: '',
      optionTitle: '添加餐桌',
      optionBtnTitle: '添加餐桌',
      displayorder: 0,
      createForm: {
        name: '',
        type: '0',
        number: '',
      },
      batCreateForm: {
        end: 2,
        start: 1,
        type: '0'
      },
      typeOptions: [{
        label: '1~2人桌',
        value: '0'
      }, {
        label: '3~4人桌',
        value: '1'
      }, {
        label: '5~6人桌',
        value: '2'
      }, {
        label: '7~8人桌',
        value: '3'
      }, {
        label: '包厢',
        value: '4'
      }, {
        label: '吧台',
        value: '5'
      }, {
        label: '其他',
        value: '6'
      }],
      createRules: {}
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.optionTitle = '修改餐桌',
      this.optionBtnTitle = '保存餐桌',
      this.getTableInfo()
    }
  },
  methods: {
    generateName() {
      this.$refs['createForm'].validateField('number', errorMsg => {
        if (errorMsg) {
          console.error(errorMsg);
        } else {
          this.createForm.name = this.createForm.number + '号桌';
        }
      });
    },
    saveCategory() {
      this.$refs['createForm'].validate(valid => {
        if (this.createForm.name === "") {
          return false
        }
        if (this.id) {
          this.$ajax.post('table/updateTable',{
            id: this.id,
            userId: sessionStorage.getItem('token'),
            tableType: this.createForm.type,
            tablName: this.createForm.name,
            num: this.createForm.number,
          }).then(e => {
            if(e.data.success='success') {
              this.$router.push({name:'TableList'})
              this.$MyMessage.success('修改成功')
            }else {
              this.$MyMessage.error('请不要添加重复的字段')
            }
          }).catch(e => {})
        } else {
          let ref = [{
            userId: sessionStorage.getItem('token'),
            tableType: this.createForm.type,
            tablName: this.createForm.name,
            num: this.createForm.number,
          }]
          this.$ajax.post('table/addTable',{
            tableList: JSON.stringify(ref)
          }).then(e => {
            if(e.data.success='success') {
              this.$router.push({name:'TableList'})
              this.$MyMessage.success('添加成功')
            }else {
              this.$MyMessage.error('请不要添加重复的字段')
            }
          }).catch(e => {})
        }
      })
    },
    batAddCategory() {
      let ref = []
      for(let i = this.batCreateForm.start; i <= this.batCreateForm.end; i++) {
        ref.push({
          userId: sessionStorage.getItem('token'),
          tableType: this.batCreateForm.type,
          tablName: i+'号桌',
          num: i,
        })
      }
      this.$refs['batCreateForm'].validate(valid => {
        this.$ajax.post('table/addTable',{
          tableList: JSON.stringify(ref)
        }).then(e => {
          if(e.data.success='success') {
            this.$router.push({name:'TableList'})
            this.$MyMessage.success('添加成功')
          }else {
            this.$MyMessage.error('请不要添加重复的字段')
          }
        }).catch(e => {})
      })
    },
    getTableInfo(cid) {
      this.$ajax.post('table/getTable',{
        id: this.id,
      }).then(e => {
        this.createForm.name = e.data.result.tablName
        this.createForm.number = e.data.result.num
        this.createForm.type = e.data.result.tableType+''
      }).catch(e => {})
    }
  }
}

</script>
<style lang="less" scoped>
.basic-info-section {
  .el-input {
    width: 210px !important;
  }
}
</style>
