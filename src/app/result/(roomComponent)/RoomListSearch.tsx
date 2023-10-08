'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'

import Link from 'next/link'
import ButtonLike from '@/app/components/btns/ButtonLike'
import style from '@/app/room/room.module.scss'
import { getRoomList } from '@/app/api/getFireBaseData'
import { RoomListContext } from '@/app/provider/roomListProvider'
import { useSearchParams } from 'next/navigation'

const RoomList = () => {
    const searchParams = useSearchParams()
    const query = searchParams.get('query')
    const [page, setPage] = useState(0)
    const [fetchRoomList, setFetchRoomList] = useState([])
    const [like, setLike] = useState({})

    // 수정 필요 20230926 BY joj
    const fetchData = async () => {
        const res = await fetch(`/api/textsearch?query=${query}&page=${page}`, {
            method: 'GET',
        })
        const data = await res.json()
        console.log('data 결과')
        console.log(data.data.content)
        setFetchRoomList((prev) => [...prev, ...data.data.content])
        // setFetchRoomList()
        setPage(page + 1)
    }

    const observerRef = useRef(null)
    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                fetchData()
            }
        })
    }
    useEffect(() => {
        fetchData()
        const observer = new IntersectionObserver(callback, {
            threshold: 1,
        })
        observer.observe(observerRef.current)
        return () => observer && observer.disconnect()
    }, [])

    const handleLike = (id) => {
        setLike((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <ul className={style.roomList}>
            {fetchRoomList.map((room, index) => {
                return (
                    <li key={index} className={style.roomListItem}>
                        <Link href={`/room/detail/${room.accommodationId}`}>
                            {/* 테스트용 삭제 예정 20230920 by jyj */}
                            {/* <span>{room.detailOpt}</span> */}
                            <span className={style.boxImg}>
                                <img src={room.imgUrl} alt="" loading="lazy" />
                            </span>

                            <span className={style.boxTxt}>
                                <span className={style.info}>
                                    <strong className={style.infoTit}>
                                        {room.accommodationName}
                                    </strong>
                                    <span className={style.infoScore}>
                                        <span>
                                            {/* <em>{room.score}</em>&nbsp; */}
                                            {/* {room.scoreTxt} */}
                                            만족해요
                                        </span>
                                        &nbsp;(3663)
                                    </span>
                                    <span className={style.infoAddr}>
                                        {room.infoAddr}
                                    </span>
                                    <span className={style.infoOpt}>
                                        {room.infoOpt}
                                    </span>
                                    <span className={style.infoEvt}>
                                        {room.infoEvt}
                                    </span>
                                </span>
                                <span className={style.price}>
                                    {room.rentHalf && (
                                        <span className={style.priceDetail}>
                                            {room.rentHalf}&nbsp;
                                            <span className={style.bold}>
                                                {room.rentHalfPrice}원
                                            </span>
                                        </span>
                                    )}

                                    <span className={style.priceDetail}>
                                        {room.rentAll}&nbsp;
                                        <span className={style.badge}>
                                            {/* {room.rentBedge} */}
                                            할인중
                                        </span>
                                        &nbsp;
                                        <span
                                            className={`${style.bold} ${style.pink}`}>
                                            {room.price}원
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </Link>
                        <ButtonLike
                            className={`m16`}
                            onClick={() => handleLike(room.id)}
                            Liked={like[room.id]}
                        />
                    </li>
                )
            })}
            <li ref={observerRef}></li>
        </ul>
    )
}

export default RoomList