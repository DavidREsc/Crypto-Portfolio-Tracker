import React, {useRef, useEffect, useState} from 'react';
import formatData from '../../utils/formatData'
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

    const {coinDetails, priceHistory, changeTimePeriod} = props;
    const prevBtn = useRef();
    const [priceData, setPriceData] = useState();
    const [timeData, setTimeData] = useState();
    const [currentPrice, setCurrentPrice] = useState();
    const [percent, setPercent] = useState();
    let delayed;

    useEffect(() => {
      prevBtn.current.className = 'chart-btn-active'
    })

    useEffect(() => {
      const prices = priceHistory.history.filter(el => el.price !== null).map(el => el.price);
      const timeStamps = priceHistory.history.filter(el => el.price !== null).map(el => el.timestamp * 1000);
      setPriceData(prices);
      setTimeData(timeStamps);
      setCurrentPrice(formatData.formatNumberV2(coinDetails.price));
      setPercent(priceHistory.change);

    }, [priceHistory, coinDetails])

    const handleChangeTimePeriod = (e) => {
      prevBtn.current.className = 'chart-btn-inactive'
      prevBtn.current = e.target;
      changeTimePeriod(e);
    }

    const data = {
        labels: timeData,
        datasets: [
          {
            label: 'Price',
            data: priceData,
            fill: false,          // Don't fill area under the line
            borderColor: 'orange', 
            backgrounColor: "#FC9408", // Line color
            borderWidth: 1.5
          }
        ]
      }
      
      const options = {  
          maintainAspectRatio: false,
          scales: {
            xAxes: {
              type: 'time',
              time: {
                parser: "YYY-MM-DDTHH:mm:ss"
              },
            },
            yAxes: {
              ticks: {
                display: true
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
                delay = context.dataIndex * 1.5 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
          elements: {
            point: {
                radius: 1
            },
        },
      };

    return (
        <div className='chart-container'>
          <div className='chart-btns'>
            <button ref={prevBtn} onClick={handleChangeTimePeriod} data-id='24h'>24h</button>
            <button className='chart-btn-inactive' onClick={handleChangeTimePeriod} data-id='7d'>7d</button>
            <button className='chart-btn-inactive' onClick={handleChangeTimePeriod} data-id='30d'>30d</button>
            <button className='chart-btn-inactive' onClick={handleChangeTimePeriod} data-id='3m'>3m</button>
            <button className='chart-btn-inactive' onClick={handleChangeTimePeriod} data-id='1y'>1y</button>
            <button className='chart-btn-inactive' onClick={handleChangeTimePeriod} data-id='3y'>3y</button>
          </div>
          <div style={1 < 0 ? {color:'red'} : {color:'green'}} className='price-percentage'>
              <h2 style={{color:'white'}}>
                  {'$' + currentPrice}
              </h2>
              <h2 style={percent < 0 ? {color: 'red'} : {color: 'green'}}>
                  <VscTriangleDown style={percent < 0 ? null : {transform: 'rotate(180deg)'}}/>{" " + Math.abs(percent).toFixed(2) + "%"}
              </h2>
          </div>
          <Line data={data} options={options}/>
        </div>
    )
}

export default Chart
