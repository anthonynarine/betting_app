import React, { useState } from 'react';
import { Switch, FormControlLabel, Checkbox, Button } from '@mui/material';
import useCrud from '../../../services/useCrud';
import { useEventData } from '../../../context/eventData/EventDataProvider';


const EventStatusSwitch = () => {
    const { deletObject } = useCrud();
    const { event } = useEventData();
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handle


}