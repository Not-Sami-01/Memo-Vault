import Header from '@/components/Header'
import md5 from 'md5'
import Link from 'next/link'
import React from 'react'
import { AlertType } from '.'
import Alert from '@/components/Alert'

const Signup = () => {
  type FormFeilds = {
    username: string,
    password: string,
    confirmPassword: string;
  }
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [inputVals, setInputVals] = React.useState<FormFeilds>({ username: '', password: '', confirmPassword: '' });
  const [myAlert, setMyAlert] = React.useState<AlertType>({ success: true, message: '', showAlert: false });
  const alertTimeout = React.useRef<NodeJS.Timeout | null>(null);
  React.useEffect(() => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    if (myAlert.showAlert) {
      alertTimeout.current = setTimeout(() => {
        setMyAlert(prevState => ({ ...prevState, showAlert: false }));
      }, 4000);
    }

    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, [myAlert]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const data = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/users/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': md5(process.env.NEXT_PUBLIC_JWT_KEY || 'nothing')
        },
        body: JSON.stringify({ username: inputVals.username, password: inputVals.password, confirmPassword: inputVals.confirmPassword }),
      });
      const response = await data.json();
      setMyAlert({ success: response.success, message: response.message, showAlert: true });
      setInputVals({ username: '', password: '', confirmPassword: '', });
      setLoading(false);
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!loading){
      setInputVals({ ...inputVals, [e.target.name]: e.target.value });
    }
  }
  return (
    <>
      <Header pos />
      {myAlert.showAlert && <Alert message={myAlert.message} success={myAlert.success} />}
      <div className="flex flex-col items-center justify-center h-screen dark">
        <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Sign Up to MemoVault</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input name='username' onChange={handleChange} value={inputVals.username} placeholder="Username" className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type="text" />
            <div className='w-full relative'>
              <input name='password' autoComplete='off' onChange={handleChange} value={inputVals.password} placeholder="Password" className="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type={showPassword ? "text" : "password"} />
              <span onClick={() => setShowPassword(!showPassword)} className='text-white absolute top-2 right-4 select-none cursor-pointer'>
                {showPassword ? <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 4.5C6.5 4.5 2 12 2 12s4.5 7.5 10 7.5 10-7.5 10-7.5S17.5 4.5 12 4.5z" />
                  <circle cx="12" cy="12" r="4.5" />
                </svg> :
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 4.5C6.5 4.5 2 12 2 12s4.5 7.5 10 7.5 10-7.5 10-7.5S17.5 4.5 12 4.5z" />
                    <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" />
                  </svg>}
              </span>
            </div>
            <input name='confirmPassword' autoComplete='off' placeholder="Confirm password" onChange={handleChange} value={inputVals.confirmPassword} className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type={showPassword ? "text" : "password"} />
            <div className="flex items-center justify-between flex-wrap">
              <p className="text-white mt-2"> Already have an account? <Link className="text-sm text-blue-500 -200 hover:underline mt-4" href="/">Signin</Link></p>
            </div>
            <div className="w-full relative">
              <button disabled={loading} className={"bg-gradient-to-r w-full from-indigo-500 to-blue-500 font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 " + (loading ? 'text-gray-400' : 'text-white')} type="submit">Submit</button>
              {loading && <div
                className=" absolute right-2 top-6 p-2 w-max h-max border-4 border-dashed rounded-full animate-spin border-white-500 mx-auto"
              />}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup