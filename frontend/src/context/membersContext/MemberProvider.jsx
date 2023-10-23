// src/contexts/MembersProvider.js
import React, { useState, useEffect } from 'react';
import MemberContext from './MemberContext';

const MemberProvider = ({ children, groupMembers }) => {

  const [members, setMembers] = useState(groupMembers || []);

  useEffect(() => {
    setMembers(groupMembers)
  }, [groupMembers]);


  return (
    <MemberContext.Provider value={{ members, setMembers }}>
      {children}
    </MemberContext.Provider>
  );
};

export default MemberProvider;
