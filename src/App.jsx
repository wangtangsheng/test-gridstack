import { useState, useLayoutEffect, createRef, useRef, useEffect } from "react";
import { GridStack } from "gridstack";
import { v4 } from "uuid";
import "./index.css";
import "gridstack/dist/gridstack.min.css";

const ControlledStack = ({ items, setItems, itemRender, onAdd }) => {
  const refs = useRef({});
  const gridRef = useRef();
  const gridContainerRef = useRef(null);
  refs.current = {};

  if (Object.keys(refs.current).length !== items.length) {
    items.forEach(({ id }) => {
      refs.current[id] = refs.current[id] || createRef();
    });
  }

  useLayoutEffect(() => {
    if (!gridRef.current) {
      const grid = (gridRef.current = GridStack.init(
        {
          float: false,
          acceptWidgets: true,
          column: 6,
          minRow: 1,
        },
        gridContainerRef.current
      )
        .on("added", (ev, gsItems) => {
          if (grid._ignoreCB) return;
          const [add] = gsItems;
          const addType = add.el.dataset.type;
          if (addType) {
            const { x, y, w, h } = add;
            add.el.remove();
            onAdd(
              {
                x,
                y,
                w,
                h,
              },
              addType
            );
            grid.engine.nodes = grid.engine.nodes.filter(({id}) => id)
            return;
          }
          const addItems = [];
          gsItems.forEach((n) => {
            grid.removeWidget(n.el, true, false);
            addItems.push({ id: n.id, x: n.x, y: n.y, w: n.w, h: n.h });
          });
          setItems((items) => {
            return [...items, ...addItems];
          });
        })
        .on("removed change", (ev, gsItems) => {
          if (grid._ignoreCB) return;
          const newItems = grid.save(false);
          setItems(newItems);
        }));
    }
    const grid = gridRef.current;
    const layout = items.map(
      (a) =>
        refs.current[a.id].current.gridstackNode || {
          ...a,
          el: refs.current[a.id].current,
        }
    );
    grid._ignoreCB = true;
    grid.load(layout);
    delete grid._ignoreCB;
  }, [setItems, items]);

  return (
    <div className="grid-stack" ref={gridContainerRef}>
      {items.map((item, i) => {
        return (
          <div key={item.id}>
            <div
              ref={refs.current[item.id]}
              className="grid-stack-item"
              gs-id={item.id}
              gs-w={item.w}
              gs-h={item.h}
              gs-x={item.x}
              gs-y={item.y}
            >
              <div className="grid-stack-item-content">
                {itemRender(item.id)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Layout = ({ dataSource, onChange, itemRender, onAdd }) => {
  const [items, setItems] = useState(dataSource);
  useEffect(() => {
    onChange(items);
  }, [items]);
  useEffect(() => {
    setItems(dataSource);
  }, [dataSource]);
  return (
    <ControlledStack
      items={items}
      setItems={setItems}
      itemRender={itemRender}
      onAdd={onAdd}
    />
  );
};

const ControlledExample = () => {
  const [items1, setItems1] = useState([
    { id: "item-1-1", x: 0, y: 0, w: 2, h: 2 },
    { id: "item-1-2", x: 2, y: 0, w: 2, h: 2 },
  ]);
  const [items2, setItems2] = useState([
    { id: "item-2-1", x: 0, y: 0 },
    { id: "item-2-2", x: 0, y: 1 },
    { id: "item-2-3", x: 1, y: 0 },
  ]);
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      GridStack.setupDragIn([ref.current], {
        helper: "clone",
        appendTo: "body",
      });
    }
  }, []);

  return (
    <>
      <div
        className="grid-stack-item"
        data-type="hhh"
        ref={ref}
        style={{
          background: "yellow",
          height: "100px",
          width: "100px",
        }}
      >
        666
      </div>
      <Layout
        dataSource={items1}
        onChange={(items) => setItems1(items)}
        onAdd={(item, type) => {
          setItems1((items) => [
            ...items,
            {
              ...item,
              id: v4(),
            },
          ]);
        }}
        itemRender={(id) => {
          if (id === "item-1-1") {
            return (
              <div
                style={{
                  background: "blue",
                  height: "100%",
                }}
              >
                <Layout
                  dataSource={items2}
                  onChange={(items) => setItems2(items)}
                  onAdd={(item, type) => {
                    setItems2((items) => [
                      ...items,
                      {
                        ...item,
                        id: v4(),
                      },
                    ]);
                  }}
                  itemRender={(id) => (
                    <div
                      style={{
                        background: "red",
                        height: "100%",
                      }}
                    >
                      {id}
                    </div>
                  )}
                />
              </div>
            );
          }
          return (
            <div
              style={{
                background: "red",
                height: "100%",
              }}
            >
              {id}
            </div>
          );
        }}
      />
    </>
  );
};
export default ControlledExample;
