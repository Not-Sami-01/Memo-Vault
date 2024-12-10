import React from 'react'

const ExportEntries = ({ loading, exportDataFormat, setExportDataFormat }: { loading: boolean; exportDataFormat: number; setExportDataFormat: React.Dispatch<React.SetStateAction<number>> }) => {
  const [dataFormat, setDataFormat] = React.useState<number>(0);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataFormat(Number(e.target.value));
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setExportDataFormat(dataFormat);
  }
  return (
    <>
      <div className='md:px-10'>
        <h1 className="text-2xl text-center">
          Export Entries
        </h1>
        <div className='pl-10 mt-10'>
          <p className=" text-xl ">
            Select the format you want to export your entries in.
          </p>
          <form className="mt-2" onSubmit={handleSubmit}>
            <ul className='px-10 '>
              <li className='text-gray-700 dark:text-gray-200'>
                <input className='cursor-pointer' onChange={handleChange} type="radio" name='exportFormat' value={1} /> JSON format
              </li>
              <li className='text-gray-700 dark:text-gray-200'>
                <input className='cursor-pointer' onChange={handleChange} type="radio" name='exportFormat' value={2} /> HTML format
              </li>
            </ul>
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm active:bg-green-500 sm:ml-3 sm:w-auto disabled:bg-gray-400" disabled={loading}>Export</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ExportEntries
