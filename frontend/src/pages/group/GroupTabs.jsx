
import ReusableTabs from '../../components/tabs/ReusableTabs';
import BetList from '../events/bets/BetList';
import { Typography, Link } from '@mui/material';
import {  useNavigate } from 'react-router-dom';

export default function GroupTabs() {
    const navigate = useNavigate();

    // Create a wrapper component for handling navigation
    const NavigateOnClick = ({ to, children }) => (
        <div onClick={() => navigate(to)} style={{ cursor: 'pointer' }}>
            {children}
        </div>
    );

    const tabsConfig = [
        {
            label: "Groups",
            onClick: () => navigate('/')
        },
        {
            label: "My Bets",
            // Direct navigation using Link or NavigateOnClick as needed
            content: <NavigateOnClick to="/bets">Bets</NavigateOnClick>, 
        },
        {
            label: "Popular Events",
            content: <Typography variant='h1'>UNDER CONSTRUCTION</Typography>,
        },
        {
            label: "My Event",
            content: <Typography variant='h1'>UNDER CONSTRUCTION</Typography>,
        },
        // Add more tabs if needed
    ];

    return <ReusableTabs tabsConfig={tabsConfig} />;
}