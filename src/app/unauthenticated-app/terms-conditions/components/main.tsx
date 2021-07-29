import React, { useState } from 'react';
import { TopNav } from './topnav';
import { useScrollPosition } from '../../../../hooks/use-scroll-position';
import { scrollToSection, isInViewport } from '../../../../utils';
import { MainSectionProps } from '../types';

export const Main = (props: MainSectionProps<any>) => {
  const [activeSection, setActiveSection] = useState<any>(null);

  const { link } = props;

  // @ts-ignore
  useScrollPosition(() => {
    link.sections.some((i) => {
      if (isInViewport(i.key)) {
        setActiveSection(i.key);
        return true;
      }
      return false;
    });
  });

  return (
    <div id="main">
      <TopNav />
      <div className="wrapper">
        <div className="content">
          <div className="heading">{link.name}</div>
          <div className="last_updated">Last updated: {link.last_updated}</div>
          <link.page />
        </div>
        <div className="page_nav">
          {link.sections.length > 0 && (
            <>
              <h4 className="heading">ON THIS PAGE</h4>
              <ul className="list">
                {link.sections.map((i) => (
                  <li
                    key={i.key}
                    className="item"
                    onClick={() => scrollToSection(i.key)}
                    style={{
                      color: activeSection === i.key ? '#1f1a47' : '#697386',
                    }}
                  >
                    {i.name}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
