import React, { useRef, useState } from "react";
import ControlledStack from "./ControlledGridstack";
import { useSelector, useDispatch } from 'react-redux'
import { save, changeItems } from './store/items'
import './index.css'


const Demo = (props) => {
    const items = useSelector((state) => state.items.value)
    const dispatch = useDispatch()
    const nRef = useRef(0)

    return (
        <>
            <button onClick={(() => {
                dispatch(changeItems(nRef.current))
                nRef.current +=1;
            })}>改变数据</button>
            <ControlledStack items={items} onChange={(newItems) => {
                console.log(newItems)
                dispatch(save(newItems))
            }} itemRender={(wgt) => {
                return (
                    <div>{wgt.id}</div>
                )
            }} />
        </>
    )
}

export default Demo