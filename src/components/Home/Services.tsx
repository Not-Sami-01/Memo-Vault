import React from 'react'

const Services = () => {
  type ServiceType = {
    title: string,
    description: string,
    icon: any
  }
  const Service = ({ detail }: { detail: ServiceType }) => {
    const { title, description, icon } = detail;
    return (
      <div className='w-full justify-between h-full p-4 border rounded-lg shadow-md flex items-start mx-3'>
        <div className='mr-4 p-1 flex items-center justify-center rounded-full border'>
          {icon}
        </div>
        <div>
          <h2 className='text-lg font-medium'>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
    )
  }
  const serviceDetails = [
    {
      title: 'Digital Sanctuary',
      description: 'MemoVault serves as a secure space for your thoughts, ideas, and reflections.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l10 9-10 9-10-9 10-9z" />
        </svg>
      ),
    },
    {
      title: 'Versatile Writing Platform',
      description: 'Ideal for diaries, journals, and creative ideas, accommodating various writing styles.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4h2a2 2 0 012 2v12a2 2 0 01-2 2h-2M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h2M8 4v12m8-12v12" />
        </svg>
      ),
    },
    {
      title: 'User-Friendly Interface',
      description: 'Designed for ease of use, allowing you to focus on expressing yourself effortlessly.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ),
    },
    {
      title: 'Advanced Security',
      description: 'MemoVault employs cutting-edge key encryption to protect your data.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a4 4 0 00-4 4v4H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-4V6a4 4 0 00-4-4z" />
        </svg>
      ),
    },
    {
      title: 'Privacy Assurance',
      description: 'Your writings are accessible only to you, ensuring complete confidentiality.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12h2v2h-2zm0 4h2v2h-2zm-4-4h2v2H8zm0 4h2v2H8zm-4-4h2v2H4zm0 4h2v2H4zM12 2a10 10 0 00-10 10v4h20v-4a10 10 0 00-10-10z" />
        </svg>
      ),
    },
    {
      title: 'Robust Protection',
      description: 'Strong security measures safeguard against unauthorized access to your private thoughts.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18V3H3zm3 14h12v-2H6v2zm0-4h12v-2H6v2zm0-4h12V7H6v2z" />
        </svg>
      ),
    },
    {
      title: 'Peace of Mind',
      description: 'Write freely, knowing your information is stored safely and securely.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v9.5m-3 3h6m-6 0a4.5 4.5 0 010-9h1.5a4.5 4.5 0 110 9H9z" />
        </svg>
      ),
    },
    {
      title: 'Intuitive Experience',
      description: 'Streamlined features enhance your writing process, making it enjoyable and stress-free.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8M8 12h8m-4 6h4" />
        </svg>
      ),
    },
    {
      title: 'Commitment to Safety',
      description: 'MemoVault prioritizes security and privacy, making it the ideal choice for expression',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-10 10v4h20v-4a10 10 0 00-10-10z" />
        </svg>
      ),
    },
  ];

  return (
    <div className='my-5'>
      <h1 className='text-3xl font-bold md:px-10 px-8 py-3'>
        We Provide
      </h1>
      <div className='w-[80%] mx-auto grid items-stretch grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {
          serviceDetails.map(detail => <span key={detail.title}><Service detail={detail} /></span>)
        }
      </div>

    </div>
  )
}

export default Services