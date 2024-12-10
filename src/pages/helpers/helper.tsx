export const getUrl = (attributes: string) => {
  return process.env.NEXT_PUBLIC_HOST + attributes;
}
export function formatToCustomDateFormat(givenDate: string | Date) {
  const date: Date = new Date(givenDate);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm.toUpperCase()}`;
}

export function formatDate(d: any) {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  const timezoneOffset = date.getTimezoneOffset();
  const sign = timezoneOffset > 0 ? '-' : '+';
  const absOffset = Math.abs(timezoneOffset);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, '0');
  const offsetMinutes = String(absOffset % 60).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${offsetHours}:${offsetMinutes}`;

  return formattedDate;
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function convertToISOFormat(dateTime: string | Date): string {
  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
      return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
export const fetchAPI = async (apiRoute: string, body:Object | any, token:string, method:string='POST') =>{
try {
  const response = await fetch(getUrl(apiRoute), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authtoken': token,
    },
    body: JSON.stringify(body),
  });
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    throw new Error('Response is not JSON');
  }
} catch (error) {
  return {success: false, error: 'Technical Error', message: 'Some technical error occured please try again'}
}
}