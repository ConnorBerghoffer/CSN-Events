'use client'
import { supabase } from '@/app/api/createClient';
import React from 'react'

type Props = {}

const Page = (props: Props) => {
    const handleCall = async () => {
        const { data: events, error } = await supabase
        .from('promotors')
        .select('*')
        if (error) console.log(error); else console.log(events);
    }

    return (
        <div>
            <button onClick={handleCall}>Call SPB</button>
        </div>
    )
}

export default Page;
