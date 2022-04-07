<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="160px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消息列表" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ask }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100px">
        <template slot-scope="{row}">
          <span v-if="row.isreply == 1" class="el-tag el-tag--success el-tag--medium el-tag--light">未回复</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="回复信息" prop="reply" style="font-size: 12px;">
          <el-input
            v-model="temp.reply"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatepwd()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios'
import dayjs from 'dayjs'

export default {
  name: 'Index',
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    fmtTime(v, str) {
      return dayjs(v).format(str)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id'
      },
      temp: {
        reply: ''
      },
      rules: {
        reply: [{
          required: true,
          message: '回复信息是必填项',
          trigger: 'change'
        }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '客服中心'
      }
    }
  },
  created() {
    this.getList()
  },

  methods: {
    getList() {
      this.listLoading = true
      axios.get('chat/chatinfo', { params: this.listQuery }).then((res) => {
        // console.log(res);
        this.list = res.data.list
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.isreply = 0
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updatepwd() {
      this.$refs['dataForm'].validate((valid) => {
        const tempData = Object.assign({}, this.temp)
        // console.log(tempData)
        if (valid) {
          axios.post('chat/updatechat', tempData).then((res) => {
            // console.log(res);
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '回复成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    sortChange(data) {
      // console.log(data);
      const { prop, order } = data
      // console.log(prop,order);
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      // console.log(this.listQuery)
      this.getList()
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }

  }
}

</script>

<style lang="scss">
.el-table td, .el-table th.is-leaf {
    text-align: center;
}
.el-form--label-left .el-form-item__label {
    font-size: 12px;
}
</style>
