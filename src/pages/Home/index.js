import React from 'react'
import Bar from '@/components/Bar'

export default function Home() {

  
  return (
    <div >
      <Bar
      title='三大框架满意度'
      xData={['vue', 'angular', 'react']}
      yData={[50, 60, 70]}
      style={{ width: '500px', height: '400px' }}
     />
    </div>
  )
}
