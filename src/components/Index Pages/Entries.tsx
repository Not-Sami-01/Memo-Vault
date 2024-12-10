import { LoginInfoType } from '@/pages'
import { EntryType } from '@/pages/api/Models/EntrySchema';
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import Helpers from '../CompareDate';
import ExportDataModal from './ExportDataModal';
import { formatToCustomDateFormat } from '@/pages/helpers/helper';
type ImportDataType = {
  loginInfo: LoginInfoType,
  entries: EntryType[],
  setCurrentEntryId: React.Dispatch<React.SetStateAction<string | null>>,
  fetchMoreEntries: () => void,
  totalLength: number
  createEntry: () => void,
  loading: boolean;
  allEntries: boolean;
  setAllEntries: React.Dispatch<React.SetStateAction<boolean>>;
  refreshEntries: () => void;
  clearLoginInfo: () => void;
  setRecyclebin: React.Dispatch<React.SetStateAction<boolean>>;
  recyclebin: boolean;
  softDeleteEntry: (id: string) => void;
  forceDeleteEntry: (id: string) => void;
  restoreDeletedEntry: (id: string) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchSubmit: () => void;
  searchedEntries: boolean;
  setSearchedEntries: React.Dispatch<React.SetStateAction<boolean>>;
  sideLoading: boolean;
  setSideLoading: React.Dispatch<React.SetStateAction<boolean>>;
  orderReverse: boolean;
  setOrderReverse: React.Dispatch<React.SetStateAction<boolean>>;
  exportDataFormat: number;
  setExportDataFormat: React.Dispatch<React.SetStateAction<number>>;
  exportModal: boolean;
  setExportModal: React.Dispatch<React.SetStateAction<boolean>>;
}
function Entries({ loginInfo,
  entries,
  setCurrentEntryId,
  fetchMoreEntries,
  totalLength,
  createEntry,
  loading,
  allEntries,
  setAllEntries,
  refreshEntries,
  softDeleteEntry,
  setRecyclebin,
  recyclebin,
  restoreDeletedEntry,
  search,
  setSearch,
  searchSubmit,
  searchedEntries,
  setSearchedEntries,
  forceDeleteEntry,
  sideLoading,
  setSideLoading,
  orderReverse,
  setOrderReverse,
  exportDataFormat,
  setExportDataFormat,
  exportModal,
  setExportModal
}: ImportDataType) {
  const [thatLoading, setThatLoading] = React.useState<boolean>(false);
  const filterString = (string: string): string => {
    const newString = string.replace(/<p>&nbsp;<\/p>/g, '');
    return newString;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearch(e.target.value);
  }

  function parseHtmlToText(html: string): string {
    let doc = new DOMParser().parseFromString(html, 'text/html');

    function processNode(node: Node): void {
      if (node.nodeType === 1) {  // Element node
        const allowedTags = ['p', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span'];
        if (allowedTags.includes(node.nodeName.toLowerCase())) {
          Array.from(node.childNodes).forEach(processNode);
        } else {
          const elementNode = node as HTMLElement;
          elementNode.replaceWith(document.createTextNode(elementNode.textContent || ''));
        }
      } else if (node.nodeType === 3) {
        return;
      }
    }

    Array.from(doc.body.childNodes).forEach(processNode);

    return doc.body.innerHTML;
  }

  function autoCloseHTMLTags(inputHTML: string) {
    const doc = new DOMParser().parseFromString(inputHTML, 'text/html');
    return parseHtmlToText(doc.body.innerHTML);
  }
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (search.length !== 0)
      searchSubmit();
  }

  const handleDeleteClick = (id: string) => {
    if (recyclebin)
      forceDeleteEntry(id);
    else
      softDeleteEntry(id);
  }
  const getActiveClass = (attr: any): string => {
    if (attr)
      return " !bg-orange-500 ";
    else
      return "";
  }
  const buttonClass = 'cursor-pointer ml-1 bg-slate-500 shadow rounded p-1 py-1.5 h-max text-sm sm:text-xs md:text-sm select-none dark:bg-black border dark:active:bg-slate-600 active:bg-slate-600';

  // Loading components
  const LoadingSpinner = () => {
    return <div role="status" className='flex ml-auto justify-center items-center px-3'>
      <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  }
  const maxTextLength = 500;
  const PreLoadCard = () => {
    return (<div className="cursor-pointer flex flex-col mt-3 border dark:border-gray-200 border-gray-300 overflow-hidden rounded-lg shadow-lg mx-3">
      <div className="flex items-center p-2 py-3 w-full dark:bg-gray-950 bg-gray-300 justify-between animate-pulse min-h-8">
        <p className=" text-sm"></p>
        {/* <div className="flex w-full h-4 animate bg-gray-400 dark:bg-gray-900 animate-pulse rounded-lg"/> */}
      </div>
      <div className="p-1 w-full text-start min-h-24 bg-transpaernt dark:bg-gray-800 overflow-hidden">
        <div className='px-1 rounded-lg my-2 card-text bg-gray-300 animate-pulse dark:bg-gray-600 w-full h-4' />
        <div className='px-1 rounded-lg my-2 card-text bg-gray-300 animate-pulse dark:bg-gray-600 w-full h-4' />
        <div className='px-1 rounded-lg mt-2 card-text bg-gray-300 animate-pulse dark:bg-gray-600 w-[50%] h-4' />
      </div>
    </div>);
  }
  const monthArray = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  const helper = new Helpers();
  const getMonthAndYear = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = monthArray[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
  return (
    <div className='min-h-screen'>
      <ExportDataModal
        modal={exportModal}
        setModal={setExportModal}
        setExportDataFormat={setExportDataFormat}
        exportDataFormat={exportDataFormat}
        loading={loading}
        sideLoading={sideLoading}
      />
      <div className="max-w-[85%] mx-auto my-5 overflow-hidden">
        <div className="menu-bar flex flex-wrap md:flex-row items-center">
          <div className='flex flex-wrap w-full text-white md:justify-start items-center space-x-1'>
            <button
              disabled={loading || sideLoading}
              onClick={createEntry}
              className={buttonClass}>
              New Entry
            </button>
            <button
              disabled={loading || sideLoading}
              className={buttonClass}
              onClick={() => setExportModal(!exportModal)}
            >
              Export Data
            </button>
            <button
              disabled={loading || sideLoading}
              className={buttonClass}
              onClick={refreshEntries}
            >
              Refresh
            </button>
            <button
              disabled={loading || sideLoading}
              className={buttonClass + getActiveClass(orderReverse)}
              onClick={() => setOrderReverse(!orderReverse)}
            >
              Order By : {!orderReverse ? "Asc" : "Desc"}
            </button>
            <button
              disabled={loading || sideLoading}
              className={buttonClass + getActiveClass(allEntries)}
              onClick={() => setAllEntries(!allEntries)}
            >
              {allEntries ? "Paginate Entries" : "Show All Entries"}
            </button>
            <button
              disabled={loading || sideLoading}
              className={buttonClass + getActiveClass(recyclebin)}
              onClick={() => { setRecyclebin(!recyclebin) }}>
              {recyclebin ? 'Non deleted entries' : 'Deleted entries'}
            </button>
            {sideLoading && <LoadingSpinner />}
          </div>
          <form onSubmit={handleSubmit} className='mx-2 mt-1 flex justify-evenly w-full'>
            <input
              type="text"
              name='search'
              placeholder='Search...'
              className='w-full sm:w-3/4 md:w-full rounded-l p-1 border outline-none dark:bg-black dark:text-white'
              onChange={handleChange}
              value={search}
            />
            <button
              className='bg-green-500 rounded-r p-1 text-white border active:bg-green-700'
              type='submit'
            >
              Search
            </button>
          </form>
        </div>

        <div className='min-h-[70vh]'>
          {searchedEntries && search.length !== 0 && <h2 className='text-xl mt-3'>Results of search: "{search}", Click <button className="underline active:text-purple-500" onClick={refreshEntries}>Refresh</button> to clear search filter</h2>}
          {recyclebin && <h2 className='text-xl mt-3'>Showing deleted entries, Click <button className="underline active:text-purple-500" onClick={() => setRecyclebin(!recyclebin)}>Non deleted entries</button> to get normal entries</h2>}
          {entries.length === 0 && !loading && <p className='mx-auto w-max text-xl mt-4'>No Entries found</p>}
          <InfiniteScroll
            dataLength={entries.length}
            next={fetchMoreEntries}
            hasMore={entries.length < totalLength}
            loader={<></>}
          >
            {
              entries.map((entry, index) => {
                let content = entry.content;
                if (entry.content.length > maxTextLength) {
                  content = entry.content.slice(0, maxTextLength) + '...';
                } else {
                  content = entry.content;
                }
                const update = helper.compareValue(new Date(entry.entry_date_time).getMonth());

                return (<div key={Date.now() * Math.random() + index}>
                  {index !== 0 && !update && <div className="my-10 flex">
                    <p className="month-name text-3xl">{getMonthAndYear(entry.entry_date_time)}</p>
                    <span className="month-flex">
                      <span className="month-line"></span>
                    </span>
                  </div>}

                  <div key={String('aksldfjaksdf' + Math.random()) + index} className="cursor-pointer flex flex-col mt-3 border dark:border-gray-200 border-gray-300 overflow-hidden rounded-lg shadow-lg mx-3">
                    <div className="flex items-center p-2 w-full dark:bg-gray-950 bg-gray-200 justify-between">
                      <p className=" text-sm"><strong># {totalLength - (index)}</strong> &nbsp; {formatToCustomDateFormat(entry.entry_date_time)}</p>
                      <div className="flex">
                        {recyclebin && <button onClick={() => restoreDeletedEntry(entry._id || '')} disabled={loading || sideLoading} className="d-inline mx-2 cursor-pointer" >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-recycle" viewBox="0 0 16 16">
                            <title>Restore Entry</title>
                            <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.5.5 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244z" />
                          </svg>
                        </button>}
                        <button disabled={loading || sideLoading} className="d-inline mx-2 cursor-pointer" onClick={() => handleDeleteClick(entry._id || '')}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                            <title>Delete Entry</title>
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button disabled={loading || sideLoading} onClick={() => { !recyclebin && setCurrentEntryId(entry._id || null) }} className="p-1 w-full text-start dark:bg-gray-800 min-h-24 bg-transpaernt overflow-hidden">
                      <p className='px-1 card-text' dangerouslySetInnerHTML={{ __html: filterString(autoCloseHTMLTags((content))) }} />
                    </button>
                    {recyclebin && <div className='px-3 bg-gray-300 text-black'><strong>Deleted at</strong>: {formatToCustomDateFormat(entry.deleted_at || '')}</div>}
                  </div>
                </div>)
              })
            }
          </InfiniteScroll>
          {
            loading && !thatLoading && <>
              <PreLoadCard />
              <PreLoadCard />
              <PreLoadCard />
              <PreLoadCard />
              <PreLoadCard />
            </>
          }
        </div>

      </div>
    </div >
  )
}

export default Entries



