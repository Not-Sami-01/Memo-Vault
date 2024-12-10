import FullPageLoading from '@/components/Other/FullPageLoading';
import { AlertType, LoginInfoType } from '@/pages';
import { fetchAPI, formatToCustomDateFormat, getUrl } from '@/pages/helpers/helper';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent } from 'react'

const AccountSetting = ({ loginInfo, setMyAlert }: { loginInfo: LoginInfoType; setMyAlert: React.Dispatch<React.SetStateAction<AlertType>> }) => {


  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [changePasswordInputVals, setChangePasswordInputVals] = React.useState<{ oldPassword: string; newPassword: string; confirmPassword: string }>({ oldPassword: '', newPassword: '', confirmPassword: '' });
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const response = await fetchAPI('/api/users/change-password', { ...changePasswordInputVals }, loginInfo.token);
      if (response.success) {
        setMyAlert({ success: true, message: response.message, showAlert: true });
      } else {
        setMyAlert({ success: response.succes, message: response.message, showAlert: true });
      }
      setChangePasswordInputVals({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }
  }
  const changePasswordHandleChange = (e: ChangeEvent<any>) => {
    e.preventDefault();
    setChangePasswordInputVals({ ...changePasswordInputVals, [e.target.name]: e.target.value });
  }

  return (
    <div className='md:px-10'>
      {loading && <FullPageLoading />}
      <h1 className='text-2xl text-center'>Account Setting</h1>
      <div className="min-h-40">
        <h2 className="text-xl">
          Account Information:
        </h2>
        <ul className=''>
          <li className='px-3'><strong className='text-lg'>Username:</strong> {loginInfo.username}</li>
          <li className='px-3'><strong className='text-lg'>Date Joined:</strong> {formatToCustomDateFormat(loginInfo.joinedAt || '')}</li>
          <li className='px-3'><strong className='text-lg'>Total Entries:</strong> {loginInfo.totalEntries}</li>
          <li className='px-3'><strong className='text-lg'>Trashed Entries:</strong> {loginInfo.trashedEntries}</li>
        </ul>
        <p className="dark:text-yellow-400  text-yellow-500 text-sm flex p-2 justify-center items-center w-max">
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          &nbsp;If you forgot your password, Please <Link href="/about#contact" className='text-purple-500 underline active:text-gray-600'>&nbsp;contact support&nbsp;</Link> for help!</p>
      </div>
      <hr />
      <div className='mx-auto md:w-[70%] py-10'>
        <div className="w-full max-w-md mx-auto bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-200 mb-4">Change Password</h2>
          <form onSubmit={handleSubmit} className={"flex flex-col"}>
            <input readOnly={loading} name='oldPassword' autoComplete='off' onChange={changePasswordHandleChange} value={changePasswordInputVals.oldPassword} placeholder="Current Password" className="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type={showPassword ? "text" : "password"} />
            <div className='w-full relative'>
              <input readOnly={loading} name='newPassword' autoComplete='off' onChange={changePasswordHandleChange} value={changePasswordInputVals.newPassword} placeholder="New Password" className="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type={showPassword ? "text" : "password"} />
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
              <input readOnly={loading} name='confirmPassword' autoComplete='off' onChange={changePasswordHandleChange} value={changePasswordInputVals.confirmPassword} placeholder="Confirm Password" className="w-full bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150" type={showPassword ? "text" : "password"} />
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
    </div>
  )
}

export default AccountSetting
