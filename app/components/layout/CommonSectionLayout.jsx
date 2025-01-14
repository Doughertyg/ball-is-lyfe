import React from 'react';

// type Props = {
//   title: string;
//   rightComponent?: React.ReactElement;
//   children: Array<React.ReactElement>
// }

/**
 * Common Section Layout component
 * - includes a title and possible button components
 * - renders children content
 * 
 * Section  (+)
 * |````| |````| |````| |````|
 * | Cn | | Cn2| | Cn3| | Cn4|
 * :....: :....: :....: :....:
 * 
 * 
 */
const CommonSectionLayout = ({
  title,
  rightComponent,
  children
}) => {
  return (
    <div className='flex flex-col w-full'>
      <div className='flex items-center justify-items-start'>
        <div className='font-extrabold text-lg my-5 mr-3'>{title}</div>
        {rightComponent}
      </div>
      <div className='flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4'>
        {children}
      </div>
    </div>
  )
}

export default CommonSectionLayout;
