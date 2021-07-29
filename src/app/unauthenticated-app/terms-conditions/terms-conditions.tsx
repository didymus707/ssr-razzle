import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { TermsConditionsContainer } from "./terms-conditions.style";
import Links from "./links";

import { Main, SideNav } from "./components";

export const TermsConditions = (props: RouteComponentProps<{}>) => {
  const [activePage, setActivePage] = useState("terms-of-use");

  useEffect(() => {
    document.title = "Simpu: Terms and Conditions";
  }, []);

  // @ts-ignore
  const link = Links[activePage];

  return (
    <TermsConditionsContainer>
      <SideNav
        links={Object.values(Links)}
        setActivePage={setActivePage}
        activePage={activePage}
      />
      <Main link={link} />
    </TermsConditionsContainer>
  );
};
