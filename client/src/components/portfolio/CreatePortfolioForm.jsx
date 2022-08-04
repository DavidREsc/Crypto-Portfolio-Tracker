import React, {useState} from 'react'
import {MdClose} from 'react-icons/md';

// Form for creating a new portfolio
const CreatePortfolioForm = (props) => {
    const {reference, createPortfolio, closeForm} = props;
    const [portfolioName, setPortfolioName] = useState("");
  return (
   <div className='overlay'>
    <form className='create-portfolio-form' ref={reference} onSubmit={(e) => createPortfolio(e, portfolioName)} >
        <div className='create-portfolio-form-title-container'>
          <h3 className='create-portfolio-form-title'>Create Portfolio</h3>
          <MdClose onClick={closeForm} style={{fontSize: '1.5rem', cursor: 'pointer'}}/>
        </div>
        <label style={{marginBottom: "0.5rem"}}>Portfolio name</label>
        <input className='create-portfolio-form-input' required
          type='text' 
          placeholder="Enter portfolio name..."
          maxLength='16' 
          value={portfolioName} 
          onChange={(e) => setPortfolioName(e.target.value)}
          autoFocus>     
        </input>
        <button className='form-btn' type='submit'>Create</button>
    </form>
   </div>
  )
}
export default CreatePortfolioForm