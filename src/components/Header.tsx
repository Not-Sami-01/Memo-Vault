
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { LoginInfoType } from '../pages';
export default function Header({ pos = false, loginInfo = null, clearData = () => { } }: { pos: boolean | number; loginInfo?: LoginInfoType | null; clearData?: () => void }) {
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const [dropdown, setDropdown] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mode: string | null = localStorage.getItem('theme');
    const check: boolean = mode === 'dark' || (mode === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(check);
    if (check) document.documentElement.classList.add('dark');
  }, []);
  const showDropDown = () => setDropdown(!dropdown);
  const changeDarkMode: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const isChecked = e.target.checked;
    setDarkMode(isChecked);
    localStorage.setItem('theme', isChecked ? 'dark' : 'light');
    if (isChecked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  const showLoginSignup = !loginInfo?.loggedIn && true;
  const navLi = 'mx-4 text-sm transition-all md:text-base hover:text-green-500 transition-all cursor-pointer text-white flex items-center';
  const navLiDropdown = 'justify-center mx-4 text-sm transition-all md:text-base cursor-pointer dark:text-white flex p-1 items-center dark:bg-gray-700 bg-gray-200 m-1 rounded active:bg-gray-400 transition-none';

  // return <nav className={'z-10 bg-black w-full dark:bg-opacity-100 bg-opacity-50 flex justify-between top-0 left-0 ' + (pos ? 'sticky':'md:fixed')}>
  return <nav className={(pos === -1 ? '!relative ' : '') + 'z-20 bg-black w-full dark:bg-opacity-100 bg-opacity-50 flex justify-between top-0 left-0 dark:border-b-2 border-b-2 dark:border-gray-100 border-transparent ' + (pos === false ? 'fixed dark:sticky' : 'sticky')}>
    <div className='flex'>
      <span className='flex items-center'>
        <Image className='invert max-w-[200px] max-h-[22]' width={200} height={22} src="/images/memovault-logo-transparent.png" alt="Logo" />
      </span>
      <ul className='md:flex justify-start p-2 bg-transparent hidden'>
        {/* <li className='flex items-center hover:items-start transition-all cursor-pointer select-none'>
        <Link href={'/'}></Link>
        </li> */}
        <li className={navLi}>
          <Link legacyBehavior href="/home">Home</Link>
        </li>
        <li className={navLi}>
          <Link legacyBehavior href="/about">About</Link>
        </li>
        {showLoginSignup ? <> <li className={navLi}>
          <Link legacyBehavior href="/">Sign In</Link>
        </li>
          <li className={navLi}>
            <Link legacyBehavior href="/signup">Sign Up</Link>
          </li></> :
          <li className={navLi}>
            <button onClick={clearData}>Logout</button>
          </li>
        }
      </ul>
    </div>

    <label className="md:inline-flex scale-50 items-center relative cursor-pointer hidden ">
      <input checked={darkMode} onChange={changeDarkMode} className="peer hidden" id="toggle" type="checkbox" />
      <div
        className="relative w-[110px] h-[50px] bg-white peer-checked:bg-zinc-500 rounded-full after:absolute after:content-[''] after:w-[40px] after:h-[40px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] active:after:w-[50px] peer-checked:after:left-[105px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"
      ></div>
      <svg
        height="0"
        width="100"
        viewBox="0 0 24 24"
        data-name="Layer 1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-white peer-checked:opacity-60 absolute w-6 h-6 left-[13px]"
      >
        <path
          d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"
        ></path>
      </svg>
      <svg
        height="512"
        width="512"
        viewBox="0 0 24 24"
        data-name="Layer 1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-6 h-6 right-[13px]"
      >
        <path
          d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"
        ></path>
      </svg>
    </label>
    <button className='md:hidden dark:invert active:scale-110 flex items-center mr-4' onClick={showDropDown}>
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 128 128">
        <path fill="#fff" d="M64 14A50 50 0 1 0 64 114A50 50 0 1 0 64 14Z"></path><path fill="#444b54" d="M64,117c-29.2,0-53-23.8-53-53s23.8-53,53-53s53,23.8,53,53S93.2,117,64,117z M64,17c-25.9,0-47,21.1-47,47s21.1,47,47,47s47-21.1,47-47S89.9,17,64,17z"></path><path fill="#444b54" d="M86.5 52h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3S88.2 52 86.5 52zM86.5 67h-45c-1.7 0-3-1.3-3-3s1.3-3 3-3h45c1.7 0 3 1.3 3 3S88.2 67 86.5 67z"></path><g><path fill="#444b54" d="M86.5,82h-45c-1.7,0-3-1.3-3-3s1.3-3,3-3h45c1.7,0,3,1.3,3,3S88.2,82,86.5,82z"></path></g>
      </svg>
    </button>
    {dropdown && <ul className='flex flex-col absolute right-2 top-10 rounded justify-start p-2 bg-gray-500 md:hidden'>
      <span className='bg-gray-500 rounded w-4 h-4 -top-1 right-1 rotate-45 shadow-none absolute' />
      {/* <li className='flex items-center hover:items-start transition-all cursor-pointer select-none'>
        <Link href={'/'}></Link>
        </li> */}
      <li className={navLiDropdown}>
        <Link legacyBehavior href="/home">Home</Link>
      </li>
      <li className={navLiDropdown}>
        <Link legacyBehavior href="/about">About</Link>
      </li>
      {showLoginSignup ? <><li className={navLiDropdown}>
        <Link legacyBehavior href="/">Sign In</Link>
      </li><li className={navLiDropdown}>
          <Link legacyBehavior href="/signup">Sign Up</Link>
        </li></>
        :
        <li className={navLiDropdown}>
          <button onClick={clearData}>Logout</button>
        </li>}
      <li className={'flex items-center hover:items-start transition-all cursor-pointer select-none '}>
        <label className="inline-flex scale-50 items-center relative cursor-pointer ">
          <input checked={darkMode} onChange={changeDarkMode} className="peer hidden" id="toggle" type="checkbox" />
          <div
            className="relative w-[110px] h-[50px] bg-white peer-checked:bg-zinc-600 rounded-full after:absolute after:content-[''] after:w-[40px] after:h-[40px] after:bg-gradient-to-r from-orange-500 to-yellow-400 peer-checked:after:from-zinc-900 peer-checked:after:to-zinc-900 after:rounded-full after:top-[5px] after:left-[5px] active:after:w-[50px] peer-checked:after:left-[105px] peer-checked:after:translate-x-[-100%] shadow-sm duration-300 after:duration-300 after:shadow-md"
          ></div>
          <svg
            height="0"
            width="100"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-white peer-checked:opacity-60 absolute w-6 h-6 left-[13px]"
          >
            <path
              d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z"
            ></path>
          </svg>
          <svg
            height="512"
            width="512"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-black opacity-60 peer-checked:opacity-70 peer-checked:fill-white absolute w-6 h-6 right-[13px]"
          >
            <path
              d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2ZM20.5,12a1,1,0,0,1-.97-.757l-.358-1.43L17.74,9.428a1,1,0,0,1,.035-1.94l1.4-.325.351-1.406a1,1,0,0,1,1.94,0l.355,1.418,1.418.355a1,1,0,0,1,0,1.94l-1.418.355-.355,1.418A1,1,0,0,1,20.5,12ZM16,14a1,1,0,0,0,2,0A1,1,0,0,0,16,14Zm6,4a1,1,0,0,0,2,0A1,1,0,0,0,22,18Z"
            ></path>
          </svg>
        </label>
      </li>
    </ul>}
  </nav>
}