<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.value" placeholder="请输入用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

      <el-table-column label="用户名" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.yonghuming }}</span>
        </template>
      </el-table-column>

      <el-table-column label="密码" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.mima }}</span>
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xingming }}</span>
        </template>
      </el-table-column>

      <el-table-column label="头像" width="110px" align="center">
        <template slot-scope="{row}">
          <img :src="$baseUrl.url+row.touxiang" style="width: 100px; height: 100px; object-fit: contain; padding-right: 10px;">
          <!-- <img src="../../assets/user.jpg" style="width: 100px; height: 100px; object-fit: contain; padding-right: 10px;"> -->
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xingbie }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shouji }}</span>
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

        <el-form-item label="用户名" prop="yonghuming">
          <el-input v-model="temp.yonghuming" />
        </el-form-item>
        <el-form-item label="密码" prop="mima">
          <el-input v-model="temp.mima" />
        </el-form-item>
        <el-form-item label="姓名" prop="xingming">
          <el-input v-model="temp.xingming" />
        </el-form-item>
        <el-form-item label="性别" prop="xingbie">
          <el-select v-model="temp.xingbie" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="shouji">
          <el-input v-model="temp.shouji" />
        </el-form-item>
        <el-form-item label="头像" prop="touxiang">
          <el-upload
            class="avatar-uploader"
            :action="newaction"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
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
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女 ',
        label: '女'
      }],
      tableKey: 0,
      action: 'http://localhost:8080/movie_ssm_war/users/updateavater',
      newaction: '',
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
        yonghuming: '',
        mima: '',
        xingming: '',
        xingbie: '',
        shouji: '',
        touxiang: ''
      },
      rules: {
        yonghuming: [{
          required: true,
          message: '用户名是必填项',
          trigger: 'change'
        }],
        mima: [{
          required: true,
          message: '密码是必填项',
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
      axios.get('users/yonghuinfo', { params: this.listQuery }).then((res) => {
        // console.log(res);
        this.list = res.data.list
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.imageUrl = ''
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
          axios.post('users/updateinfo', tempData).then((res) => {
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
                message: '用户名重复，请重新输入！',
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
      axios.post('users/del', JSON.stringify(row.id)).then((res) => {
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(res);
      this.temp.touxiang = res
      // console.log(this.imageUrl);
      // console.log(this.temp);
    },
    beforeAvatarUpload(file) {
    // console.log(file);
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log(this.newaction);
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.newaction = this.action + '?uid=' + file.uid

      return isJPG && isLt2M
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
        yonghuming: '',
        mima: '',
        xingming: '',
        xingbie: '',
        shouji: '',
        touxiang: ''
      }
    }
  }
}

</script>

<style lang="scss" >
  .avatar-uploader .el-upload {
    border: 1px dashed #000;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
