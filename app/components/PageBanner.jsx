import React from 'react';

// type Props = {
//   title: string;
//   description: string;
//   loading?: boolean;
//   subTitle?: string | React.ReactElement;
//   rightContent?: React.ReactElement;
//   style?: {
//     backgroundColor?: string;
//   }
// }

/**
 * PageBanner common component to display common title and details information
 * 
 * ,..............................................................,
 * ;            Title                       (optional)            ;
 * :             subtitle                                         :
 * :             description (expandable) V                       :
 * :______________________________________________________________:
 * :            |                                     |           :
 * :            |                                     |           :
 * :            |                                     |           :
 * /            /                                     /           /
 */
const PageBanner = ({
  title,
  description,
  loading,
  subTitle,
  rightContent,
  style: {
    backgroundColor
  } = {}
}) => {
  return loading ? (
    <LoadingBanner style={{ backgroundColor }} />
  ) : (
    <div className={`${backgroundColor ? `backgroundColor` : 'bg-gradient-to-r from-cyan-500 to-blue-500'} w-full`}>
      <div className='mx-auto max-w-4xl py-4 pb-8'>
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-4xl'>{title}</h1>
          {rightContent && <>{rightContent}</>}
        </div>
        {subTitle && typeof subTitle === 'string' ? (
          <div className='text-slate-600 mb-2'>
            {subTitle}
          </div>
        ) : subTitle ? (
          subTitle
        ) : null}
        <div className='text-slate-800'>
          {description}
        </div>
      </div>
    </div>
  )
}

// type LoadingBannerProps = {
//   style?: {
//     backgroundColor?: string;
//   }
// }

const LoadingBanner = ({
  style: {
    backgroundColor
  } = {}
}) => {
  return (
    <div className={`${backgroundColor ? `backgroundColor` : 'bg-gradient-to-r from-cyan-500 to-blue-500'} w-full`}>
      <div className='mx-auto max-w-4xl py-4 pb-8'>
        <div className='w-full loading-div animate-pulse min-h-8' />
        <div className='w-1/4 loading-div details-text animate-pulse' />
        <div className='loading-div w-full animate-pulse' />
      </div>
    </div>
  )
}

export default PageBanner;
