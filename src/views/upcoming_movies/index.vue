<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.value" placeholder="请输入电影名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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

      <el-table-column label="添加时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addtime | fmtTime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电影名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.dianyingmingcheng }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电影类型" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.dianyingleixing }}</span>
        </template>
      </el-table-column>

      <el-table-column label="海报" width="110px" align="center">
        <template slot-scope="{row}">
          <img :src="$baseUrl.url+row.haibao" style="width: 100px; height: 100px; object-fit: contain; padding-right: 10px;">
        </template>
      </el-table-column>

      <el-table-column label="导演" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.daoyan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主演" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.zhuyan }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制片地区" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.zhipiandiqu }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电影预告" width="110px" align="center">
        <template slot-scope="{row}">
          <el-link :href="$baseUrl.url+row.dianyingyugao" target="_Blank">预览</el-link>
        </template>
      </el-table-column>
      <el-table-column label="上映时间" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shangyingriqi | fmtTime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="片长" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.pianzhang }}</span>
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

        <el-form-item label="电影名称" prop="dianyingmingcheng">
          <el-input v-model="temp.dianyingmingcheng" />
        </el-form-item>
        <el-form-item label="电影类型" prop="dianyingleixing">
          <el-select v-model="temp.dianyingleixing" filterable placeholder="请选择电影类型">
            <el-option
              v-for="(item,index) in dylxoptions"
              :key="index"
              :label="item.dianyingleixing"
              :value="item.dianyingleixing"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="海报" prop="haibao">
          <el-upload
            class="avatar-uploader"
            :action="newaction"
            :show-file-list="false"
            :on-success="handlehaibaoSuccess"
            :before-upload="beforehaibaoUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="导演" prop="daoyan">
          <el-input v-model="temp.daoyan" />
        </el-form-item>

        <el-form-item label="主演" prop="zhuyan">
          <el-input v-model="temp.zhuyan" />
        </el-form-item>

        <el-form-item label="制片地区" prop="zhipiandiqu">
          <el-input v-model="temp.zhipiandiqu" />
        </el-form-item>
        <el-form-item label="上映时间" prop="shangyingriqi">
          <div class="block">
            <el-date-picker
              v-model="temp.shangyingriqi"
              type="date"
              placeholder="选择上映时间"
            />
          </div>
        </el-form-item>
        <el-form-item label="片长" prop="pianzhang">
          <el-input v-model="temp.pianzhang" />
        </el-form-item>

        <el-form-item label="电影预告" prop="dianyingyugao">
          <el-upload
            class="avatar-uploader"
            :action="newvideoaction"
            :show-file-list="false"
            :on-success="handlevideoSuccess"
            :before-upload="beforevideoUpload"
          >
            <img v-if="videoUrl" :src="videoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="电影简介" prop="dianyingjianjie">
          <quill-editor
            ref="myQuillEditor"
            v-model="temp.dianyingjianjie"
            style="line-height: normal !important;height: 200px;"
          />
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
      dylxoptions: [],
      tableKey: 0,
      action: 'http://localhost:8080/movie_ssm_war/jijiangshangying/updatehm',
      newaction: '',
      newvideoaction: '',
      list: null,
      total: 0,
      listLoading: true,
      imageUrl: '',
      videoUrl: '',
      listQuery: {
        page: 1,
        limit: 20,
        sort: '+id',
        value: ''
      },
      temp: {
        dianyingmingcheng: '',
        dianyingleixing: '',
        daoyan: '',
        zhuyan: '',
        zhipiandiqu: '',
        shangyingriqi: '',
        pianzhang: '',
        dianyingjianjie: '',
        haibao: '',
        dianyingyugao: ''
      },
      rules: {
        dianyingmingcheng: [{
          required: true,
          message: '电影名称是必填项',
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
      axios.get('jijiangshangying/jjsyinfo', { params: this.listQuery }).then((res) => {
        // console.log(res);
        this.list = res.data.list
        this.total = res.data.total
      })
      axios.get('movietype/mtAll').then((res) => {
        // console.log(res);
        this.dylxoptions = res.data
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.imageUrl = ''
      this.videoUrl = ''
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      console.log(this.temp.dianyingjianjie)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      /* axios.get('fangyingting/fytAll').then((res) => {
        //console.log(res);
        this.fytoptions = res.data
      }) */
    },
    updateinfo() {
      this.$refs['dataForm'].validate((valid) => {
        // this.temp.dianyingjianjie = '<p>'+ this.temp.dianyingjianjie +'</p>'
        const tempData = Object.assign({}, this.temp)
        // console.log(tempData)
        if (valid) {
          axios.post('jijiangshangying/updatejjsy', tempData).then((res) => {
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
      axios.post('jijiangshangying/del', JSON.stringify(row.id)).then((res) => {
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

    handlehaibaoSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.temp.haibao = res
      // console.log(this.temp);
    },
    beforehaibaoUpload(file) {
      this.newaction = this.action + '?uid=' + file.uid
      // console.log("img");
      // console.log(this.newaction);
    },
    handlevideoSuccess(res, file) {
      this.videoUrl = URL.createObjectURL(file.raw)
      this.temp.dianyingyugao = res
      // console.log(this.temp);
    },
    beforevideoUpload(file) {
      this.newvideoaction = this.action + '?uid=' + file.uid
      // console.log("mp4");
      // console.log(this.newvideoaction)
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
        dianyingmingcheng: '',
        dianyingleixing: '',
        daoyan: '',
        zhuyan: '',
        zhipiandiqu: '',
        shangyingriqi: '',
        pianzhang: '',
        dianyingjianjie: '',
        haibao: '',
        dianyingyugao: ''
      }
    }
  }
}

</script>

<style lang="scss" >
  .el-form-item__label {
    font-size: 12px;
  }
  .el-table td, .el-table th.is-leaf{
    text-align: center;
  }
  .el-table--enable-row-transition .el-table__body td {
    text-align: center;
  }
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
