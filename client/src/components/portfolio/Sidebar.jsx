import React, { useEffect, useState, useRef} from 'react';
import PortfolioList from './PortfolioList';
import { ButtonCreatePortfolio } from '../../styles/MaterialUi.styled';
import { usePortfolio } from '../../contexts/PortfolioContext';
import DeleteForm from './DeleteForm';
import CreatePortfolioForm from './CreatePortfolioForm';

//Sidebar containing portfolios, create portfolio button
const Sidebar = (props) => {
    const {active, handleSidebar} = props
    const {updateCurrentPortfolio, portfolios, currentPortfolio, deletePortfolio, createPortfolio} = usePortfolio()
    const [selectedPortfolio, setSelectedPortfolio] = useState()
    const [deletePortfolioFormDisplay, setDeletePortfolioFormDisplay] = useState(false)
    const [createPortfolioFormDisplay, setCreatePortfolioFormDisplay] = useState(false)
    const [queryLoading, setQueryLoading] = useState(false)
    const deletePortfolioFormRef = useRef(null)
    const createPortfolioFormRef = useRef(null)
    

    useEffect(() => {
		const handleClickOutside = (e) => {
			if (deletePortfolioFormRef.current && !deletePortfolioFormRef.current.contains(e.target)) {
				setDeletePortfolioFormDisplay(false)
			} else if (createPortfolioFormRef.current && !createPortfolioFormRef.current.contains(e.target)) {
				setCreatePortfolioFormDisplay(false)
            }
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

    // Function handler for selecting different portfolios
    const handleSelectPortfolio = (p) => {
        updateCurrentPortfolio(p)
        handleSidebar()
    }

    const showDeletePortfolioForm = (p) => {
        setSelectedPortfolio(p)
        setDeletePortfolioFormDisplay(true)
    }

    const showCreatePortfolioForm = () => {
        setCreatePortfolioFormDisplay(true)
    }

    const handleDeletePortfolio = () => {
        setQueryLoading(true)
        deletePortfolio(selectedPortfolio, (e) => {
            if (e) console.log(e)
            else {
                setDeletePortfolioFormDisplay(false)
            }
            setQueryLoading(false)
        })
    }

    const handleCreatePortfolio = (data) => {
        const {name} = data
        setQueryLoading(true)
        createPortfolio(name, (e) => {
            if (e) console.log(e)
            else {
                setCreatePortfolioFormDisplay(false)
            }
            setQueryLoading(false)
        })

    }

    return (
        <div className={!active ? 'side-bar' : 'side-bar active'}>
            {portfolios && currentPortfolio &&
                <>
                <div className='all-portfolios-container'>Portfolios</div>
                <PortfolioList 
                    portfolios={portfolios} 
                    handleSelectPortfolio={handleSelectPortfolio} 
                    currentPortfolio={currentPortfolio}
                    showDeletePortfolioForm={showDeletePortfolioForm}
                    />
                <div className='create-portfolio-container'>
                    {/* Button for creating a new portfolio */}
                    <ButtonCreatePortfolio 
                        variant='outlined' 
                        fullWidth 
                        onClick={showCreatePortfolioForm}>
                        Create Portfolio
                    </ButtonCreatePortfolio>
                </div>
                {deletePortfolioFormDisplay &&
                    <DeleteForm 
                        reference={deletePortfolioFormRef}
                        deleteFunc={handleDeletePortfolio}
                        closeForm={() => setDeletePortfolioFormDisplay(false)}
                        title={'Delete Portfolio?'}
                        text={'All transactions associated with this portfolio will be deleted.'}
                        loading={queryLoading}
                    />
                }
                {createPortfolioFormDisplay &&
                    <CreatePortfolioForm 
                        reference={createPortfolioFormRef}
                        createPortfolio={handleCreatePortfolio}
                        closeForm={() => setCreatePortfolioFormDisplay(false)}
                        loading={queryLoading}
                    />
                }

                </>
            }
        </div>
    )
}

export default Sidebar
