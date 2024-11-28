import React, { useEffect } from 'react'
type ImportDataType = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  exportDataFormat: number;
  setExportDataFormat: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  sideLoading: boolean;
}
const ExportDataModal = ({
  modal,
  setModal,
  exportDataFormat,
  setExportDataFormat,
  loading,
  sideLoading
}: ImportDataType) => {

  const [dataFormat, setDataFormat] = React.useState<number>(1);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFormat(Number(e.target.value));
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExportDataFormat(dataFormat);
  }
  useEffect(()=>{
    setDataFormat(exportDataFormat);
  },[])
  return (
    <>{modal && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white dark:bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <svg className="size-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div> */}
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">Export Data!</h3>
                  <div className="mt-2">
                    <p className="text-base text-gray-700 dark:text-gray-200">In which format do you want to export your data:</p>
                    <ul className=''>
                      <li className='text-gray-700 dark:text-gray-200'>
                        <input className='cursor-pointer' onChange={handleChange} type="radio" name='exportFormat' value={1}/> JSON format
                      </li>
                      <li className='text-gray-700 dark:text-gray-200'>
                        <input className='cursor-pointer' onChange={handleChange} type="radio" name='exportFormat' value={2}/> HTML format
                      </li>
                      <li className='text-gray-700 dark:text-gray-200'>
                        <input className='cursor-pointer' onChange={handleChange} type="radio" name='exportFormat' value={3}/> PDF format
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="submit" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm active:bg-green-500 sm:ml-3 sm:w-auto disabled:bg-gray-400" disabled={loading || sideLoading}>Export</button>
              <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-transparent px-3 py-2 text-sm font-semibold text-red-500 shadow-sm border-red-500 border active:text-red-500 sm:mt-0 sm:w-auto" disabled={loading || sideLoading} onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>}</>
  )
}

export default ExportDataModal;
