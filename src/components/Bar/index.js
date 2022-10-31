import React,{useEffect, useRef} from 'react'
import * as echarts from 'echarts'

export default function Bar({title,xData,yData,style}) {
 // 基于准备好的dom，初始化echarts实例
  const chartRef=useRef(null)
  

  useEffect(() => {
    const chartInit=() => {
      const myChart = echarts.init(chartRef.current);
      // 绘制图表
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {},
        xAxis: {
          data: xData//['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: yData//[5, 20, 36, 10, 10, 20]
          }
        ]
      });
    } 
      chartInit()
  },[title, xData, yData ])
  
  return (
    <div ref={chartRef} style={style} ></div>
  )
}

