import React from 'react'
import { Stack } from '@chakra-ui/core'
import LogDetailsRs from './logs/component/logDetails/LogDetailsRs';

const RsContainer = (props: any) => {
  const { logs, selectedId } = props;
  
  return (
    <Stack width="50%" style={{height:`calc(100vh - 290px)`}} py={4} px={2}>
      {logs
        .filter((log: any) => log.meta.id === selectedId)
        .map(((log: any) => (
          <LogDetailsRs
            key={log.meta.id}
            method={log.method}
            path={log.path}
            meta={log.meta}
            query={log.query}
            response={log.response}
          />
        )))}
    </Stack>
  )
}

export default RsContainer
