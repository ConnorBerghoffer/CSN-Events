'use client'
import { Box, Text } from '@chakra-ui/layout'
import React from 'react'

type Props = {}

const ActionBar = (props: Props) => {
  return (
    <Box w={'100vw'} h={'2vh'} alignContent={'center'} paddingX={'5vw'} zIndex={0} bgColor={'primary'} pos={'fixed'} bottom={0} opacity={'50%'}>
        <Text></Text>
    </Box>
  )
}

export default ActionBar