import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types'; // Import PropTypes for type-checking

/**
 * TabPanel Component
 * 
 * This component is responsible for displaying the content of a specific tab within a tabbed interface.
 * It only shows the content of the tab that is currently active (selected).
 * 
 * Props:
 * - children: The content to be displayed inside the tab panel.
 * - value: The index of the currently selected tab.
 * - index: The index of the current tab panel. This helps determine if the panel is active.
 * - ...other: Any other props passed to the component, allowing for further customization.
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    // The `role` attribute is set to "tabpanel" to indicate that this div is a tab panel.
    // The `hidden` attribute controls the visibility based on whether this panel's index matches the current value (selected tab).
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`} // Unique ID for accessibility, associating the panel with its tab.
      aria-labelledby={`tab-${index}`} // Accessibility attribute to label the tab panel by its corresponding tab.
      {...other} // Spread any other passed props to the div for flexibility.
      
    >
      {value === index && (
        // Only render the children (content) if this tab panel is active.
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography> {/* Render the actual content */}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node, // Expecting a React node (anything that can be rendered).
  index: PropTypes.any.isRequired, // The index of this tab panel. Could be number or string depending on usage.
  value: PropTypes.any.isRequired, // The index of the currently active (selected) tab.
};

export default TabPanel;
