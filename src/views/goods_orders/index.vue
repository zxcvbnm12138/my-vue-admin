<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input v-model="listQuery.value" placeholder="请输入用户手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 20px;" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="添加时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addtime | fmtTime('YYYY-MM-DD')}}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="订单编号" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.dingdanbianhao }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.shangpinmingcheng }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品图片" width="110px" align="center">
        <template slot-scope="{row}">
          <img :src="$baseUrl.url+row.tupian" style="width: 100px; height: 100px; object-fit: contain; padding-right: 10px;">
        </template>
      </el-table-column>

      <el-table-column label="规格" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.guige }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shuliang }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jiage }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.zongjine }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="102px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.xiadanshijian | fmtTime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单用户" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.yonghuming }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shouji }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否支付" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ispay }}</span>
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

        <el-form-item label="订单编号" prop="dingdanbianhao">
          <el-input v-model="temp.dingdanbianhao" />
        </el-form-item>
        <el-form-item label="商品名称" prop="shangpinmingcheng">
          <el-input v-model="temp.shangpinmingcheng" />
        </el-form-item>
        <el-form-item label="商品图片" prop="tupian">
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

        <el-form-item label="规格" prop="guige">
          <el-input v-model="temp.guige" />
        </el-form-item>
        <el-form-item label="数量" prop="shuliang">
          <el-input v-model="temp.shuliang" />
        </el-form-item>

        <el-form-item label="价格" prop="jiage">
          <el-input v-model="temp.jiage" />
        </el-form-item>
        <el-form-item label="总金额" prop="zongjine">
          <el-input v-model="temp.zongjine" />
        </el-form-item>
        <el-form-item label="下单时间" prop="xiadanshijian">
          <div class="block">
            <el-date-picker
              v-model="temp.xiadanshijian"
              type="datetime"
              placeholder="选择下单时间"
              default-time="12:00:00"
            />
          </div>
        </el-form-item>
        <el-form-item label="下单用户" prop="yonghuming">
          <el-input v-model="temp.yonghuming" />
        </el-form-item>
        <el-form-item label="手机号" prop="shouji">
          <el-input v-model="temp.shouji" />
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
      // spfloptions: [],
      tableKey: 0,
      action: 'http://localhost:8080/movie_ssm_war/shangpingoumai/updatehm',
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
        dingdanbianhao: '',
        shangpinmingcheng: '',
        tupian: '',
        guige: '',
        shuliang: '',
        jiage: '',
        zongjine: '',
        xiadanshijian: '',
        yonghuming: '',
        shouji: ''
      },
      rules: {
        shuliang: [{
          // required: true,
          pattern: /^-?[1-9]\d*$/,
          message: '请输入整数',
          trigger: 'blur'
        }],
        jiage: [{
          // required: true,
          pattern: /^-?[1-9]\d*$/,
          message: '请输入整数',
          trigger: 'blur'
        }],
        zongjine: [{
          // required: true,
          pattern: /^-?[1-9]\d*$/,
          message: '请输入整数',
          trigger: 'blur'
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
      axios.get('shangpingoumai/spgminfo', { params: this.listQuery }).then((res) => {
        // console.log(res.data);
        this.list = res.data.list
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.imageUrl = this.$baseUrl.url + row.tupian
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // console.log(this.temp.dianyingjianjie);
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      /* axios.get('shangpinfenlei/spflAll').then((res) => {
        //console.log(res);
        this.spfloptions = res.data
      }) */
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
          axios.post('shangpingoumai/updatespgm', tempData).then((res) => {
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
      axios.post('shangpingoumai/del', JSON.stringify(row.id)).then((res) => {
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
      this.temp.tupian = res
      // console.log(this.temp);
    },
    beforehaibaoUpload(file) {
      this.newaction = this.action + '?uid=' + file.uid
      // console.log("img");
      // console.log(this.newaction);
    }
    /* handlevideoSuccess(res, file) {
      this.videoUrl = URL.createObjectURL(file.raw)
      this.temp.dianyingyugao = res
      //console.log(this.temp);
    },
    beforevideoUpload(file) {
      this.newvideoaction = this.action+'?uid='+file.uid
      //console.log("mp4");
      //console.log(this.newvideoaction)
    } */
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
