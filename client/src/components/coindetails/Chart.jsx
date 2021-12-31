import React from 'react';
import '../../styles/coindetails.css';
import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip);

const Chart = (props) => {

    const {price, time, changeInterval} = props;
    const timeLabels = time.map(el => {
        let d = new Date(el);
        return d.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        })
    });

    let delayed;
    
    const data = {
        toolTipContent: 'yo',
        labels: timeLabels,
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
              ticks: {
                autoskip: true,
                maxTicksLimit: 15
              }
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
          <Line data={data} options={options}/>
        </div>
    )
}

export default Chart
