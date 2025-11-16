import React from 'react'
import RecordClient from './RecordClient';

const page = async({params}: {params: Promise<{id: string}>}) => {
  const {id} = await params;
  return (
    <RecordClient />
  )
}

export default page