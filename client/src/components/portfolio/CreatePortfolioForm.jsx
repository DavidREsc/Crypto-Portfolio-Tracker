import React, {useState} from 'react'

const CreatePortfolioForm = (props) => {
    const {reference, createPortfolio} = props;
    const [portfolioName, setPortfolioName] = useState("");
  return (
    <div className='delete-asset-form' ref={reference}>
        <h4 className='delete-asset-form-title'>Create Portfolio</h4>
        <input 
          type='text' 
          maxLength='16' 
          value={portfolioName} 
          onChange={(e) => setPortfolioName(e.target.value)}
          autoFocus>     
        </input>
        <div className='delete-asset-form-btns'>
            <button className='delete-asset-btn' onClick={() => createPortfolio(portfolioName)}>Create</button>
        </div>
    </div>
  )
}

export default CreatePortfolioForm