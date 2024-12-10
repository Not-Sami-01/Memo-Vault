// Import data
import Signin from "@/components/Index Pages/Signin";
import Header from "@/components/Other/Header";
import Entries from "@/components/Index Pages/Entries";
import EditEntry from "@/components/Index Pages/EditEntry";
import Alert from '@/components/Other/Alert';
import React from "react";
import { MyDecrypt } from "@/encryption/Encryption";
import type { EntryType } from "./api/Models/EntrySchema";
import { useIdleTimer } from 'react-idle-timer';
import Setting from "@/components/Index Pages/Setting";
import { fetchAPI } from "./helpers/helper";
import FullPageLoading from "@/components/Other/FullPageLoading";

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
  joinedAt: string | Date | null;
  totalEntries: number | null;
  trashedEntries: number | null;
}


export default function Main() {
  // Functions

  const checkLogin = () => {
    return loginInfo.loggedIn && loginInfo.username && loginInfo.token;
  }
  const goBack = () => {
    setCurrentEntry(null);
    setTotalLength(0);
    setCurrentEntryId(null);
    setKey(Math.random() + Date.now() + 'asdfasdfasdf');
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
    totalEntries: null,
    joinedAt: null,
    trashedEntries: null,
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
  const [noPage, setNoPage] = React.useState<boolean>(false);
  // Normal Functions
  const clearLoginInfo = () => {
    setLoginInfo({
      loggedIn: false,
      username: '',
      token: '',
      currentPage: 'login',
      trashedEntries: null,
      joinedAt: null,
      totalEntries: null,
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

  const clearEntries = () => {
    setEntries([]);
    setSearch('');
    setPage(1);
    setTotalLength(0);
    setAllEntries(false);
    setRecyclebin(false);
    setOrderReverse(false);
  }

  const clearOtherData = () => {
    setEntries([]);
    setSearch('');
    setPage(1);
    setCurrentEntry(null);
    setCurrentEntryId(null);
    setTotalLength(0);
    setAllEntries(false);
    setRecyclebin(false);
    setOrderReverse(false);
  }
  const clearAllData = () => {
    clearLoginInfo();
    setLoginInfo({
      loggedIn: false,
      username: '',
      token: '',
      currentPage: 'login',
      totalEntries: null,
      joinedAt: null,
      trashedEntries: null,
    })
    setCurrentPage('login');
    clearOtherData();
  }
  const handleOnIdle = () => {
    clearAllData();
  };


  // ------------------ API Calls ------------------


  // ------------------ GET API Calls ------------------


  // Get all entries to Export API call
  const exportData = async () => {
    if (!loading) {
      setLoading(true);
      try {
        const url = '/api/entries/get-all-entries-to-export'
        const response = await fetchAPI(url, { order: -1 }, loginInfo.token, 'POST');
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
              setMyAlert({ success: false, message: 'Please select a valid format', showAlert: true });
              break;
          }
          setMyAlert({ success: true, message: 'Download operation is running...', showAlert: true });
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
      const url = '/api/entries/get-search-from-content';
      const response = await fetchAPI(url, { search, order: orderReverse ? 1 : -1 }, loginInfo.token, 'POST');
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
      setLoading(false);
    }
  }


  // Get All Entries API call
  async function getAllEntries() {
    if (!checkLogin()) return;
    try {
      setLoading(true);
      const url = recyclebin ? '/api/entries/get-all-deleted-entries' : '/api/entries/get-all-entries';
      const response = await fetchAPI(url, { order: orderReverse ? 1 : -1 }, loginInfo.token, 'POST');
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
      const response = await fetchAPI(url, { page: 1, limit, order: orderReverse ? 1 : -1 }, loginInfo.token, 'POST');
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
        const response = await fetchAPI(url, { page, limit, order: orderReverse ? 1 : -1 }, loginInfo.token, 'POST');
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

  const clearCurrentEntry = () => {
    setCurrentEntry(null);
    setCurrentEntryId(null);
  }
  const refreshEntry = async () => {
    if (!loading) {
      setLoading(true);
      setNoPage(true);
      setCurrentEntry(null);
      await getEntryToEdit();
      setNoPage(false);
      setMyAlert({ success: true, message: 'Entry refreshed successfully', showAlert: true });
      setLoading(false);
    }
  }
  // Get Entry to edit API call
  const getEntryToEdit = async () => {
    if (!checkLogin() || !currentEntryId) return;
    setSideLoading(true);
    try {
      const url = '/api/entries/get-entry-by-id';
      const response = await fetchAPI(url, { entryId: currentEntryId }, loginInfo.token, 'POST');
      if (response.success) {
        response.entry.content = await MyDecrypt(response.entry.content, encryptionKey);
        setCurrentEntry(response.entry);
        setKey(Math.random() + Date.now() + 'askdfjkasjdfkajsdfkjasdfkjas');
        setCurrentPage('editEntry');
        clearEntries();
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
    } catch (error) {
      setMyAlert({ success: false, message: 'Error fetching entry to edit', showAlert: true });
    }
    setSideLoading(false);
  }


  // Import/Add Data to the database
  const importData = async (data: []) => {
    if (!loading) {
      const url = '/api/entries/import-entries';
      const response = await fetchAPI(url, { data }, loginInfo.token, 'POST');
      setMyAlert({ success: response.success, message: response.message, showAlert: true });
    }
  }

  // ------------------ Deletion/Restortion Api Calls ------------------

  // Force Delete Entry API call
  const forceDeleteEntry = async (entryId: string) => {
    if (!sideLoading && checkLogin()) {
      setSideLoading(true)
      try {
        const url = '/api/entries/force-delete-entry'
        const response = await fetchAPI(url, { entryId }, loginInfo.token, 'POST');
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
        const url = '/api/entries/create-entry'
        const response = await fetchAPI(url, {}, loginInfo.token, 'POST')
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
        const url = '/api/entries/soft-delete-entry'
        const response = await fetchAPI(url, { entryId }, loginInfo.token, 'POST')
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
        let url = '/api/entries/restore-entry';
        const response = await fetchAPI(url, { entryId }, loginInfo.token, 'POST')
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
    if (loginInfo.currentPage === 'entries') {

      if (allEntries) {
        getAllEntries();
      } else {
        getPaginatedEntries();
      }
      setKey(Math.random() * Date.now());
    }
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
        clearCurrentEntry();
        if (allEntries) {
          getAllEntries();
        } else {
          getPaginatedEntries();
        }
      } else if (loginInfo.currentPage === 'editEntry') {
        getEntryToEdit();
      } else if (loginInfo.currentPage === 'setting') {
        clearCurrentEntry();
        setCurrentPage('setting');
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
    if (loginInfo.currentPage === 'entries') {
      if (allEntries) {
        getAllEntries();
      } else {
        getPaginatedEntries();
      }
    }
  }, [recyclebin]);


  // Order reverse UseEffect - Refreshes entries on changing order
  React.useEffect(() => {
    if (loginInfo.currentPage === 'entries') {
      refreshEntries();
    }
  }, [orderReverse]);

  return (
    <>

      <Header key={'same'} pos={-1} setLoginInfo={setLoginInfo} loginInfo={loginInfo} clearData={clearAllData} loading={loading} />
      {myAlert.showAlert && <Alert
        success={myAlert.success}
        message={myAlert.message}
      />}
      {currentPage === 'login' && !noPage && <Signin loading={loading}
        setLoading={setLoading}
        setLoginInfo={setLoginInfo}
        myAlert={myAlert}
        setMyAlert={setMyAlert}
      />
      }
      {currentPage === 'setting' && !noPage && loginInfo.loggedIn && loginInfo.token && loginInfo.username &&
        <Setting
          loginInfo={loginInfo}
          goBack={goBack}
          loading={loading}
          setLoading={setLoading}
          setExportDataFormat={setExportDataFormat}
          exportDataFormat={exportDataFormat}
          clearAllData={clearAllData}
          setMyAlert={setMyAlert}
          importData={importData}
        />}
      {currentPage === 'entries' && !noPage && loginInfo.loggedIn && loginInfo.token && loginInfo.username &&
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
      {currentPage === 'editEntry' && !noPage && loginInfo.loggedIn && loginInfo.token && loginInfo.username &&
        <EditEntry
          key={`${currentEntryId} This is key`}
          refreshEntry={refreshEntry}
          goBack={goBack}
          encryptionKey={encryptionKey}
          setMyAlert={setMyAlert}
          loading={loading}
          setLoading={setLoading}
          currentEntry={currentEntry}
          setCurrentEntry={setCurrentEntry}
          loginInfo={loginInfo}
        />}
      {noPage && <FullPageLoading />}

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
9- Data Operations - Pending...















// ChatGPT Response on features
For your journal-taking website, the settings page should provide users with flexibility and control over their account and journal-related preferences. Here are some additional features and information you can consider adding to the settings page:

1. Profile Settings
Change Username: Allow users to update their username if desired.
Change Email: Let users update their email address.
Profile Picture: Allow users to upload a profile image or choose a default avatar.
Display Name: Let users choose a preferred display name for how they appear on the site.
2. Theme and Appearance
Dark Mode/Light Mode: Provide an option to switch between dark and light themes for a personalized experience.
Custom Fonts: Let users choose a preferred font for writing their journal entries (e.g., serif, sans-serif).
Custom Backgrounds: Offer users the ability to choose or upload a background image for their journal interface.
Text Size/Spacing: Provide options to adjust the text size and line spacing for better readability.
3. Notification Settings
Email Notifications: Let users opt in or out of receiving notifications for updates (e.g., new features, updates, or reminders).
Push Notifications: If applicable, allow users to enable/disable push notifications for reminders or journal-related updates.
Daily Reminders: Let users set daily reminders to encourage journaling habits (e.g., a reminder to write at a specific time each day).
4. Privacy and Security Settings
Two-Factor Authentication (2FA): Add an option for users to enable two-factor authentication for an added layer of security.
Login Activity: Show a log of recent login activity (e.g., devices and locations where the account was accessed).
Session Timeout: Provide the option to set session timeout intervals (e.g., automatically log out after a period of inactivity).
Data Encryption: Inform users if their data is encrypted both in transit and at rest for privacy concerns.
5. Backup & Sync Settings
Sync Across Devices: Enable users to sync their journal entries across multiple devices, ensuring they can access their content anywhere.
Backup Frequency: Let users set automatic backup intervals (e.g., daily, weekly) for their journal entries.
Cloud Sync: Offer integration with cloud storage services like Google Drive, Dropbox, or iCloud for seamless backup and syncing.
6. Language and Regional Settings
Change Language: Provide users with the option to change the language of the interface.
Date and Time Format: Allow users to set their preferred date and time format (e.g., DD/MM/YYYY vs. MM/DD/YYYY).
Time Zone: Let users set their time zone so journal entries are logged correctly in local time.
7. Entry Settings
Privacy for Entries: Allow users to set journal entries as private, shared with certain users, or public.
Tags/Labels: Provide the ability to create and manage custom tags or categories for journal entries to help with organization.
Word Count Limit: Option to set a limit on the number of words for each journal entry, encouraging brevity or allowing for long entries.
8. Subscription and Billing (if applicable)
Plan Management: Allow users to upgrade, downgrade, or change their subscription plan.
Payment Methods: Allow users to add, update, or remove payment methods for subscription management.
Billing History: Display the user's billing history, including past payments and invoices.
9. Export/Import Options (Enhanced)
Export Journal Entries: Allow users to export journal entries in different formats such as PDF, TXT, or DOCX.
Import from External Platforms: Allow users to import journal data from other platforms, such as Evernote or Day One.
Backup to External Services: Provide integration with third-party services for users to back up their journals (e.g., exporting to Dropbox).
10. Accessibility Settings
Screen Reader Compatibility: Offer options to improve compatibility with screen readers for visually impaired users.
Color Blind Mode: Provide a mode that adjusts colors for users with color vision deficiencies.
Keyboard Shortcuts: Offer a list of keyboard shortcuts for efficient navigation, especially for power users.
11. Activity Log
Journal Activity Log: Display a log of recent activity, such as journal entries made, edits, or deletions.
Login History: Show a list of recent logins (with location and time) for transparency and security.
12. Account Preferences
Timezone Settings: Allow users to set the preferred time zone for their journal timestamps.
Auto-Save Options: Provide a setting for automatically saving journal entries as users write.
Entry Templates: Allow users to choose or create custom templates for common journal entries (e.g., daily gratitude journal, mood tracker).
13. Customer Support
Help & FAQ: Provide quick links to the help center or frequently asked questions (FAQs).
Contact Support: A way for users to submit a request to customer support if they have an issue or question.
Community Forums: If applicable, link to community forums where users can discuss journaling or the platform.
14. Legal & Compliance
Terms of Service: Provide users access to the Terms of Service agreement.
Privacy Policy: Display the platform's privacy policy so users can understand how their data is handled.
GDPR/CCPA Settings: For users in applicable regions, include settings for GDPR or CCPA compliance, such as data export and deletion requests.
15. Miscellaneous
Custom Reminders: Allow users to set custom reminders for journaling (e.g., a reminder to journal about their mood at 9 PM every day).
Journal Prompts: Provide a list of optional prompts that users can opt into for inspiration or to help with writing.
Deleted Entries: Provide an option to recover recently deleted journal entries within a certain period.
By adding these features, you give users control over how their journal works, enhancing their experience while maintaining a secure, flexible, and customizable platform.




*/
