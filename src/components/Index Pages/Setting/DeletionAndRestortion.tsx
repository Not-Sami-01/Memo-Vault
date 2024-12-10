import FullPageLoading from '@/components/Other/FullPageLoading';
import Modal from '@/components/Other/Modal';
import { AlertType, LoginInfoType } from '@/pages'
import { fetchAPI } from '@/pages/helpers/helper';
import React from 'react'
import DeleteAccountModal from './DeleteAccountModal';
type ImportDataType = {
  loginInfo: LoginInfoType;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMyAlert: React.Dispatch<React.SetStateAction<AlertType>>;
  clearAllData: ()=> void;
}
type ModalDataType = {
  title: string;
  body: () => React.ReactNode;
  submitFunc: () => void;
}
const DeletionAndRestortion = ({ loading, loginInfo, setLoading, setMyAlert, clearAllData }: ImportDataType) => {
  const [password, setPassword] = React.useState<string>('');
  const [deleteAccountModal, setDeleteAccountModal] = React.useState<boolean>(false);
  const [modal, setModal] = React.useState<boolean>(false);
  const [modalData, setModalData] = React.useState<ModalDataType>({
    title: '',
    body: () => <>Null</>,
    submitFunc: () => { },
  });

  const operation = async (route: string) => {
    if (!loading) {
      setModal(false);
      setLoading(true);
      const response = await fetchAPI(route, {}, loginInfo.token, 'POST');
      setLoading(false);
      setMyAlert({ success: response.success, message: response.message, showAlert: true });
    }
  }

  const handleClick = (option: number) => {
    if (modal) return;
    switch (option) {

      // Restore all entries
      case 1:
        setModalData({
          title: 'Restore All Entries', body:
            () => <><p>Do you want to restore all the entries in recyclebin?</p> <p className="text-red-500 text-sm"><strong>Warning! </strong>This operation is irreversible</p></>
          ,
          submitFunc: () => {
            operation('/api/entries/restore-all-entries');
          }
        })
        setModal(true);
        break;

      // Soft delete all entries
      case 2:
        setModalData({
          title: 'Move all entries to recyclebin', body:
            () => <><p>Do you want to move all entries to recyclebin?</p> <p className="text-red-500 text-sm"><strong>Warning! </strong>This operation is irreversible</p></>
          ,
          submitFunc: () => {
            operation('/api/entries/soft-delete-all-entries');
          }
        })
        setModal(true);
        break;

      // Force delete trashed entries
      case 3:
        setModalData({
          title: 'Empty recyclebin', body:
            () => <><p>Do you want to delete all entries in the recyclebin permanently?</p> <p className="text-red-500 text-sm"><strong>Warning! </strong>This operation is irreversible</p></>
          ,
          submitFunc: () => {
            operation('/api/entries/force-delete-all-trashed-entries');
          }
        })
        setModal(true);
        break;

      // Force delete all entries
      case 4:
        setModalData({
          title: 'Delete all entries', body:
            () => <><p>Do you want to delete all entries permanently?</p> <p className="text-red-500 text-sm"><strong>Warning! </strong>This operation is irreversible</p></>
          ,
          submitFunc: () => {
            operation('/api/entries/force-delete-all-entries');
          }
        })
        setModal(true);
        break;

      default:
        break;
    }
  }

  const handlePasswordInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const deleteAccountHandleModal = () => {
    setDeleteAccountModal(true);
  }
  const deleteAccount = async ()=> {
    if (!loading) {
      setLoading(true);
      const response = await fetchAPI('/api/users/delete-user', {password}, loginInfo.token, 'POST');
      setLoading(false);
      if (response.success) {
        setMyAlert({ success: true, message: response.message, showAlert: true });
        setDeleteAccountModal(false);
        clearAllData();
        
      } else {
        setMyAlert({ success: false, message: response.message, showAlert: true });
      }
      setDeleteAccountModal(false);
    }
  }

  React.useEffect(() => {
    if (modal === false) {
      setModalData({ title: '', body: () => <>Null</>, submitFunc: () => { } })
    }
  }, [modal])
  const operationButtonClassName = 'p-1 border border-gray-600 dark:border-gray-200 rounded m-1 text-sm active:bg-gray-700';
  return (
    <div>
      {loading && <FullPageLoading />}
      <DeleteAccountModal
      modal={deleteAccountModal}
      setModal={setDeleteAccountModal}
      onSubmit={deleteAccount}
      loading={loading}
      password={password}
      setPassword={setPassword}
      />
      <Modal
        loading={loading}
        modal={modal}
        setModal={setModal}
        ModalBody={modalData.body}
        title={modalData.title}
        onSubmit={modalData.submitFunc}
        submitButtonName='Delete'
      />
      <h1 className="text-2xl text-center">Deletion</h1>
      <div className="container md:px-10">

        <h2 className="text-xl">Delete/Restore Entries</h2>
        <div className="md:px-10 px-1">
          <ul className='md:pl-5 p-1'>
            <li>Total Entries: {(loginInfo.totalEntries || 0) + (loginInfo.trashedEntries || 0)}</li>
            <li>Deleted Entries: {loginInfo.trashedEntries}</li>
            <li>Non-Deleted Entries: {loginInfo.totalEntries}</li>
          </ul>
          Operations:
          <ul className='flex flex-wrap'>
            <li>
              <button className={operationButtonClassName} onClick={() => handleClick(1)} >
                Restore deleted Entries
              </button>
            </li>
            <li>
              <button className={operationButtonClassName} onClick={() => handleClick(2)}>
                Move all entries to recyclebin
              </button>
            </li>
            <li>
              <button className={operationButtonClassName} onClick={() => handleClick(3)}>
                Empty Recyclebin
              </button>
            </li>
            <li>
              <button className={operationButtonClassName} onClick={() => handleClick(4)}>
                Delete All Entries
              </button>
            </li>
          </ul>
        </div>
        <h2 className="text-xl">Delete Your account</h2>
        <div className='md:px-10 px-1'>

          <p className="text-red-500">
            <strong>Warning!</strong> Deleting your account permanently removes all your data, including your entries, settings, and your account. Please ensure you have a backup before proceeding. If you want to restore your account, you can do so by creating a new account and importing your data.
          </p>
          <button className='p-1 flex justify-center items-center text-white bg-red-500 rounded mt-1' onClick={deleteAccountHandleModal}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            Delete Your Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletionAndRestortion
