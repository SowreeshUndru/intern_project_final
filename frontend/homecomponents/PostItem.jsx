import React, { useContext, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usercontext } from '../src/Userprovider';
import LostItemForm from './LostItemForm';
import FoundItemForm from './FoundItemForm';

const PostItem = () => {
    const { enable, setEnable, item, setItem } = useContext(usercontext);
    const modalRef = useRef(null);

    useEffect(() => {
        if (enable && modalRef.current) {
            const isMobile = window.innerWidth <= 768;
            gsap.fromTo(
                modalRef.current,
                {
                    y: isMobile ? '100%' : '-500px',
                    opacity: 0,
                    scale: isMobile ? 1 : 0.8,
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out',
                }
            );
        }
    }, [enable]);

    return (
        <div className='m-2 text-xl'>
            {/* Toggle Button */}
            <button
                className='transition duration-300 ease-in-out hover:shadow-2xl hover:scale-110'
                onClick={() => setEnable(prev => !prev)}
            >
                postItem
            </button>

            {/* Background overlay */}
            {enable && (
                <div
                    className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm flex items-center justify-center md:px-0 px-2"
                    onClick={() => setEnable(false)}
                >
                    {/* Modal / Drawer */}
                    <div
                        ref={modalRef}
                        className={`
                            box z-[100] bg-[#E8E1B5] rounded-2xl shadow-lg w-full md:w-[35vw] 
                            ${window.innerWidth <= 768
                                ? 'fixed bottom-0 left-0 rounded-b-none h-[85%]'
                                : 'relative'}
                        `}
                        onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                    >
                        {/* Tab Switcher */}
                        <div className='flex justify-around text-[#012F49] border-b border-[#ccc]'>
                            <h1
                                className={`w-1/2 text-center py-2 cursor-pointer ${
                                    item === 'foundItem' ? 'border-b-2 border-[#012F49] font-semibold' : ''
                                }`}
                                onClick={() => setItem('foundItem')}
                            >
                                Found Item
                            </h1>
                            <h1
                                className={`w-1/2 text-center py-2 cursor-pointer ${
                                    item === 'lostItem' ? 'border-b-2 border-[#012F49] font-semibold' : ''
                                }`}
                                onClick={() => setItem('lostItem')}
                            >
                                Lost Item
                            </h1>
                        </div>

                        {/* Form Section */}
                        <div className='p-4 max-h-[70vh] overflow-y-auto'>
                            {item === 'lostItem' && <LostItemForm />}
                            {item === 'foundItem' && <FoundItemForm />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;
