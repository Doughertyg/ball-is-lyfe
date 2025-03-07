import React from 'react';
import CommonSectionLayout from './CommonSectionLayout.jsx';
import PageBanner from '../PageBanner.jsx'

// type Props = {
//   title: string;
//   subTitle?: string;
//   description?: string;
//   rightContent?: React.ReactElement;
//   loading?: Boolean;
//   content: Array<React.ReactElement>;
// }

/**
 * Common Page layout component
 * ,...........................,
 * |     Title        (+)      |
 * |      desc.                |
 * |...........................|
 * |    | Section 1      |     |
 * |    |  [C] [C] [C]   |     |
 * |    |                |     |
 * |    | Section 2      |     |
 * :,,,,|,,,,,,,,,,,,,,,,|,,,,,: 
 */
const CommonPageLayout = ({
  title,
  subTitle,
  description,
  loading,
  rightContent,
  content
}) => {
  return (
    <div className='flex flex-col w-full bg-slate-50'>
      {title && (
        <PageBanner
          title={title}
          subTitle={subTitle}
          description={description}
          loading={loading}
          rightContent={rightContent}
        />
      )}
      <div className='flex flex-col max-w-4xl mx-auto w-full bg-white px-4 shadow-md'>
        {
          content.map((section, idx) => (
            <CommonSectionLayout key={idx} title={section.title} rightComponent={section.rightContent}>{section.content}</CommonSectionLayout>
          ))
        }
      </div>
    </div>
  )
}

export default CommonPageLayout;
