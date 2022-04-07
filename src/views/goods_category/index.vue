<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.value" placeholder="请输入分类名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="日期" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addtime | fmtTime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品分类" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.fenlei }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
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

        <el-form-item label="商品分类" prop="fenlei" style="font-size: 12px;">
          <el-input v-model="temp.fenlei" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateinfo()">
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
      imageUrl: '',
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        value: ''
      },
      temp: {
        fenlei: ''
      },
      rules: {
        fenlei: [{
          required: true,
          message: '商品分类是必填项',
          trigger: 'change'
        }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '添加'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      axios.get('shangpinfenlei/spfl', { params: this.listQuery }).then((res) => {
        // console.log(res);
        this.list = res.data.list
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateinfo() {
      this.$refs['dataForm'].validate((valid) => {
        const tempData = Object.assign({}, this.temp)
        // console.log(tempData)
        if (valid) {
          axios.post('shangpinfenlei/updatespfl', tempData).then((res) => {
            // console.log(res);
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
            // eslint-disable-next-line handle-callback-err
            .catch((error) => {
              this.$notify({
                title: 'Warning',
                message: '商品分类重复，请重新输入！',
                type: 'warning',
                duration: 2000
              })
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
    },
    handleDelete(row, index) {
      // console.log(row)
      // console.log(JSON.stringify(row.id));
      axios.post('shangpinfenlei/del', JSON.stringify(row.id)).then((res) => {
        // console.log(res);
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },

    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        addtime: new Date(),
        fenlei: ''
      }
    }

  }
}

</script>
