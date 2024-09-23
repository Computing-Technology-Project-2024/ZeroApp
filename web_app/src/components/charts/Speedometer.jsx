import React from 'react'
import ReactSpeedometer from "react-d3-speedometer"

export default function Speedometer({value}) {
  return (
    <div>
      <ReactSpeedometer
         value={value}
         minValue={0}
         maxValue={100}
         segments={5}
         segmentColors={['#ff4e4e', '#ff8a4e', '#f5d84e', '#a2f54e', '#5ec24e']}
         needleColor="#000"
         ringWidth={30}
         textColor="#000"
         width={250}
         height={150}
      />
    </div>
  )
}
