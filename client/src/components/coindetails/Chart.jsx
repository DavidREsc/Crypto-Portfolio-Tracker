import React from 'react';
import 'chartjs-adapter-moment';
import '../../styles/coindetails.css';
import {VscTriangleDown} from 'react-icons/vsc';
import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    TimeScale
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    Tooltip);

const Chart = (props) => {

    const {coinDetails, price, time, changeInterval, percent} = props;
    let delayed;

    const data = {
        toolTipContent: 'yo',
        labels: time,
        datasets: [
          {
            label: 'Price',
            data: price,
            fill: false,          // Don't fill area under the line
            borderColor: 'orange', 
            backgrounColor: "#FC9408", // Line color
            borderWidth: 1.7
          }
        ]
      }
      
      const options = {  
          maintainAspectRatio: false,
          scales: {
            xAxes: {
              type: 'time',
            }
          },
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (context.type === 'data' && context.mode === 'default' && !delayed) {
                delay = context.dataIndex * 1 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
          elements: {
            point: {
                radius: 0
            },
        },
      };

    return (
        <div className='chart-container'>
          <div className='chart-btns'>
            <button onClick={changeInterval} data-id='1'>24h</button>
            <button onClick={changeInterval} data-id='7'>7d</button>
            <button onClick={changeInterval} data-id='30'>30d</button>
            <button onClick={changeInterval} data-id='60'>60d</button>
            <button onClick={changeInterval} data-id='365'>1y</button>
          </div>
          <div style={percent < 0 ? {color:'red'} : {color:'green'}} className='price-percentage'>
              <h2 style={{color:'white'}}>
                  {'$' + coinDetails.market_data.current_price.cad}
              </h2>
              <h2>
                  <VscTriangleDown style={percent < 0 ? '' : {transform: 'rotate(180deg)'}}/>{" " + Math.abs(percent).toFixed(2) + "%"}
              </h2>
          </div>
          <Line data={data} options={options}/>
        </div>
    )
}

export default Chart
