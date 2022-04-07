<template>
  <div class="chart-container" style="display: flex;">

    <div ref="total" class="chart" style="height: 50%;;width:50%" />
    <div ref="day" class="chart" style="height: 50%;;width:50%" />
    <div ref="month" class="chart" style="height: 50%;;width:50%" />
    <div ref="year" class="chart" style="height: 50%;;width:50%" />
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  data() {
    return {
      dataSource: null,
      totalchart: null,
      daychart: null,
      monthchart: null,
      yearchart: null
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
                break
              case 1:
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
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
                break
              case 1:
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
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
                break
              case 1:
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
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
      axios.get('orders/findYear').then((res) => {
        const { list: total } = res.data
        this.dataSource = total
        this.updateYearChart()
      })
    },
    updateYearChart() {
      const addtimeList = this.dataSource.map((item) => {
        return item.addtime
      })
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
          text: '影票年销售统计',
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
                break
              case 1:
                var content = '<div style="font-size:14px;color:#666;font-weight:400;line-height:1;">' + params.seriesName + '</div><div style="margin: 10px 0 0;line-height:1;"><div style="margin: 0px 0 0;line-height:1;"><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span><span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">' + params.name + '</span><span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">' + params.data + '元</span><div style="clear:both"></div></div><div style="clear:both"></div></div>'
                return content
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
      this.yearchart.setOption(option)
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

