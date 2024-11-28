import Header from '@/components/Header'
import React from 'react'

const About = () => {
  return (
    <>
      <Header pos key={'same'} />
      <div className="container md:p-5 p-5">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p>
          Welcome to MemoVault, your secure digital sanctuary for thoughts, ideas, and reflections. Whether you're jotting down daily musings, chronicling your journey through a personal diary, or capturing innovative ideas, MemoVault offers a seamless platform for all your writing needs. Experience the freedom of expressing yourself without worry, as we provide an intuitive interface designed to make your writing process effortless and enjoyable.</p>

        <p className='mb-3'  id='services'>
          At MemoVault, your security is our top priority. We employ advanced key encryption to ensure that your data is stored safely and remains accessible only to you. With our robust security measures, you can rest assured that your private thoughts and creative insights are protected from unauthorized access. Write with confidence, knowing that your words are locked away in a vault that values your privacy.
        </p>
        <div className="bg-gray-400 dark:bg-gray-950 px-3 py-1 rounded-lg">
          <h1 className="text-3xl font-bold">We Provide:</h1>
          <ul className='list-disc'>
            <li className='ml-5 '><strong>Digital Sanctuary:</strong> MemoVault serves as a secure space for your thoughts, ideas, and reflections.</li>
            <li className='ml-5 '><strong>Versatile Writing Platform:</strong> Ideal for daily diaries, journals, and creative ideas, accommodating a variety of writing styles.</li>
            <li className='ml-5 '><strong>User-Friendly Interface:</strong> Designed for ease of use, allowing you to focus on expressing yourself effortlessly.</li>
            <li className='ml-5 '><strong>Advanced Security:</strong> MemoVault employs cutting-edge key encryption to protect your data.</li>
            <li className='ml-5 '><strong>Privacy Assurance:</strong> Your writings are accessible only to you, ensuring complete confidentiality.</li>
            <li className='ml-5 '><strong>Robust Protection:</strong> Strong security measures safeguard against unauthorized access to your private thoughts.</li>
            <li className='ml-5 '><strong>Peace of Mind:</strong> Write freely, knowing your information is stored safely and securely.</li>
            <li className='ml-5 '><strong>Intuitive Experience:</strong> Streamlined features enhance your writing process, making it enjoyable and stress-free.</li>
            <li className='ml-5 '><strong>Commitment to Safety:</strong> MemoVault prioritizes your security and privacy, making it the ideal choice for personal expression.</li>
          </ul>
        </div>
        <h1 className="text-3xl font-bold mt-5">
          Contact Us
        </h1>
        <ul className="contact-list list-disc" id='contact '>
          <li className='ml-10'><strong>Email:</strong> <a href="mailto:samiulrehman0101@gmail.com">samiulrehman0101@gmail.com</a></li>
          <li className='ml-10'><strong>Phone:</strong> <a href="tel:+923020413608">+92 (302) 041-3608</a></li>
          <li className='ml-10'><strong>Address:</strong> Lahore, Pubjab, Pakistan</li>
        </ul>

        {/* <style jsx>
          {`
          .contact-list {
            padding: 0;
            margin: 0;
          }
          .contact-list li {
            margin-bottom: 8px;
            font-size: 16px;
            color: #333;
            margin-left: 20px;
          }
          .contact-list a {
            color: #0070f3;
            text-decoration: none;
          }
          .contact-list a:hover {
            text-decoration: underline;
          }
          `}
</style> */}
        <h1 className="text-3xl font-bold mt-5">
          What do we do
        </h1>

        <p> At MemoVault, we provide a secure and intuitive platform for individuals to capture their thoughts, ideas, and experiences. Our versatile writing space accommodates everything from daily diaries and journals to creative projects, allowing users to express themselves freely and effortlessly. With a focus on user-friendly design, MemoVault ensures that everyone can navigate the platform easily, making the writing process enjoyable and stress-free. </p> <p> We prioritize your privacy and security, employing advanced encryption technology to protect your data. Our commitment to safeguarding your information means that your writings remain accessible only to you, offering peace of mind as you document your personal journey. Whether you’re reflecting on your day or brainstorming new ideas, MemoVault is your trusted companion in preserving your thoughts in a safe and welcoming environment. </p>
      </div>
    </>
  )
}

export default About