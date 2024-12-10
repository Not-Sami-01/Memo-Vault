import React, { useEffect } from 'react';
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css'; // Import Glide CSS
import Image from 'next/image';

const Carousel = ({ GetStartedButton }: { GetStartedButton: any }) => {

  useEffect(() => {
    const glide = new Glide('.glide', {
      type: 'carousel',
      startAt: 0,
      focusAt: 'center',
      autoplay: 3000,
      hoverpause: true,
      perView: 1
    });
    glide.mount();
    return () => {
      glide.destroy(); // Clean up on unmount
    };
  }, []);

  return (
    <div className='relative'>

      <div className="glide relative">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            <li className="glide__slide carousel-slide relative">
              <div className='relative'>
                <Image className='w-full max-h-[600px] bg-cover' height={600} width={1800} src="/images/background-4.avif" alt="Slide 1" />
                <div className='absolute top-0 left-0 opacity-40 w-full h-full bg-black z-10' />
              </div>
            </li>
            <li className="glide__slide carousel-slide relative">
              <div className='relative'>
                <Image className='w-full max-h-[600px] bg-cover' height={600} width={1800} src="/images/background-2.jpg" alt="Slide 2" />
                <div className='absolute top-0 left-0 opacity-40 w-full h-full bg-black ' />
              </div>
            </li>
            <li className="glide__slide carousel-slide relative">
              <div className='relative'>
                <Image className='w-full max-h-[600px] bg-cover' height={600} width={1800} src="/images/background-3.jpg" alt="Slide 3" />
                <div className='absolute top-0 left-0 opacity-40 w-full h-full bg-black ' />
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className=" absolute w-full flex items-center h-[100%] top-0 left-0">
        <div className='md:w-[70%] min-h-60 max-h-[100%] overflow-hidden flex flex-col justify-center md:mx-auto md:p-10 md:relative'>
          <h1 className='md:text-3xl text-center md:text-start text-sm font-bold md:mb-3 text-white'>
            MemoVault
          </h1>
          <span className='font-bold md:text-base text-xs'>
            <p className='max-w-[90%] mx-auto text-white'>
              MemoVault is your steady virtual sanctuary for mind and thoughts. Capture every day reflections, innovative inspirations, and private journeys effortlessly in a safe environment.
            </p>
            <p className='max-w-[90%] mx-auto text-white hidden sm:block '>
              With advanced key encryption, your data remains secure and accessible only to you. Please write with confidence knowing that your privacy is our top priority.
            </p>
          </span>
          <span className='absolute md:bottom-0 -bottom-3 right-0 hidden md:block'>
            <GetStartedButton />
          </span>

        </div>
      </div>
    </div>

  );
}

export default Carousel;
