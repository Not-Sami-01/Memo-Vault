import { MyDecrypt, MyEncrypt } from '@/encryption/Encryption';
import { AlertType, LoginInfoType } from '@/pages';
import { EntryType } from '@/pages/api/Models/EntrySchema';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const DynamicEditor = dynamic(() => import('../components/Editor'), { ssr: false });

type ImportDataType = {
  loginInfo: LoginInfoType;
  currentEntry: EntryType | null;
  loading: boolean;
  encryptionKey: string;
  setCurrentEntry: React.Dispatch<React.SetStateAction<EntryType | any>>;
  goBack: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMyAlert: React.Dispatch<React.SetStateAction<AlertType>>;
}
const EditEntry = ({ loginInfo, currentEntry, loading, encryptionKey, setCurrentEntry, goBack, setLoading, setMyAlert }: ImportDataType) => {
  const [editorKey, setEditorKey] = useState<string>('');
  const [otherInfo, setOtherInfo] = useState<{ dateTime: string; tag: string }>({ dateTime: currentEntry?.entry_date_time || '', tag: currentEntry?.tag || '' });
  const [content, setContent] = useState<string>(currentEntry?.content || '');
  const [seeMore, setSeeMore] = useState<boolean>(false);
  const handleSave = async () => {
    setLoading(true);
    const data = {
      content: await MyEncrypt(content, encryptionKey),
      entry_date_time: otherInfo.dateTime,
      tag: otherInfo.tag,
      _id: currentEntry?._id,
    }
    try {
      const sendDataToSave = await fetch(process.env.NEXT_PUBLIC_HOST + '/api/entries/save-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': loginInfo.token
        },
        body: JSON.stringify({ data })
      });
      const response = await sendDataToSave.json();
      if (response.success) {
        setLoading(false);
      } else {
        setMyAlert({ showAlert: true, message: response.message, success: false });
      }
    } catch (error) {
      setMyAlert({ showAlert: true, message: 'Could not save entry! Please try again', success: false });
    }
    setLoading(false);
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  };
  function removeHtmlTags(htmlText: string) {
    var doc = new DOMParser().parseFromString(htmlText, 'text/html');
    return doc.body.textContent || doc.body.innerText;
  }
  const countCharacters = (str: string): number => {
    return str.trim().length;

  }
  const countWords = (str: string): number => {
    let wordList = str.split(/\s/);
    let words = wordList.filter(function (element) {
      return element != "";
    });
    return words.length;
  }
  function getLetterDensityWithPercentage(str: string): { letter: string, count: number, percentage: string }[] {
    const letterFrequency: { [key: string]: number } = {};
    let totalLetters = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i].toLowerCase();
      if (/[a-z]/.test(char)) {
        totalLetters++;
        if (letterFrequency[char]) {
          letterFrequency[char]++;
        } else {
          letterFrequency[char] = 1;
        }
      }
    }

    const letterDensityWithPercentage: { letter: string, count: number, percentage: string }[] = [];

    for (let letter in letterFrequency) {
      const percentage = ((letterFrequency[letter] / totalLetters) * 100).toFixed(2);
      letterDensityWithPercentage.push({
        letter: letter,
        count: letterFrequency[letter],
        percentage: `${percentage}%`
      });
    }

    letterDensityWithPercentage.sort((a, b) => b.count - a.count);

    return letterDensityWithPercentage;
  }

  useEffect(() => {
    setEditorKey(String(Math.random() * Date.now()));
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      setEditorKey(String(Math.random()));
    };
  }, []);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherInfo({
      ...otherInfo,
      [event.target.name]: event.target.value
    });
  };
  return (
    <div className='relative min-h-screen'>
      <button title='Go back' onClick={goBack} className='absolute bg-white rounded-full active:bg-gray-400 top-5 left-5'>
        <svg xmlns="http://www.w3.org/2000/svg" className='' width="30px" height="30px" viewBox="0 0 24 24" fill="none">
          <g id="Arrow / Arrow_Circle_Left">
            <path id="Vector" d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </button>
      <div className="w-[70%] mx-auto my-5">
        <div className='w-full flex justify-between items-center'>
          <ul className="flex m-2 flex-wrap items-stretch">
            <li>Tag:<input className='h-max p-1 mx-1 outline-none rounded-lg focus:outline-none border dark:bg-gray-700' name='tag' onChange={handleChange} value={otherInfo.tag} type="text" /></li>
            <li>
              Date and Time:<input className=' p-1 mx-1 outline-none focus:outline-none border rounded-lg  dark:bg-gray-700' name='dateTime' onChange={handleChange} value={otherInfo.dateTime} type="datetime-local" />
            </li>
            <li className='flex justify-center items-center rounded'>
              <button title='Save' disabled={loading} onClick={handleSave} className='text-sm w-max h-max dark:bg-black border rounded disabled:bg-gray-500'>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" className='bg-white active:bg-gray-400' xmlns="http://www.w3.org/2000/svg">
                  <g id="System / Save">
                    <path id="Vector" d="M17 21.0002L7 21M17 21.0002L17.8031 21C18.921 21 19.48 21 19.9074 20.7822C20.2837 20.5905 20.5905 20.2843 20.7822 19.908C21 19.4806 21 18.921 21 17.8031V9.21955C21 8.77072 21 8.54521 20.9521 8.33105C20.9095 8.14 20.8393 7.95652 20.7432 7.78595C20.6366 7.59674 20.487 7.43055 20.1929 7.10378L17.4377 4.04241C17.0969 3.66374 16.9242 3.47181 16.7168 3.33398C16.5303 3.21 16.3242 3.11858 16.1073 3.06287C15.8625 3 15.5998 3 15.075 3H6.2002C5.08009 3 4.51962 3 4.0918 3.21799C3.71547 3.40973 3.40973 3.71547 3.21799 4.0918C3 4.51962 3 5.08009 3 6.2002V17.8002C3 18.9203 3 19.4796 3.21799 19.9074C3.40973 20.2837 3.71547 20.5905 4.0918 20.7822C4.5192 21 5.07899 21 6.19691 21H7M17 21.0002V17.1969C17 16.079 17 15.5192 16.7822 15.0918C16.5905 14.7155 16.2837 14.4097 15.9074 14.218C15.4796 14 14.9203 14 13.8002 14H10.2002C9.08009 14 8.51962 14 8.0918 14.218C7.71547 14.4097 7.40973 14.7155 7.21799 15.0918C7 15.5196 7 16.0801 7 17.2002V21M15 7H9" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>

              </button>

            </li>
          </ul>
          {loading && <div className="loading animate-spin border-4 border-b-transparent border-t-transparent border-yellow-400 w-5 h-5  rounded-full" />}
        </div>
        <DynamicEditor
          key={editorKey + 'KJkdsfkjkadsf'}
          editorKey={editorKey}
          currentEntry={currentEntry}
          setCurrentEntry={setCurrentEntry}
          className={'no-tailwind'}
          content={content}
          setContent={setContent}
          handleSave={handleSave}
        />
        <div className='my-4'>
          <h1 className='text-2xl font-bold'>
            Text Info:
          </h1>
          <div className="flex flex-col-reverse">
            <ul className='list-none'>
              <h1 className='text-xl font-bold ml-2'>
                Letter Density:
              </h1>
              {getLetterDensityWithPercentage(content).map((item, index) => {
                return (
                  <>{(seeMore || index < 10) && <li key={index} className='ml-3'>
                    <p><strong>{item.letter.toUpperCase()}: </strong>{item.count} ({item.percentage})</p>
                  </li>}</>
                );
              })}

              <li><button className='underline select-none cursor-pointer active:text-purple-300 text-purple-700' onClick={() => setSeeMore(!seeMore)}>{seeMore ? "See less" : "See more"}</button></li>
            </ul>
            <ul className='mx-5 list-none'>
              <li><p><strong>Characters: </strong>{countCharacters(removeHtmlTags(content))}</p></li>
              <li><p><strong>Words: </strong>{countWords(removeHtmlTags(content))}</p></li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEntry;
