import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement);

const Chart = (props) => {

    const {price, time} = props;
    const timeLabels = time.map(el => {
        let d = new Date(el);
        return d.toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
        })
    });

    let delayed;
    
    const data = {
        labels: timeLabels,
        datasets: [
          {
            label: 'Price',
            data: price,
            fill: false,          // Don't fill area under the line
            borderColor: 'orange'  // Line color
          }
        ]
      }
      
      const options = {  
          maintainAspectRatio: false,
          scales: {
            xAxes: {
              ticks: {
                autoskip: true,
                maxTicksLimit: 20
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
                delay = context.dataIndex * 3 + context.datasetIndex * 100;
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
            <button>30</button>
            <Line data={data} options={options}/>
        </div>
    )
}

export default Chart
