import React from 'react'
import { AlertType, LoginInfoType } from '@/pages'
import FullPageLoading from '@/components/Other/FullPageLoading';
import { MyEncrypt } from '@/encryption/Encryption';
type ImportDataType = {
  loading: boolean,
  loginInfo: LoginInfoType,
  setMyAlert: React.Dispatch<React.SetStateAction<AlertType>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  importData: (data: any) => void;
}
const ImportEntries = ({ loading, loginInfo, setMyAlert, setLoading, importData }: ImportDataType) => {
  const [file, setFile] = React.useState<File | null>(null);
  const inputFileRef = React.useRef<any>();
  // const [importedData, setImportedData] = React.useState<[] | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = Array.from(e.target.files || [])[0];
    if(!file){
      setFile(null);
      return;
    }
    if (file.size < 10 * 1024 * 1024 && file.type === 'application/json') { // 10 MB in bytes
      setFile(Array.from(e.target.files || [])[0]);
    } else {
      setMyAlert({ success: false, message: 'File is larger than 10mbs', showAlert: true });
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      if (file) {
        const reader = new FileReader();

        reader.onload = async (event) => {
          try {
            let jsonData = JSON.parse(event.target?.result as string);
            if (jsonData) {
              if (!Array.isArray(jsonData)) {
                jsonData = [jsonData];
              }
            }
            let decryptedEntries: any[] = [];
            for (let entry of jsonData) {
              entry.content = await MyEncrypt(entry.content, process.env.NEXT_PUBLIC_ENCRYPT_KEY || '');
              decryptedEntries.push(entry);
            }
            console.log(decryptedEntries)
            await importData(jsonData);
            if (inputFileRef.current) {
              inputFileRef.current.value = '';
            }
            setFile(null);
          } catch (error) {
            console.error('Error parsing JSON');
            setMyAlert({ success: false, message: 'Invalid JSON file', showAlert: true });
          }
          finally {
            setLoading(false);
          }
        };

        reader.onerror = () => {
          console.error('Error reading file');
          setMyAlert({ success: false, message: 'Error reading file', showAlert: true });
        };

        reader.readAsText(file);
      } else {
        setMyAlert({ success: false, message: 'No file selected', showAlert: true });
      }
    } else {
      setMyAlert({ success: false, message: 'Another operation is running please wait', showAlert: true });
    }
  };


  return (
    <div>
      {loading && <FullPageLoading />}
      <h1 className='text-2xl text-center'>Import Entries</h1>
      <p className="text-lg pl-2 md:pl-10">We only accept JSON format</p>
      <p className='pl-4 md:pl-14 mt-2'>There is an example of the format (Only content field is required):</p>
      <p className='pl-4 md:pl-14 text-red-500 mt-2'>Make sure your internet is connected while importing entries.</p>
      <pre className='bg-slate-950 rounded text-white text-sm md:text-base md:w-[70%] px-1 mx-auto mt-3 overflow-auto'>
        {`
  [
    {
      _id: 874af6da473e207098bd831e,
      tag: "personal",
      content: "This is an example of an entry content.", //Required
      entry_date_time: "2024-12-02T22:10:24.000+05:00",
      deleted_at: "2024-12-02T22:10:24.000+05:00", // Nullable
      created_at: "2024-12-01T08:00:00Z",
      updated_at: "2024-12-02T09:00:00Z",
    }
  ]
        `}
      </pre>
      <form onSubmit={handleSubmit} className='md:w-[70%] px-2 mt-4 mx-auto '>
        <div className="flex items-center justify-center w-full">
          <>
            <div className="grid w-full items-center gap-1.5">
              <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                JSON File
              </label>
              <input
                type="file"
                accept='.json'
                onChange={handleChange}
                ref={inputFileRef}
                className="flex h-10 w-full rounded-md border border-input bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 file:border-0 file:bg-transparent file:text-gray-600 file:text-sm file:font-medium"
              />
            </div>
          </>
        </div>

        <button disabled={loading || !file} type='submit' className={"bg-gradient-to-r w-full from-indigo-500 disabled:cursor-not-allowed to-blue-500 font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 " + (loading ? 'text-gray-400' : 'text-white')}> Import</button>
      </form>

    </div>
  )
}

export default ImportEntries
