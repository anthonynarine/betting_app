// src/contexts/MembersProvider.js
import React, { useState, useEffect } from 'react';
import MemberContext from './MemberContext';

import PropTypes from 'prop-types';

// MemberProvider.propTypes = {
//   groupMembers: PropTypes.array,
//   children: PropTypes.node.isRequired,
// };

const MemberProvider = ({ children, groupMembers }) => {

  const [members, setMembers] = useState(groupMembers || []);

  useEffect(() => {
    console.log('Updating members state with:', groupMembers);
    setMembers(groupMembers)
  }, [groupMembers]);


  return (
    <MemberContext.Provider value={{ members, setMembers }}>
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
