
// context that will hold the state of group members.

import { createContext, useContext } from "react";

//context object
const MemberContext = createContext();

export const useMembers = () => {
    const context = useContext(MemberContext);
    if(!context) {
        throw new Error("useMembers must be used within a MemberProvider ")
    }
    return context;
}
export default MemberContext;