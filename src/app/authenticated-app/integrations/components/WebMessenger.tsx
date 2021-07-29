import React from 'react';
import { Button } from 'app/components';
import { Box, Flex, Text, Textarea } from '@chakra-ui/core';

const SubSection = ({
  height,
  description,
  text,
}: {
  height: string;
  description: string;
  text: string;
}) => (
  <>
    <Text fontSize=".875rem" mt=".3125rem">
      {description}
    </Text>

    <Textarea
      fontSize=".875rem"
      mt=".5rem"
      p="1.25rem 1.5rem"
      color="lightBlack"
      boxShadow="0 0 1px 0 rgba(67, 90, 111, 0.47)"
      rounded=".3125rem"
      isReadOnly
      resize="none"
      height={height}
      value={text}
    />
  </>
);

const Section = ({
  index,
  title,
  children,
}: {
  children: React.ReactNode;
  index: number;
  title: string;
}) => {
  return (
    <Box mt={index === 1 ? '0' : '2.5rem'} maxWidth="48.125rem">
      <Flex fontWeight="semibold">
        <Text color="#6554c0">{`${index}.`}</Text>
        <Text ml=".75rem">{title}</Text>
      </Flex>

      <Box ml="1.625rem">{children}</Box>
    </Box>
  );
};

const data = [
  {
    height: '24.6875rem',
    title: 'Add to your web page',
    description: 'Add the following code towards the end of the <head> section on your page',
    text: `script>
!function(e,n,t,r){
    function o(){try{var e;if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){
    var t=n.getElementsByTagName("script")[0],r=n.createElement("script");r.async=!0,r.src=e.url,t.parentNode.insertBefore(r,t)}}catch(e){}}
    var s,p,a,i=[],c=[];e[t]={init:function(){s=arguments;var e={then:function(n){return c.push({type:"t",next:n}),e},catch:function(n){
    return c.push({type:"c",next:n}),e}};return e},on:function(){i.push(arguments)},render:function(){p=arguments},destroy:function(){a=arguments}},
    e.__onWebMessengerHostReady__=function(n){if(delete e.__onWebMessengerHostReady__,e[t]=n,s)for(var r=n.init.apply(n,s),o=0;o<c.length;o++){
    var u=c[o];r="t"===u.type?r.then(u.next):r.catch(u.next)}p&&n.render.apply(n,p),a&&n.destroy.apply(n,a);for(o=0;o<i.length;o++)n.on.apply(n,i[o])};
    var u=new XMLHttpRequest;u.addEventListener("load",o),u.open("GET","https://"+r+".webloader.smooch.io/",!0),u.responseType="json",u.send()
}(window,document,"Smooch","5d73f7c6e723f1000f65f460")
</script>`,
  },
  {
    height: '5.5625rem',
    title: 'Initialize with your App Id',
    description:
      'Simply initialize the Web Messenger using this code snippet. This should be placed where you want after the code in Step 1, ideally towards the end of the <body> section for better performance.',
    text: `<script>
Smooch.init({ appId: '5d73f7c6e723f1000f65f460' });
</script>`,
  },
];

export function WebMessengerIntegration() {
  return (
    <Box px="3.125rem" py="1.3125rem" color="#212242">
      {data.map(({ title, height, description, text }, index) => (
        <Section key={title} title={title} index={index + 1}>
          <SubSection height={height} description={description} text={text} />
        </Section>
      ))}

      <Section title="Confirm Integration" index={3}>
        <Button size="sm" mt=".5rem" variantColor="blue">
          Confirm Integration
        </Button>
      </Section>
    </Box>
  );
}
