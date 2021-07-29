export const simpuThemeFull = {
  Sidebar: {
    Container: {
      width: '230px',
      color: '#333333',
      transition: 'all .3s',
      backgroundColor: '#f6fafd',
      display: ['none', 'none', 'block', 'block'],
    },
    Header: {
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      padding: '0.75rem 1.8rem',
    },
    Content: {
      overflow: 'auto',
      flex: 1,
      display: 'flex',
    },
    Menu: {
      height: '100%',
      padding: '1.2rem 0.75rem',
    },
    MenuItem: {
      marginBottom: '0.8rem',
    },
    MenuLink: {
      width: '100%',
      height: '100%',
      display: 'block',
      color: '#333333',
      borderRadius: '100px',
      padding: '0.4rem 1rem',
      _hover: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
      _active: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
      _focus: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
    },
    Footer: {
      height: '40px',
      width: '230px',
      display: 'flex',
      padding: '0 1rem',
      alignItems: 'center',
      borderTop: '1px solid rgba(17, 17, 17, 0.05)',
    },
  },
  Header: {
    height: '60px',
    padding: '0 1rem',
    alignItems: 'center',
    // display: ['flex', 'flex', 'none', 'none'],
  },
  Content: {
    backgroundColor: '#f6fafd',
    // paddingTop: ['4rem', '4rem', 0, 0],
  },
};

export const simpuThemeCollapsed = {
  Sidebar: {
    Container: {
      width: '60px',
      color: '#333333',
      transition: 'all .3s',
      backgroundColor: '#f6fafd',
      display: ['none', 'none', 'block', 'block'],
    },
    Header: {
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      padding: '0.75rem 0.2rem',
    },
    Content: {
      overflow: 'auto',
      flex: 1,
      display: 'flex',
    },
    Menu: {
      height: '100%',
      padding: '1.2rem 0.2rem',
    },
    MenuItem: {
      marginBottom: '0.5rem',
    },
    MenuLink: {
      width: '100%',
      height: '100%',
      display: 'flex',
      color: '#333333',
      borderRadius: '10px',
      alignItems: 'center',
      padding: '0.4rem 1rem',
      justifyContent: 'center',
      _hover: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
      _active: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
      _focus: {
        textDecoration: 'none',
        color: '#3d50df!important',
        backgroundColor: 'rgba(61, 80, 223, 0.06)',
      },
    },
    Footer: {
      width: '60px',
      height: '40px',
      display: 'flex',
      padding: '0 1rem',
      alignItems: 'center',
      borderTop: '1px solid rgba(17, 17, 17, 0.05)',
    },
  },
  Header: {
    height: '60px',
    padding: '0 1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    display: ['flex', 'flex', 'none', 'none'],
  },
};
