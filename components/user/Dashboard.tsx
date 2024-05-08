import React from 'react'
import Sidebar from '../global/Sidebar'

type Props = {}

const UserDashboard = (props: Props) => {
  return (
    <div className="flex">
    <Sidebar/>
    <div>
    You Are A User
    </div>
  </div>
  )
}

export default UserDashboard