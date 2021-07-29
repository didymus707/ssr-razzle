import { ReactType } from "react";

type LinkSectionProps<T> = {
  name: string;
  key: string;
};

export type LinkProps<T> = {
  name: string;
  key: string;
  last_updated: string;
  page: ReactType;
  sections: Array<LinkSectionProps<any>>;
};

export type SideNavProps<T> = {
  links: Array<LinkProps<any>>;
  activePage: any;
  setActivePage: Function;
};

export type MainSectionProps<T> = {
  link: LinkProps<any>;
};
