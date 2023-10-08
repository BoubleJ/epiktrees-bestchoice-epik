'use client'

import Sidebar from '@/app/layout/sidebar/page'
import RoomCata from '@/app/room/RoomCata'
import RoomList from '@/app/room/RoomList'
import RoomListSort from '@/app/room/RoomListSort'
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation'
import { useContext, useEffect, useRef } from 'react'
import { RoomListContext } from '@/app/provider/roomListProvider'
import RoomListEmpty from '@/app/room/RoomListEmpty'

export default function Room() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const params = useParams()
    const { setFetchRoomList } = useContext(RoomListContext)

    const fetchData = async () => {
        const res = await fetch(`/api/room/${params.id}`, { method: 'GET' })
        const data = await res.json()
        setFetchRoomList(data.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    // useEffect(() => {
    //     const valuesArray = Array.from(searchParams.values())
    //     const fetchData = async () => {
    //         const res = await fetch('/api/hello', { method: 'GET' })
    //         const data = await res.json()
    //         console.log(data)
    //         if (valuesArray.length > 0) {
    //             const arr = data.filter((v) => {
    //                 return valuesArray.every((a) => v['detailOpt'].includes(a))
    //             })
    //             setFetchRoomList(arr)
    //         } else {
    //             setFetchRoomList(data)
    //         }
    //     }
    //     fetchData()
    // }, [searchParams])
    return (
        <div className={`inner contentGrid`}>
            <Sidebar>
                <RoomCata />
            </Sidebar>
            <main>
                <RoomListSort />
                {/* {fetchRoomList.length == 0 ? <RoomListEmpty /> : <RoomList />} */}
                <RoomList />
            </main>
        </div>
    )
}
