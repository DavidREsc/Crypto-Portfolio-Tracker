import React from 'react';
import parse from 'html-react-parser';

const Summary = (props) => {
    const {coinDetails} = props;

  return (
    coinDetails &&
    <div className='summary'>
        <div className='description'>
            <h3>What is {coinDetails.name}?</h3>
            {parse(coinDetails.description)}
        </div>
        <ul className='links'>
          <h3 className='links-title'>{coinDetails.name + " Links"}</h3>
          {coinDetails.links.map((link, idx) => {
            return <li key={idx} className='coin-link-row'>{link.type}
              <a className="coin-summary-link" href={link.url} target="_blank" rel="noreferrer noopener">
                {link.name}
              </a>
            </li>
          })}
        </ul>
    </div>
  )
}

export default Summary