import { Stack } from '@chakra-ui/core';
import React from 'react';
import LogDetailsLs from './logs/component/logDetails/LogDetailsLs';

const LsContainer = (props: any) => {
  const { logs, selectedId, setSelected } = props;
  return (
    <Stack
      width="50%"
      style={{height: `calc(100vh - 290px)`, overflow: "auto"}}
    >
      {logs.map((log: any) => (
        <LogDetailsLs
          id={log.meta.id}
          key={log.meta.id}
          meta={log.meta}
          method={log.method}
          path={log.path}
          selectId={setSelected}
          selectedId={selectedId}
        />
      ))}
    </Stack>
  )
}

export default LsContainer;
