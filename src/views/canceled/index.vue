<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.value" placeholder="请输入用户手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 20px;">
        搜索
      </el-button>
    </div>
    
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单编号" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.orderid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="电影名称" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.goodname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="票数" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.buynumber}}张</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.price}}元</span>
        </template>
      </el-table-column>
      <el-table-column label="总价" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.total}}元</span>
        </template>
      </el-table-column>

      <el-table-column label="支付方式" width="110px" align="center">
        <template slot-scope="{row}">

          <span v-if="row.type === 1">线上支付</span>
          <span v-else>线下支付</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已选座位" width="102px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address}}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="104px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.addtime | fmtTime('YYYY-MM-DD HH:MM') }}</span>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
        style="width: 400px; margin-left:50px;">

        <el-form-item label="订单编号" prop="orderid">
          <el-input v-model="temp.orderid" />
        </el-form-item>

        <el-form-item label="电影名称" prop="goodname">
          <el-input v-model="temp.goodname" />
        </el-form-item>

        <el-form-item label="票数" prop="buynumber">
          <el-input v-model="temp.buynumber" />
        </el-form-item>
        <el-form-item label="单价" prop="price">
          <el-input v-model="temp.price" />
        </el-form-item>

        <el-form-item label="总价" prop="total">
          <el-input v-model="temp.total" />
        </el-form-item>

        <el-form-item label="支付类型" prop="type">
          <el-select v-model="temp.type" filterable placeholder="请选择支付类型">
            <el-option
              v-for="(item,index) in typeoptions"
              :key="index"
              :label="item.str"
              :value="item.val">
            </el-option>
          </el-select>
      </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" filterable placeholder="请选择订单状态">
            <el-option
              v-for="(item,index) in statusoptions"
              :key="index"
              :label="item.val"
              :value="item.val">
            </el-option>
          </el-select>
      </el-form-item>
        <el-form-item label="已选座位" prop="address">
          <el-input v-model="temp.address" />
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
    name: 'index',
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
        typeoptions: [
          {
            str:'线上支付',
            val:1
          },
          {
            str:'线下支付',
            val:2
          },
        ],
        statusoptions: [
          {
            val:'已完成',
          },
          {
            val:'已取消',
          },
          {
            val:'已支付',
          },
          {
            val:'已退款',
          },
          {
            val:'未支付',
          }
        ],
        tableKey: 0,
        // action:"http://localhost:8080/movie_ssm_war/shangpingoumai/updatehm",
        // newaction:'',
        list: null,
        total: 0,
        listLoading: true,
        // imageUrl: '',
        listQuery: {
          page: 1,
          limit: 20,
          sort: '+id',
          value:''
        },
        temp: {
          orderid: '',
          goodname:'',
          buynumber:'',
          price:'',
          total:'',
          type:'',
          status:'',
          address:'',
        },
         rules: {
          price: [{
            // required: true,
            pattern:/^-?[1-9]\d*$/,
            message: '请输入整数',
            trigger: 'blur'
          }],
          total: [{
            // required: true,
            pattern:/^-?[1-9]\d*$/,
            message: '请输入整数',
            trigger: 'blur'
          }],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改商品订单信息'
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
    getList() {
      this.listLoading = true
      axios.get('orders/yqxinfo',{params:this.listQuery}).then((res) => {
        //console.log(res.data);
        this.list = res.data.list
        this.total = res.data.total
      })
      this.listLoading = false
    },
    handleUpdate(row) {
      this.imageUrl = this.$baseUrl.url+row.tupian
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      //console.log(this.temp.dianyingjianjie);
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
        //console.log(tempData)
        if (valid) {
          axios.post('orders/updateod', tempData).then((res) => {
            //console.log(res);
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp);
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
      //console.log(data);
      const { prop,order } = data
      //console.log(prop,order);
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
      //console.log(this.listQuery)
      this.getList()
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    handleDelete(row, index) {
      //console.log(row)
      //console.log(JSON.stringify(row.id));
      axios.post('orders/del',JSON.stringify(row.id)).then((res) => {
        //console.log(res);
        this.$notify({
        title: 'Success',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    })
    },


   /*  handlehaibaoSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.temp.tupian = res
      //console.log(this.temp);
    }, */
   /*  beforehaibaoUpload(file) {
      this.newaction = this.action+'?uid='+file.uid
      //console.log("img");
      //console.log(this.newaction);
    }, */
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
  },
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