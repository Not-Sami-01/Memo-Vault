import React from 'react'
import AccountSetting from './Setting/AccountSetting';
import { AlertType, LoginInfoType } from '@/pages';
import ExportEntries from './Setting/ExportEntries';
import ImportEntries from './Setting/ImportEntries';
import FullPageLoading from '../Other/FullPageLoading';
import DeletionAndRestortion from './Setting/DeletionAndRestortion';
type ImportDataType = {
  goBack: () => void;
  loginInfo: LoginInfoType;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  exportDataFormat: number;
  setExportDataFormat: React.Dispatch<React.SetStateAction<number>>;
  setMyAlert: React.Dispatch<React.SetStateAction<AlertType>>;
  importData: (data:any) => void;
  clearAllData: () => void;

}
const Setting = ({
  goBack,
  loginInfo,
  loading,
  setLoading,
  exportDataFormat,
  setExportDataFormat,
  setMyAlert,
  importData,
  clearAllData,

}: ImportDataType) => {
  const [page, setPage] = React.useState<string>('dashboard');
  const [menu, setMenu] = React.useState<boolean>(true);
  const liButtonClass = 'md:text-base text-sm select-none md:p-2 py-1 bg-black dark:bg-gray-950 text-nowrap dark:active:bg-gray-700 rounded my-2 active:bg-slate-800 w-full h-full text-white flex';
  const liClass = '';
  const svgClass = 'dark:text-white mr-1';



  const selectPage = () => {
    if (!loading) {
      switch (page) {
        case 'dashboard':
          return <div>Dashboard</div>;
        case 'account-setting':
          return <AccountSetting loginInfo={loginInfo} setMyAlert={setMyAlert} />;
        case 'export-entries':
          return <ExportEntries loading={loading} exportDataFormat={exportDataFormat} setExportDataFormat={setExportDataFormat} />
        case 'import-entries':
          return <ImportEntries loading={loading} setLoading={setLoading} loginInfo={loginInfo} importData={importData} setMyAlert={setMyAlert} />
        case 'deletion-and-restortion':
          return <DeletionAndRestortion clearAllData={clearAllData} setMyAlert={setMyAlert} loginInfo={loginInfo} loading={loading} setLoading={setLoading}/>
        default:
          return <div>Page not found</div>;
      }
    }
  }
  return (
    <div className='flex relative min-h-screen'>
      {loading&& <FullPageLoading/>}
      <button className={'absolute z-10 top-1 transition-all p-1 '} onClick={() => setMenu(!menu)}>
        {menu ? <svg width={'30px'} height={'30px'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>

          : <svg width={'30px'} height={'30px'} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"size-10"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>



        }
      </button>
      <div className={'sideBar px-5 min-h-full transition-all overflow-hidden absolute md:relative flex pt-20 justify-center dark:bg-slate-700 bg-black bg-opacity-40 ' + (menu ? '' : ' hidden ')} >
        <ul className=''>
          {/* Account Settings */}
          <li className={liClass}>
            <button onClick={() => setPage('dashboard')} className={liButtonClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"size-6"}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              Dashboard
            </button>
          </li>
          <li className={liClass}>
            <button onClick={() => setPage('account-setting')} className={liButtonClass}>
              <svg className={svgClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Account Settings
            </button>
          </li>

          {/* Export Entries */}
          <li className={liClass}>
            <button onClick={() => setPage('export-entries')} className={liButtonClass}>
              <svg className={svgClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10V4a1 1 0 0 0-1-1H9.914a1 1 0 0 0-.707.293L5.293 7.207A1 1 0 0 0 5 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2M10 3v4a1 1 0 0 1-1 1H5m5 6h9m0 0-2-2m2 2-2 2" />
              </svg>


              Export Entries
            </button>
          </li>

          {/* Import Entries */}
          <li className={liClass}>
            <button onClick={() => setPage('import-entries')} className={liButtonClass}>
              <svg className={svgClass} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2" />
              </svg>


              Import Entries
            </button>
          </li>

          {/* Account Deletion */}
          <li className={liClass}>
            <button onClick={() => setPage('deletion-and-restortion')} className={liButtonClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={svgClass} width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>

              Deletion/Restortion
            </button>
          </li>

          {/* Exit */}
          <li className={liClass}>
            <button onClick={() => goBack()} className={liButtonClass}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={svgClass} width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>

              Exit
            </button>
          </li>
        </ul>

      </div>
      {/* Main Div */}
      <div className='w-full p-4'>
        {selectPage()}
      </div>
    </div>
  )
}

export default Setting
