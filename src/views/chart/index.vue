<template>
  <div class="chart-container" style="display: flex;position: relative;">

    <div ref="total" class="chart" style="height: 50%;;width:50%" />
    <div ref="day" class="chart" style="height: 50%;;width:50%" />
    <div ref="month" class="chart" style="height: 50%;;width:50%" />
    <div ref="year" class="chart" style="height: 50%;;width:50%;" />
    <div class="container" style="position: absolute;top: 25.5em;right: 37.5em;">
      <div class="block">
        <el-date-picker
          v-model="yeartime"
          type="year"
          style="width:100px;"
          @change="getyeartime"
        />
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
import resize from './mixins/resize'
import dayjs from 'dayjs'
export default {
  mixins: [resize],
  data() {
    return {
      dataSource: null,
      totalchart: null,
      daychart: null,
      monthchart: null,
      yearchart: null,
      yeartime: '',
      yeardata: ''
    }
  },
  created() {
    this.getTotalList()
    this.getDayList()
    this.getMonthList()
    this.getYearList()
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.totalchart = echarts.init(this.$refs.total)
      this.daychart = echarts.init(this.$refs.day)
      this.monthchart = echarts.init(this.$refs.month)
      this.yearchart = echarts.init(this.$refs.year)
      window.onresize = () => {
        this.totalchart.resize()
        this.daychart.resize()
        this.monthchart.resize()
        this.yearchart.resize()
      }
    },
    getTotalList() {
      axios.get('orders/findTotal').then((res) => {
        const { list: total } = res.data
        this.dataSource = total
        this.updateTotalChart()
      })
    },
    updateTotalChart() {
      const goodnameList = this.dataSource.map((item) => {
        return item.goodname
      })
      const buynumberList = this.dataSource.map((item) => {
        return item.buynumber
      })
      const totalList = this.dataSource.map((item) => {
        return item.total
      })

      const option = {
        title: {
          text: '影票销售统计',
          top: '3%',
          left: '3%'
        },
        tooltip: {
          tigger: 'axis',
          formatter: function(params, ticket, callback) {
            var index = params.seriesIndex
            switch (index) {
              case 0:
                var content =
            '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '张</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
              case 1:
                // eslint-disable-next-line no-redeclare
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
            }
          }
        },
        legend: {
          top: '5%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '7%'
        },
        xAxis: {
          type: 'category',
          data: goodnameList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          { type: 'bar', name: '销量', data: buynumberList },
          { type: 'bar', name: '销额', data: totalList }
        ]

      }
      this.totalchart.setOption(option)
    },
    getDayList() {
      axios.get('orders/findDay').then((res) => {
        const { list: total } = res.data
        this.dataSource = total
        this.updateDayChart()
      })
    },
    updateDayChart() {
      // console.log(JSON.stringify(this.dataSource))
      const addtimeList = this.dataSource.map((item) => {
        return item.addtime
      })

      const buynumberList = this.dataSource.map((item) => {
        return item.buynumber
      })
      const totalList = this.dataSource.map((item) => {
        return item.total
      })

      const option = {
        title: {
          text: '影票日销售统计',
          top: '3%',
          left: '3%'
        },
        tooltip: {
          tigger: 'axis',
          formatter: function(params, ticket, callback) {
            var index = params.seriesIndex
            switch (index) {
              case 0:
                var content =
            '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '张</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
              case 1:
                // eslint-disable-next-line no-redeclare
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
            }
          }
        },
        legend: {
          top: '5%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '7%'
        },
        xAxis: {
          type: 'category',
          data: addtimeList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          { type: 'bar', name: '销量', data: buynumberList },
          { type: 'bar', name: '销额', data: totalList }
        ]

      }
      this.daychart.setOption(option)
    },
    getMonthList() {
      axios.get('orders/findMonth').then((res) => {
        const { list: total } = res.data
        this.dataSource = total
        this.updateMonthChart()
      })
    },
    updateMonthChart() {
      const addtimeList = this.dataSource.map((item) => {
        return item.addtime
      })

      const buynumberList = this.dataSource.map((item) => {
        return item.buynumber
      })
      const totalList = this.dataSource.map((item) => {
        return item.total
      })

      const option = {
        title: {
          text: '影票月销售统计',
          top: '3%',
          left: '3%'
        },
        tooltip: {
          tigger: 'axis',
          formatter: function(params, ticket, callback) {
            var index = params.seriesIndex
            switch (index) {
              case 0:
                var content =
            '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '张</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
              case 1:
                // eslint-disable-next-line no-redeclare
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
            }
          }
        },
        legend: {
          top: '5%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '7%'
        },
        xAxis: {
          type: 'category',
          data: addtimeList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          { type: 'bar', name: '销量', data: buynumberList },
          { type: 'bar', name: '销额', data: totalList }
        ]

      }
      this.monthchart.setOption(option)
    },
    getYearList() {
      if (this.yeartime !== '') {
        this.yeardata = dayjs(this.yeartime).year()
      }
      const data = { year: this.yeardata }
      axios.get('orders/findYear', { params: data }).then((res) => {
        const { list: total } = res.data
        if (total.length == 0) {
          alert('暂无数据，请重新选择！')
        } else {
          this.dataSource = total
          this.updateYearChart()
        }
      })
    },
    updateYearChart() {
      const addtimeList = this.dataSource.map((item) => {
        return item.addtime
      })
      const buynumberList = this.dataSource.map((item) => {
        return item.buynumber
      })
      const totalList = this.dataSource.map((item) => {
        return item.total
      })

      const option = {
        title: {
          text: '影票年销售统计',
          top: '3%',
          left: 'center'
        },
        tooltip: {
          tigger: 'item',
          formatter: function(params, ticket, callback) {
            // console.log(params)
            var index = params.dataIndex
            switch (index) {
              case 0:
                /*  var content =
            '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.data.name + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.data.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data.value[0] + '张</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
             */
                var content =
            '<div style="line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.data.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data.value[0] + '张</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
              case 1:
                // eslint-disable-next-line no-redeclare
                // var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.data.name + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.data.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data.value[0] + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                var content =
            '<div style="line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.data.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data.value[0] + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
                // eslint-disable-next-line no-unreachable
                break
            }
          }
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          top: '10%'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }, /*
        grid: {
          left: '5%',
          right: '5%',
          bottom: '7%'
        },
        xAxis: {
          type: 'category',
          data: addtimeList
        },
        yAxis: {
          type: 'value'
        }, */
        /* series: [
          { type: 'pie', name: '销量', data: buynumberList },
          { type: 'pie', name: '销额', data: totalList }
        ] */
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              { value: buynumberList, name: '销量' },
              { value: totalList, name: '销额' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]

      }
      this.yearchart.setOption(option)
    },
    getyeartime() {
      this.getYearList()
    }
  }

}
</script>

<style lang="scss" scoped>
.chart-container{
  display: flex;
  flex-wrap:wrap;
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>

