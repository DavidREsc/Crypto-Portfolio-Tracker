import React, {useEffect} from 'react';
import PortfolioRoute from '../apis/PortfolioRoute';
import Sidebar from '../components/portfolio/Sidebar';
import Content from '../components/portfolio/Content';

const Portfolio = () => {

    useEffect(() => {
        const retrieveData = async () => {
            try {
                const response = await PortfolioRoute.get('');
                console.log(response);
            } catch (error) {
                console.log(error)
            }
        }
        retrieveData();
    },[]);

    return (
        <div className='portfolio-page'>
            <Sidebar/>
            <Content/>
        </div>
    )
}

export default Portfolio
