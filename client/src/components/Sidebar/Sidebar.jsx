import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import { PiArrowFatLineDownBold } from "react-icons/pi";
import { PiArrowFatLineUpBold } from "react-icons/pi";
import { TbBrandGoogleHome } from "react-icons/tb";
import { MdTimeline } from "react-icons/md";
import '../Sidebar/Sidebar.css'

const Sidebar = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    
    const location = useLocation()

    const active = location.pathname

    const styles = {backgroundColor:'#EEF2FF',borderLeft:'3px solid blue'}
    const styles_mobile = {color:'blue'}

    return (
        <>
            {!isMobile ? <div className='sidebar'>
                <h1 style={{textAlign:'center'}}>Sure Bank</h1>
                <hr style={{width:'12rem',margin:'auto'}}/>
                <ul>
                    <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/dashboard'}>  <li style={active === '/user/dashboard' ? styles : null}><TbBrandGoogleHome style={{marginRight:'4px'}} />Home</li> </Link>
                    <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/deposit'}> <li style={active === '/user/deposit' ? styles : null}><PiArrowFatLineDownBold style={{marginRight:'4px'}} />Deposit Money</li></Link>
                    <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/send'}> <li style={active === '/user/send' ? styles : null}><PiArrowFatLineUpBold style={{marginRight:'4px'}} />Send Money</li></Link>
                    <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/history'}> <li style={active === '/user/history' ? styles : null}><MdTimeline style={{marginRight:'4px'}} />History</li></Link>
                </ul>
            </div>
                :

                <div className='sidebar-mobile'>
                    <ul>
                        <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/dashboard'}>  <li style={active === '/user/dashboard' ? styles_mobile : null}><TbBrandGoogleHome />Home</li> </Link>
                        <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/deposit'}> <li style={active === '/user/deposit' ? styles_mobile : null}><PiArrowFatLineDownBold />Deposit</li></Link>
                        <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/send'}> <li style={active === '/user/send' ? styles_mobile : null}><PiArrowFatLineUpBold />Send</li></Link>
                        <Link style={{ color: 'black',listStyle:'none',textDecoration:'none' }} to={'/user/history'}> <li style={active === '/user/history' ? styles_mobile : null}><MdTimeline />History</li></Link>
                    </ul>
                </div>

            }



        </>
    )
}

export default Sidebar