

import { useAuthServices } from '../../../Auth/AuthServices'

const TestLogin = () => {
  const { isLoggedIn } = useAuthServices();
  console.log("LOGIN STATUS", isLoggedIn)


  return <>
    {isLoggedIn.toString()}
  </>


};
export default TestLogin;