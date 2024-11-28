// Import data
import Signin from "@/components/Signin";
import Header from "@/components/Header";
import Entries from "@/components/Entries";
import EditEntry from "@/components/EditEntry";
import Alert from '@/components/Alert';
import React from "react";
import { MyDecrypt } from "@/encryption/Encryption";
import type { EntryType } from "./api/Models/EntrySchema";
import getEntriesPagination from "./api/entries/get-entries-pagination";
import { IdleTimerProvider, useIdleTimer } from 'react-idle-timer';

// Types Declarations
export type AlertType = {
  success: boolean;
  message: string;
  showAlert: boolean;
}

export type LoginInfoType = {
  loggedIn: boolean;
  username: string;
  token: string;
  currentPage: string;
}


export default function Main() {
  // Functions
  const getUrl = (attributes: string) => {
    return process.env.NEXT_PUBLIC_HOST + attributes;
  }
  const checkLogin = () => {
    return loginInfo.loggedIn && loginInfo.username && loginInfo.token;
  }
  const goBack = () => {
    setCurrentEntry(null);
    setTotalLength(0);
    setCurrentEntryId(null);
    setLoginInfo({ ...loginInfo, currentPage: 'entries' })
  }

  // State Variables
  const [myAlert, setMyAlert] = React.useState<AlertType>({ success: false, message: '', showAlert: false });
  const alertTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [encryptionKey, setEncryptionKey] = React.useState<string>(process.env.NEXT_PUBLIC_ENCRYPT_KEY || '');
  const [totalLength, setTotalLength] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(1);
  const [loginInfo, setLoginInfo] = React.useState<LoginInfoType>({
    loggedIn: false,
    username: '',
    token: '',
    currentPage: 'login',
  });
  const [entries, setEntries] = React.useState<EntryType[]>([]);
  const [currentPage, setCurrentPage] = React.useState<string>('login');
  const [currentEntry, setCurrentEntry] = React.useState<EntryType | null>(null);
  const [currentEntryId, setCurrentEntryId] = React.useState<string | null>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [key, setKey] = React.useState<string | number>(Math.random() * Date.now());
  const [allEntries, setAllEntries] = React.useState<boolean>(false);
  const [recyclebin, setRecyclebin] = React.useState<boolean>(false);
  const [limit, setLimit] = React.useState<number>(5);
  const [search, setSearch] = React.useState<string>('');
  const [searchedEntries, setSearchedEntries] = React.useState<boolean>(false);
  const [sideLoading, setSideLoading] = React.useState<boolean>(false);
  const [orderReverse, setOrderReverse] = React.useState<boolean>(false);
  const [exportDataFormat, setExportDataFormat] = React.useState<number>(0);
  const [exportModal, setExportModal] = React.useState<boolean>(false);

  // Normal Functions
  const clearLoginInfo = () => {
    setLoginInfo({
      loggedIn: false,
      username: '',
      token: '',
      currentPage: 'login',
    })
  }

  const refreshEntries = () => {
    setEntries([]);
    setSearch('');
    setSearchedEntries(false);
    setTotalLength(0);
    if (allEntries) {
      getAllEntries();
    } else {
      getPaginatedEntries();
    }
    setKey(Math.random() * Date.now())
  }

  const clearAllData = () => {
    setLoginInfo({ loggedIn: false, token: '', username: '', currentPage: 'login' });
    setEntries([]);
    setSearch('');
    setPage(1);
    setCurrentEntry(null);
    setCurrentEntryId(null);
    setCurrentPage('login');
    setTotalLength(0);
    setAllEntries(false);
    setRecyclebin(false);
    setOrderReverse(false);
  }
  const handleOnIdle = () => {
    clearAllData();
    console.log('you are idle')
  };


  // ------------------ API Calls ------------------


  // ------------------ GET API Calls ------------------


  // Get all entries to Export API call
  const exportData = async () => {
    if(!loading){
    setLoading(false);
    try {
      const data = await fetch(getUrl('/api/entries/get-all-entries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': loginInfo.token,
        },
        body: JSON.stringify({ search, order: -1 }),
      });

      const response = await data.json();
      if (response.success) {
        let entries = response.entries;
        let decryptedEntries = [];
        for (let entry of entries) {
          entry.content = await MyDecrypt(entry.content, encryptionKey);
          delete entry.__v;
          decryptedEntries.push(entry);
        }
        switch (exportDataFormat) {
          case 1:
            const jsonString = JSON.stringify(decryptedEntries, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'MemoVault_' + loginInfo.username + '_entries.json';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            break;
          case 2:
            const htmlFormatCreator = (index: number, date: string, content: string, tag: string) => {
              return `<br>
  <h2 style="margin-left: 59px;">Entry No ${index}</h2>
  <div style="width: 80%; margin: auto;">
    <h3>Date: ${date}, Tag: ${tag}</h3>
    <div>${content}</div>
  </div>
  <br>
  <hr>`;
            }
            const htmlTop = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MemoVault - Downloaded Entries</title>
  <style>
    *{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
    }
  </style>
</head>

<body>
  <h1 style="text-align: center; color: white; background-color: black; padding: 15px 0;">MemoVault - Downloaded Entries</h1>
  `;
            const htmlBottom = `</body>
</html > `;
            let mainString = '';
            for (let [index, entry] of decryptedEntries.entries()) {
              mainString += htmlFormatCreator(index + 1, entry.entry_date_time, entry.content, entry.tag);
            }
            const totalHtmlString = htmlTop + mainString + htmlBottom;
            const blob2 = new Blob([totalHtmlString], { type: 'text/html' });
            const url2 = URL.createObjectURL(blob2);
            const a2 = document.createElement('a');
            a2.href = url2;
            a2.download = 'MemoVault_' + loginInfo.username + '_entries.html';
            a2.style.display = 'none';
            document.body.appendChild(a2);
            a2.click();
            document.body.removeChild(a2);
            URL.revokeObjectURL(url2);
            break;
          default:
            break;
        }
        setMyAlert({success: true, message: 'Download operation is running...', showAlert:true});
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
    } catch (error) {
      setMyAlert({ success: false, message: 'Some technical error occurred', showAlert: true });
    }

    setExportDataFormat(0);
    setExportModal(false);
    setLoading(false);
  }
}



  // Search API call
  const searchSubmit = async () => {
    if (checkLogin()) {
      setLoading(true);
      setEntries([]);
      setRecyclebin(false);
      setAllEntries(false);
      setOrderReverse(false);
      try {
        const data = await fetch(getUrl('/api/entries/get-search-from-content'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
          body: JSON.stringify({ search, order: orderReverse ? 1 : -1 })
        });
        const response = await data.json();
        if (response.success) {
          const decryptedEntries: EntryType[] | null = []
          for (let entry of response.entries) {
            entry.content = await MyDecrypt(entry.content, encryptionKey);
            decryptedEntries.push(entry);
          }
          setTotalLength(decryptedEntries.length);
          setEntries(decryptedEntries);
          setSearchedEntries(true);
          setCurrentPage('entries')
          setMyAlert({ success: response.success, message: response.message, showAlert: true });
        } else
          setMyAlert({ success: response.success, message: response.message, showAlert: true });
      } catch (error) {
        setMyAlert({ success: false, message: 'Some technical error occured', showAlert: true });
      }
      setLoading(false);
    }
  }


  // Get All Entries API call
  async function getAllEntries() {
    if (!checkLogin()) return;
    try {
      setLoading(true);
      const url = recyclebin ? '/api/entries/get-all-deleted-entries' : '/api/entries/get-all-entries';
      const data = await fetch(getUrl(url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': loginInfo.token
        },
        body: JSON.stringify({ order: orderReverse ? 1 : -1 })
      });
      const response = await data.json();
      if (response.success) {
        let decryptedEntries = [];
        for (let entry of response.entries) {
          entry.content = await MyDecrypt(entry.content, encryptionKey);
          decryptedEntries.push(entry);
        }
        setEntries(decryptedEntries);
        setTotalLength(response.entries.length);
        setCurrentPage('entries');
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
    } catch (error) {
      setMyAlert({ success: false, message: 'Failed to fetch all entries', showAlert: true });
    }
    setLoading(false);
  }



  // Get Entries by Pagination Call
  const getPaginatedEntries = async () => {
    if (!checkLogin()) return;
    try {
      setLoading(true);
      const url = recyclebin ? '/api/entries/get-deleted-entries-by-pagination' : '/api/entries/get-entries-pagination';
      const data = await fetch(getUrl(url), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': loginInfo.token
        },
        body: JSON.stringify({ page: 1, limit, order: orderReverse ? 1 : -1 })
      });
      const response = await data.json();
      if (response.success) {
        let decryptedEntries = [];
        for (let entry of response.entries) {
          entry.content = await MyDecrypt(entry.content, encryptionKey);
          decryptedEntries.push(entry);
        }
        setEntries(decryptedEntries);
        setTotalLength(response.totalLength);
        setPage(2);
        setCurrentPage('entries');
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
    } catch (error) {
      setMyAlert({ success: false, message: 'Error fetching entries', showAlert: true });
    }
    setLoading(false);
  }


  // Fetch More Data API call
  const fetchMoreEntries = async () => {
    setLoading(true);
    if (entries.length < totalLength) {
      if (!checkLogin()) return;
      try {
        const url = recyclebin ? '/api/entries/get-deleted-entries-by-pagination' : '/api/entries/get-entries-pagination';
        const data = await fetch(getUrl(url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
          body: JSON.stringify({ page, limit, order: orderReverse ? 1 : -1 })
        });
        const response = await data.json();
        if (response.success) {
          let decryptedEntries = [];
          for (let entry of response.entries) {
            entry.content = await MyDecrypt(entry.content, encryptionKey);
            decryptedEntries.push(entry);
          }
          setEntries(entries.concat(decryptedEntries));
          setPage(page + 1);
          setTotalLength(response.totalLength);
          setCurrentPage('entries');
        } else {
          setMyAlert({ success: false, message: response.message, showAlert: true });
        }
      } catch (error) {
        setMyAlert({ success: false, message: 'Error fetching entries', showAlert: true });
      }
    }
    setLoading(false);
  }


  // Get Entry to edit API call
  const getEntryToEdit = async () => {
    if (!checkLogin() || !currentEntryId) return;
    setSideLoading(true);
    try {
      const data = await fetch(getUrl('/api/entries/get-entry-by-id'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authtoken': loginInfo.token
        },
        body: JSON.stringify({ entryId: currentEntryId })
      });
      const response = await data.json();
      if (response.success) {
        response.entry.content = await MyDecrypt(response.entry.content, encryptionKey);
        setCurrentEntry(response.entry);
        setCurrentPage('editEntry');
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
    } catch (error) {
      setMyAlert({ success: false, message: 'Error fetching entry to edit', showAlert: true });
    }
    setSideLoading(false);
  }


  // ------------------ Deletion/Restortion Api Calls ------------------

  // Force Delete Entry API call
  const forceDeleteEntry = async (entryId: string) => {
    if (!sideLoading && checkLogin()) {
      setSideLoading(true)
      try {
        const data = await fetch(getUrl('/api/entries/force-delete-entry'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
          body: JSON.stringify({ entryId })
        });
        const response = await data.json();
        if (response.success) {
          setMyAlert({ success: true, message: response.message, showAlert: true });
          refreshEntries();
        } else {
          setMyAlert({ success: false, message: response.message, showAlert: true });
        }
      } catch (error) {
        setMyAlert({ success: false, message: 'Some technical error occured', showAlert: true });
      }
      setSideLoading(false);
    }
  }


  // Create an Entry API call
  const createEntry = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const data = await fetch(getUrl('/api/entries/create-entry'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
        });
        const response = await data.json();
        if (response.success) {
          setCurrentEntryId(response.entryId);
          setMyAlert({ success: true, message: response.message, showAlert: true });
        } else {
          setMyAlert({ success: false, message: response.message, showAlert: true });
        }
      } catch (error) {
        setMyAlert({ success: false, message: 'Failed to create new entry', showAlert: true })
      }
      setLoading(false);
    }
  }


  // Soft Delete Entry API call
  const softDeleteEntry = async (entryId: string | undefined) => {
    if (!sideLoading && checkLogin()) {
      setSideLoading(true);
      try {
        const data = await fetch(getUrl('/api/entries/soft-delete-entry'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
          body: JSON.stringify({ entryId })
        });
        const response = await data.json();
        if (response.success) {
          setMyAlert({ success: true, message: response.message, showAlert: true });
          refreshEntries();
        } else {
          setMyAlert({ success: false, message: response.message, showAlert: true });
        }
      } catch (error) {
        setMyAlert({ success: false, message: 'Some technical error occured', showAlert: true });
      }
      setSideLoading(false);
    }
  }


  // Restore Deleted Entry API Call
  const restoreDeletedEntry = async (entryId: string | undefined) => {
    if (!checkLogin()) return;
    if (!sideLoading) {
      setSideLoading(true);
      try {
        const data = await fetch(getUrl('/api/entries/restore-entry'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authtoken': loginInfo.token
          },
          body: JSON.stringify({ entryId })
        });
        const response = await data.json();
        if (response.success) {
          setMyAlert({ success: true, message: response.message, showAlert: true });
          refreshEntries();
        } else {
          setMyAlert({ success: false, message: response.message, showAlert: true });
        }
      } catch (error) {
        setMyAlert({ success: false, message: 'Some technical error occured', showAlert: true });
      }
      setSideLoading(false);
    }
  }

  // --------------------------------------------------------------

  const handleOnActive = () => {
  }
  const handleOnAction = () => {
  }
  const timeout = 1000 * 60 * 5;
  const { reset, start, pause } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    events: ['click', 'keydown', 'keypress'],
  });


  // UseEffect functions


  // Export Data UseEffect - Calls export data function
  React.useEffect(() => {
    if (exportDataFormat !== 0) {
      exportData();
    }
  }, [exportDataFormat])


  // All Entries UseEffect
  React.useEffect(() => {
    setEntries([]);
    setTotalLength(0);
    if (allEntries) {
      getAllEntries();
    } else {
      getPaginatedEntries();
    }
    setKey(Math.random() * Date.now());

  }, [allEntries]);


  // LoginInfo UseEffect - Changes page or starts the activity detector timer
  React.useEffect(() => {
    if (loginInfo.loggedIn) {
      if (loginInfo.loggedIn) {
        start();
        reset();
      }
    }
    if (checkLogin()) {
      if (loginInfo.currentPage === 'entries') {
        if (allEntries) {
          getAllEntries();
        } else {
          getPaginatedEntries();
        }
      } else if (loginInfo.currentPage === 'editEntry') {
        getEntryToEdit();
      }
    }
  }, [loginInfo]);


  // Current Id UseEffect - Sets the page to edit entry page
  React.useEffect(() => {
    if (currentEntryId !== null) {
      setLoginInfo(vals => ({ ...vals, currentPage: 'editEntry' }));
    }
  }, [currentEntryId]);


  // Alert UseEffect - dissmisses Alert after 4 seconds
  React.useEffect(() => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }
    if (myAlert.showAlert) {
      alertTimeout.current = setTimeout(() => {
        setMyAlert({ success: false, message: '', showAlert: false });
      }, 4000);
    }
    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, [myAlert]);


  // RecycleBin UseEffect - Set Entries to deleted entries
  React.useEffect(() => {
    setEntries([]);
    setPage(1);
    if (allEntries) {
      getAllEntries();
    } else {
      getPaginatedEntries();
    }
  }, [recyclebin]);


  // Order reverse UseEffect - Refreshes entries on changing order
  React.useEffect(() => {
    refreshEntries();
  }, [orderReverse]);
  return (
    <>

      <Header key={'same'} pos={-1} loginInfo={loginInfo} clearData={clearAllData} />
      {myAlert.showAlert && <Alert
        success={myAlert.success}
        message={myAlert.message}
      />}
      {currentPage === 'login' && <Signin loading={loading}
        setLoading={setLoading}
        setLoginInfo={setLoginInfo}
        myAlert={myAlert}
        setMyAlert={setMyAlert}
      />
      }
      {currentPage === 'entries' && loginInfo.loggedIn && loginInfo.token && loginInfo.username &&
        <Entries
          key={key}
          allEntries={allEntries}
          setAllEntries={setAllEntries}
          clearLoginInfo={clearLoginInfo}
          loading={loading}
          createEntry={createEntry}
          totalLength={totalLength}
          refreshEntries={refreshEntries}
          fetchMoreEntries={fetchMoreEntries}
          setRecyclebin={setRecyclebin}
          softDeleteEntry={softDeleteEntry}
          recyclebin={recyclebin}
          setCurrentEntryId={setCurrentEntryId}
          loginInfo={loginInfo}
          entries={entries}
          restoreDeletedEntry={restoreDeletedEntry}
          search={search}
          setSearch={setSearch}
          searchSubmit={searchSubmit}
          setSearchedEntries={setSearchedEntries}
          searchedEntries={searchedEntries}
          forceDeleteEntry={forceDeleteEntry}
          sideLoading={sideLoading}
          setSideLoading={setSideLoading}
          orderReverse={orderReverse}
          setOrderReverse={setOrderReverse}
          exportDataFormat={exportDataFormat}
          setExportDataFormat={setExportDataFormat}
          exportModal={exportModal}
          setExportModal={setExportModal}
        />
      }
      {currentPage === 'editEntry' && loginInfo.loggedIn && loginInfo.token && loginInfo.username &&
        <EditEntry
          goBack={goBack}
          encryptionKey={encryptionKey}
          setMyAlert={setMyAlert}
          loading={loading}
          setLoading={setLoading}
          currentEntry={currentEntry}
          setCurrentEntry={setCurrentEntry}
          loginInfo={loginInfo}
        />}
    </>
  );
}



/*
Task list:
1- RecycleBin function - Done
2- Render All entries at once - Done
3- Navbar responsiveness - Done
4- Searching in entries - Done
5- Activity detector - Done
6- Export Data - Done
7- Change Password - Pending...
8- Import Data - Pending...


*/