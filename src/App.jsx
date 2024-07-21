import React, { useState } from "react";
import ControlledStack from "./ControlledGridstack";
import './index.css'

const list0 = [{ id: 'item-1-1', x: 0, y: 0, w: 1, h: 1 }, { id: 'item-1-2', x: 1, y: 0, w: 1, h: 1 }]
const list1 = [{ id: 'item-1-1', x: 0, y: 0, w: 1, h: 1 }, { id: 'item-1-3', x: 1, y: 0, w: 1, h: 1 }]

const Demo = (props) => {
    const [items, setItems] = useState(list0);

    return (
        <>
            <button onClick={(() => {
                setItems(list1)
            })}>改变数据</button>
            <ControlledStack items={items} onChange={(newItems) => {
                console.log(newItems)
                setItems(newItems)
            }} itemRender={(wgt) => {
                return (
                    <div>{wgt.id}</div>
                )
            }} />
        </>
    )
}

export default Demo